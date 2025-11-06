import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Text } from '../../src/entities/Text';

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
    measureText: vi.fn(() => ({ width: 100 })),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
  } as any as CanvasRenderingContext2D;
}

describe('Text', () => {
  describe('Constructor & Initialization', () => {
    it('should initialize with required text parameter', () => {
      const text = new Text({ text: 'Hello World' });
      expect(text.text).toBe('Hello World');
    });

    it('should initialize with default values', () => {
      const text = new Text({ text: 'Test' });
      expect(text.fontSize).toBe(16);
      expect(text.fontFamily).toBe('Arial, sans-serif');
      expect(text.color).toBe('#ffffff');
      expect(text.align).toBe('center');
      expect(text.baseline).toBe('middle');
    });

    it('should initialize with custom font size', () => {
      const text = new Text({ text: 'Test', fontSize: 24 });
      expect(text.fontSize).toBe(24);
    });

    it('should initialize with custom font family', () => {
      const text = new Text({ text: 'Test', fontFamily: 'Courier' });
      expect(text.fontFamily).toBe('Courier');
    });

    it('should initialize with custom color', () => {
      const text = new Text({ text: 'Test', color: '#ff0000' });
      expect(text.color).toBe('#ff0000');
    });

    it('should initialize with custom alignment', () => {
      const text = new Text({ text: 'Test', align: 'left' });
      expect(text.align).toBe('left');
    });

    it('should initialize with custom baseline', () => {
      const text = new Text({ text: 'Test', baseline: 'top' });
      expect(text.baseline).toBe('top');
    });

    it('should inherit Entity properties', () => {
      const text = new Text({
        text: 'Test',
        x: 100,
        y: 200,
        rotation: Math.PI / 4,
        alpha: 0.5
      });
      expect(text.x).toBe(100);
      expect(text.y).toBe(200);
      expect(text.rotation).toBe(Math.PI / 4);
      expect(text.alpha).toBe(0.5);
    });
  });

  describe('Font Size Property', () => {
    it('should get font size', () => {
      const text = new Text({ text: 'Test', fontSize: 20 });
      expect(text.fontSize).toBe(20);
    });

    it('should set font size', () => {
      const text = new Text({ text: 'Test' });
      text.fontSize = 32;
      expect(text.fontSize).toBe(32);
    });

    it('should update font size multiple times', () => {
      const text = new Text({ text: 'Test' });
      text.fontSize = 24;
      expect(text.fontSize).toBe(24);
      text.fontSize = 48;
      expect(text.fontSize).toBe(48);
    });
  });

  describe('Font Family Property', () => {
    it('should get font family', () => {
      const text = new Text({ text: 'Test', fontFamily: 'Times' });
      expect(text.fontFamily).toBe('Times');
    });

    it('should set font family', () => {
      const text = new Text({ text: 'Test' });
      text.fontFamily = 'Helvetica';
      expect(text.fontFamily).toBe('Helvetica');
    });

    it('should update font family multiple times', () => {
      const text = new Text({ text: 'Test' });
      text.fontFamily = 'Georgia';
      expect(text.fontFamily).toBe('Georgia');
      text.fontFamily = 'Verdana';
      expect(text.fontFamily).toBe('Verdana');
    });
  });

  describe('Text Measurement', () => {
    it('should measure text width and height', () => {
      const text = new Text({ text: 'Test', fontSize: 20 });
      const ctx = createMockCanvasContext();

      const dimensions = text.measureText(ctx);

      expect(dimensions.width).toBe(100); // Mock returns 100
      expect(dimensions.height).toBe(20); // Should be fontSize
      expect(ctx.measureText).toHaveBeenCalledWith('Test');
    });

    it('should use correct font when measuring', () => {
      const text = new Text({
        text: 'Test',
        fontSize: 24,
        fontFamily: 'Courier'
      });
      const ctx = createMockCanvasContext();

      text.measureText(ctx);

      expect(ctx.font).toBe('24px Courier');
    });

    it('should save and restore context when measuring', () => {
      const text = new Text({ text: 'Test' });
      const ctx = createMockCanvasContext();

      text.measureText(ctx);

      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });
  });

  describe('Alignment Options', () => {
    it('should support left alignment', () => {
      const text = new Text({ text: 'Test', align: 'left' });
      expect(text.align).toBe('left');
    });

    it('should support center alignment', () => {
      const text = new Text({ text: 'Test', align: 'center' });
      expect(text.align).toBe('center');
    });

    it('should support right alignment', () => {
      const text = new Text({ text: 'Test', align: 'right' });
      expect(text.align).toBe('right');
    });
  });

  describe('Baseline Options', () => {
    it('should support top baseline', () => {
      const text = new Text({ text: 'Test', baseline: 'top' });
      expect(text.baseline).toBe('top');
    });

    it('should support middle baseline', () => {
      const text = new Text({ text: 'Test', baseline: 'middle' });
      expect(text.baseline).toBe('middle');
    });

    it('should support bottom baseline', () => {
      const text = new Text({ text: 'Test', baseline: 'bottom' });
      expect(text.baseline).toBe('bottom');
    });

    it('should support alphabetic baseline', () => {
      const text = new Text({ text: 'Test', baseline: 'alphabetic' });
      expect(text.baseline).toBe('alphabetic');
    });
  });

  describe('Rendering', () => {
    it('should render text at position', () => {
      const text = new Text({ text: 'Hello', x: 100, y: 200 });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(ctx.fillText).toHaveBeenCalledWith('Hello', 0, 0);
    });

    it('should apply font settings', () => {
      const text = new Text({
        text: 'Test',
        fontSize: 24,
        fontFamily: 'Courier'
      });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(ctx.font).toBe('24px Courier');
    });

    it('should apply color', () => {
      const text = new Text({ text: 'Test', color: '#ff0000' });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(ctx.fillStyle).toBe('#ff0000');
    });

    it('should apply text alignment', () => {
      const text = new Text({ text: 'Test', align: 'right' });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(ctx.textAlign).toBe('right');
    });

    it('should apply text baseline', () => {
      const text = new Text({ text: 'Test', baseline: 'top' });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(ctx.textBaseline).toBe('top');
    });
  });

  describe('Auto Dimension Measurement', () => {
    it('should auto-measure width on first render when width is 0', () => {
      const text = new Text({ text: 'Test', width: 0 });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(text.width).toBe(100); // Mock measureText returns 100
    });

    it('should auto-measure height on first render when height is 0', () => {
      const text = new Text({ text: 'Test', fontSize: 20, height: 0 });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(text.height).toBe(20); // Should match fontSize
    });

    it('should not override explicit width', () => {
      const text = new Text({ text: 'Test', width: 50 });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(text.width).toBe(50); // Should remain 50
    });

    it('should not override explicit height', () => {
      const text = new Text({ text: 'Test', height: 30 });
      const ctx = createMockCanvasContext();

      text.render(ctx);

      expect(text.height).toBe(30); // Should remain 30
    });

    it('should only measure dimensions once', () => {
      const text = new Text({ text: 'Test', width: 0, height: 0 });
      const ctx = createMockCanvasContext();

      text.render(ctx);
      const width1 = text.width;
      const height1 = text.height;

      text.render(ctx);
      const width2 = text.width;
      const height2 = text.height;

      expect(width1).toBe(width2);
      expect(height1).toBe(height2);
      // measureText should be called twice: once in measureText(), once in draw()
      // But dimensions should be cached after first render
    });
  });

  describe('Text Content', () => {
    it('should update text content', () => {
      const text = new Text({ text: 'Initial' });
      expect(text.text).toBe('Initial');

      text.text = 'Updated';
      expect(text.text).toBe('Updated');
    });

    it('should render updated text', () => {
      const text = new Text({ text: 'Initial' });
      const ctx = createMockCanvasContext();

      text.text = 'Updated';
      text.render(ctx);

      expect(ctx.fillText).toHaveBeenCalledWith('Updated', 0, 0);
    });
  });

  describe('Color Property', () => {
    it('should update color', () => {
      const text = new Text({ text: 'Test', color: '#ffffff' });
      expect(text.color).toBe('#ffffff');

      text.color = '#000000';
      expect(text.color).toBe('#000000');
    });

    it('should render with updated color', () => {
      const text = new Text({ text: 'Test' });
      text.color = '#0000ff';

      const ctx = createMockCanvasContext();
      text.render(ctx);

      expect(ctx.fillStyle).toBe('#0000ff');
    });
  });

  describe('Integration with Entity', () => {
    it('should support physics properties', () => {
      const text = new Text({
        text: 'Test',
        vx: 50,
        vy: 100
      });

      text.update(1);

      expect(text.x).toBeCloseTo(50, 1);
      expect(text.y).toBeCloseTo(100, 1);
    });

    it('should support tweening', () => {
      const text = new Text({ text: 'Test', x: 0, y: 0 });
      const tween = text.tween({ x: 100, y: 100 }, { duration: 1000 });
      expect(tween).toBeDefined();
    });

    it('should support interactivity', () => {
      const text = new Text({
        text: 'Click Me',
        interactive: true,
        width: 100,
        height: 50
      });
      expect(text.interactive).toBe(true);
    });

    it('should support tags', () => {
      const text = new Text({ text: 'Test' });
      text.addTag('ui');
      text.addTag('label');

      expect(text.hasTag('ui')).toBe(true);
      expect(text.hasTag('label')).toBe(true);
    });

    it('should support visibility', () => {
      const text = new Text({ text: 'Test', visible: false });
      expect(text.visible).toBe(false);
    });

    it('should support alpha transparency', () => {
      const text = new Text({ text: 'Test', alpha: 0.5 });
      expect(text.alpha).toBe(0.5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const text = new Text({ text: '' });
      expect(text.text).toBe('');

      const ctx = createMockCanvasContext();
      text.render(ctx);

      expect(ctx.fillText).toHaveBeenCalledWith('', 0, 0);
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      const text = new Text({ text: longText });
      expect(text.text).toBe(longText);
    });

    it('should handle special characters', () => {
      const text = new Text({ text: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`' });
      expect(text.text).toBe('!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`');
    });

    it('should handle unicode characters', () => {
      const text = new Text({ text: '你好世界 🌍 مرحبا' });
      expect(text.text).toBe('你好世界 🌍 مرحبا');
    });

    it('should handle newlines in text', () => {
      const text = new Text({ text: 'Line 1\nLine 2\nLine 3' });
      expect(text.text).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should handle very small font size', () => {
      const text = new Text({ text: 'Test', fontSize: 1 });
      expect(text.fontSize).toBe(1);
    });

    it('should handle very large font size', () => {
      const text = new Text({ text: 'Test', fontSize: 500 });
      expect(text.fontSize).toBe(500);
    });

    it('should handle same fontSize setting (no cache update)', () => {
      const text = new Text({ text: 'Test', fontSize: 20 });
      const initialFontSize = text.fontSize;

      text.fontSize = 20; // Same value
      expect(text.fontSize).toBe(initialFontSize);
    });

    it('should handle same fontFamily setting (no cache update)', () => {
      const text = new Text({ text: 'Test', fontFamily: 'Arial' });
      const initialFontFamily = text.fontFamily;

      text.fontFamily = 'Arial'; // Same value
      expect(text.fontFamily).toBe(initialFontFamily);
    });
  });
});
