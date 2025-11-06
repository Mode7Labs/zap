import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  map,
  randomInt,
  randomFloat,
  randomItem,
  distance,
  distanceSquared,
  length,
  lengthSquared,
  normalize,
  dot,
  rotate,
  rotateAround
} from '../../src/utils/math';

describe('Math Utilities', () => {
  describe('clamp()', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, -10, 10)).toBe(0);
      expect(clamp(-5, -10, 10)).toBe(-5);
    });

    it('should clamp to min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, -10, 10)).toBe(-10);
      expect(clamp(0, 5, 10)).toBe(5);
    });

    it('should clamp to max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, -10, 10)).toBe(10);
      expect(clamp(20, 5, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 0)).toBe(0);
      expect(clamp(5, 5, 5)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should work with negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    it('should work with decimal values', () => {
      expect(clamp(5.5, 0, 10)).toBe(5.5);
      expect(clamp(0.1, 0, 1)).toBe(0.1);
      expect(clamp(1.5, 0, 1)).toBe(1);
    });
  });

  describe('lerp()', () => {
    it('should return start when t is 0', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(-5, 5, 0)).toBe(-5);
      expect(lerp(100, 200, 0)).toBe(100);
    });

    it('should return end when t is 1', () => {
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(-5, 5, 1)).toBe(5);
      expect(lerp(100, 200, 1)).toBe(200);
    });

    it('should interpolate correctly at t=0.5', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(-10, 10, 0.5)).toBe(0);
      expect(lerp(100, 200, 0.5)).toBe(150);
    });

    it('should handle various t values', () => {
      expect(lerp(0, 100, 0.25)).toBe(25);
      expect(lerp(0, 100, 0.75)).toBe(75);
      expect(lerp(50, 100, 0.5)).toBe(75);
    });

    it('should work with negative values', () => {
      expect(lerp(-10, -5, 0.5)).toBe(-7.5);
      expect(lerp(-100, 100, 0.5)).toBe(0);
      expect(lerp(-50, 50, 0.25)).toBe(-25);
    });

    it('should handle t values outside 0-1 range (extrapolation)', () => {
      expect(lerp(0, 10, 2)).toBe(20);
      expect(lerp(0, 10, -1)).toBe(-10);
      expect(lerp(5, 10, 1.5)).toBe(12.5);
    });

    it('should work with decimal values', () => {
      expect(lerp(0, 1, 0.333)).toBeCloseTo(0.333, 5);
      expect(lerp(1.5, 2.5, 0.5)).toBe(2);
    });

    it('should handle zero range', () => {
      expect(lerp(5, 5, 0.5)).toBe(5);
      expect(lerp(0, 0, 0.7)).toBe(0);
    });
  });

  describe('map()', () => {
    it('should map value from one range to another', () => {
      expect(map(5, 0, 10, 0, 100)).toBe(50);
      expect(map(0, 0, 10, 0, 100)).toBe(0);
      expect(map(10, 0, 10, 0, 100)).toBe(100);
    });

    it('should handle negative ranges', () => {
      expect(map(0, -10, 10, 0, 100)).toBe(50);
      expect(map(-5, -10, 10, 0, 100)).toBe(25);
      expect(map(5, -10, 10, -100, 100)).toBe(50);
    });

    it('should work with inverted output ranges', () => {
      expect(map(5, 0, 10, 100, 0)).toBe(50);
      expect(map(0, 0, 10, 100, 0)).toBe(100);
      expect(map(10, 0, 10, 100, 0)).toBe(0);
    });

    it('should handle different range scales', () => {
      expect(map(50, 0, 100, 0, 1)).toBe(0.5);
      expect(map(0.5, 0, 1, 0, 100)).toBe(50);
      expect(map(25, 0, 100, 0, 10)).toBe(2.5);
    });

    it('should work with values outside input range', () => {
      expect(map(15, 0, 10, 0, 100)).toBe(150);
      expect(map(-5, 0, 10, 0, 100)).toBe(-50);
    });

    it('should handle same input and output ranges', () => {
      expect(map(5, 0, 10, 0, 10)).toBe(5);
      expect(map(7.5, 0, 10, 0, 10)).toBe(7.5);
    });

    it('should work with decimal values', () => {
      expect(map(0.333, 0, 1, 0, 100)).toBeCloseTo(33.3, 1);
      expect(map(2.5, 0, 5, 10, 20)).toBe(15);
    });
  });

  describe('randomInt()', () => {
    it('should return integer within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(0, 10);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should include both min and max', () => {
      const results = new Set<number>();
      for (let i = 0; i < 1000; i++) {
        results.add(randomInt(0, 2));
      }
      expect(results.has(0)).toBe(true);
      expect(results.has(1)).toBe(true);
      expect(results.has(2)).toBe(true);
    });

    it('should work with negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-5);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should work with negative to positive ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(-5, 5);
        expect(result).toBeGreaterThanOrEqual(-5);
        expect(result).toBeLessThanOrEqual(5);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should return same value when min equals max', () => {
      expect(randomInt(5, 5)).toBe(5);
      expect(randomInt(0, 0)).toBe(0);
      expect(randomInt(-3, -3)).toBe(-3);
    });

    it('should have roughly uniform distribution', () => {
      const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const result = randomInt(0, 4);
        counts[result as keyof typeof counts]++;
      }

      // Each value should appear roughly 20% of the time (±5%)
      Object.values(counts).forEach(count => {
        const percentage = count / iterations;
        expect(percentage).toBeGreaterThan(0.15);
        expect(percentage).toBeLessThan(0.25);
      });
    });
  });

  describe('randomFloat()', () => {
    it('should return float within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0, 10);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(10);
      }
    });

    it('should work with negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThan(-5);
      }
    });

    it('should work with negative to positive ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(-5, 5);
        expect(result).toBeGreaterThanOrEqual(-5);
        expect(result).toBeLessThan(5);
      }
    });

    it('should return same value when min equals max', () => {
      expect(randomFloat(5, 5)).toBe(5);
      expect(randomFloat(0, 0)).toBe(0);
    });

    it('should work with decimal ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0.1, 0.9);
        expect(result).toBeGreaterThanOrEqual(0.1);
        expect(result).toBeLessThan(0.9);
      }
    });

    it('should return non-integer values', () => {
      let hasDecimal = false;
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0, 100);
        if (!Number.isInteger(result)) {
          hasDecimal = true;
          break;
        }
      }
      expect(hasDecimal).toBe(true);
    });

    it('should have roughly uniform distribution', () => {
      const buckets = [0, 0, 0, 0, 0];
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const result = randomFloat(0, 5);
        const bucket = Math.floor(result);
        buckets[bucket]++;
      }

      // Each bucket should have roughly 20% of values (±5%)
      buckets.forEach(count => {
        const percentage = count / iterations;
        expect(percentage).toBeGreaterThan(0.15);
        expect(percentage).toBeLessThan(0.25);
      });
    });
  });

  describe('randomItem()', () => {
    it('should return item from array', () => {
      const items = [1, 2, 3, 4, 5];
      for (let i = 0; i < 100; i++) {
        const result = randomItem(items);
        expect(items).toContain(result);
      }
    });

    it('should work with different types', () => {
      const strings = ['a', 'b', 'c'];
      const result = randomItem(strings);
      expect(strings).toContain(result);
      expect(typeof result).toBe('string');
    });

    it('should work with objects', () => {
      const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = randomItem(objects);
      expect(objects).toContain(result);
      expect(result).toHaveProperty('id');
    });

    it('should return only item from single-element array', () => {
      const items = [42];
      expect(randomItem(items)).toBe(42);
    });

    it('should eventually return all items', () => {
      const items = [1, 2, 3];
      const results = new Set<number>();

      for (let i = 0; i < 1000; i++) {
        results.add(randomItem(items));
        if (results.size === items.length) break;
      }

      expect(results.size).toBe(items.length);
      expect([...results].sort()).toEqual(items.sort());
    });

    it('should have roughly uniform distribution', () => {
      const items = ['a', 'b', 'c', 'd'];
      const counts = { a: 0, b: 0, c: 0, d: 0 };
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        const result = randomItem(items);
        counts[result as keyof typeof counts]++;
      }

      // Each item should appear roughly 25% of the time (±5%)
      Object.values(counts).forEach(count => {
        const percentage = count / iterations;
        expect(percentage).toBeGreaterThan(0.20);
        expect(percentage).toBeLessThan(0.30);
      });
    });

    it('should not modify original array', () => {
      const items = [1, 2, 3];
      const original = [...items];
      randomItem(items);
      expect(items).toEqual(original);
    });
  });

  describe('distance()', () => {
    it('should calculate distance between two points', () => {
      expect(distance(0, 0, 0, 0)).toBe(0);
      expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
      expect(distance(0, 0, 5, 12)).toBe(13); // 5-12-13 triangle
    });

    it('should work with negative coordinates', () => {
      expect(distance(-3, -4, 0, 0)).toBe(5);
      expect(distance(-5, -5, 5, 5)).toBeCloseTo(14.142, 2);
    });

    it('should be commutative', () => {
      expect(distance(1, 2, 5, 7)).toBe(distance(5, 7, 1, 2));
      expect(distance(-3, 4, 2, -1)).toBe(distance(2, -1, -3, 4));
    });

    it('should handle horizontal distance', () => {
      expect(distance(0, 5, 10, 5)).toBe(10);
      expect(distance(-5, 0, 5, 0)).toBe(10);
    });

    it('should handle vertical distance', () => {
      expect(distance(5, 0, 5, 10)).toBe(10);
      expect(distance(0, -5, 0, 5)).toBe(10);
    });

    it('should handle decimal coordinates', () => {
      expect(distance(0, 0, 1.5, 2)).toBeCloseTo(2.5, 5);
      expect(distance(0.5, 0.5, 1.5, 1.5)).toBeCloseTo(1.414, 2);
    });
  });

  describe('distanceSquared()', () => {
    it('should calculate squared distance between two points', () => {
      expect(distanceSquared(0, 0, 0, 0)).toBe(0);
      expect(distanceSquared(0, 0, 3, 4)).toBe(25); // 5^2 = 25
      expect(distanceSquared(0, 0, 5, 12)).toBe(169); // 13^2 = 169
    });

    it('should work with negative coordinates', () => {
      expect(distanceSquared(-3, -4, 0, 0)).toBe(25);
      expect(distanceSquared(-5, -5, 5, 5)).toBe(200); // sqrt(200) ≈ 14.142
    });

    it('should be faster than distance (no sqrt)', () => {
      // Just verify it returns correct value without sqrt
      expect(distanceSquared(0, 0, 10, 0)).toBe(100);
      expect(distanceSquared(0, 0, 0, 10)).toBe(100);
    });

    it('should be commutative', () => {
      expect(distanceSquared(1, 2, 5, 7)).toBe(distanceSquared(5, 7, 1, 2));
    });

    it('should match distance squared', () => {
      const d = distance(3, 4, 7, 8);
      const d2 = distanceSquared(3, 4, 7, 8);
      expect(d * d).toBeCloseTo(d2, 10);
    });
  });

  describe('length()', () => {
    it('should calculate vector length', () => {
      expect(length(0, 0)).toBe(0);
      expect(length(3, 4)).toBe(5);
      expect(length(5, 12)).toBe(13);
    });

    it('should work with negative components', () => {
      expect(length(-3, -4)).toBe(5);
      expect(length(-5, 12)).toBe(13);
    });

    it('should handle unit vectors', () => {
      expect(length(1, 0)).toBe(1);
      expect(length(0, 1)).toBe(1);
      expect(length(0.6, 0.8)).toBe(1);
    });

    it('should handle zero vectors', () => {
      expect(length(0, 0)).toBe(0);
    });

    it('should match Pythagorean theorem', () => {
      expect(length(3, 4)).toBe(Math.sqrt(3 * 3 + 4 * 4));
      expect(length(5, 12)).toBe(Math.sqrt(5 * 5 + 12 * 12));
    });
  });

  describe('lengthSquared()', () => {
    it('should calculate squared vector length', () => {
      expect(lengthSquared(0, 0)).toBe(0);
      expect(lengthSquared(3, 4)).toBe(25);
      expect(lengthSquared(5, 12)).toBe(169);
    });

    it('should work with negative components', () => {
      expect(lengthSquared(-3, -4)).toBe(25);
      expect(lengthSquared(-5, 12)).toBe(169);
    });

    it('should handle unit vectors', () => {
      expect(lengthSquared(1, 0)).toBe(1);
      expect(lengthSquared(0, 1)).toBe(1);
      expect(lengthSquared(0.6, 0.8)).toBe(1);
    });

    it('should match length squared', () => {
      const len = length(7, 24);
      const len2 = lengthSquared(7, 24);
      expect(len * len).toBeCloseTo(len2, 10);
    });
  });

  describe('normalize()', () => {
    it('should normalize vectors to length 1', () => {
      const result1 = normalize(3, 4);
      expect(length(result1.x, result1.y)).toBeCloseTo(1, 10);

      const result2 = normalize(5, 12);
      expect(length(result2.x, result2.y)).toBeCloseTo(1, 10);
    });

    it('should preserve direction', () => {
      const result = normalize(3, 4);
      expect(result.x).toBeCloseTo(0.6, 5);
      expect(result.y).toBeCloseTo(0.8, 5);
    });

    it('should work with negative vectors', () => {
      const result = normalize(-3, -4);
      expect(result.x).toBeCloseTo(-0.6, 5);
      expect(result.y).toBeCloseTo(-0.8, 5);
      expect(length(result.x, result.y)).toBeCloseTo(1, 10);
    });

    it('should handle zero vector', () => {
      const result = normalize(0, 0);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('should handle unit vectors', () => {
      const result1 = normalize(1, 0);
      expect(result1.x).toBeCloseTo(1, 10);
      expect(result1.y).toBeCloseTo(0, 10);

      const result2 = normalize(0, 1);
      expect(result2.x).toBeCloseTo(0, 10);
      expect(result2.y).toBeCloseTo(1, 10);
    });

    it('should handle already normalized vectors', () => {
      const result = normalize(0.6, 0.8);
      expect(result.x).toBeCloseTo(0.6, 10);
      expect(result.y).toBeCloseTo(0.8, 10);
    });
  });

  describe('dot()', () => {
    it('should calculate dot product', () => {
      expect(dot(1, 0, 0, 1)).toBe(0); // Perpendicular
      expect(dot(1, 0, 1, 0)).toBe(1); // Parallel
      expect(dot(3, 4, 5, 0)).toBe(15); // 3*5 + 4*0
    });

    it('should be commutative', () => {
      expect(dot(3, 4, 5, 6)).toBe(dot(5, 6, 3, 4));
      expect(dot(-2, 3, 4, -5)).toBe(dot(4, -5, -2, 3));
    });

    it('should return zero for perpendicular vectors', () => {
      expect(dot(1, 0, 0, 1)).toBe(0);
      expect(dot(2, 3, -3, 2)).toBe(0); // Perpendicular check: 2*(-3) + 3*2 = 0
    });

    it('should handle negative values', () => {
      expect(dot(-3, -4, 5, 6)).toBe(-39); // -3*5 + -4*6 = -15 + -24
      expect(dot(-1, 0, 1, 0)).toBe(-1);
    });

    it('should handle zero vectors', () => {
      expect(dot(0, 0, 5, 6)).toBe(0);
      expect(dot(3, 4, 0, 0)).toBe(0);
    });

    it('should work with unit vectors', () => {
      expect(dot(1, 0, 1, 0)).toBe(1);
      expect(dot(0, 1, 0, 1)).toBe(1);
      expect(dot(0.6, 0.8, 0.8, -0.6)).toBeCloseTo(0, 10); // Perpendicular
    });
  });

  describe('rotate()', () => {
    it('should rotate vector by angle', () => {
      // Rotate (1, 0) by 90 degrees (π/2) should give (0, 1)
      const result1 = rotate(1, 0, Math.PI / 2);
      expect(result1.x).toBeCloseTo(0, 10);
      expect(result1.y).toBeCloseTo(1, 10);

      // Rotate (1, 0) by 180 degrees (π) should give (-1, 0)
      const result2 = rotate(1, 0, Math.PI);
      expect(result2.x).toBeCloseTo(-1, 10);
      expect(result2.y).toBeCloseTo(0, 10);
    });

    it('should rotate by zero angle (no change)', () => {
      const result = rotate(3, 4, 0);
      expect(result.x).toBeCloseTo(3, 10);
      expect(result.y).toBeCloseTo(4, 10);
    });

    it('should rotate by full circle (360 degrees)', () => {
      const result = rotate(3, 4, Math.PI * 2);
      expect(result.x).toBeCloseTo(3, 10);
      expect(result.y).toBeCloseTo(4, 10);
    });

    it('should preserve vector length', () => {
      const original = { x: 3, y: 4 };
      const rotated = rotate(original.x, original.y, Math.PI / 4);
      const origLen = length(original.x, original.y);
      const rotLen = length(rotated.x, rotated.y);
      expect(rotLen).toBeCloseTo(origLen, 10);
    });

    it('should handle negative angles', () => {
      // Rotate (1, 0) by -90 degrees should give (0, -1)
      const result = rotate(1, 0, -Math.PI / 2);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(-1, 10);
    });

    it('should rotate zero vector', () => {
      const result = rotate(0, 0, Math.PI / 2);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(0, 10);
    });
  });

  describe('rotateAround()', () => {
    it('should rotate point around center', () => {
      // Rotate (2, 0) around (0, 0) by 90 degrees
      const result1 = rotateAround(2, 0, 0, 0, Math.PI / 2);
      expect(result1.x).toBeCloseTo(0, 10);
      expect(result1.y).toBeCloseTo(2, 10);

      // Rotate (2, 0) around (0, 0) by 180 degrees
      const result2 = rotateAround(2, 0, 0, 0, Math.PI);
      expect(result2.x).toBeCloseTo(-2, 10);
      expect(result2.y).toBeCloseTo(0, 10);
    });

    it('should not move point at center', () => {
      const result = rotateAround(5, 5, 5, 5, Math.PI / 2);
      expect(result.x).toBeCloseTo(5, 10);
      expect(result.y).toBeCloseTo(5, 10);
    });

    it('should rotate around non-origin center', () => {
      // Rotate (10, 5) around (5, 5) by 90 degrees
      // Point is 5 units to the right of center
      // After rotation: should be 5 units up from center
      const result = rotateAround(10, 5, 5, 5, Math.PI / 2);
      expect(result.x).toBeCloseTo(5, 10);
      expect(result.y).toBeCloseTo(10, 10);
    });

    it('should preserve distance from center', () => {
      const centerX = 10, centerY = 15;
      const pointX = 20, pointY = 25;
      const angle = Math.PI / 3;

      const origDist = distance(pointX, pointY, centerX, centerY);
      const rotated = rotateAround(pointX, pointY, centerX, centerY, angle);
      const rotDist = distance(rotated.x, rotated.y, centerX, centerY);

      expect(rotDist).toBeCloseTo(origDist, 10);
    });

    it('should handle zero angle', () => {
      const result = rotateAround(10, 5, 3, 2, 0);
      expect(result.x).toBeCloseTo(10, 10);
      expect(result.y).toBeCloseTo(5, 10);
    });

    it('should handle full circle', () => {
      const result = rotateAround(10, 5, 3, 2, Math.PI * 2);
      expect(result.x).toBeCloseTo(10, 10);
      expect(result.y).toBeCloseTo(5, 10);
    });

    it('should handle negative angles', () => {
      // Rotate counterclockwise by -90 degrees = clockwise by 90 degrees
      const result = rotateAround(5, 10, 5, 5, -Math.PI / 2);
      expect(result.x).toBeCloseTo(10, 10);
      expect(result.y).toBeCloseTo(5, 10);
    });

    it('should work with negative coordinates', () => {
      // Point (-5, -5) is at offset (+5, +5) from center (-10, -10)
      // Rotating (+5, +5) by 90 degrees gives (-5, +5)
      // Adding back center: (-10, -10) + (-5, +5) = (-15, -5)
      const result = rotateAround(-5, -5, -10, -10, Math.PI / 2);
      expect(result.x).toBeCloseTo(-15, 10);
      expect(result.y).toBeCloseTo(-5, 10);
    });
  });
});
