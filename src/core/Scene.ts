import type { Game } from './Game';
import { EventEmitter } from './EventEmitter';
import { Entity } from '../entities/Entity';
import { delay, interval, type TimerHandle } from '../utils/timer';
import type { SceneOptions } from '../types';

class SceneBackground extends Entity {
  private color?: string;
  private image: HTMLImageElement | null = null;

  constructor(width: number, height: number, options: SceneOptions) {
    super({
      x: width / 2,
      y: height / 2,
      width,
      height,
      anchorX: 0.5,
      anchorY: 0.5,
      zIndex: -1000,
      interactive: false,
      visible: true,
    });

    this.color = options.backgroundColor;
    if (options.backgroundImage) {
      this.setImage(options.backgroundImage);
    }
  }

  private setImage(source: string | HTMLImageElement): void {
    if (typeof source === 'string') {
      const img = new Image();
      img.onload = () => {
        this.image = img;
      };
      img.src = source;
    } else {
      this.image = source;
    }
  }

  protected draw(ctx: CanvasRenderingContext2D): void {
    const offsetX = -this.width * this.anchorX;
    const offsetY = -this.height * this.anchorY;

    if (this.color) {
      ctx.fillStyle = this.color;
      ctx.fillRect(offsetX, offsetY, this.width, this.height);
    }

    if (this.image) {
      ctx.drawImage(this.image, offsetX, offsetY, this.width, this.height);
    }
  }
}

/**
 * Scene manages a collection of entities
 */
export class Scene extends EventEmitter {
  private game: Game | null = null;
  private entities: Entity[] = [];
  private sortRequired: boolean = false;
  private timers: TimerHandle[] = [];
  private backgroundSprite: SceneBackground | null = null;
  private options: SceneOptions;

  constructor(options: SceneOptions = {}) {
    super();
    this.options = options;
  }

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

    // Create background sprite if backgroundImage or backgroundColor is provided
    if ((this.options.backgroundImage || this.options.backgroundColor) && !this.backgroundSprite) {
      this.backgroundSprite = new SceneBackground(game.width, game.height, this.options);
      this.add(this.backgroundSprite);
    }
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

    // LittleJS style: update physics first (which saves oldPos), then check collisions
    for (const entity of this.entities) {
      if (entity.active) {
        entity.update(deltaTime);
      }
    }

    // Check collisions AFTER movement (can use oldPos to detect pre-existing overlaps)
    this.checkCollisions();

    this.emit('update', deltaTime);
  }

  /**
   * Check collisions between all entities that have collision checking enabled
   */
  private checkCollisions(): void {
    const collidableEntities = this.entities.filter(e => e.checkCollisions && e.active);

    // Check each pair only once
    for (let i = 0; i < collidableEntities.length; i++) {
      for (let j = i + 1; j < collidableEntities.length; j++) {
        const entity = collidableEntities[i];
        const other = collidableEntities[j];

        // Double-check both have collisions enabled (defensive)
        if (!entity.checkCollisions || !other.checkCollisions) continue;

        // If both are static, skip (no physics response needed)
        if (entity.static && other.static) continue;

        // Check collision between this pair
        // Both entities get a chance to filter by tags and receive events
        // Physics response is handled internally based on static flags
        entity.checkCollision(other);
        other.checkCollision(entity);
      }
    }
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
