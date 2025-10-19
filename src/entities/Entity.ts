import type { EntityOptions, Transform, Point, TweenOptions } from '../types';
import { EventEmitter } from '../core/EventEmitter';
import type { Scene } from '../core/Scene';
import { Tween } from '../effects/Tween';
import { tweenManager } from '../effects/TweenManager';

/**
 * Base entity class with transform hierarchy
 */
export class Entity extends EventEmitter {
  // Transform properties
  public x: number = 0;
  public y: number = 0;
  public rotation: number = 0;
  public scaleX: number = 1;
  public scaleY: number = 1;
  public alpha: number = 1;

  // Size
  public width: number = 0;
  public height: number = 0;

  // Anchor point (0-1, default center)
  public anchorX: number = 0.5;
  public anchorY: number = 0.5;

  // Hierarchy
  public parent: Entity | null = null;
  public children: Entity[] = [];

  // State
  public active: boolean = true;
  public visible: boolean = true;
  public interactive: boolean = false;
  public zIndex: number = 0;

  // Collision
  public checkCollisions: boolean = false;
  public collisionTags: string[] = [];
  private collidingWith: Set<Entity> = new Set();

  // Tags for grouping
  private tags: Set<string> = new Set();

  // Scene reference
  private scene: Scene | null = null;

  constructor(options: EntityOptions = {}) {
    super();

    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.rotation = options.rotation ?? 0;
    this.scaleX = options.scaleX ?? 1;
    this.scaleY = options.scaleY ?? 1;
    this.alpha = options.alpha ?? 1;
    this.width = options.width ?? 0;
    this.height = options.height ?? 0;
    this.anchorX = options.anchorX ?? 0.5;
    this.anchorY = options.anchorY ?? 0.5;
    this.zIndex = options.zIndex ?? 0;
    this.interactive = options.interactive ?? false;
    this.visible = options.visible ?? true;
    this.checkCollisions = options.checkCollisions ?? false;
    this.collisionTags = options.collisionTags ?? [];
  }

  /**
   * Set the scene
   */
  setScene(scene: Scene | null): void {
    this.scene = scene;
  }

  /**
   * Get the scene
   */
  getScene(): Scene | null {
    return this.scene;
  }

  /**
   * Add a child entity
   */
  addChild(child: Entity): this {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    child.parent = this;
    this.children.push(child);
    return this;
  }

