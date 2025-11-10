import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Scene } from '../../src/core/Scene';
import { Entity } from '../../src/entities/Entity';
import { Sprite } from '../../src/entities/Sprite';

// Helper to create a mock canvas context
function createMockCanvasContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
  } as any as CanvasRenderingContext2D;
}

describe('Scene', () => {
  let scene: Scene;

  beforeEach(() => {
    scene = new Scene();
  });

  describe('Constructor & Initialization', () => {
    it('should initialize with default values', () => {
      const s = new Scene();
      expect(s).toBeDefined();
      expect(s.getEntities()).toEqual([]);
    });

    it('should initialize with options', () => {
      const s = new Scene({
        backgroundColor: '#000000'
      });
      expect(s).toBeDefined();
    });
  });

  describe('Entity Management', () => {
    it('should add entity to scene', () => {
      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);

      expect(scene.getEntities()).toContain(entity);
    });

    it('should add multiple entities', () => {
      const entity1 = new Entity({ x: 100, y: 100 });
      const entity2 = new Entity({ x: 200, y: 200 });
      const entity3 = new Entity({ x: 300, y: 300 });

      scene.add(entity1);
      scene.add(entity2);
      scene.add(entity3);

      expect(scene.getEntities()).toHaveLength(3);
      expect(scene.getEntities()).toContain(entity1);
      expect(scene.getEntities()).toContain(entity2);
      expect(scene.getEntities()).toContain(entity3);
    });

    it('should not add duplicate entities', () => {
      const entity = new Entity({ x: 100, y: 100 });

      scene.add(entity);
      scene.add(entity); // Try to add again

      expect(scene.getEntities()).toHaveLength(1);
    });

    it('should set entity scene reference when adding', () => {
      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);

      expect(entity.getScene()).toBe(scene);
    });

    it('should emit entityadded event', () => {
      const callback = vi.fn();
      scene.on('entityadded', callback);

      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);

      expect(callback).toHaveBeenCalledWith(entity);
    });

    it('should trigger entity added lifecycle event', () => {
      const entity = new Entity({ x: 100, y: 100 });
      const callback = vi.fn();

      entity.on('added', callback);
      scene.add(entity);

      expect(callback).toHaveBeenCalled();
    });

    it('should support method chaining for add', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();

      const result = scene.add(entity1).add(entity2);

      expect(result).toBe(scene);
      expect(scene.getEntities()).toHaveLength(2);
    });
  });

  describe('Entity Removal', () => {
    it('should remove entity from scene', () => {
      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);
      scene.remove(entity);

      expect(scene.getEntities()).not.toContain(entity);
    });

    it('should clear entity scene reference when removing', () => {
      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);
      scene.remove(entity);

      expect(entity.getScene()).toBeNull();
    });

    it('should emit entityremoved event', () => {
      const callback = vi.fn();
      scene.on('entityremoved', callback);

      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);
      scene.remove(entity);

      expect(callback).toHaveBeenCalledWith(entity);
    });

    it('should trigger entity removed lifecycle event', () => {
      const entity = new Entity({ x: 100, y: 100 });
      const callback = vi.fn();

      scene.add(entity);
      entity.on('removed', callback);
      scene.remove(entity);

      expect(callback).toHaveBeenCalled();
    });

    it('should handle removing non-existent entity', () => {
      const entity = new Entity({ x: 100, y: 100 });

      expect(() => scene.remove(entity)).not.toThrow();
      expect(scene.getEntities()).toHaveLength(0);
    });

    it('should support method chaining for remove', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();

      scene.add(entity1).add(entity2);
      const result = scene.remove(entity1).remove(entity2);

      expect(result).toBe(scene);
      expect(scene.getEntities()).toHaveLength(0);
    });
  });

  describe('Get Entities', () => {
    it('should return all entities', () => {
      const entities = [
        new Entity({ x: 100, y: 100 }),
        new Entity({ x: 200, y: 200 }),
        new Entity({ x: 300, y: 300 })
      ];

      entities.forEach(e => scene.add(e));

      expect(scene.getEntities()).toEqual(entities);
    });

    it('should return empty array when no entities', () => {
      expect(scene.getEntities()).toEqual([]);
    });

    it('should return entities by tag', () => {
      const player = new Entity({ x: 100, y: 100 });
      player.addTag('player');

      const enemy1 = new Entity({ x: 200, y: 200 });
      enemy1.addTag('enemy');

      const enemy2 = new Entity({ x: 300, y: 300 });
      enemy2.addTag('enemy');

      scene.add(player);
      scene.add(enemy1);
      scene.add(enemy2);

      const enemies = scene.getEntitiesByTag('enemy');
      expect(enemies).toHaveLength(2);
      expect(enemies).toContain(enemy1);
      expect(enemies).toContain(enemy2);
    });

    it('should return empty array for non-existent tag', () => {
      const entity = new Entity({ x: 100, y: 100 });
      entity.addTag('player');
      scene.add(entity);

      expect(scene.getEntitiesByTag('enemy')).toEqual([]);
    });

    it('should filter entities by multiple tags', () => {
      const entity1 = new Entity({ x: 100, y: 100 });
      entity1.addTag('player');
      entity1.addTag('friendly');

      const entity2 = new Entity({ x: 200, y: 200 });
      entity2.addTag('player');

      scene.add(entity1);
      scene.add(entity2);

      const players = scene.getEntitiesByTag('player');
      const friendly = scene.getEntitiesByTag('friendly');

      expect(players).toHaveLength(2);
      expect(friendly).toHaveLength(1);
      expect(friendly[0]).toBe(entity1);
    });
  });

  describe('Z-Index Sorting', () => {
    it('should sort entities by z-index', () => {
      const entity1 = new Entity({ x: 100, y: 100, zIndex: 10 });
      const entity2 = new Entity({ x: 200, y: 200, zIndex: 5 });
      const entity3 = new Entity({ x: 300, y: 300, zIndex: 1 });

      scene.add(entity1);
      scene.add(entity2);
      scene.add(entity3);

      // Trigger sort by calling update
      scene.update(0.016);

      const entities = scene.getEntities();
      expect(entities[0]).toBe(entity3); // zIndex 1
      expect(entities[1]).toBe(entity2); // zIndex 5
      expect(entities[2]).toBe(entity1); // zIndex 10
    });

    it('should handle entities with same z-index', () => {
      const entity1 = new Entity({ x: 100, y: 100, zIndex: 5 });
      const entity2 = new Entity({ x: 200, y: 200, zIndex: 5 });

      scene.add(entity1);
      scene.add(entity2);

      scene.update(0.016);

      expect(scene.getEntities()).toHaveLength(2);
    });

    it('should sort when markSortRequired is called', () => {
      const entity = new Entity({ x: 100, y: 100, zIndex: 10 });
      scene.add(entity);
      scene.update(0.016);

      // Change z-index after adding
      entity.zIndex = 1;
      scene.markSortRequired();
      scene.update(0.016);

      // Entity should still be in scene with new z-index
      expect(scene.getEntities()).toContain(entity);
    });
  });

  describe('Update', () => {
    it('should update all entities', () => {
      const entity1 = new Entity({ x: 100, y: 100, vx: 50 });
      const entity2 = new Entity({ x: 200, y: 200, vx: 30 });

      scene.add(entity1);
      scene.add(entity2);

      scene.update(1); // 1 second

      expect(entity1.x).toBe(150); // 100 + 50*1
      expect(entity2.x).toBe(230); // 200 + 30*1
    });

    it('should not update inactive entities', () => {
      const entity = new Entity({ x: 100, y: 100, vx: 50 });
      entity.active = false;

      scene.add(entity);
      scene.update(1);

      expect(entity.x).toBe(100); // Should not have moved
    });

    it('should emit update event', () => {
      const callback = vi.fn();
      scene.on('update', callback);

      scene.update(0.016);

      expect(callback).toHaveBeenCalledWith(0.016);
    });

    it('should check collisions during update', () => {
      const entity1 = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      const entity2 = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      const callback = vi.fn();
      entity1.on('collisionenter', callback);

      scene.add(entity1);
      scene.add(entity2);

      scene.update(0.016);

      expect(callback).toHaveBeenCalled();
    });

    it('should sort entities before updating if needed', () => {
      const entity1 = new Entity({ x: 100, y: 100, zIndex: 10 });
      const entity2 = new Entity({ x: 200, y: 200, zIndex: 5 });

      scene.add(entity1);
      scene.add(entity2);

      scene.update(0.016);

      // After sorting, entity2 should be first
      expect(scene.getEntities()[0]).toBe(entity2);
    });
  });

  describe('Collision Detection', () => {
    it('should check collisions between entities with checkCollisions enabled', () => {
      const entity1 = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      const entity2 = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      const callback = vi.fn();
      entity1.on('collisionenter', callback);

      scene.add(entity1);
      scene.add(entity2);
      scene.update(0.016);

      expect(callback).toHaveBeenCalled();
    });

    it('should not check collisions for inactive entities', () => {
      const entity1 = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      const entity2 = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        active: false
      });

      const callback = vi.fn();
      entity1.on('collisionenter', callback);

      scene.add(entity1);
      scene.add(entity2);
      scene.update(0.016);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not check entity against itself', () => {
      const entity = new Sprite({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        checkCollisions: true
      });

      scene.add(entity);
      scene.update(0.016);

      // Should not cause errors or self-collision
      expect(() => scene.update(0.016)).not.toThrow();
    });
  });

  describe('Clear', () => {
    it('should remove all entities', () => {
      const entities = [
        new Entity({ x: 100, y: 100 }),
        new Entity({ x: 200, y: 200 }),
        new Entity({ x: 300, y: 300 })
      ];

      entities.forEach(e => scene.add(e));
      scene.clear();

      expect(scene.getEntities()).toEqual([]);
    });

    it('should clear entity scene references', () => {
      const entity = new Entity({ x: 100, y: 100 });
      scene.add(entity);
      scene.clear();

      expect(entity.getScene()).toBeNull();
    });

    it('should emit entityremoved for each entity', () => {
      const callback = vi.fn();
      scene.on('entityremoved', callback);

      const entity1 = new Entity();
      const entity2 = new Entity();

      scene.add(entity1);
      scene.add(entity2);
      scene.clear();

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should preserve background sprite when clearing', () => {
      // Create scene with background image
      const sceneWithBg = new Scene({
        backgroundImage: 'test.png'
      });

      // Mock game to trigger background sprite creation
      const mockGame = {
        width: 800,
        height: 600
      } as any;

      sceneWithBg.setGame(mockGame);

      // Add some regular entities
      const entity1 = new Entity({ x: 100, y: 100 });
      const entity2 = new Entity({ x: 200, y: 200 });
      sceneWithBg.add(entity1);
      sceneWithBg.add(entity2);

      // Should have 3 entities: background + 2 regular
      expect(sceneWithBg.getEntities().length).toBe(3);

      // Clear the scene
      sceneWithBg.clear();

      // Should only have background sprite left
      expect(sceneWithBg.getEntities().length).toBe(1);
      expect(sceneWithBg.getEntities()[0].zIndex).toBe(-1000);
    });
  });

  describe('Lifecycle Events', () => {
    it('should emit enter event on onEnter', () => {
      const callback = vi.fn();
      scene.on('enter', callback);

      scene.onEnter();

      expect(callback).toHaveBeenCalled();
    });

    it('should emit exit event on onExit', () => {
      const callback = vi.fn();
      scene.on('exit', callback);

      scene.onExit();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Game Integration', () => {
    it('should set game instance', () => {
      const mockGame = {
        width: 800,
        height: 600
      } as any;

      scene.setGame(mockGame);

      expect(scene.getGame()).toBe(mockGame);
    });

    it('should return null when no game set', () => {
      expect(scene.getGame()).toBeNull();
    });

    it('should create background sprite when backgroundColor provided', () => {
      const s = new Scene({ backgroundColor: '#000000' });
      const mockGame = {
        width: 800,
        height: 600
      } as any;

      s.setGame(mockGame);

      // Background should be added as an entity
      expect(s.getEntities().length).toBeGreaterThan(0);
    });

    it('should not create duplicate background on multiple setGame calls', () => {
      const s = new Scene({ backgroundColor: '#000000' });
      const mockGame = {
        width: 800,
        height: 600
      } as any;

      s.setGame(mockGame);
      const count1 = s.getEntities().length;

      s.setGame(mockGame);
      const count2 = s.getEntities().length;

      expect(count2).toBe(count1);
    });
  });

  describe('Timers', () => {
    it('should create delay timer', () => {
      const callback = vi.fn();
      const handle = scene.delay(100, callback);

      expect(handle).toBeDefined();
      expect(handle.cancel).toBeDefined();
    });

    it('should create interval timer', () => {
      const callback = vi.fn();
      const handle = scene.interval(100, callback);

      expect(handle).toBeDefined();
      expect(handle.cancel).toBeDefined();
    });

    it('should track timers internally', () => {
      scene.delay(100, () => {});
      scene.interval(100, () => {});

      // Timers are tracked (verified by destroy cleanup)
      expect(() => scene.destroy()).not.toThrow();
    });
  });

  describe('Destroy', () => {
    it('should clear all entities', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();

      scene.add(entity1);
      scene.add(entity2);
      scene.destroy();

      expect(scene.getEntities()).toEqual([]);
    });

    it('should cancel all timers', () => {
      const callback = vi.fn();
      const handle = scene.delay(1000, callback);

      scene.destroy();

      // Timer should be cancelled
      expect(() => handle.cancel()).not.toThrow();
    });

    it('should clear all event listeners', () => {
      const callback = vi.fn();
      scene.on('update', callback);

      scene.destroy();
      scene.emit('update', 0.016);

      // Callback should not be called after destroy
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Render', () => {
    it('should call render on all visible entities', () => {
      const entity1 = new Entity({ x: 100, y: 100, visible: true });
      const entity2 = new Entity({ x: 200, y: 200, visible: true });

      const spy1 = vi.spyOn(entity1, 'render');
      const spy2 = vi.spyOn(entity2, 'render');

      scene.add(entity1);
      scene.add(entity2);

      const mockCtx = createMockCanvasContext();
      scene.render(mockCtx);

      expect(spy1).toHaveBeenCalledWith(mockCtx);
      expect(spy2).toHaveBeenCalledWith(mockCtx);
    });

    it('should not render invisible entities', () => {
      const entity = new Entity({ x: 100, y: 100, visible: false });
      const spy = vi.spyOn(entity, 'render');

      scene.add(entity);

      const mockCtx = createMockCanvasContext();
      scene.render(mockCtx);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit render event', () => {
      const callback = vi.fn();
      scene.on('render', callback);

      const mockCtx = createMockCanvasContext();
      scene.render(mockCtx);

      expect(callback).toHaveBeenCalledWith(mockCtx);
    });

    it('should render entities in z-index order', () => {
      const entity1 = new Entity({ x: 100, y: 100, zIndex: 10 });
      const entity2 = new Entity({ x: 200, y: 200, zIndex: 5 });

      const renderOrder: number[] = [];

      entity1.render = vi.fn(() => renderOrder.push(10));
      entity2.render = vi.fn(() => renderOrder.push(5));

      scene.add(entity1);
      scene.add(entity2);
      scene.update(0.016); // Trigger sort

      const mockCtx = createMockCanvasContext();
      scene.render(mockCtx);

      expect(renderOrder).toEqual([5, 10]); // Lower z-index renders first
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty scene update', () => {
      expect(() => scene.update(0.016)).not.toThrow();
    });

    it('should handle empty scene render', () => {
      const mockCtx = createMockCanvasContext();
      expect(() => scene.render(mockCtx)).not.toThrow();
    });

    it('should handle multiple clear calls', () => {
      const entity = new Entity();
      scene.add(entity);

      scene.clear();
      scene.clear();

      expect(scene.getEntities()).toEqual([]);
    });

    it('should handle adding entity during update', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();

      scene.add(entity1);
      scene.on('update', () => {
        if (!scene.getEntities().includes(entity2)) {
          scene.add(entity2);
        }
      });

      expect(() => scene.update(0.016)).not.toThrow();
    });

    it('should handle negative z-index', () => {
      const entity = new Entity({ x: 100, y: 100, zIndex: -10 });
      scene.add(entity);
      scene.update(0.016);

      expect(scene.getEntities()).toContain(entity);
    });
  });
});
