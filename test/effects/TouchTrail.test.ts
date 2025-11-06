import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TouchTrail } from '../../src/effects/TouchTrail';

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
    lineCap: 'butt' as CanvasLineCap,
    lineJoin: 'miter' as CanvasLineJoin,
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
  } as any as CanvasRenderingContext2D;
}

describe('TouchTrail', () => {
  describe('Constructor & Initialization', () => {
    it('should initialize with default values', () => {
      const trail = new TouchTrail();
      expect(trail).toBeDefined();
    });

    it('should initialize with custom color', () => {
      const trail = new TouchTrail({ color: '#ff0000' });
      trail.setColor('#00ff00'); // Test that we can change it
      expect(trail).toBeDefined();
    });

    it('should initialize with custom width', () => {
      const trail = new TouchTrail({ width: 5 });
      expect(trail).toBeDefined();
    });

    it('should initialize with custom fade time', () => {
      const trail = new TouchTrail({ fadeTime: 1000 });
      expect(trail).toBeDefined();
    });

    it('should initialize with custom max points', () => {
      const trail = new TouchTrail({ maxPoints: 100 });
      expect(trail).toBeDefined();
    });

    it('should initialize with all custom options', () => {
      const trail = new TouchTrail({
        color: '#0000ff',
        width: 10,
        fadeTime: 2000,
        maxPoints: 200
      });
      expect(trail).toBeDefined();
    });
  });

  describe('Adding Points', () => {
    let trail: TouchTrail;

    beforeEach(() => {
      trail = new TouchTrail({ maxPoints: 5 });
    });

    it('should add a point to the trail', () => {
      trail.addPoint(100, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // With only 1 point, should not render (needs at least 2)
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should add multiple points', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);
      trail.addPoint(300, 300);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // With 3 points, should render 2 line segments
      expect(ctx.stroke).toHaveBeenCalledTimes(2);
    });

    it('should enforce max points limit', () => {
      // Add more than maxPoints (5)
      for (let i = 0; i < 10; i++) {
        trail.addPoint(i * 10, i * 10);
      }

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Should only have 5 points = 4 line segments
      expect(ctx.stroke).toHaveBeenCalledTimes(4);
    });

    it('should not add points when disabled', () => {
      trail.disable();
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // No points added, so no rendering
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should add points again when re-enabled', () => {
      trail.disable();
      trail.addPoint(100, 100);

      trail.enable();
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Only the 2 points added after enable should render
      expect(ctx.stroke).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update & Aging', () => {
    let trail: TouchTrail;

    beforeEach(() => {
      trail = new TouchTrail({ fadeTime: 100 }); // 100ms fade time
    });

    it('should age points on update', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.update(0.05); // 50ms

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Points should still exist but be aged
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should remove expired points', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      // Age beyond fadeTime (100ms)
      trail.update(0.15); // 150ms

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // All points should be removed
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should handle incremental aging', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      // Age in increments
      trail.update(0.05); // 50ms
      trail.update(0.05); // 100ms total
      trail.update(0.05); // 150ms total - should remove all

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should handle zero delta time', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.update(0);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Points should still exist
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle negative delta time', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.update(-0.05);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Points should still exist (negative age is invalid but shouldn't crash)
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
    let trail: TouchTrail;
    let ctx: CanvasRenderingContext2D;

    beforeEach(() => {
      trail = new TouchTrail({ color: '#ff0000', width: 5 });
      ctx = createMockCanvasContext();
    });

    it('should not render with no points', () => {
      trail.render(ctx);
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should not render with only one point', () => {
      trail.addPoint(100, 100);
      trail.render(ctx);
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should render with two points', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalledTimes(1);
      expect(ctx.moveTo).toHaveBeenCalledWith(100, 100);
      expect(ctx.lineTo).toHaveBeenCalledWith(200, 200);
    });

    it('should apply color', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.render(ctx);

      expect(ctx.strokeStyle).toBe('#ff0000');
    });

    it('should apply line cap and join', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.render(ctx);

      expect(ctx.lineCap).toBe('round');
      expect(ctx.lineJoin).toBe('round');
    });

    it('should fade alpha over time', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      // Age halfway through fade time
      trail.update(0.25); // 250ms (fadeTime is default 500ms)

      trail.render(ctx);

      // Alpha should be applied (somewhere between 0 and 1)
      expect(ctx.globalAlpha).toBeGreaterThan(0);
      expect(ctx.globalAlpha).toBeLessThanOrEqual(1);
    });

    it('should save and restore context', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.render(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should reset global alpha after rendering', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.render(ctx);

      // Global alpha should be reset to 1
      expect(ctx.globalAlpha).toBe(1);
    });
  });

  describe('Clear Functionality', () => {
    let trail: TouchTrail;

    beforeEach(() => {
      trail = new TouchTrail();
    });

    it('should clear all points', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);
      trail.addPoint(300, 300);

      trail.clear();

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should allow adding points after clear', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.clear();

      trail.addPoint(300, 300);
      trail.addPoint(400, 400);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle clearing empty trail', () => {
      trail.clear();

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should handle multiple clears', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.clear();
      trail.clear();
      trail.clear();

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });
  });

  describe('Enable/Disable', () => {
    let trail: TouchTrail;

    beforeEach(() => {
      trail = new TouchTrail();
    });

    it('should be enabled by default', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should not add points when disabled', () => {
      trail.disable();
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should keep existing points when disabled', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.disable();

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Existing points should still render
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should add points again when re-enabled', () => {
      trail.disable();
      trail.enable();

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle multiple enable calls', () => {
      trail.enable();
      trail.enable();
      trail.enable();

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle multiple disable calls', () => {
      trail.disable();
      trail.disable();
      trail.disable();

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });
  });

  describe('Color Setting', () => {
    let trail: TouchTrail;

    beforeEach(() => {
      trail = new TouchTrail({ color: '#ffffff' });
    });

    it('should change color', () => {
      trail.setColor('#ff0000');

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.strokeStyle).toBe('#ff0000');
    });

    it('should apply new color to existing points', () => {
      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.setColor('#00ff00');

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.strokeStyle).toBe('#00ff00');
    });

    it('should handle multiple color changes', () => {
      trail.setColor('#ff0000');
      trail.setColor('#00ff00');
      trail.setColor('#0000ff');

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.strokeStyle).toBe('#0000ff');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero max points', () => {
      const trail = new TouchTrail({ maxPoints: 0 });

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // With maxPoints=0, no points should be kept
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should handle very small fade time', () => {
      const trail = new TouchTrail({ fadeTime: 1 });

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.update(0.002); // 2ms - should remove all

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should handle very large fade time', () => {
      const trail = new TouchTrail({ fadeTime: 10000 });

      trail.addPoint(100, 100);
      trail.addPoint(200, 200);

      trail.update(1); // 1 second

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Points should still exist
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle very large number of points', () => {
      const trail = new TouchTrail({ maxPoints: 1000 });

      for (let i = 0; i < 1000; i++) {
        trail.addPoint(i, i);
      }

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Should render 999 line segments
      expect(ctx.stroke).toHaveBeenCalledTimes(999);
    });

    it('should handle points at same position', () => {
      const trail = new TouchTrail();

      trail.addPoint(100, 100);
      trail.addPoint(100, 100);
      trail.addPoint(100, 100);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      // Should still render (even if lines are zero-length)
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle negative coordinates', () => {
      const trail = new TouchTrail();

      trail.addPoint(-100, -200);
      trail.addPoint(-300, -400);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(-100, -200);
      expect(ctx.lineTo).toHaveBeenCalledWith(-300, -400);
    });

    it('should handle very large coordinates', () => {
      const trail = new TouchTrail();

      trail.addPoint(10000, 20000);
      trail.addPoint(30000, 40000);

      const ctx = createMockCanvasContext();
      trail.render(ctx);

      expect(ctx.stroke).toHaveBeenCalled();
    });
  });
});
