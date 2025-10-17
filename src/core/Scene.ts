import type { Game } from './Game';
import { EventEmitter } from './EventEmitter';
import type { Entity } from '../entities/Entity';
import { delay, interval, type TimerHandle } from '../utils/timer';

/**
 * Scene manages a collection of entities
 */
export class Scene extends EventEmitter {
  private game: Game | null = null;
  private entities: Entity[] = [];
  private sortRequired: boolean = false;
  private timers: TimerHandle[] = [];

  /**
   * Called when scene becomes active
   */
  onEnter(): void {
    this.emit('enter');
  }

  /**
   * Called when scene becomes inactive
   */
  onExit(): void {
    this.emit('exit');
  }

  /**
   * Set the game instance
   */
  setGame(game: Game): void {
    this.game = game;
  }

  /**
   * Get the game instance
   */
  getGame(): Game | null {
    return this.game;
  }

  /**
   * Add an entity to the scene
   */
  add(entity: Entity): this {
    if (!this.entities.includes(entity)) {
      this.entities.push(entity);
      entity.setScene(this);
      this.sortRequired = true;
      this.emit('entityadded', entity);
    }
    return this;
  }

  /**
   * Remove an entity from the scene
   */
  remove(entity: Entity): this {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      entity.setScene(null);
      this.emit('entityremoved', entity);
    }
    return this;
  }

  /**
   * Get all entities
   */
  getEntities(): Entity[] {
    return this.entities;
  }

  /**
   * Get entities by tag
   */
  getEntitiesByTag(tag: string): Entity[] {
    return this.entities.filter(entity => entity.hasTag(tag));
  }

  /**
   * Sort entities by z-index
   */
  private sortEntities(): void {
    this.entities.sort((a, b) => a.zIndex - b.zIndex);
    this.sortRequired = false;
  }

  /**
   * Mark that entities need to be sorted
   */
  markSortRequired(): void {
    this.sortRequired = true;
  }

  /**
   * Update all entities
   */
  update(deltaTime: number): void {
    if (this.sortRequired) {
      this.sortEntities();
    }

    for (const entity of this.entities) {
      if (entity.active) {
        entity.update(deltaTime);
      }
    }

    this.emit('update', deltaTime);
  }

  /**
   * Render all entities
   */
  render(ctx: CanvasRenderingContext2D): void {
    for (const entity of this.entities) {
      if (entity.visible) {
        entity.render(ctx);
      }
    }

    this.emit('render', ctx);
  }

  /**
   * Execute callback after delay
   */
  delay(ms: number, callback: () => void): TimerHandle {
    const handle = delay(ms, callback);
    this.timers.push(handle);
    return handle;
  }

  /**
   * Execute callback repeatedly at interval
   */
  interval(ms: number, callback: () => void): TimerHandle {
    const handle = interval(ms, callback);
    this.timers.push(handle);
    return handle;
  }

  /**
   * Clear all entities
   */
  clear(): void {
    for (const entity of [...this.entities]) {
      this.remove(entity);
    }
  }

  /**
   * Destroy the scene
   */
  destroy(): void {
    // Cancel all timers
    this.timers.forEach(timer => timer.cancel());
    this.timers = [];

    this.clear();
    this.clearEvents();
  }
}