  /**
   * Remove a child entity
   */
  removeChild(child: Entity): this {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
    }
    return this;
  }

  /**
   * Add a tag
   */
  addTag(tag: string): this {
    this.tags.add(tag);
    return this;
  }

  /**
   * Remove a tag
   */
  removeTag(tag: string): this {
    this.tags.delete(tag);
    return this;
  }

  /**
   * Check if entity has tag
   */
  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  /**
   * Get world position
   */
  getWorldPosition(): Point {
    let worldX = this.x;
    let worldY = this.y;
    let current: Entity | null = this.parent;

    while (current) {
      worldX += current.x;
      worldY += current.y;
      current = current.parent;
    }

    return { x: worldX, y: worldY };
  }

  /**
   * Get world transform
   */
  getWorldTransform(): Transform {
    let transform: Transform = {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      alpha: this.alpha,
    };

    let current: Entity | null = this.parent;

    while (current) {
      transform.x += current.x;
      transform.y += current.y;
      transform.rotation += current.rotation;
      transform.scaleX *= current.scaleX;
      transform.scaleY *= current.scaleY;
      transform.alpha *= current.alpha;
      current = current.parent;
    }

    return transform;
  }

  /**
   * Check if point is inside entity bounds
   */
  containsPoint(x: number, y: number): boolean {
    const worldPos = this.getWorldPosition();
    const left = worldPos.x - this.width * this.anchorX;
    const right = left + this.width;
    const top = worldPos.y - this.height * this.anchorY;
    const bottom = top + this.height;

    return x >= left && x <= right && y >= top && y <= bottom;
  }

  /**
   * Get bounding box in world coordinates
   */
  getBounds(): { left: number; right: number; top: number; bottom: number } {
    const worldPos = this.getWorldPosition();
    const left = worldPos.x - this.width * this.anchorX;
    const top = worldPos.y - this.height * this.anchorY;

    return {
      left,
      right: left + this.width,
      top,
      bottom: top + this.height,
    };
  }

  /**
   * Check if this entity intersects with another entity
   */
  intersects(other: Entity): boolean {
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    return !(
      bounds1.right < bounds2.left ||
      bounds1.left > bounds2.right ||
      bounds1.bottom < bounds2.top ||
      bounds1.top > bounds2.bottom
    );
  }

  /**
   * Get distance between this entity and another
   */
  distanceTo(other: Entity): number {
    const pos1 = this.getWorldPosition();
    const pos2 = other.getWorldPosition();
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check collision with another entity and emit events
   */
  checkCollision(other: Entity): void {
    if (!this.active || !other.active) return;
    if (!this.checkCollisions) return;

    // Skip if filtering by tags and other doesn't have any matching tags
    if (this.collisionTags.length > 0) {
      const hasMatchingTag = this.collisionTags.some(tag => other.hasTag(tag));
      if (!hasMatchingTag) return;
    }

    const isColliding = this.intersects(other);

    if (isColliding && !this.collidingWith.has(other)) {
      // New collision started
      this.collidingWith.add(other);
      this.emit('collide', { other });
      this.emit('collisionenter', { other });
    } else if (!isColliding && this.collidingWith.has(other)) {
      // Collision ended
      this.collidingWith.delete(other);
      this.emit('collisionexit', { other });
    }
  }

  /**
   * Get all entities currently colliding with this one
   */
  getCollisions(): Entity[] {
    return Array.from(this.collidingWith);
  }

  /**
   * Update entity (override in subclasses)
   */
  update(deltaTime: number): void {
    // Update children
    for (const child of this.children) {
      if (child.active) {
        child.update(deltaTime);
      }
    }

    this.emit('update', deltaTime);
  }

  /**
   * Render entity (override in subclasses)
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;

    // PERFORMANCE: Only save/restore if we actually need to transform
    const hasTransform = this.x !== 0 || this.y !== 0 || this.rotation !== 0 ||
                        this.scaleX !== 1 || this.scaleY !== 1 || this.alpha !== 1 ||
                        this.children.length > 0;

    if (hasTransform) {
      ctx.save();

      // Apply local transform only (parent transform already applied if this is a child)
      if (this.x !== 0 || this.y !== 0) {
        ctx.translate(this.x, this.y);
      }
      if (this.rotation !== 0) {
        ctx.rotate(this.rotation);
      }
      if (this.scaleX !== 1 || this.scaleY !== 1) {
        ctx.scale(this.scaleX, this.scaleY);
      }
      if (this.alpha !== 1) {
        ctx.globalAlpha *= this.alpha;
      }
    }

    // Render self (override in subclasses)
    this.draw(ctx);

    // Render children (they will apply their own transforms)
    if (this.children.length > 0) {
      for (const child of this.children) {
        if (child.visible) {
          child.render(ctx);
        }
      }
    }

    if (hasTransform) {
      ctx.restore();
    }
  }

  /**
   * Draw the entity (override in subclasses)
   */
  protected draw(_ctx: CanvasRenderingContext2D): void {
    // Override in subclasses
  }

  /**
   * Tween entity properties
   */
  tween(endValues: Partial<Entity>, options: TweenOptions): Tween<Entity> {
    const tween = new Tween(this, endValues, options);
    tweenManager.add(tween);
    return tween;
  }

  /**
   * Destroy entity
   */
  destroy(): void {
    // Remove from parent
    if (this.parent) {
      this.parent.removeChild(this);
    }

    // Remove from scene
    if (this.scene) {
      this.scene.remove(this);
    }

    // Destroy children
    for (const child of [...this.children]) {
      child.destroy();
    }

    this.clearEvents();
  }
}
