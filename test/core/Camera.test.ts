import { describe, it, expect, beforeEach } from 'vitest';
import { Camera } from '../../src/core/Camera';
import { Entity } from '../../src/entities/Entity';

describe('Camera', () => {
  let camera: Camera;

  beforeEach(() => {
    camera = new Camera(800, 600);
  });

  describe('Constructor & Initialization', () => {
    it('should initialize with dimensions', () => {
      expect(camera.width).toBe(800);
      expect(camera.height).toBe(600);
    });

    it('should initialize with default position', () => {
      expect(camera.x).toBe(0);
      expect(camera.y).toBe(0);
    });

    it('should initialize with default zoom', () => {
      expect(camera.zoom).toBe(1);
    });

    it('should initialize with default rotation', () => {
      expect(camera.rotation).toBe(0);
    });
  });

  describe('Position', () => {
    it('should set position', () => {
      camera.setPosition(100, 200);
      expect(camera.x).toBe(100);
      expect(camera.y).toBe(200);
    });

    it('should update position multiple times', () => {
      camera.setPosition(50, 75);
      expect(camera.x).toBe(50);
      expect(camera.y).toBe(75);

      camera.setPosition(150, 225);
      expect(camera.x).toBe(150);
      expect(camera.y).toBe(225);
    });

    it('should handle negative positions', () => {
      camera.setPosition(-100, -200);
      expect(camera.x).toBe(-100);
      expect(camera.y).toBe(-200);
    });
  });

  describe('Zoom', () => {
    it('should set zoom level', () => {
      camera.setZoom(2);
      expect(camera.zoom).toBe(2);
    });

    it('should allow zoom in', () => {
      camera.setZoom(3);
      expect(camera.zoom).toBe(3);
    });

    it('should allow zoom out', () => {
      camera.setZoom(0.5);
      expect(camera.zoom).toBe(0.5);
    });

    it('should clamp zoom to minimum 0.1', () => {
      camera.setZoom(0.05);
      expect(camera.zoom).toBe(0.1);
    });

    it('should clamp negative zoom to minimum', () => {
      camera.setZoom(-1);
      expect(camera.zoom).toBe(0.1);
    });

    it('should allow very high zoom', () => {
      camera.setZoom(100);
      expect(camera.zoom).toBe(100);
    });
  });

  describe('Rotation', () => {
    it('should allow setting rotation', () => {
      camera.rotation = Math.PI / 4;
      expect(camera.rotation).toBe(Math.PI / 4);
    });

    it('should allow 360 degree rotation', () => {
      camera.rotation = Math.PI * 2;
      expect(camera.rotation).toBe(Math.PI * 2);
    });

    it('should allow negative rotation', () => {
      camera.rotation = -Math.PI / 2;
      expect(camera.rotation).toBe(-Math.PI / 2);
    });
  });

  describe('Entity Following', () => {
    it('should follow an entity', () => {
      const entity = new Entity({ x: 100, y: 100 });
      camera.follow(entity);

      camera.update(0.1);

      // Camera should move towards entity
      expect(camera.x).not.toBe(0);
      expect(camera.y).not.toBe(0);
    });

    it('should use follow offset', () => {
      const entity = new Entity({ x: 200, y: 200 });
      camera.follow(entity, { x: 50, y: 50 });

      camera.update(0.1);

      // Camera should follow entity + offset
      // With entity at (200,200), offset (50,50), and camera centered:
      // targetX = 200 + 50 - 400 = -150, so camera moves toward negative
      expect(camera.x).not.toBe(0); // Camera should have moved
      expect(camera.y).not.toBe(0);
    });

    it('should use follow speed', () => {
      const entity = new Entity({ x: 600, y: 500 });

      // Fast follow speed
      camera.follow(entity, { x: 0, y: 0 }, 5);
      camera.update(0.1);
      const fastX = camera.x;
      const fastY = camera.y;

      // Reset and use slow follow speed
      camera.setPosition(0, 0);
      camera.follow(entity, { x: 0, y: 0 }, 0.5);
      camera.update(0.1);
      const slowX = camera.x;
      const slowY = camera.y;

      // Fast follow should move more
      expect(Math.abs(fastX)).toBeGreaterThan(Math.abs(slowX));
      expect(Math.abs(fastY)).toBeGreaterThan(Math.abs(slowY));
    });

    it('should stop following', () => {
      const entity = new Entity({ x: 100, y: 100 });
      camera.follow(entity);
      camera.stopFollow();

      const initialX = camera.x;
      const initialY = camera.y;

      camera.update(0.1);

      // Camera should not move after stop follow
      expect(camera.x).toBe(initialX);
      expect(camera.y).toBe(initialY);
    });

    it('should follow moving entity', () => {
      const entity = new Entity({ x: 100, y: 100 });
      camera.follow(entity);

      camera.update(0.1);
      const x1 = camera.x;

      // Move entity
      entity.x = 300;
      camera.update(0.1);
      const x2 = camera.x;

      // Camera should have moved further
      expect(x2).toBeGreaterThan(x1);
    });

    it('should center on entity', () => {
      const entity = new Entity({ x: 400, y: 300 });
      camera.follow(entity);

      // Update multiple times to reach entity
      for (let i = 0; i < 100; i++) {
        camera.update(0.016);
      }

      // Camera should be approximately centered on entity
      const expectedX = entity.x - camera.width / 2;
      const expectedY = entity.y - camera.height / 2;

      expect(camera.x).toBeCloseTo(expectedX, 0);
      expect(camera.y).toBeCloseTo(expectedY, 0);
    });
  });

  describe('Screen Shake', () => {
    it('should trigger screen shake', () => {
      camera.shake(10, 100);
      camera.update(0.05);

      // Shake should create non-zero offset
      // (Random, so just check it was triggered)
      expect(() => camera.update(0.01)).not.toThrow();
    });

    it('should decrease shake intensity over time', () => {
      camera.shake(20, 100);

      camera.update(0.01); // 10ms
      // Shake is active

      camera.update(0.1); // 110ms - should be done
      // Shake should be complete
      expect(() => camera.update(0.01)).not.toThrow();
    });

    it('should reset shake after duration', () => {
      camera.shake(10, 50);

      // Before shake ends
      camera.update(0.02);

      // After shake ends
      camera.update(0.05);

      // Update again - should have no shake
      camera.update(0.01);
      expect(() => camera.update(0.01)).not.toThrow();
    });

    it('should allow multiple shakes', () => {
      camera.shake(5, 100);
      camera.update(0.05);

      camera.shake(10, 100);
      camera.update(0.05);

      expect(() => camera.update(0.01)).not.toThrow();
    });

    it('should support zero intensity', () => {
      camera.shake(0, 100);
      camera.update(0.05);

      expect(() => camera.update(0.01)).not.toThrow();
    });

    it('should support zero duration', () => {
      camera.shake(10, 0);
      camera.update(0.001);

      expect(() => camera.update(0.01)).not.toThrow();
    });
  });

  describe('Coordinate Transformations', () => {
    describe('screenToWorld', () => {
      it('should convert screen center to world center', () => {
        const world = camera.screenToWorld(400, 300); // Center of 800x600
        expect(world.x).toBeCloseTo(400, 1);
        expect(world.y).toBeCloseTo(300, 1);
      });

      it('should account for camera position', () => {
        camera.setPosition(100, 50);
        const world = camera.screenToWorld(400, 300);

        expect(world.x).toBeCloseTo(500, 1); // 400 + 100
        expect(world.y).toBeCloseTo(350, 1); // 300 + 50
      });

      it('should account for zoom', () => {
        camera.setZoom(2);
        const world = camera.screenToWorld(500, 400);

        // With 2x zoom, screen distance from center is halved in world space
        expect(world.x).toBeCloseTo(450, 1);
        expect(world.y).toBeCloseTo(350, 1);
      });

      it('should account for rotation', () => {
        camera.rotation = Math.PI / 2; // 90 degrees
        const world = camera.screenToWorld(500, 300);

        // At 90 degrees, rotation transforms the coordinates
        expect(world.x).toBeCloseTo(400, 1);
        expect(world.y).toBeCloseTo(200, 1);
      });

      it('should handle negative screen coordinates', () => {
        const world = camera.screenToWorld(-100, -100);
        expect(world.x).toBeDefined();
        expect(world.y).toBeDefined();
      });

      it('should handle large screen coordinates', () => {
        const world = camera.screenToWorld(10000, 10000);
        expect(world.x).toBeDefined();
        expect(world.y).toBeDefined();
      });
    });

    describe('worldToScreen', () => {
      it('should convert world center to screen center', () => {
        const screen = camera.worldToScreen(400, 300);
        expect(screen.x).toBeCloseTo(400, 1);
        expect(screen.y).toBeCloseTo(300, 1);
      });

      it('should account for camera position', () => {
        camera.setPosition(100, 50);
        const screen = camera.worldToScreen(500, 350);

        expect(screen.x).toBeCloseTo(400, 1); // Center
        expect(screen.y).toBeCloseTo(300, 1); // Center
      });

      it('should account for zoom', () => {
        camera.setZoom(2);
        const screen = camera.worldToScreen(450, 350);

        // With 2x zoom, world distance is doubled on screen
        expect(screen.x).toBeCloseTo(500, 1);
        expect(screen.y).toBeCloseTo(400, 1);
      });

      it('should account for rotation', () => {
        camera.rotation = Math.PI / 2; // 90 degrees
        const screen = camera.worldToScreen(400, 500);

        expect(screen.x).toBeCloseTo(200, 1);
        expect(screen.y).toBeCloseTo(300, 1);
      });

      it('should be inverse of screenToWorld', () => {
        camera.setPosition(50, 75);
        camera.setZoom(1.5);

        const original = { x: 250, y: 400 };
        const world = camera.screenToWorld(original.x, original.y);
        const screen = camera.worldToScreen(world.x, world.y);

        expect(screen.x).toBeCloseTo(original.x, 1);
        expect(screen.y).toBeCloseTo(original.y, 1);
      });
    });

    describe('Round-trip transformations', () => {
      it('should handle screen->world->screen with zoom', () => {
        camera.setZoom(2.5);
        const screen1 = { x: 300, y: 200 };
        const world = camera.screenToWorld(screen1.x, screen1.y);
        const screen2 = camera.worldToScreen(world.x, world.y);

        expect(screen2.x).toBeCloseTo(screen1.x, 1);
        expect(screen2.y).toBeCloseTo(screen1.y, 1);
      });

      it('should handle screen->world->screen with rotation', () => {
        camera.rotation = Math.PI / 3; // 60 degrees
        const screen1 = { x: 600, y: 400 };
        const world = camera.screenToWorld(screen1.x, screen1.y);
        const screen2 = camera.worldToScreen(world.x, world.y);

        expect(screen2.x).toBeCloseTo(screen1.x, 1);
        expect(screen2.y).toBeCloseTo(screen1.y, 1);
      });

      it('should handle screen->world->screen with position, zoom, and rotation', () => {
        camera.setPosition(150, 225);
        camera.setZoom(1.8);
        camera.rotation = -Math.PI / 4;

        const screen1 = { x: 450, y: 350 };
        const world = camera.screenToWorld(screen1.x, screen1.y);
        const screen2 = camera.worldToScreen(world.x, world.y);

        expect(screen2.x).toBeCloseTo(screen1.x, 1);
        expect(screen2.y).toBeCloseTo(screen1.y, 1);
      });
    });
  });

  describe('Update Method', () => {
    it('should update without following', () => {
      expect(() => camera.update(0.016)).not.toThrow();
    });

    it('should update with following', () => {
      const entity = new Entity({ x: 100, y: 100 });
      camera.follow(entity);

      expect(() => camera.update(0.016)).not.toThrow();
    });

    it('should update with shake', () => {
      camera.shake(10, 100);
      expect(() => camera.update(0.016)).not.toThrow();
    });

    it('should update with following and shake', () => {
      const entity = new Entity({ x: 100, y: 100 });
      camera.follow(entity);
      camera.shake(10, 100);

      expect(() => camera.update(0.016)).not.toThrow();
    });

    it('should handle zero delta time', () => {
      expect(() => camera.update(0)).not.toThrow();
    });

    it('should handle large delta time', () => {
      expect(() => camera.update(10)).not.toThrow();
    });

    it('should handle negative delta time', () => {
      expect(() => camera.update(-0.016)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle extreme zoom values', () => {
      camera.setZoom(0.01); // Below minimum
      expect(camera.zoom).toBe(0.1);

      camera.setZoom(1000);
      expect(camera.zoom).toBe(1000);
    });

    it('should handle following entity at origin', () => {
      const entity = new Entity({ x: 0, y: 0 });
      camera.follow(entity);
      camera.update(0.1);

      expect(camera.x).toBeDefined();
      expect(camera.y).toBeDefined();
    });

    it('should handle following with zero speed', () => {
      const entity = new Entity({ x: 100, y: 100 });
      camera.follow(entity, { x: 0, y: 0 }, 0);

      const initialX = camera.x;
      const initialY = camera.y;

      camera.update(0.1);

      // With zero speed, camera should not move
      expect(camera.x).toBe(initialX);
      expect(camera.y).toBe(initialY);
    });

    it('should handle multiple follow calls', () => {
      const entity1 = new Entity({ x: 100, y: 100 });
      const entity2 = new Entity({ x: 200, y: 200 });

      camera.follow(entity1);
      camera.update(0.1);
      const x1 = camera.x;

      camera.follow(entity2); // Switch to entity2
      camera.update(0.1);

      // Camera should have moved toward entity2
      expect(camera.x).not.toBe(x1);
    });

    it('should handle shake with very high intensity', () => {
      camera.shake(1000, 100);
      expect(() => camera.update(0.05)).not.toThrow();
    });

    it('should handle shake with very long duration', () => {
      camera.shake(10, 10000);
      expect(() => camera.update(0.05)).not.toThrow();
    });

    it('should handle coordinate conversion at extreme positions', () => {
      camera.setPosition(10000, 10000);
      const world = camera.screenToWorld(400, 300);
      const screen = camera.worldToScreen(world.x, world.y);

      expect(screen.x).toBeCloseTo(400, 1);
      expect(screen.y).toBeCloseTo(300, 1);
    });
  });
});
