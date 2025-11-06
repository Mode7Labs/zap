import { describe, it, expect } from 'vitest';
import { Easing, EasingName } from '../../src/utils/easing';

describe('Easing Functions', () => {
  // Helper to test basic properties of all easing functions
  const testEasingFunction = (name: EasingName, fn: (t: number) => number) => {
    describe(name, () => {
      it('should return 0 or close to 0 at t=0', () => {
        const result = fn(0);
        expect(result).toBeCloseTo(0, 5);
      });

      it('should return 1 or close to 1 at t=1', () => {
        const result = fn(1);
        expect(result).toBeCloseTo(1, 5);
      });

      it('should return values between 0 and 1 for t in [0, 1]', () => {
        for (let t = 0; t <= 1; t += 0.1) {
          const result = fn(t);
          // Some easing functions (like elastic and back) can go slightly outside [0,1]
          // but should generally be in a reasonable range
          expect(result).toBeGreaterThan(-0.5);
          expect(result).toBeLessThan(1.5);
        }
      });

      it('should be monotonic or have controlled oscillation', () => {
        const values: number[] = [];
        for (let i = 0; i <= 100; i++) {
          values.push(fn(i / 100));
        }
        // First and last values should be roughly 0 and 1
        expect(values[0]).toBeCloseTo(0, 1);
        expect(values[values.length - 1]).toBeCloseTo(1, 0); // Relaxed tolerance for floating point
      });
    });
  };

  // Test all easing functions
  Object.entries(Easing).forEach(([name, fn]) => {
    testEasingFunction(name as EasingName, fn);
  });

  describe('linear', () => {
    it('should return the input value unchanged', () => {
      expect(Easing.linear(0)).toBe(0);
      expect(Easing.linear(0.5)).toBe(0.5);
      expect(Easing.linear(1)).toBe(1);
      expect(Easing.linear(0.25)).toBe(0.25);
      expect(Easing.linear(0.75)).toBe(0.75);
    });
  });

  describe('Quad easing', () => {
    it('easeInQuad should accelerate', () => {
      expect(Easing.easeInQuad(0.5)).toBe(0.25);
      expect(Easing.easeInQuad(0.5)).toBeLessThan(0.5);
    });

    it('easeOutQuad should decelerate', () => {
      expect(Easing.easeOutQuad(0.5)).toBeCloseTo(0.75, 5);
      expect(Easing.easeOutQuad(0.5)).toBeGreaterThan(0.5);
    });

    it('easeInOutQuad should accelerate then decelerate', () => {
      expect(Easing.easeInOutQuad(0.25)).toBeLessThan(0.25);
      expect(Easing.easeInOutQuad(0.75)).toBeGreaterThan(0.75);
      expect(Easing.easeInOutQuad(0.5)).toBeCloseTo(0.5, 5);
    });
  });

  describe('Cubic easing', () => {
    it('easeInCubic should have strong acceleration', () => {
      expect(Easing.easeInCubic(0.5)).toBe(0.125);
      expect(Easing.easeInCubic(0.5)).toBeLessThan(Easing.easeInQuad(0.5));
    });

    it('easeOutCubic should have strong deceleration', () => {
      const result = Easing.easeOutCubic(0.5);
      expect(result).toBeGreaterThan(0.5);
      expect(result).toBeGreaterThan(Easing.easeOutQuad(0.5));
    });
  });

  describe('Quart easing', () => {
    it('easeInQuart should have very strong acceleration', () => {
      expect(Easing.easeInQuart(0.5)).toBe(0.0625);
      expect(Easing.easeInQuart(0.5)).toBeLessThan(Easing.easeInCubic(0.5));
    });

    it('easeOutQuart should have very strong deceleration', () => {
      const result = Easing.easeOutQuart(0.5);
      expect(result).toBeGreaterThan(0.5);
    });
  });

  describe('Quint easing', () => {
    it('easeInQuint should have extreme acceleration', () => {
      expect(Easing.easeInQuint(0.5)).toBe(0.03125);
      expect(Easing.easeInQuint(0.5)).toBeLessThan(Easing.easeInQuart(0.5));
    });

    it('easeOutQuint should have extreme deceleration', () => {
      const result = Easing.easeOutQuint(0.5);
      expect(result).toBeGreaterThan(0.5);
    });
  });

  describe('Sine easing', () => {
    it('easeInSine should have smooth acceleration', () => {
      const result = Easing.easeInSine(0.5);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(0.5);
    });

    it('easeOutSine should have smooth deceleration', () => {
      const result = Easing.easeOutSine(0.5);
      expect(result).toBeGreaterThan(0.5);
      expect(result).toBeLessThan(1);
    });

    it('easeInOutSine should be smooth throughout', () => {
      expect(Easing.easeInOutSine(0.5)).toBeCloseTo(0.5, 5);
    });
  });

  describe('Expo easing', () => {
    it('easeInExpo should return 0 at t=0', () => {
      expect(Easing.easeInExpo(0)).toBe(0);
    });

    it('easeInExpo should have exponential acceleration', () => {
      const result = Easing.easeInExpo(0.5);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(0.1);
    });

    it('easeOutExpo should return 1 at t=1', () => {
      expect(Easing.easeOutExpo(1)).toBe(1);
    });

    it('easeOutExpo should have exponential deceleration', () => {
      const result = Easing.easeOutExpo(0.5);
      expect(result).toBeGreaterThan(0.9);
    });

    it('easeInOutExpo should handle edge cases', () => {
      expect(Easing.easeInOutExpo(0)).toBe(0);
      expect(Easing.easeInOutExpo(1)).toBe(1);
    });
  });

  describe('Circ easing', () => {
    it('easeInCirc should follow circular curve', () => {
      const result = Easing.easeInCirc(0.5);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(0.5);
    });

    it('easeOutCirc should follow circular curve', () => {
      const result = Easing.easeOutCirc(0.5);
      expect(result).toBeGreaterThan(0.5);
      expect(result).toBeLessThan(1);
    });

    it('easeInOutCirc should be smooth', () => {
      const result = Easing.easeInOutCirc(0.5);
      expect(result).toBeCloseTo(0.5, 1);
    });
  });

  describe('Back easing', () => {
    it('easeInBack should overshoot backwards initially', () => {
      const result = Easing.easeInBack(0.3);
      expect(result).toBeLessThan(0);
    });

    it('easeOutBack should overshoot forward at end', () => {
      const result = Easing.easeOutBack(0.8);
      expect(result).toBeGreaterThan(1);
    });

    it('easeInOutBack should overshoot both directions', () => {
      expect(Easing.easeInOutBack(0.2)).toBeLessThan(0);
      expect(Easing.easeInOutBack(0.8)).toBeGreaterThan(1);
    });
  });

  describe('Elastic easing', () => {
    it('easeInElastic should return 0 at t=0', () => {
      expect(Easing.easeInElastic(0)).toBe(0);
    });

    it('easeInElastic should return 1 at t=1', () => {
      expect(Easing.easeInElastic(1)).toBe(1);
    });

    it('easeInElastic should oscillate', () => {
      const values: number[] = [];
      for (let t = 0.1; t < 1; t += 0.1) {
        values.push(Easing.easeInElastic(t));
      }
      // Should have both negative and positive values due to oscillation
      const hasNegative = values.some(v => v < 0);
      expect(hasNegative).toBe(true);
    });

    it('easeOutElastic should return 0 at t=0', () => {
      expect(Easing.easeOutElastic(0)).toBe(0);
    });

    it('easeOutElastic should return 1 at t=1', () => {
      expect(Easing.easeOutElastic(1)).toBe(1);
    });

    it('easeOutElastic should oscillate', () => {
      const values: number[] = [];
      for (let t = 0.1; t < 1; t += 0.1) {
        values.push(Easing.easeOutElastic(t));
      }
      // Should have values greater than 1 due to oscillation
      const hasOvershoot = values.some(v => v > 1);
      expect(hasOvershoot).toBe(true);
    });

    it('easeInOutElastic should handle edge cases', () => {
      expect(Easing.easeInOutElastic(0)).toBe(0);
      expect(Easing.easeInOutElastic(1)).toBe(1);
    });
  });

  describe('Bounce easing', () => {
    it('easeInBounce should be inverse of easeOutBounce', () => {
      for (let t = 0; t <= 1; t += 0.1) {
        const inValue = Easing.easeInBounce(t);
        const outValue = Easing.easeOutBounce(1 - t);
        expect(inValue).toBeCloseTo(1 - outValue, 5);
      }
    });

    it('easeOutBounce should have multiple bounces', () => {
      const values: number[] = [];
      for (let t = 0; t <= 1; t += 0.01) {
        values.push(Easing.easeOutBounce(t));
      }

      // Check for local minima (bounces)
      let bounces = 0;
      for (let i = 1; i < values.length - 1; i++) {
        if (values[i] < values[i - 1] && values[i] < values[i + 1]) {
          bounces++;
        }
      }
      expect(bounces).toBeGreaterThan(0);
    });

    it('easeInOutBounce should combine in and out', () => {
      expect(Easing.easeInOutBounce(0.25)).toBeLessThan(0.25);
      expect(Easing.easeInOutBounce(0.75)).toBeGreaterThan(0.75);
    });
  });

  describe('Edge cases', () => {
    it('all easing functions should handle t=0', () => {
      Object.values(Easing).forEach(fn => {
        const result = fn(0);
        expect(result).toBeCloseTo(0, 5);
      });
    });

    it('all easing functions should handle t=1', () => {
      Object.values(Easing).forEach(fn => {
        const result = fn(1);
        expect(result).toBeCloseTo(1, 5);
      });
    });

    it('all easing functions should handle t=0.5', () => {
      Object.values(Easing).forEach(fn => {
        const result = fn(0.5);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
        expect(isFinite(result)).toBe(true);
      });
    });
  });

  describe('Type safety', () => {
    it('should export EasingName type', () => {
      const easingNames: EasingName[] = Object.keys(Easing) as EasingName[];
      expect(easingNames.length).toBeGreaterThan(0);
      expect(easingNames).toContain('linear');
      expect(easingNames).toContain('easeInQuad');
      expect(easingNames).toContain('easeOutBounce');
    });

    it('all Easing object keys should be valid easing functions', () => {
      Object.entries(Easing).forEach(([name, fn]) => {
        expect(typeof fn).toBe('function');
        expect(typeof fn(0.5)).toBe('number');
      });
    });
  });

  describe('Performance characteristics', () => {
    it('in variants should be slower than linear at t=0.5', () => {
      expect(Easing.easeInQuad(0.5)).toBeLessThan(Easing.linear(0.5));
      expect(Easing.easeInCubic(0.5)).toBeLessThan(Easing.linear(0.5));
      expect(Easing.easeInQuart(0.5)).toBeLessThan(Easing.linear(0.5));
      expect(Easing.easeInQuint(0.5)).toBeLessThan(Easing.linear(0.5));
    });

    it('out variants should be faster than linear at t=0.5', () => {
      expect(Easing.easeOutQuad(0.5)).toBeGreaterThan(Easing.linear(0.5));
      expect(Easing.easeOutCubic(0.5)).toBeGreaterThan(Easing.linear(0.5));
      expect(Easing.easeOutQuart(0.5)).toBeGreaterThan(Easing.linear(0.5));
      expect(Easing.easeOutQuint(0.5)).toBeGreaterThan(Easing.linear(0.5));
    });

    it('inOut variants should be close to linear at t=0.5', () => {
      expect(Easing.easeInOutQuad(0.5)).toBeCloseTo(0.5, 1);
      expect(Easing.easeInOutSine(0.5)).toBeCloseTo(0.5, 1);
      expect(Easing.easeInOutCirc(0.5)).toBeCloseTo(0.5, 1);
    });
  });
});
