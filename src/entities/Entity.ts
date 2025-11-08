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
  public mass?: number; // Mass for force calculations (default 1)

  // Force accumulator (cleared each frame)
  private forceX: number = 0;
  private forceY: number = 0;

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

  // Previous position for collision detection (like LittleJS oldPos)
  private oldX: number = 0;
  private oldY: number = 0;

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
    this.mass = options.mass !== undefined ? Math.max(0.001, sanitize(options.mass, 1)) : undefined; // Minimum mass to avoid divide-by-zero
    this.anchorX = Math.max(0, Math.min(1, sanitize(options.anchorX, 0.5)));
    this.anchorY = Math.max(0, Math.min(1, sanitize(options.anchorY, 0.5)));
    this.zIndex = sanitize(options.zIndex, 0);
    this.active = options.active ?? true;
    this.interactive = options.interactive ?? false;
    this.visible = options.visible ?? true;
    this.checkCollisions = options.checkCollisions ?? false;
    this.collisionTags = options.collisionTags ?? [];
    this.static = options.static ?? false;

    // Initialize oldX/oldY to current position (for first collision check before update)
    this.oldX = this.x;
    this.oldY = this.y;
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
    // Use circle collision if radius is set and makes sense as a circle
    if (this.radius === undefined || this.radius <= 0) return false;

    // If no width/height specified, it's definitely a circle
    if (this.width === 0 && this.height === 0) return true;

    // If width and height are set, check if they form a square that matches the radius
    // Use circle collision only if dimensions roughly match (within 20% tolerance)
    // This allows {width: 40, height: 40, radius: 20} to be a circle
    // But {width: 70, height: 12, radius: 6} to be a rectangle
    const avgDimension = (this.width + this.height) / 2;
    const expectedRadius = avgDimension / 2;
    const tolerance = 0.2; // 20% tolerance

    return Math.abs(this.radius - expectedRadius) / expectedRadius < tolerance;
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
      // Normal always points from rect to circle (pushes circle away from rect)
      const sign = thisIsCircle ? 1 : -1;

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

    // Rectangle vs Rectangle
    // Use world positions to determine correct separation direction
    const thisWorldPos = this.getWorldPosition();
    const otherWorldPos = other.getWorldPosition();

    // If either rectangle is rotated, use simple center-to-center normal
    // This avoids AABB issues with rotation
    if (this.rotation !== 0 || other.rotation !== 0) {
      const dx = thisWorldPos.x - otherWorldPos.x;
      const dy = thisWorldPos.y - otherWorldPos.y;
      const normal = normalize(dx, dy);
      return normal;
    }

    // For non-rotated rectangles, use minimum penetration axis (AABB)
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    // Calculate overlap on each axis
    const overlapX = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
    const overlapY = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);

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
   * Check if this entity was overlapping with other at their old positions (before this frame's movement)
   */
  private wasOverlappingAtOldPos(other: Entity): boolean {
    // Safety: If either entity doesn't have collision checking, they weren't "overlapping" for collision purposes
    if (!this.checkCollisions || !other.checkCollisions) return false;

    // Temporarily swap to old positions
    const thisX = this.x;
    const thisY = this.y;
    const otherX = other.x;
    const otherY = other.y;

    this.x = this.oldX;
    this.y = this.oldY;
    other.x = other.oldX;
    other.y = other.oldY;

    const wasOverlapping = this.intersects(other);

    // Restore current positions
    this.x = thisX;
    this.y = thisY;
    other.x = otherX;
    other.y = otherY;

    return wasOverlapping;
  }

  /**
   * Check collision with another entity and emit events
   */
  checkCollision(other: Entity): void {
    if (!this.active || !other.active) return;
    if (!this.checkCollisions) return;
    if (!other.checkCollisions) return; // Both entities must have collision checking enabled

    // Skip if filtering by tags and other doesn't have any matching tags
    if (this.collisionTags.length > 0) {
      const hasMatchingTag = this.collisionTags.some(tag => other.hasTag(tag));
      if (!hasMatchingTag) return;
    }

    const isColliding = this.intersects(other);
    const wasAlreadyOverlapping = this.wasOverlappingAtOldPos(other);

    if (isColliding && !this.collidingWith.has(other)) {
      // New collision started (first time detecting collision with this entity)
      this.collidingWith.add(other);
      const normal = this.getCollisionNormal(other);
      this.collisionNormals.set(other, normal);

      // LittleJS style: if was already overlapping at oldPos AND entity has moved, they were stuck
      // Check if entity has actually moved since initialization (oldPos != currentPos)
      const hasMoved = this.oldX !== this.x || this.oldY !== this.y;

      if (wasAlreadyOverlapping && hasMoved) {
        // Objects were already stuck from previous frame - apply gentle push-away acceleration
        if (!this.static && this.vx !== undefined && this.vy !== undefined) {
          const pushAwayAccel = 0.001;
          this.vx += normal.x * pushAwayAccel;
          this.vy += normal.y * pushAwayAccel;
        }

        this.emit('collide', { other, normal });
        this.emit('collisionenter', { other, normal });
        return;
      }

      // If wasAlreadyOverlapping but hasn't moved, this is first collision check (before any update())
      // Treat as new collision and do full separation

      // NEW collision (wasn't overlapping at oldPos) - do full resolution
      // Only resolve if this entity is non-static AND other is static (clear authority)
      // If both are non-static, don't resolve (ambiguous - would need mutual separation)
      if (!this.static && other.static) {
        const epsilon = 0.001;

        // For circles, use radius. For rectangles, we need to be smarter about rotated objects
        const thisRadius = this.radius;
        const otherRadius = other.radius;

        // Get current world position (for parented entities)
        const currentWorldPos = this.parent ? this.getWorldPosition() : { x: this.x, y: this.y };
        const otherWorldPos = other.parent ? other.getWorldPosition() : { x: other.x, y: other.y };


        // Calculate the current distance between centers
        const dx = currentWorldPos.x - otherWorldPos.x;
        const dy = currentWorldPos.y - otherWorldPos.y;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the required minimum distance based on object sizes
        // For rectangles, project their half-sizes onto the collision normal
        let requiredDistance = 0;

        if (thisRadius !== undefined && otherRadius !== undefined) {
          // Circle-circle: simple sum of radii
          requiredDistance = thisRadius + otherRadius;
        } else if (thisRadius !== undefined && otherRadius === undefined) {
          // Circle-rectangle: circle radius + rectangle's projection onto normal
          const otherHalfWidth = other.width / 2;
          const otherHalfHeight = other.height / 2;
          // Project rectangle onto the normal direction
          const otherProjection = Math.abs(normal.x) * otherHalfWidth + Math.abs(normal.y) * otherHalfHeight;
          requiredDistance = thisRadius + otherProjection;
        } else if (thisRadius === undefined && otherRadius !== undefined) {
          // Rectangle-circle: rectangle's projection onto normal + circle radius
          const thisHalfWidth = this.width / 2;
          const thisHalfHeight = this.height / 2;
          const thisProjection = Math.abs(normal.x) * thisHalfWidth + Math.abs(normal.y) * thisHalfHeight;
          requiredDistance = thisProjection + otherRadius;
        } else {
          // Rectangle-rectangle: sum of both projections onto normal
          const thisHalfWidth = this.width / 2;
          const thisHalfHeight = this.height / 2;
          const otherHalfWidth = other.width / 2;
          const otherHalfHeight = other.height / 2;
          const thisProjection = Math.abs(normal.x) * thisHalfWidth + Math.abs(normal.y) * thisHalfHeight;
          const otherProjection = Math.abs(normal.x) * otherHalfWidth + Math.abs(normal.y) * otherHalfHeight;
          requiredDistance = thisProjection + otherProjection;
        }

        // Calculate overlap (penetration depth)
        const overlap = requiredDistance - currentDistance + epsilon;

        // Only separate if there's actual overlap
        if (overlap > 0) {
          // Move this object away from other along the normal by the overlap amount
          const worldOffsetX = normal.x * overlap;
          const worldOffsetY = normal.y * overlap;

          if (this.parent) {
            const localOffset = this.worldOffsetToLocal(worldOffsetX, worldOffsetY);
            this.x += localOffset.x;
            this.y += localOffset.y;
          } else {
            this.x += worldOffsetX;
            this.y += worldOffsetY;
          }
        }

        // Bounce velocity along the normal
        if (this.vx !== undefined && this.vy !== undefined) {
          const restitution = this.bounciness ?? 0.8;

          // Calculate velocity component along normal
          const velocityAlongNormal = this.vx * normal.x + this.vy * normal.y;

          // Only bounce if moving into the surface
          if (velocityAlongNormal < 0) {
            // Reflect velocity along normal
            const oldVx = this.vx;
            const oldVy = this.vy;

            this.vx -= (1 + restitution) * velocityAlongNormal * normal.x;
            this.vy -= (1 + restitution) * velocityAlongNormal * normal.y;

            // Debug: log bounce if significant
            if (Math.abs(velocityAlongNormal) > 100) {
              console.log(`Bounce: v=(${oldVx.toFixed(1)}, ${oldVy.toFixed(1)}) -> (${this.vx.toFixed(1)}, ${this.vy.toFixed(1)}), normal=(${normal.x.toFixed(2)}, ${normal.y.toFixed(2)})`);
            }

            // Stop micro-bounces (only at very low velocities)
            if (Math.abs(this.vx) < 10) this.vx = 0;
            if (Math.abs(this.vy) < 10) this.vy = 0;
          }
        }
      }

      this.emit('collide', { other, normal });
      this.emit('collisionenter', { other, normal });
    } else if (isColliding && this.collidingWith.has(other)) {
      // Still colliding - was already stuck from last frame
      // Don't separate or bounce - just emit event
      const normal = this.getCollisionNormal(other);
      this.collisionNormals.set(other, normal);

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
  // @ts-ignore - May be used in future
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
   * Swept collision test for continuous collision detection (CCD)
   * Uses binary search to find exact time of impact
   * Works with all shapes including rotated rectangles
   * @param dx Movement delta X for this substep
   * @param dy Movement delta Y for this substep
   * @param other The static object to test against
   */
  private sweepTest(dx: number, dy: number, other: Entity): { t: number; normal: { x: number; y: number } } | null {
    if (!other.static) return null;

    // Save current position
    const startX = this.x;
    const startY = this.y;

    // Don't do CCD if already overlapping at start
    if (this.intersects(other)) {
      return null;
    }

    // Check if we would intersect at end position
    this.x = startX + dx;
    this.y = startY + dy;
    const intersectsAtEnd = this.intersects(other);

    // Restore position
    this.x = startX;
    this.y = startY;

    // If no intersection at end, no collision
    if (!intersectsAtEnd) {
      return null;
    }

    // Binary search to find exact time of impact
    let tLow = 0;
    let tHigh = 1;
    let bestT = 1;
    const epsilon = 0.001;
    const maxIterations = 10;

    for (let i = 0; i < maxIterations; i++) {
      const tMid = (tLow + tHigh) / 2;

      // Test position at tMid
      this.x = startX + dx * tMid;
      this.y = startY + dy * tMid;

      const intersects = this.intersects(other);

      if (intersects) {
        // Collision at tMid, search earlier
        tHigh = tMid;
        bestT = tMid;
      } else {
        // No collision at tMid, search later
        tLow = tMid;
      }

      // If range is small enough, we found it
      if (tHigh - tLow < epsilon) {
        break;
      }
    }

    // Restore position
    this.x = startX;
    this.y = startY;

    // Calculate collision normal at impact point
    const impactX = startX + dx * bestT;
    const impactY = startY + dy * bestT;

    // Move to impact point to get accurate normal
    this.x = impactX;
    this.y = impactY;
    const normal = this.getCollisionNormal(other);
    this.x = startX;
    this.y = startY;

    return { t: bestT, normal };
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
    // Calculate effective size for substep calculation
    let effectiveSize = 10; // Default
    if (this.radius !== undefined) {
      effectiveSize = this.radius * 2; // Use diameter for circles
    } else if (this.width > 0 && this.height > 0) {
      effectiveSize = Math.min(this.width, this.height);
    }

    // Use a quarter of the effective size as max step distance for better safety
    // This ensures fast objects take enough substeps to not tunnel through walls
    const maxStepDistance = effectiveSize * 0.25;
    const wouldMove = speed * deltaTime;
    const substeps = Math.max(1, Math.min(Math.ceil(wouldMove / maxStepDistance), 50)); // At least 1, cap at 50 substeps
    const subDelta = deltaTime / substeps;

    for (let i = 0; i < substeps; i++) {
      // Apply accumulated forces (F = ma, so a = F/m)
      if ((this.forceX !== 0 || this.forceY !== 0) && this.vx !== undefined && this.vy !== undefined) {
        const mass = this.mass ?? 1;
        const accelerationX = this.forceX / mass;
        const accelerationY = this.forceY / mass;
        this.vx += accelerationX * subDelta;
        this.vy += accelerationY * subDelta;
      }

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

      // Constrain velocity against static collision surfaces to prevent tunneling
      // Only constrain when moving significantly into the surface (not for gentle rolling)
      if (this.collisionNormals.size > 0 && this.vx !== undefined && this.vy !== undefined) {
        for (const [entity, normal] of this.collisionNormals.entries()) {
          if (entity.static) {
            // Calculate velocity component along the collision normal (into the surface)
            const velocityIntoSurface = dot(this.vx, this.vy, normal.x, normal.y);

            // Only constrain if pushing hard into surface (> 50 px/s)
            // This allows gentle rolling/sliding without jittery corrections
            if (velocityIntoSurface < -50) {
              // Project out the velocity component that's pushing into the surface
              this.vx -= velocityIntoSurface * normal.x;
              this.vy -= velocityIntoSurface * normal.y;
            }
          }
        }
      }

      // Apply velocity to position with continuous collision detection (CCD)
      const vx = this.vx ?? 0;
      const vy = this.vy ?? 0;
      const dx = vx * subDelta;
      const dy = vy * subDelta;

      // For fast-moving circles, use swept collision detection
      if (this.radius !== undefined && this.scene && speed > effectiveSize) {
        // Get all static collidable entities
        const staticEntities = this.scene.getEntities().filter(e =>
          e !== this && e.static && e.checkCollisions && e.active
        );

        // Find earliest collision
        let earliestHit: { t: number; normal: { x: number; y: number }; entity: Entity } | null = null;
        for (const other of staticEntities) {
          const hit = this.sweepTest(dx, dy, other);
          if (hit && (earliestHit === null || hit.t < earliestHit.t)) {
            earliestHit = { ...hit, entity: other };
          }
        }

        // If we found a collision, move to collision point and bounce
        if (earliestHit) {
          // Move to point of contact (slightly before to avoid embedding)
          const safeT = Math.max(0, earliestHit.t - 0.001);
          this.x += dx * safeT;
          this.y += dy * safeT;

          // Bounce velocity along the hit normal
          const restitution = this.bounciness ?? 0.8;
          const velocityAlongNormal = vx * earliestHit.normal.x + vy * earliestHit.normal.y;
          if (velocityAlongNormal < 0) {
            this.vx = vx - (1 + restitution) * velocityAlongNormal * earliestHit.normal.x;
            this.vy = vy - (1 + restitution) * velocityAlongNormal * earliestHit.normal.y;

            // Stop micro-bounces (only at very low velocities)
            if (Math.abs(this.vx) < 10) this.vx = 0;
            if (Math.abs(this.vy) < 10) this.vy = 0;
          }

          // Mark as colliding for future substeps
          this.collidingWith.add(earliestHit.entity);
          this.collisionNormals.set(earliestHit.entity, earliestHit.normal);

          // Emit collision event
          this.emit('collisionenter', { other: earliestHit.entity, normal: earliestHit.normal });
        } else {
          // No collision, move normally
          this.x += dx;
          this.y += dy;
        }
      } else {
        // Normal movement without CCD (for slow objects or non-circles)
        this.x += dx;
        this.y += dy;
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
   * Apply a force to this entity (accumulated until next physics update)
   * Forces are converted to acceleration using F = ma (acceleration = force / mass)
   * @param fx Force in X direction
   * @param fy Force in Y direction
   */
  applyForce(fx: number, fy: number): void {
    // Static objects don't respond to forces
    if (this.static) return;
    this.forceX += fx;
    this.forceY += fy;
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
    // Save old position for collision detection (LittleJS style)
    this.oldX = this.x;
    this.oldY = this.y;

    // Static objects don't have physics
    // Integrate physics if velocity is set and object is not static
    if (!this.static && (this.vx !== undefined || this.vy !== undefined)) {
      this.integratePhysics(deltaTime);
    }

    // Clear forces after physics update (forces are per-frame)
    this.forceX = 0;
    this.forceY = 0;

    // Normalize rotation only if it's extremely far outside [-2π, 4π] range
    // This prevents unbounded accumulation while allowing small negative angles
    // which are commonly used for rotated objects (e.g., flippers at -22.5°)
    if (this.rotation < -Math.PI * 2 || this.rotation > Math.PI * 4) {
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
