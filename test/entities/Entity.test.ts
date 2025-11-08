import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Entity } from '../../src/entities/Entity';
import { Scene } from '../../src/core/Scene';

describe('Entity', () => {
  let entity: Entity;

  beforeEach(() => {
    entity = new Entity({
      x: 100,
      y: 100,
      width: 50,
      height: 50
    });
  });

  describe('Constructor & Initialization', () => {
    it('should initialize with default values', () => {
      const e = new Entity();
      expect(e.x).toBe(0);
      expect(e.y).toBe(0);
      expect(e.rotation).toBe(0);
      expect(e.scaleX).toBe(1);
      expect(e.scaleY).toBe(1);
      expect(e.alpha).toBe(1);
      expect(e.visible).toBe(true);
      expect(e.zIndex).toBe(0);
    });

    it('should initialize with provided options', () => {
      const e = new Entity({
        x: 200,
        y: 150,
        rotation: Math.PI / 4,
        scaleX: 2,
        scaleY: 0.5,
        alpha: 0.8,
        visible: false,
        zIndex: 10
      });

      expect(e.x).toBe(200);
      expect(e.y).toBe(150);
      expect(e.rotation).toBe(Math.PI / 4);
      expect(e.scaleX).toBe(2);
      expect(e.scaleY).toBe(0.5);
      expect(e.alpha).toBe(0.8);
      expect(e.visible).toBe(false);
      expect(e.zIndex).toBe(10);
    });

    it('should initialize anchor points', () => {
      const e = new Entity({
        anchorX: 0.25,
        anchorY: 0.75
      });

      expect(e.anchorX).toBe(0.25);
      expect(e.anchorY).toBe(0.75);
    });

    it('should default anchor to 0.5 (center)', () => {
      const e = new Entity();
      expect(e.anchorX).toBe(0.5);
      expect(e.anchorY).toBe(0.5);
    });
  });

  describe('Transform Properties', () => {
    it('should update x position', () => {
      entity.x = 200;
      expect(entity.x).toBe(200);
    });

    it('should update y position', () => {
      entity.y = 300;
      expect(entity.y).toBe(300);
    });

    it('should update rotation', () => {
      entity.rotation = Math.PI;
      expect(entity.rotation).toBe(Math.PI);
    });

    it('should update scale', () => {
      entity.scaleX = 2;
      entity.scaleY = 3;
      expect(entity.scaleX).toBe(2);
      expect(entity.scaleY).toBe(3);
    });

    it('should update alpha', () => {
      entity.alpha = 0.5;
      expect(entity.alpha).toBe(0.5);
    });

    it('should clamp alpha between 0 and 1', () => {
      const e1 = new Entity({ alpha: -0.5 });
      expect(e1.alpha).toBe(0); // Clamped to 0

      const e2 = new Entity({ alpha: 1.5 });
      expect(e2.alpha).toBe(1); // Clamped to 1

      const e3 = new Entity({ alpha: 0.5 });
      expect(e3.alpha).toBe(0.5); // Normal value
    });
  });

  describe('Visibility & Z-Index', () => {
    it('should toggle visibility', () => {
      expect(entity.visible).toBe(true);
      entity.visible = false;
      expect(entity.visible).toBe(false);
    });

    it('should update z-index', () => {
      entity.zIndex = 100;
      expect(entity.zIndex).toBe(100);
    });

    it('should support negative z-index', () => {
      entity.zIndex = -10;
      expect(entity.zIndex).toBe(-10);
    });
  });

  describe('Tags', () => {
    it('should add a tag', () => {
      entity.addTag('player');
      expect(entity.hasTag('player')).toBe(true);
    });

    it('should add multiple tags', () => {
      entity.addTag('player');
      entity.addTag('friendly');
      expect(entity.hasTag('player')).toBe(true);
      expect(entity.hasTag('friendly')).toBe(true);
    });

    it('should not duplicate tags', () => {
      entity.addTag('player');
      entity.addTag('player');
      // Should only have one instance
      expect(entity.hasTag('player')).toBe(true);
    });

    it('should remove a tag', () => {
      entity.addTag('player');
      entity.removeTag('player');
      expect(entity.hasTag('player')).toBe(false);
    });

    it('should return false for non-existent tag', () => {
      expect(entity.hasTag('nonexistent')).toBe(false);
    });

    it('should handle removing non-existent tag gracefully', () => {
      expect(() => entity.removeTag('nonexistent')).not.toThrow();
    });
  });

  describe('Hierarchy', () => {
    it('should add a child entity', () => {
      const child = new Entity({ x: 50, y: 50 });
      entity.addChild(child);

      expect(child.parent).toBe(entity);
      expect(entity.children).toContain(child);
    });

    it('should add multiple children', () => {
      const child1 = new Entity();
      const child2 = new Entity();

      entity.addChild(child1);
      entity.addChild(child2);

      expect(entity.children).toHaveLength(2);
      expect(entity.children).toContain(child1);
      expect(entity.children).toContain(child2);
    });

    it('should remove a child entity', () => {
      const child = new Entity();
      entity.addChild(child);
      entity.removeChild(child);

      expect(child.parent).toBeNull();
      expect(entity.children).not.toContain(child);
    });

    it('should remove child from previous parent when reparented', () => {
      const parent1 = new Entity();
      const parent2 = new Entity();
      const child = new Entity();

      parent1.addChild(child);
      parent2.addChild(child);

      expect(parent1.children).not.toContain(child);
      expect(parent2.children).toContain(child);
      expect(child.parent).toBe(parent2);
    });

    it('should apply parent transform to child position', () => {
      const parent = new Entity({ x: 100, y: 100 });
      const child = new Entity({ x: 50, y: 50 });

      parent.addChild(child);

      const worldPos = child.getWorldPosition();
      expect(worldPos.x).toBe(150);
      expect(worldPos.y).toBe(150);
    });

    it('should calculate world position with nested hierarchy', () => {
      const grandparent = new Entity({ x: 100, y: 100 });
      const parent = new Entity({ x: 50, y: 50 });
      const child = new Entity({ x: 25, y: 25 });

      grandparent.addChild(parent);
      parent.addChild(child);

      const worldPos = child.getWorldPosition();
      expect(worldPos.x).toBe(175);
      expect(worldPos.y).toBe(175);
    });
  });

  describe('Bounds & Geometry', () => {
    it('should calculate bounds for rectangle', () => {
      const rect = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        anchorX: 0.5,
        anchorY: 0.5
      });

      const bounds = rect.getBounds();
      expect(bounds.left).toBe(75);
      expect(bounds.right).toBe(125);
      expect(bounds.top).toBe(75);
      expect(bounds.bottom).toBe(125);
    });

    it('should calculate bounds with different anchor', () => {
      const rect = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        anchorX: 0,
        anchorY: 0
      });

      const bounds = rect.getBounds();
      expect(bounds.left).toBe(100);
      expect(bounds.right).toBe(150);
      expect(bounds.top).toBe(100);
      expect(bounds.bottom).toBe(150);
    });

    it('should calculate bounds for circle', () => {
      const circle = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        radius: 25
      });

      const bounds = circle.getBounds();
      expect(bounds.left).toBe(75);
      expect(bounds.right).toBe(125);
      expect(bounds.top).toBe(75);
      expect(bounds.bottom).toBe(125);
    });

    it('should check if point is inside rectangle', () => {
      const rect = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50
      });

      expect(rect.containsPoint(100, 100)).toBe(true);
      expect(rect.containsPoint(75, 75)).toBe(true);
      expect(rect.containsPoint(125, 125)).toBe(true);
      expect(rect.containsPoint(50, 50)).toBe(false);
      expect(rect.containsPoint(150, 150)).toBe(false);
    });

    it('should check if point is inside circle', () => {
      const circle = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        radius: 25
      });

      expect(circle.containsPoint(100, 100)).toBe(true);
      expect(circle.containsPoint(115, 100)).toBe(true); // Within radius
      expect(circle.containsPoint(150, 150)).toBe(false);
    });
  });

  describe('Distance Calculations', () => {
    it('should calculate distance between two entities', () => {
      const entity1 = new Entity({ x: 0, y: 0 });
      const entity2 = new Entity({ x: 30, y: 40 });

      const distance = entity1.distanceTo(entity2);
      expect(distance).toBe(50); // 3-4-5 triangle
    });

    it('should return 0 for same position', () => {
      const entity1 = new Entity({ x: 100, y: 100 });
      const entity2 = new Entity({ x: 100, y: 100 });

      expect(entity1.distanceTo(entity2)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const entity1 = new Entity({ x: -10, y: -10 });
      const entity2 = new Entity({ x: 10, y: 10 });

      const distance = entity1.distanceTo(entity2);
      expect(distance).toBeCloseTo(28.28, 1); // sqrt(20^2 + 20^2)
    });
  });

  describe('Collision Detection', () => {
    describe('Rectangle vs Rectangle', () => {
      it('should detect collision between overlapping rectangles', () => {
        const rect1 = new Entity({ x: 100, y: 100, width: 50, height: 50 });
        const rect2 = new Entity({ x: 120, y: 120, width: 50, height: 50 });

        expect(rect1.intersects(rect2)).toBe(true);
        expect(rect2.intersects(rect1)).toBe(true);
      });

      it('should not detect collision for separated rectangles', () => {
        const rect1 = new Entity({ x: 100, y: 100, width: 50, height: 50 });
        const rect2 = new Entity({ x: 200, y: 200, width: 50, height: 50 });

        expect(rect1.intersects(rect2)).toBe(false);
      });

      it('should detect edge collision', () => {
        const rect1 = new Entity({ x: 100, y: 100, width: 50, height: 50 });
        const rect2 = new Entity({ x: 150, y: 100, width: 50, height: 50 });

        expect(rect1.intersects(rect2)).toBe(true);
      });
    });

    describe('Circle vs Circle', () => {
      it('should detect collision between overlapping circles', () => {
        const circle1 = new Entity({ x: 100, y: 100, radius: 25 });
        const circle2 = new Entity({ x: 130, y: 100, radius: 25 });

        expect(circle1.intersects(circle2)).toBe(true);
      });

      it('should not detect collision for separated circles', () => {
        const circle1 = new Entity({ x: 100, y: 100, radius: 25 });
        const circle2 = new Entity({ x: 200, y: 200, radius: 25 });

        expect(circle1.intersects(circle2)).toBe(false);
      });

      it('should detect overlapping circles with small margin', () => {
        const circle1 = new Entity({ x: 100, y: 100, radius: 25 });
        const circle2 = new Entity({ x: 149, y: 100, radius: 25 }); // Slightly overlapping

        expect(circle1.intersects(circle2)).toBe(true);
      });
    });

    describe('Circle vs Rectangle', () => {
      it('should detect collision between circle and rectangle', () => {
        const circle = new Entity({ x: 100, y: 100, radius: 25 });
        const rect = new Entity({ x: 110, y: 110, width: 50, height: 50 });

        expect(circle.intersects(rect)).toBe(true);
        expect(rect.intersects(circle)).toBe(true);
      });

      it('should not detect collision for separated shapes', () => {
        const circle = new Entity({ x: 100, y: 100, radius: 25 });
        const rect = new Entity({ x: 200, y: 200, width: 50, height: 50 });

        expect(circle.intersects(rect)).toBe(false);
      });
    });

    describe('Parented Entity Collisions', () => {
      it('should detect collision using world coordinates for parented circles', () => {
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100 });
        const child = new Entity({ x: 50, y: 0, radius: 25 });
        parent.addChild(child);

        // Child's world position should be (150, 100)
        const childWorldPos = child.getWorldPosition();
        expect(childWorldPos.x).toBe(150);
        expect(childWorldPos.y).toBe(100);

        // Create another circle at the child's world position
        const other = new Entity({ x: 150, y: 100, radius: 25 });

        // Should collide because both circles are at (150, 100) with radius 25
        expect(child.intersects(other)).toBe(true);
      });

      it('should detect collision using world coordinates for parented rectangles', () => {
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100 });
        const child = new Entity({ x: 50, y: 0, width: 50, height: 50 });
        parent.addChild(child);

        // Child's world position should be (150, 100)
        const childWorldPos = child.getWorldPosition();
        expect(childWorldPos.x).toBe(150);
        expect(childWorldPos.y).toBe(100);

        // Create another rect overlapping the child's world position
        const other = new Entity({ x: 160, y: 110, width: 50, height: 50 });

        // Should collide because they overlap in world space
        expect(child.intersects(other)).toBe(true);
      });

      it('should calculate correct collision normal for parented circles', () => {
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100 });
        const child = new Entity({ x: 50, y: 0, radius: 25 });
        parent.addChild(child);

        // Child's world position: (150, 100)
        const other = new Entity({ x: 180, y: 100, radius: 25 });

        const normal = child.getCollisionNormal(other);

        // Normal should point from other to child (left direction)
        expect(normal.x).toBeCloseTo(-1, 1);
        expect(normal.y).toBeCloseTo(0, 1);
      });

      it('should separate parented entities correctly in world space', () => {
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100 });
        const child = new Entity({
          x: 50,
          y: 0,
          radius: 25,
          checkCollisions: true
        });
        parent.addChild(child);

        // Child's world position: (150, 100)
        // Create overlapping circle slightly offset to avoid degenerate normal
        const other = new Entity({
          x: 160,
          y: 100,
          radius: 25,
          checkCollisions: true
        });

        // Enable collision resolution
        child.resolveCollisions = true;
        other.static = true; // Make other static so child moves

        // Store initial local position
        const initialLocalX = child.x;

        // Check collision which should trigger separation
        child.checkCollision(other);

        // Child's local x should have changed to separate in world space
        // Child should be pushed to the left (negative direction)
        expect(child.x).toBeLessThan(initialLocalX);
      });

      it('should calculate correct collision normal for rect-rect with rotated parent', () => {
        // Create a parent rotated 90 degrees
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100, rotation: Math.PI / 2 });
        const child = new Entity({ x: 50, y: 0, width: 30, height: 30 });
        parent.addChild(child);

        // With 90° rotation, child at local (50, 0) becomes world (100, 150)
        const childWorldPos = child.getWorldPosition();
        expect(childWorldPos.x).toBeCloseTo(100, 1);
        expect(childWorldPos.y).toBeCloseTo(150, 1);

        // Create another rect to the right of the child in world space
        const other = new Entity({ x: 130, y: 150, width: 30, height: 30 });

        const normal = child.getCollisionNormal(other);

        // Normal should push child away from other (left: -1, 0) in world space
        // Child is to the left of other, so push left
        expect(normal.x).toBeCloseTo(-1, 1);
        expect(normal.y).toBeCloseTo(0, 1);
      });

      it('should separate rect-rect with rotated parent correctly', () => {
        // Parent rotated 90 degrees
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100, rotation: Math.PI / 2 });
        const child = new Entity({
          x: 50,
          y: 0,
          width: 30,
          height: 30,
          checkCollisions: true,
          resolveCollisions: true
        });
        parent.addChild(child);

        // Child world position: ~(100, 150)
        // Create overlapping rect
        const other = new Entity({
          x: 110,
          y: 150,
          width: 30,
          height: 30,
          checkCollisions: true,
          static: true
        });

        const initialLocalX = child.x;
        const initialLocalY = child.y;
        const initialWorldPos = child.getWorldPosition();

        // Trigger collision
        child.checkCollision(other);

        const newWorldPos = child.getWorldPosition();

        // Child should be pushed away in world space (negative X direction)
        // BUG: Currently applies world offset directly to local x/y, which is wrong for rotated parents
        expect(newWorldPos.x).toBeLessThan(initialWorldPos.x);
      });

      it('should calculate correct collision normal for rect-rect with scaled parent', () => {
        // Parent scaled 2x
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100, scaleX: 2, scaleY: 2 });
        const child = new Entity({ x: 25, y: 0, width: 20, height: 20 });
        parent.addChild(child);

        // With 2x scale, child at local (25, 0) becomes world (150, 100)
        const childWorldPos = child.getWorldPosition();
        expect(childWorldPos.x).toBeCloseTo(150, 1);
        expect(childWorldPos.y).toBeCloseTo(100, 1);

        // Create another rect to the right in world space
        const other = new Entity({ x: 180, y: 100, width: 20, height: 20 });

        const normal = child.getCollisionNormal(other);

        // Normal should push child away from other (left) in world space
        // Child is to the left of other, so push left
        expect(normal.x).toBeCloseTo(-1, 1);
        expect(normal.y).toBeCloseTo(0, 1);
      });

      it('should separate entities with scaled parent correctly', () => {
        // Parent scaled 2x
        const parent = new Entity({ x: 100, y: 100, width: 100, height: 100, scaleX: 2, scaleY: 2 });
        const child = new Entity({
          x: 25,
          y: 0,
          width: 20,
          height: 20,
          checkCollisions: true,
          resolveCollisions: true
        });
        parent.addChild(child);

        // Child world position: ~(150, 100)
        const other = new Entity({
          x: 160,
          y: 100,
          width: 20,
          height: 20,
          checkCollisions: true,
          static: true
        });

        const initialWorldPos = child.getWorldPosition();

        // Trigger collision
        child.checkCollision(other);

        const newWorldPos = child.getWorldPosition();

        // Child should be pushed away in world space
        // BUG: Direct application of world offset to local coords is wrong with scale
        expect(newWorldPos.x).toBeLessThan(initialWorldPos.x);
      });

      it('should handle separation with both rotated and scaled parent', () => {
        // Parent rotated 45° and scaled 1.5x
        const parent = new Entity({
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          rotation: Math.PI / 4,
          scaleX: 1.5,
          scaleY: 1.5
        });
        const child = new Entity({
          x: 30,
          y: 0,
          width: 20,
          height: 20,
          checkCollisions: true,
          resolveCollisions: true
        });
        parent.addChild(child);

        const childWorldPos = child.getWorldPosition();

        // Create overlapping entity in world space
        const other = new Entity({
          x: childWorldPos.x + 15,
          y: childWorldPos.y,
          width: 20,
          height: 20,
          checkCollisions: true,
          static: true
        });

        const initialWorldPos = child.getWorldPosition();

        // Trigger collision
        child.checkCollision(other);

        const newWorldPos = child.getWorldPosition();

        // Child should be pushed away in world space
        // BUG: Complex transforms completely break separation
        const worldDeltaX = newWorldPos.x - initialWorldPos.x;
        const worldDeltaY = newWorldPos.y - initialWorldPos.y;
        const moveDistance = Math.sqrt(worldDeltaX * worldDeltaX + worldDeltaY * worldDeltaY);

        // Should have actually moved to separate
        expect(moveDistance).toBeGreaterThan(0);
      });
    });
  });

  describe('Physics Properties', () => {
    it('should initialize physics properties', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        vx: 50,
        vy: 100,
        gravity: 980,
        friction: 0.98
      });

      expect(e.vx).toBe(50);
      expect(e.vy).toBe(100);
      expect(e.gravity).toBe(980);
      expect(e.friction).toBe(0.98);
    });

    it('should default physics properties to undefined', () => {
      const e = new Entity();
      expect(e.vx).toBeUndefined();
      expect(e.vy).toBeUndefined();
      expect(e.gravity).toBeUndefined();
      expect(e.friction).toBeUndefined();
    });

    it('should update velocity', () => {
      entity.vx = 100;
      entity.vy = 200;

      expect(entity.vx).toBe(100);
      expect(entity.vy).toBe(200);
    });

    it('should apply gravity to velocity', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        vy: 0,
        gravity: 980
      });

      // Simulate update with delta time of 0.1 seconds
      e.update(0.1);

      expect(e.vy).toBeCloseTo(98, 1); // vy should increase by gravity * deltaTime
    });

    it('should apply friction to velocity', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        vx: 100,
        vy: 100,
        friction: 0.9
      });

      e.update(1);

      expect(e.vx).toBe(90); // 100 * 0.9
      expect(e.vy).toBe(90);
    });

    it('should update position based on velocity', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        vx: 50,
        vy: 30
      });

      e.update(1); // 1 second

      expect(e.x).toBeCloseTo(150, 10); // 100 + 50
      expect(e.y).toBeCloseTo(130, 10); // 100 + 30
    });

    it('should update position with fractional delta time', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        vx: 60,
        vy: 0
      });

      e.update(0.5); // 0.5 seconds

      expect(e.x).toBe(130); // 100 + 60 * 0.5
    });

    it('should initialize bounciness', () => {
      const e = new Entity({
        bounciness: 0.8
      });

      expect(e.bounciness).toBe(0.8);
    });

    it('should default bounciness to undefined', () => {
      const e = new Entity();
      expect(e.bounciness).toBeUndefined();
    });

    it('should bounce with correct normal and restitution', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        vx: 100,
        vy: 200
      });

      // Bounce off floor (normal pointing up: 0, 1)
      // Formula: v' = v - 2(v·n)n * restitution
      // dot = 100*0 + 200*1 = 200
      // vx' = 100 - 2*200*0*0.8 = 100
      // vy' = 200 - 2*200*1*0.8 = 200 - 320 = -120
      e.bounce(0, 1, 0.8);

      expect(e.vx).toBe(100); // horizontal velocity unchanged
      expect(e.vy).toBe(-120); // vertical velocity reflected and reduced
    });

    it('should bounce off vertical wall', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        vx: 100,
        vy: 50
      });

      // Bounce off right wall (normal pointing left: -1, 0)
      // Formula: v' = v - 2(v·n)n * restitution
      // dot = 100*(-1) + 50*0 = -100
      // vx' = 100 - 2*(-100)*(-1)*0.9 = 100 - 180 = -80
      // vy' = 50 - 2*(-100)*0*0.9 = 50
      e.bounce(-1, 0, 0.9);

      expect(e.vx).toBe(-80); // horizontal velocity reflected and reduced
      expect(e.vy).toBe(50); // vertical velocity unchanged
    });
  });

  describe('Static Property', () => {
    it('should default to non-static', () => {
      const e = new Entity();
      expect(e.static).toBeFalsy();
    });

    it('should initialize as static', () => {
      const e = new Entity({ static: true });
      expect(e.static).toBe(true);
    });

    it('should update static property', () => {
      entity.static = true;
      expect(entity.static).toBe(true);
    });
  });

  describe('Collision Events', () => {
    let scene: Scene;
    let entity1: Entity;
    let entity2: Entity;

    beforeEach(() => {
      scene = new Scene();
      entity1 = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });
      entity2 = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      scene.add(entity1);
      scene.add(entity2);
    });

    it('should emit collisionenter event when collision starts', () => {
      const callback = vi.fn();
      entity1.on('collisionenter', callback);

      // Trigger collision check
      entity1.checkCollision(entity2);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ other: entity2 })
      );
    });

    it('should emit collide event while colliding', () => {
      const callback = vi.fn();
      entity1.on('collide', callback);

      // First collision
      entity1.checkCollision(entity2);
      // Still colliding
      entity1.checkCollision(entity2);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should emit collisionexit when collision ends', () => {
      const callback = vi.fn();
      entity1.on('collisionexit', callback);

      // Start collision
      entity1.checkCollision(entity2);
      // Move entity2 away
      entity2.x = 300;
      // Check again - should detect exit
      entity1.checkCollision(entity2);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should filter collisions by tags', () => {
      const callback = vi.fn();
      entity1.collisionTags = ['enemy'];
      entity1.on('collisionenter', callback);

      entity2.addTag('friend');
      entity1.checkCollision(entity2);

      expect(callback).not.toHaveBeenCalled();

      entity2.addTag('enemy');
      entity1.checkCollision(entity2);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Interactive Property', () => {
    it('should default to non-interactive', () => {
      const e = new Entity();
      expect(e.interactive).toBeFalsy();
    });

    it('should initialize as interactive', () => {
      const e = new Entity({ interactive: true });
      expect(e.interactive).toBe(true);
    });

    it('should update interactive property', () => {
      entity.interactive = true;
      expect(entity.interactive).toBe(true);
    });
  });

  describe('Lifecycle Events', () => {
    it('should emit added event when added to scene', () => {
      const callback = vi.fn();
      const scene = new Scene();
      const e = new Entity();

      e.on('added', callback);
      scene.add(e);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should emit removed event when removed from scene', () => {
      const callback = vi.fn();
      const scene = new Scene();
      const e = new Entity();

      scene.add(e);
      e.on('removed', callback);
      scene.remove(e);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tweening', () => {
    it('should create a tween for entity properties', () => {
      const tween = entity.tween(
        { x: 200, y: 200 },
        { duration: 1000 }
      );

      expect(tween).toBeDefined();
    });

    it('should return Tween object from tween method', () => {
      const e = new Entity({ x: 100, y: 100 });

      const tween = e.tween(
        { x: 200 },
        { duration: 100 }
      );

      // Tween returns a Tween object
      expect(tween).toBeDefined();
      expect(typeof tween).toBe('object');
      expect(e.x).toBe(100); // Not updated until tween manager runs
    });
  });

  describe('Rotation with Anchor', () => {
    it('should rotate around center anchor', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        anchorX: 0.5,
        anchorY: 0.5,
        rotation: Math.PI / 2 // 90 degrees
      });

      // Center should remain at 100, 100
      expect(e.x).toBe(100);
      expect(e.y).toBe(100);
    });
  });

  describe('Scale', () => {
    it('should return logical bounds without scale applied', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        scaleX: 2,
        scaleY: 2
      });

      const bounds = e.getBounds();
      const width = bounds.right - bounds.left;
      const height = bounds.bottom - bounds.top;

      // getBounds returns logical bounds (without scale transformation)
      expect(width).toBe(50); // Original width, not scaled
      expect(height).toBe(50); // Original height, not scaled
    });

    it('should support negative scale for flipping', () => {
      const e = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        scaleX: -1
      });

      expect(e.scaleX).toBe(-1);
    });
  });

  describe('getCollisions()', () => {
    it('should return list of currently colliding entities', () => {
      const e1 = new Entity({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });
      const e2 = new Entity({ x: 110, y: 110, width: 50, height: 50, checkCollisions: true });

      // Check collision to populate the list
      e1.checkCollision(e2);

      const collisions = e1.getCollisions();
      expect(collisions).toContain(e2);
    });

    it('should return empty array when not colliding', () => {
      const e = new Entity();
      expect(e.getCollisions()).toEqual([]);
    });
  });
});
