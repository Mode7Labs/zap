import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Tween } from '../../src/effects/Tween';
import { Easing } from '../../src/utils/easing';

describe('Tween', () => {
  let target: { x: number; y: number; opacity: number };

  beforeEach(() => {
    target = { x: 0, y: 0, opacity: 1 };
  });

  describe('constructor', () => {
    it('should create a tween with target and end values', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      expect(tween).toBeInstanceOf(Tween);
      expect(tween.isActive()).toBe(true);
      expect(tween.isCompleted()).toBe(false);
    });

    it('should use linear easing by default', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(0.5); // 500ms
      expect(target.x).toBe(50);
    });

    it('should accept easing function name', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000, easing: 'easeInQuad' });
      tween.update(0.5); // 500ms
      expect(target.x).toBe(25); // easeInQuad(0.5) = 0.25
    });

    it('should accept custom easing function', () => {
      const customEasing = (t: number) => t * t * t;
      const tween = new Tween(target, { x: 100 }, { duration: 1000, easing: customEasing });
      tween.update(0.5); // 500ms
      expect(target.x).toBe(12.5); // cubic(0.5) = 0.125
    });

    it('should handle delay option', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000, delay: 500 });
      tween.update(0.25); // 250ms
      expect(target.x).toBe(0); // Still in delay
    });

    it('should handle onUpdate callback', () => {
      const onUpdate = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onUpdate });
      tween.update(0.5);
      expect(onUpdate).toHaveBeenCalledWith(0.5);
    });

    it('should handle onComplete callback', () => {
      const onComplete = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onComplete });
      tween.update(1);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    it('should interpolate single property', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });

      tween.update(0); // 0ms
      expect(target.x).toBe(0);

      tween.update(0.25); // 250ms
      expect(target.x).toBe(25);

      tween.update(0.25); // 500ms total
      expect(target.x).toBe(50);

      tween.update(0.5); // 1000ms total
      expect(target.x).toBe(100);
    });

    it('should interpolate multiple properties', () => {
      const tween = new Tween(target, { x: 100, y: 200, opacity: 0 }, { duration: 1000 });

      tween.update(0.5); // 500ms
      expect(target.x).toBe(50);
      expect(target.y).toBe(100);
      expect(target.opacity).toBe(0.5);

      tween.update(0.5); // 1000ms total
      expect(target.x).toBe(100);
      expect(target.y).toBe(200);
      expect(target.opacity).toBe(0);
    });

    it('should not update during delay period', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000, delay: 500 });

      tween.update(0.25); // 250ms
      expect(target.x).toBe(0);

      tween.update(0.25); // 500ms (delay done)
      expect(target.x).toBe(0);

      tween.update(0.5); // 1000ms into animation
      expect(target.x).toBe(50);
    });

    it('should apply easing function', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000, easing: 'easeInQuad' });

      tween.update(0.5); // 500ms
      expect(target.x).toBe(25); // 0.5^2 * 100 = 25

      tween.update(0.5); // 1000ms total
      expect(target.x).toBe(100);
    });

    it('should call onUpdate callback with progress', () => {
      const onUpdate = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onUpdate });

      tween.update(0.25);
      expect(onUpdate).toHaveBeenCalledWith(0.25);

      tween.update(0.25);
      expect(onUpdate).toHaveBeenCalledWith(0.5);

      tween.update(0.5);
      expect(onUpdate).toHaveBeenCalledWith(1);
    });

    it('should call onComplete when finished', () => {
      const onComplete = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onComplete });

      tween.update(0.5);
      expect(onComplete).not.toHaveBeenCalled();

      tween.update(0.5);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should not update after completion', () => {
      const onUpdate = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onUpdate });

      tween.update(1); // Complete
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(target.x).toBe(100);

      onUpdate.mockClear();
      tween.update(1); // Try to update again
      expect(onUpdate).not.toHaveBeenCalled();
      expect(target.x).toBe(100);
    });

    it('should not update after stop() is called', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });

      tween.update(0.5);
      expect(target.x).toBe(50);

      tween.stop();
      tween.update(0.5);
      expect(target.x).toBe(50); // Should not change
    });

    it('should handle zero duration', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 0 });
      tween.update(0);
      expect(target.x).toBe(100);
      expect(tween.isCompleted()).toBe(true);
    });

    it('should clamp progress to 1 when exceeding duration', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(2); // 2000ms (more than duration)
      expect(target.x).toBe(100);
      expect(tween.isCompleted()).toBe(true);
    });

    it('should capture start values on first update after delay', () => {
      target.x = 50;
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(0.5);
      expect(target.x).toBe(75); // 50 + (100 - 50) * 0.5
    });

    it('should work with negative values', () => {
      target.x = 100;
      const tween = new Tween(target, { x: -50 }, { duration: 1000 });
      tween.update(0.5);
      expect(target.x).toBe(25); // 100 + (-50 - 100) * 0.5
    });

    it('should work with decimal values', () => {
      const tween = new Tween(target, { opacity: 0.5 }, { duration: 1000 });
      tween.update(0.5);
      expect(target.opacity).toBeCloseTo(0.75, 5);
    });
  });

  describe('stop()', () => {
    it('should stop the tween', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(0.5);
      expect(target.x).toBe(50);

      tween.stop();
      expect(tween.isActive()).toBe(false);

      tween.update(0.5);
      expect(target.x).toBe(50);
    });

    it('should not call onComplete when stopped', () => {
      const onComplete = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onComplete });

      tween.update(0.5);
      tween.stop();
      tween.update(0.5);

      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should allow stopping multiple times', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      expect(() => {
        tween.stop();
        tween.stop();
        tween.stop();
      }).not.toThrow();
    });
  });

  describe('isCompleted()', () => {
    it('should return false initially', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      expect(tween.isCompleted()).toBe(false);
    });

    it('should return false during animation', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(0.5);
      expect(tween.isCompleted()).toBe(false);
    });

    it('should return true after completion', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(1);
      expect(tween.isCompleted()).toBe(true);
    });

    it('should remain true after completion', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(1);
      expect(tween.isCompleted()).toBe(true);
      tween.update(1);
      expect(tween.isCompleted()).toBe(true);
    });
  });

  describe('isActive()', () => {
    it('should return true initially', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      expect(tween.isActive()).toBe(true);
    });

    it('should return true during animation', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(0.5);
      expect(tween.isActive()).toBe(true);
    });

    it('should return false after completion', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(1);
      expect(tween.isActive()).toBe(false);
    });

    it('should return false after stop', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.stop();
      expect(tween.isActive()).toBe(false);
    });
  });

  describe('then()', () => {
    it('should add onComplete callback', () => {
      const callback = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.then(callback);
      tween.update(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should chain with existing onComplete', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const tween = new Tween(target, { x: 100 }, { duration: 1000, onComplete: callback1 });
      tween.then(callback2);
      tween.update(1);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should return the tween for chaining', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      const result = tween.then(() => {});
      expect(result).toBe(tween);
    });

    it('should support multiple then calls', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.then(callback1).then(callback2).then(callback3);
      tween.update(1);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should handle then() without callback', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      expect(() => tween.then()).not.toThrow();
      tween.update(1);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle tweening from non-zero start values', () => {
      target.x = 50;
      target.y = 100;

      const tween = new Tween(target, { x: 150, y: 200 }, { duration: 1000 });
      tween.update(0.5);

      expect(target.x).toBe(100); // 50 + (150 - 50) * 0.5
      expect(target.y).toBe(150); // 100 + (200 - 100) * 0.5
    });

    it('should work with custom easing and delay', () => {
      const customEasing = (t: number) => t * t;
      const tween = new Tween(
        target,
        { x: 100 },
        { duration: 1000, delay: 500, easing: customEasing }
      );

      tween.update(0.25); // 250ms during delay
      expect(target.x).toBe(0);

      tween.update(0.25); // 500ms total - delay completes, 0ms applied to animation
      expect(target.x).toBe(0);

      tween.update(0.5); // 500ms into animation
      expect(target.x).toBe(25); // 0.5^2 * 100 = 25
    });

    it('should handle updates with varying deltaTime', () => {
      const tween = new Tween(target, { x: 100 }, { duration: 1000 });

      tween.update(0.1); // 100ms
      expect(target.x).toBe(10);

      tween.update(0.3); // 300ms more (400ms total)
      expect(target.x).toBe(40);

      tween.update(0.2); // 200ms more (600ms total)
      expect(target.x).toBe(60);

      tween.update(0.4); // 400ms more (1000ms total)
      expect(target.x).toBe(100);
    });

    it('should preserve non-tweened properties', () => {
      target.x = 10;
      target.y = 20;
      target.opacity = 1;

      const tween = new Tween(target, { x: 100 }, { duration: 1000 });
      tween.update(0.5);

      expect(target.x).toBe(55);
      expect(target.y).toBe(20); // Unchanged
      expect(target.opacity).toBe(1); // Unchanged
    });

    it('should support all built-in easing functions', () => {
      const easingNames = Object.keys(Easing) as Array<keyof typeof Easing>;

      easingNames.forEach(easingName => {
        const target = { value: 0 };
        const tween = new Tween(target, { value: 100 }, { duration: 1000, easing: easingName });
        tween.update(1);
        expect(target.value).toBeCloseTo(100, 0);
      });
    });
  });
});
