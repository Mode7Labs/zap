import type { EntityOptions, Transform, Point, TweenOptions } from '../types';
import { EventEmitter } from '../core/EventEmitter';
import type { Scene } from '../core/Scene';
import { Tween } from '../effects/Tween';
import { tweenManager } from '../effects/TweenManager';
import { length, normalize, dot, rotate } from '../utils/math';

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
  public radius?: number;

  // Physics properties
  public vx?: number;
  public vy?: number;
  public gravity?: number;
  public friction?: number;
  public bounciness?: number;

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
  private collisionNormals: Map<Entity, { x: number; y: number }> = new Map();

  // Mark object as static (immovable) - used for walls, platforms, etc.
  public static: boolean = false;

  // Tags for grouping
  private tags: Set<string> = new Set();

  // Scene reference
  private scene: Scene | null = null;

  constructor(options: EntityOptions = {}) {
    super();

    // Validate and sanitize numeric inputs
    const sanitize = (value: number | undefined, defaultValue: number): number => {
      if (value === undefined) return defaultValue;
      if (!isFinite(value)) return defaultValue;
      return value;
    };

    this.x = sanitize(options.x, 0);
    this.y = sanitize(options.y, 0);
    this.rotation = sanitize(options.rotation, 0);
    this.scaleX = sanitize(options.scaleX, 1);
    this.scaleY = sanitize(options.scaleY, 1);
    this.alpha = Math.max(0, Math.min(1, sanitize(options.alpha, 1))); // Clamp 0-1
    this.width = Math.max(0, sanitize(options.width, 0)); // No negative dimensions
    this.height = Math.max(0, sanitize(options.height, 0));
    this.radius = options.radius !== undefined ? Math.max(0, sanitize(options.radius, 0)) : undefined;
    this.vx = options.vx !== undefined ? sanitize(options.vx, 0) : undefined;
    this.vy = options.vy !== undefined ? sanitize(options.vy, 0) : undefined;
    this.gravity = options.gravity !== undefined ? sanitize(options.gravity, 0) : undefined;
    this.friction = options.friction !== undefined ? Math.max(0, Math.min(1, sanitize(options.friction, 1))) : undefined; // Clamp 0-1
    this.bounciness = options.bounciness !== undefined ? Math.max(0, Math.min(1, sanitize(options.bounciness, 0.8))) : undefined; // Clamp 0-1
    this.anchorX = Math.max(0, Math.min(1, sanitize(options.anchorX, 0.5)));
    this.anchorY = Math.max(0, Math.min(1, sanitize(options.anchorY, 0.5)));
    this.zIndex = sanitize(options.zIndex, 0);
    this.active = options.active ?? true;
    this.interactive = options.interactive ?? false;
    this.visible = options.visible ?? true;
    this.checkCollisions = options.checkCollisions ?? false;
    this.collisionTags = options.collisionTags ?? [];
    this.static = options.static ?? false;
  }

  /**
   * Set the scene
   */
  setScene(scene: Scene | null): void {
    const wasInScene = this.scene !== null;
    const nowInScene = scene !== null;

    this.scene = scene;

    // Emit lifecycle events
    if (!wasInScene && nowInScene) {
      this.emit('added');
    } else if (wasInScene && !nowInScene) {
      this.emit('removed');
    }
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
   * Properly applies parent rotation and scale transforms
   */
  getWorldPosition(): Point {
    let worldX = this.x;
    let worldY = this.y;
    let current: Entity | null = this.parent;

    while (current) {
      // Apply parent's scale to the position
      const scaledX = worldX * current.scaleX;
      const scaledY = worldY * current.scaleY;

      // Apply parent's rotation
      if (current.rotation !== 0) {
        const cos = Math.cos(current.rotation);
        const sin = Math.sin(current.rotation);
        worldX = scaledX * cos - scaledY * sin;
        worldY = scaledX * sin + scaledY * cos;
      } else {
        worldX = scaledX;
        worldY = scaledY;
      }

      // Add parent's position
      worldX += current.x;
      worldY += current.y;

      current = current.parent;
    }

    return { x: worldX, y: worldY };
  }

  /**
   * Get world transform
   * Properly applies parent rotation and scale transforms
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
      // Apply parent's scale to the position
      const scaledX = transform.x * current.scaleX;
      const scaledY = transform.y * current.scaleY;

      // Apply parent's rotation to the position
      if (current.rotation !== 0) {
        const cos = Math.cos(current.rotation);
        const sin = Math.sin(current.rotation);
        transform.x = scaledX * cos - scaledY * sin + current.x;
        transform.y = scaledX * sin + scaledY * cos + current.y;
      } else {
        transform.x = scaledX + current.x;
        transform.y = scaledY + current.y;
      }

      // Accumulate rotation, scale, and alpha
      transform.rotation += current.rotation;
      transform.scaleX *= current.scaleX;
      transform.scaleY *= current.scaleY;
      transform.alpha *= current.alpha;

      current = current.parent;
    }

    return transform;
  }

  /**
   * Convert a world-space offset to local-space offset
   * Takes into account parent rotation and scale
   */
  private worldOffsetToLocal(worldDx: number, worldDy: number): Point {
    if (!this.parent) {
      // No parent, world space = local space
      return { x: worldDx, y: worldDy };
    }

    // Apply inverse transformations from all parents
    let localDx = worldDx;
    let localDy = worldDy;

    // Build parent chain from root to immediate parent
    const parents: Entity[] = [];
    let current: Entity | null = this.parent;
    while (current) {
      parents.unshift(current); // Add to beginning
      current = current.parent;
    }

    // Apply inverse transforms from root down to immediate parent
    for (const parent of parents.reverse()) {
      // Inverse rotation
      if (parent.rotation !== 0) {
        const cos = Math.cos(-parent.rotation);
        const sin = Math.sin(-parent.rotation);
        const rotatedDx = localDx * cos - localDy * sin;
        const rotatedDy = localDx * sin + localDy * cos;
        localDx = rotatedDx;
        localDy = rotatedDy;
      }

      // Inverse scale
      localDx /= parent.scaleX;
      localDy /= parent.scaleY;
    }

    return { x: localDx, y: localDy };
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
   * Accounts for rotation by computing AABB of the rotated rectangle
   */
  getBounds(): { left: number; right: number; top: number; bottom: number } {
    const worldPos = this.getWorldPosition();

    // If no rotation, use simple calculation
    if (this.rotation === 0) {
      const left = worldPos.x - this.width * this.anchorX;
      const top = worldPos.y - this.height * this.anchorY;
      return {
        left,
        right: left + this.width,
        top,
        bottom: top + this.height,
      };
    }

    // Calculate the 4 corners of the rotated rectangle
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    // Rectangle corners relative to anchor point
    const localLeft = -this.width * this.anchorX;
    const localRight = this.width * (1 - this.anchorX);
    const localTop = -this.height * this.anchorY;
    const localBottom = this.height * (1 - this.anchorY);

    // Rotate each corner and find min/max bounds
    const corners = [
      { x: localLeft, y: localTop },      // Top-left
      { x: localRight, y: localTop },     // Top-right
      { x: localRight, y: localBottom },  // Bottom-right
      { x: localLeft, y: localBottom }    // Bottom-left
    ];

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const corner of corners) {
      // Rotate corner
      const rotatedX = corner.x * cos - corner.y * sin;
      const rotatedY = corner.x * sin + corner.y * cos;

      // Translate to world position
      const worldX = worldPos.x + rotatedX;
      const worldY = worldPos.y + rotatedY;

      // Update bounds
      minX = Math.min(minX, worldX);
      maxX = Math.max(maxX, worldX);
      minY = Math.min(minY, worldY);
      maxY = Math.max(maxY, worldY);
    }

    return {
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY,
    };
  }

  /**
   * Determine if this entity should use circle collision
   * Returns true if radius is set and entity has positive dimensions
   */
  private isCircleCollider(): boolean {
    // Simple check: if radius is set and positive, use circle collision
    // User sets radius when they want circle collision
    return this.radius !== undefined && this.radius > 0;
  }

  /**
   * Get the collision normal when this entity collides with another
   * Returns the direction to push this entity away from other
   */
  getCollisionNormal(other: Entity): { x: number; y: number } {
    const thisIsCircle = this.isCircleCollider();
    const otherIsCircle = other.isCircleCollider();

    // Circle vs Circle: normal is from other center to this center
    if (thisIsCircle && otherIsCircle) {
      const thisWorldPos = this.getWorldPosition();
      const otherWorldPos = other.getWorldPosition();
      const dx = thisWorldPos.x - otherWorldPos.x;
      const dy = thisWorldPos.y - otherWorldPos.y;
      return normalize(dx, dy);
    }

    // Circle vs Rectangle (or vice versa)
    if (thisIsCircle || otherIsCircle) {
      const circle = thisIsCircle ? this : other;
      const rect = thisIsCircle ? other : this;
      const sign = thisIsCircle ? 1 : -1; // Flip if rect is 'this'

      // For rotated rectangles, find closest point in local space
      if (rect.rotation !== 0) {
        const rectWorldPos = rect.getWorldPosition();
        const circleWorldPos = circle.getWorldPosition();
        const dx = circleWorldPos.x - rectWorldPos.x;
        const dy = circleWorldPos.y - rectWorldPos.y;

        // Transform to local space
        const local = rotate(dx, dy, -rect.rotation);

        // Rectangle bounds in local space
        const localLeft = -rect.width * rect.anchorX;
        const localRight = rect.width * (1 - rect.anchorX);
        const localTop = -rect.height * rect.anchorY;
        const localBottom = rect.height * (1 - rect.anchorY);

        // Closest point on rectangle
        const closestX = Math.max(localLeft, Math.min(local.x, localRight));
        const closestY = Math.max(localTop, Math.min(local.y, localBottom));

        // Normal in local space (from closest point to circle)
        const normalX = local.x - closestX;
        const normalY = local.y - closestY;

        // Normalize and rotate back to world space
        const normalLocal = normalize(normalX, normalY);
        const normalWorld = rotate(normalLocal.x, normalLocal.y, rect.rotation);

        return {
          x: normalWorld.x * sign,
          y: normalWorld.y * sign
        };
      }

      // Non-rotated: simple closest point
      const bounds = rect.getBounds();
      const circleWorldPos = circle.getWorldPosition();
      const closestX = Math.max(bounds.left, Math.min(circleWorldPos.x, bounds.right));
      const closestY = Math.max(bounds.top, Math.min(circleWorldPos.y, bounds.bottom));

      const normalX = circleWorldPos.x - closestX;
      const normalY = circleWorldPos.y - closestY;
      const normal = normalize(normalX, normalY);

      return {
        x: normal.x * sign,
        y: normal.y * sign
      };
    }

    // Rectangle vs Rectangle: use minimum penetration axis
    // This works for both rotated and non-rotated rectangles
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    // Calculate overlap on each axis
    const overlapX = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
    const overlapY = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);

    // Use world positions to determine correct separation direction
    const thisWorldPos = this.getWorldPosition();
    const otherWorldPos = other.getWorldPosition();

    // Separate along axis of least penetration
    if (Math.abs(overlapX) < Math.abs(overlapY)) {
      // Horizontal separation
      const direction = thisWorldPos.x < otherWorldPos.x ? -1 : 1;
      return { x: direction, y: 0 };
    } else {
      // Vertical separation
      const direction = thisWorldPos.y < otherWorldPos.y ? -1 : 1;
      return { x: 0, y: direction };
    }
  }

  /**
   * Check if this entity intersects with another entity
   * Automatically detects shape based on radius property:
   * - If radius is set AND entity is square, uses circle collision
   * - Otherwise uses rectangle (AABB) collision
   */
  intersects(other: Entity): boolean {
    // Auto-detect if entity should use circle collision
    // Only treat as circle if it's actually circular (width ≈ height and radius ≈ half the size)
    const thisIsCircle = this.isCircleCollider();
    const otherIsCircle = other.isCircleCollider();

    // Circle vs Circle collision
    if (thisIsCircle && otherIsCircle) {
      const thisWorldPos = this.getWorldPosition();
      const otherWorldPos = other.getWorldPosition();
      const dx = thisWorldPos.x - otherWorldPos.x;
      const dy = thisWorldPos.y - otherWorldPos.y;
      const radiusSum = this.radius! + other.radius!;
      // Use squared distance to avoid expensive sqrt
      return (dx * dx + dy * dy) < (radiusSum * radiusSum);
    }

    // Circle vs Rectangle collision
    if (thisIsCircle || otherIsCircle) {
      const circle = thisIsCircle ? this : other;
      const rect = thisIsCircle ? other : this;

      // If rectangle is rotated, transform circle into rectangle's local space
      if (rect.rotation !== 0) {
        // Get rectangle center in world space
        const rectWorldPos = rect.getWorldPosition();
        const circleWorldPos = circle.getWorldPosition();

        // Vector from rect center to circle center (world space)
        const dx = circleWorldPos.x - rectWorldPos.x;
        const dy = circleWorldPos.y - rectWorldPos.y;

        // Rotate circle position into rectangle's local space (inverse rotation)
        const local = rotate(dx, dy, -rect.rotation);

        // Rectangle bounds in local space (centered at origin, accounting for anchor)
        const localLeft = -rect.width * rect.anchorX;
        const localRight = rect.width * (1 - rect.anchorX);
        const localTop = -rect.height * rect.anchorY;
        const localBottom = rect.height * (1 - rect.anchorY);

        // Find closest point on rectangle in local space
        const closestX = Math.max(localLeft, Math.min(local.x, localRight));
        const closestY = Math.max(localTop, Math.min(local.y, localBottom));

        // Check distance from circle center to closest point
        const distX = local.x - closestX;
        const distY = local.y - closestY;
        return (distX * distX + distY * distY) < (circle.radius! * circle.radius!);
      }

      // Non-rotated rectangle: use simple AABB test
      const bounds = rect.getBounds();
      const circleWorldPos = circle.getWorldPosition();
      const closestX = Math.max(bounds.left, Math.min(circleWorldPos.x, bounds.right));
      const closestY = Math.max(bounds.top, Math.min(circleWorldPos.y, bounds.bottom));

      const dx = circleWorldPos.x - closestX;
      const dy = circleWorldPos.y - closestY;
      return (dx * dx + dy * dy) < (circle.radius! * circle.radius!);
    }

    // Rectangle vs Rectangle collision (AABB - Axis-Aligned Bounding Box)
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
      const normal = this.getCollisionNormal(other);
      this.collisionNormals.set(other, normal);

      // Auto-depenetration: push this entity out of other along collision normal
      // For dynamic-dynamic collisions, use mutual separation
      if (!other.static && !this.static) {
        // Both dynamic - calculate overlap once and move each 50%
        this.mutualSeparation(other, normal);
      } else {
        // One is static - only move the dynamic one
        this.separateFrom(other, normal);
      }

      // Auto-bounce: reflect velocity if moving into the collision
      // Only bounce if this entity has velocity and is moving toward the other entity
      if (this.vx !== undefined && this.vy !== undefined) {
        const dotProduct = dot(this.vx, this.vy, normal.x, normal.y);
        // Only bounce if moving into the surface (dot < 0)
        if (dotProduct < 0) {
          const restitution = this.bounciness ?? 0.8;
          this.bounce(normal.x, normal.y, restitution);
        }
      }

      this.emit('collide', { other, normal });
      this.emit('collisionenter', { other, normal });
    } else if (isColliding && this.collidingWith.has(other)) {
      // Still colliding - this means separation wasn't enough
      // Re-separate and stop velocity component pointing into surface
      const normal = this.getCollisionNormal(other);
      this.collisionNormals.set(other, normal);

      // For dynamic-dynamic collisions, use mutual separation
      if (!other.static && !this.static) {
        this.mutualSeparation(other, normal);
      } else {
        this.separateFrom(other, normal);
      }

      // Zero out velocity component pointing into the surface to prevent drift
      if (this.vx !== undefined && this.vy !== undefined) {
        const dotProduct = dot(this.vx, this.vy, normal.x, normal.y);
        if (dotProduct < 0) {
          // Remove the component of velocity pointing into the surface
          this.vx -= dotProduct * normal.x;
          this.vy -= dotProduct * normal.y;
        }
      }

      this.emit('collide', { other, normal });
    } else if (!isColliding && this.collidingWith.has(other)) {
      // Collision ended
      this.collidingWith.delete(other);
      this.collisionNormals.delete(other);
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
   * Calculate collision overlap distance between two entities
   * Returns the penetration depth (how much they're overlapping)
   */
  private calculateOverlap(other: Entity): number {
    const thisIsCircle = this.isCircleCollider();
    const otherIsCircle = other.isCircleCollider();

    // Circle vs Circle
    if (thisIsCircle && otherIsCircle) {
      const thisWorldPos = this.getWorldPosition();
      const otherWorldPos = other.getWorldPosition();
      const dx = thisWorldPos.x - otherWorldPos.x;
      const dy = thisWorldPos.y - otherWorldPos.y;
      const distance = length(dx, dy);
      return (this.radius! + other.radius!) - distance;
    }

    // Circle vs Rectangle (or vice versa)
    if (thisIsCircle || otherIsCircle) {
      const circle = thisIsCircle ? this : other;
      const rect = thisIsCircle ? other : this;

      // Rotated rectangle
      if (rect.rotation !== 0) {
        const rectPos = rect.getWorldPosition();
        const circleWorldPos = circle.getWorldPosition();
        const dx = circleWorldPos.x - rectPos.x;
        const dy = circleWorldPos.y - rectPos.y;

        // Transform to local space
        const local = rotate(dx, dy, -rect.rotation);

        // Rectangle bounds in local space (accounting for anchor)
        const localLeft = -rect.width * rect.anchorX;
        const localRight = rect.width * (1 - rect.anchorX);
        const localTop = -rect.height * rect.anchorY;
        const localBottom = rect.height * (1 - rect.anchorY);

        // Closest point on rectangle
        const closestX = Math.max(localLeft, Math.min(local.x, localRight));
        const closestY = Math.max(localTop, Math.min(local.y, localBottom));

        // Distance from circle center to closest point
        const distX = local.x - closestX;
        const distY = local.y - closestY;
        const dist = length(distX, distY);

        return circle.radius! - dist;
      }

      // Non-rotated rectangle
      const bounds = rect.getBounds();
      const circleWorldPos = circle.getWorldPosition();
      const closestX = Math.max(bounds.left, Math.min(circleWorldPos.x, bounds.right));
      const closestY = Math.max(bounds.top, Math.min(circleWorldPos.y, bounds.bottom));

      const distX = circleWorldPos.x - closestX;
      const distY = circleWorldPos.y - closestY;
      const dist = length(distX, distY);

      return circle.radius! - dist;
    }

    // Rectangle vs Rectangle
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    const overlapX = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
    const overlapY = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);

    if (overlapX > 0 && overlapY > 0) {
      return Math.min(overlapX, overlapY);
    }

    return 0;
  }

  /**
   * Mutual separation between two dynamic objects
   * Calculates overlap once and moves both objects 50% to avoid recalculation issues
   */
  private mutualSeparation(other: Entity, normal: { x: number; y: number }): void {
    const overlap = this.calculateOverlap(other);

    if (overlap > 0) {
      const halfOverlap = overlap * 0.5;

      // Calculate world-space separation
      const worldDx = normal.x * halfOverlap;
      const worldDy = normal.y * halfOverlap;

      // Convert to local space for each entity
      const thisLocalOffset = this.worldOffsetToLocal(worldDx, worldDy);
      const otherLocalOffset = other.worldOffsetToLocal(-worldDx, -worldDy);

      // Apply local offsets
      this.x += thisLocalOffset.x;
      this.y += thisLocalOffset.y;
      other.x += otherLocalOffset.x;
      other.y += otherLocalOffset.y;
    }
  }

  /**
   * Separate this entity from another entity along a collision normal
   * Pushes this entity out so it's no longer overlapping
   * Used when one entity is static (immovable)
   */
  private separateFrom(other: Entity, normal: { x: number; y: number }): void {
    // Static objects cannot be moved
    if (this.static) {
      return;
    }

    const overlap = this.calculateOverlap(other);

    if (overlap > 0) {
      // Calculate world-space separation
      const worldDx = normal.x * overlap;
      const worldDy = normal.y * overlap;

      // Convert to local space for this entity
      const localOffset = this.worldOffsetToLocal(worldDx, worldDy);

      // Apply local offset
      this.x += localOffset.x;
      this.y += localOffset.y;
    }
  }

  /**
   * Integrate physics (velocity, gravity, friction)
   * Called automatically in update if physics properties are set
   * Uses sub-stepping for fast-moving objects to prevent tunneling
   */
  private integratePhysics(deltaTime: number): void {
    // Calculate speed to determine if we need sub-stepping
    const vx = this.vx ?? 0;
    const vy = this.vy ?? 0;
    const speed = length(vx, vy);

    // Sub-step if moving faster than a threshold (prevents tunneling)
    // At 300 px/s, objects move ~5px per frame at 60fps
    // We sub-step if they'd move more than their size in one frame
    const minDimension = Math.min(this.width, this.height);
    const maxStepDistance = minDimension > 0 ? minDimension * 0.8 : 10; // Default to 10px if no size
    const wouldMove = speed * deltaTime;
    const substeps = maxStepDistance > 0 ? Math.max(1, Math.min(Math.ceil(wouldMove / maxStepDistance), 10)) : 1; // At least 1, cap at 10 substeps
    const subDelta = deltaTime / substeps;

    for (let i = 0; i < substeps; i++) {
      // Apply gravity to vertical velocity
      if (this.gravity !== undefined && this.vy !== undefined) {
        const gravityDelta = this.gravity * subDelta;

        // Check if gravity would push us into a STATIC collision surface
        // Only constrain against static objects (walls, platforms)
        let allowGravity = true;
        if (this.collisionNormals.size > 0) {
          for (const [entity, normal] of this.collisionNormals.entries()) {
            // Only constrain against static objects
            if (entity.static) {
              // If gravity direction opposes the normal (dot product < 0), we're being pushed into the surface
              // Be aggressive: if normal points even slightly upward and gravity pulls down, block it
              const dotProduct = dot(0, gravityDelta, normal.x, normal.y);
              if (dotProduct < 0) { // Any opposing force blocks gravity
                allowGravity = false;
                // Also zero out velocity to prevent drift
                if (this.vy > 0 && this.vy < 5) { // Very small downward velocity
                  this.vy = 0;
                }
                break;
              }
            }
          }
        }

        if (allowGravity) {
          this.vy += gravityDelta;
        }
      }

      // Constrain velocity based on STATIC collision normals to prevent tunneling
      // Only constrain against static objects (walls, platforms), not other dynamic objects
      if (this.collisionNormals.size > 0 && this.vx !== undefined && this.vy !== undefined) {
        for (const [entity, normal] of this.collisionNormals.entries()) {
          // Only constrain against static objects
          if (entity.static) {
            const dotProduct = dot(this.vx, this.vy, normal.x, normal.y);
            // If moving into the surface, remove that velocity component
            if (dotProduct < 0) {
              this.vx -= dotProduct * normal.x;
              this.vy -= dotProduct * normal.y;
            }

            // If velocity is very small while on static surface, snap to zero
            // This prevents tiny floating-point drift through floors
            const speed = length(this.vx, this.vy);
            if (speed < 1) { // Less than 1 pixel/second
              // Check if velocity is mostly in the direction of the surface normal
              const velocityAlongNormal = dot(this.vx, this.vy, normal.x, normal.y);
              if (Math.abs(velocityAlongNormal) < 0.5) {
                // Object is essentially at rest on the surface
                this.vx = 0;
                this.vy = 0;
              }
            }
          }
        }
      }

      // Apply velocity to position
      if (this.vx !== undefined) {
        this.x += this.vx * subDelta;
      }
      if (this.vy !== undefined) {
        this.y += this.vy * subDelta;
      }
    }

    // Apply friction once after all substeps (more efficient)
    if (this.friction !== undefined) {
      if (this.vx !== undefined) {
        this.vx *= this.friction;
      }
      if (this.vy !== undefined) {
        this.vy *= this.friction;
      }
    }
  }

  /**
   * Bounce off a surface by reflecting velocity along a normal vector
   * @param normalX X component of surface normal (should be normalized)
   * @param normalY Y component of surface normal (should be normalized)
   * @param restitution Bounciness coefficient (0 = no bounce, 1 = perfect bounce)
   */
  bounce(normalX: number, normalY: number, restitution: number = 0.8): void {
    // Static objects cannot bounce (they don't have velocity)
    if (this.static) return;
    if (this.vx === undefined || this.vy === undefined) return;

    // Reflect velocity along normal: v' = v - 2(v·n)n
    const dotProduct = dot(this.vx, this.vy, normalX, normalY);
    this.vx -= 2 * dotProduct * normalX * restitution;
    this.vy -= 2 * dotProduct * normalY * restitution;
  }

  /**
   * Update entity (override in subclasses)
   */
  update(deltaTime: number): void {
    // Static objects don't have physics
    // Integrate physics if velocity is set and object is not static
    if (!this.static && (this.vx !== undefined || this.vy !== undefined)) {
      this.integratePhysics(deltaTime);
    }

    // Normalize rotation to prevent unbounded accumulation
    // Keep rotation in range [0, 2π]
    if (this.rotation < 0 || this.rotation > Math.PI * 2) {
      this.rotation = ((this.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    }

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
