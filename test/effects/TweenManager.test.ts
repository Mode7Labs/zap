import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TweenManager, tweenManager } from '../../src/effects/TweenManager';
import { Tween } from '../../src/effects/Tween';

describe('TweenManager', () => {
  let manager: TweenManager;
  let target1: { x: number };
  let target2: { y: number };

  beforeEach(() => {
    manager = new TweenManager();
    target1 = { x: 0 };
    target2 = { y: 0 };
  });

  describe('add()', () => {
    it('should add a tween to the manager', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });
      manager.add(tween);
      expect(manager.getCount()).toBe(1);
    });

    it('should add multiple tweens', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);

      expect(manager.getCount()).toBe(2);
    });

    it('should not add duplicate tweens', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });

      manager.add(tween);
      manager.add(tween);

      expect(manager.getCount()).toBe(1);
    });
  });

  describe('remove()', () => {
    it('should remove a tween from the manager', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });
      manager.add(tween);
      expect(manager.getCount()).toBe(1);

      manager.remove(tween);
      expect(manager.getCount()).toBe(0);
    });

    it('should handle removing non-existent tween', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });
      expect(() => manager.remove(tween)).not.toThrow();
      expect(manager.getCount()).toBe(0);
    });

    it('should only remove specified tween', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);
      expect(manager.getCount()).toBe(2);

      manager.remove(tween1);
      expect(manager.getCount()).toBe(1);
    });
  });

  describe('update()', () => {
    it('should update all tweens', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);

      manager.update(0.5); // 500ms

      expect(target1.x).toBe(50);
      expect(target2.y).toBe(100);
    });

    it('should remove completed tweens automatically', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });
      manager.add(tween);
      expect(manager.getCount()).toBe(1);

      manager.update(1); // 1000ms - complete the tween

      expect(manager.getCount()).toBe(0);
      expect(target1.x).toBe(100);
    });

    it('should handle mix of active and completed tweens', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 2000 });

      manager.add(tween1);
      manager.add(tween2);
      expect(manager.getCount()).toBe(2);

      manager.update(1); // 1000ms

      expect(manager.getCount()).toBe(1);
      expect(target1.x).toBe(100);
      expect(target2.y).toBe(100);

      manager.update(1); // 2000ms total

      expect(manager.getCount()).toBe(0);
      expect(target2.y).toBe(200);
    });

    it('should handle empty tween list', () => {
      expect(() => manager.update(1)).not.toThrow();
    });

    it('should continue updating remaining tweens after removal', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 2000 });

      manager.add(tween1);
      manager.add(tween2);

      manager.update(0.5); // 500ms
      expect(target1.x).toBe(50);
      expect(target2.y).toBe(50);

      manager.update(0.5); // 1000ms - tween1 completes
      expect(target1.x).toBe(100);
      expect(target2.y).toBe(100);
      expect(manager.getCount()).toBe(1);

      manager.update(1); // 2000ms - tween2 completes
      expect(target2.y).toBe(200);
      expect(manager.getCount()).toBe(0);
    });

    it('should call onComplete callbacks when tweens finish', () => {
      const onComplete1 = vi.fn();
      const onComplete2 = vi.fn();

      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000, onComplete: onComplete1 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 2000, onComplete: onComplete2 });

      manager.add(tween1);
      manager.add(tween2);

      manager.update(1);
      expect(onComplete1).toHaveBeenCalledTimes(1);
      expect(onComplete2).not.toHaveBeenCalled();

      manager.update(1);
      expect(onComplete2).toHaveBeenCalledTimes(1);
    });

    it('should handle tweens added during update', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000, onComplete: () => {
        const tween2 = new Tween(target2, { y: 200 }, { duration: 2000 }); // Longer duration so it doesn't complete in same frame
        manager.add(tween2);
      }});

      manager.add(tween1);
      manager.update(1);

      // tween2 was added during the update and partially processed
      expect(manager.getCount()).toBe(1);
      expect(target1.x).toBe(100);
      expect(target2.y).toBe(100); // 1 second out of 2 seconds

      manager.update(1);
      expect(manager.getCount()).toBe(0);
      expect(target2.y).toBe(200);
    });
  });

  describe('clear()', () => {
    it('should remove all tweens', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);
      expect(manager.getCount()).toBe(2);

      manager.clear();
      expect(manager.getCount()).toBe(0);
    });

    it('should not update cleared tweens', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);

      manager.update(0.5);
      expect(target1.x).toBe(50);
      expect(target2.y).toBe(100);

      manager.clear();
      manager.update(0.5);

      expect(target1.x).toBe(50); // Should not change
      expect(target2.y).toBe(100); // Should not change
    });

    it('should handle clearing empty manager', () => {
      expect(() => manager.clear()).not.toThrow();
      expect(manager.getCount()).toBe(0);
    });

    it('should allow adding tweens after clear', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      manager.add(tween1);
      manager.clear();

      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });
      manager.add(tween2);

      expect(manager.getCount()).toBe(1);
      manager.update(1);
      expect(target2.y).toBe(200);
    });
  });

  describe('getCount()', () => {
    it('should return 0 for empty manager', () => {
      expect(manager.getCount()).toBe(0);
    });

    it('should return correct count for single tween', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });
      manager.add(tween);
      expect(manager.getCount()).toBe(1);
    });

    it('should return correct count for multiple tweens', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });
      const target3 = { z: 0 };
      const tween3 = new Tween(target3, { z: 300 }, { duration: 1000 });

      manager.add(tween1);
      expect(manager.getCount()).toBe(1);

      manager.add(tween2);
      expect(manager.getCount()).toBe(2);

      manager.add(tween3);
      expect(manager.getCount()).toBe(3);
    });

    it('should decrease count when tweens complete', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 2000 });

      manager.add(tween1);
      manager.add(tween2);
      expect(manager.getCount()).toBe(2);

      manager.update(1);
      expect(manager.getCount()).toBe(1);

      manager.update(1);
      expect(manager.getCount()).toBe(0);
    });

    it('should update count after remove', () => {
      const tween = new Tween(target1, { x: 100 }, { duration: 1000 });
      manager.add(tween);
      expect(manager.getCount()).toBe(1);

      manager.remove(tween);
      expect(manager.getCount()).toBe(0);
    });

    it('should update count after clear', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);
      expect(manager.getCount()).toBe(2);

      manager.clear();
      expect(manager.getCount()).toBe(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complex tween choreography', () => {
      const results: string[] = [];

      const tween1 = new Tween(target1, { x: 100 }, {
        duration: 1000,
        onComplete: () => results.push('tween1 done')
      });

      const tween2 = new Tween(target2, { y: 200 }, {
        duration: 2000,
        onComplete: () => results.push('tween2 done')
      });

      manager.add(tween1);
      manager.add(tween2);

      manager.update(0.5); // 500ms
      expect(results).toEqual([]);

      manager.update(0.5); // 1000ms
      expect(results).toEqual(['tween1 done']);

      manager.update(1); // 2000ms
      expect(results).toEqual(['tween1 done', 'tween2 done']);
    });

    it('should handle stopped tweens correctly', () => {
      const tween1 = new Tween(target1, { x: 100 }, { duration: 1000 });
      const tween2 = new Tween(target2, { y: 200 }, { duration: 1000 });

      manager.add(tween1);
      manager.add(tween2);

      manager.update(0.5);
      expect(target1.x).toBe(50);
      expect(target2.y).toBe(100);

      tween1.stop();
      manager.update(0.5);

      expect(target1.x).toBe(50); // Should not change
      expect(target2.y).toBe(200); // Should complete
      expect(manager.getCount()).toBe(1); // Stopped tween remains
    });

    it('should handle sequential tweens', async () => {
      const results: number[] = [];

      const tween1 = new Tween(target1, { x: 100 }, {
        duration: 1000,
        onComplete: () => {
          results.push(target1.x);
          const tween2 = new Tween(target1, { x: 200 }, {
            duration: 2000, // Longer duration to prevent immediate completion
            onComplete: () => results.push(target1.x)
          });
          manager.add(tween2);
        }
      });

      manager.add(tween1);
      manager.update(1);
      // tween2 gets partially updated in same frame
      expect(results).toEqual([100]);
      expect(target1.x).toBe(150); // Halfway through tween2

      manager.update(1);
      expect(results).toEqual([100, 200]);
    });
  });

  describe('Global tweenManager instance', () => {
    it('should export a singleton instance', () => {
      expect(tweenManager).toBeInstanceOf(TweenManager);
    });

    it('should work as expected', () => {
      const target = { value: 0 };
      const tween = new Tween(target, { value: 100 }, { duration: 1000 });

      const initialCount = tweenManager.getCount();
      tweenManager.add(tween);
      expect(tweenManager.getCount()).toBe(initialCount + 1);

      tweenManager.update(0.5);
      expect(target.value).toBe(50);

      tweenManager.update(0.5);
      expect(tweenManager.getCount()).toBe(initialCount);
    });
  });
});
