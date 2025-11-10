import { describe, it, expect, beforeEach } from 'vitest';
import { wrapText, measureText, truncateText, calculateTextHeight } from '../../src/utils/text';

describe('Text Utilities', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')!;
  });

  describe('wrapText', () => {
    it('should wrap text to fit within max width', () => {
      const text = 'This is a long piece of text that needs to be wrapped';
      const lines = wrapText(text, 200, ctx, '16px Arial');

      expect(lines.length).toBeGreaterThan(1);
      expect(lines.every(line => line.length > 0)).toBe(true);
    });

    it('should handle text that fits on one line', () => {
      const text = 'Short';
      const lines = wrapText(text, 1000, ctx, '16px Arial');

      expect(lines).toEqual(['Short']);
    });

    it('should handle empty text', () => {
      const lines = wrapText('', 200, ctx, '16px Arial');

      expect(lines).toEqual([]);
    });

    it('should preserve paragraph breaks', () => {
      const text = 'First paragraph\nSecond paragraph';
      const lines = wrapText(text, 1000, ctx, '16px Arial');

      expect(lines.length).toBe(2);
      expect(lines[0]).toBe('First paragraph');
      expect(lines[1]).toBe('Second paragraph');
    });

    it('should handle single long word', () => {
      const text = 'Supercalifragilisticexpialidocious';
      const lines = wrapText(text, 50, ctx, '16px Arial');

      expect(lines.length).toBe(1);
      expect(lines[0]).toBe(text);
    });

    it('should handle multiple spaces between words', () => {
      const text = 'Word1    Word2    Word3';
      const lines = wrapText(text, 1000, ctx, '16px Arial');

      expect(lines.length).toBeGreaterThan(0);
    });
  });

  describe('measureText', () => {
    it('should measure text width and height', () => {
      const { width, height } = measureText('Hello World', ctx, '16px Arial');

      expect(width).toBeGreaterThan(0);
      expect(height).toBe(16);
    });

    it('should handle empty text', () => {
      const { width, height } = measureText('', ctx, '16px Arial');

      expect(width).toBe(0);
      expect(height).toBe(16);
    });

    it('should extract font size from font string', () => {
      const { height: h1 } = measureText('Test', ctx, '24px Arial');
      const { height: h2 } = measureText('Test', ctx, '48px Arial');

      expect(h1).toBe(24);
      expect(h2).toBe(48);
    });

    it('should handle font string without size', () => {
      const { height } = measureText('Test', ctx, 'Arial');

      expect(height).toBe(16); // Default fallback
    });
  });

  describe('truncateText', () => {
    it('should truncate text that exceeds max width', () => {
      const text = 'This is a very long text that will be truncated';
      const truncated = truncateText(text, 100, ctx, '16px Arial');

      expect(truncated).not.toBe(text);
      expect(truncated.endsWith('...')).toBe(true);
      expect(truncated.length).toBeLessThan(text.length);
    });

    it('should not truncate text that fits', () => {
      const text = 'Short';
      const truncated = truncateText(text, 1000, ctx, '16px Arial');

      expect(truncated).toBe(text);
    });

    it('should use custom ellipsis', () => {
      const text = 'This is a very long text that will be truncated';
      const truncated = truncateText(text, 100, ctx, '16px Arial', '…');

      expect(truncated.endsWith('…')).toBe(true);
    });

    it('should handle empty text', () => {
      const truncated = truncateText('', 100, ctx, '16px Arial');

      expect(truncated).toBe('');
    });

    it('should handle very small max width', () => {
      const text = 'Text';
      const truncated = truncateText(text, 5, ctx, '16px Arial');

      expect(truncated).toBe('...');
    });
  });

  describe('calculateTextHeight', () => {
    it('should calculate height for single line', () => {
      const lines = ['Single line'];
      const height = calculateTextHeight(lines, 16);

      expect(height).toBe(16 * 1.2); // Default line height 1.2
    });

    it('should calculate height for multiple lines', () => {
      const lines = ['Line 1', 'Line 2', 'Line 3'];
      const height = calculateTextHeight(lines, 16);

      expect(height).toBe(3 * 16 * 1.2);
    });

    it('should use custom line height', () => {
      const lines = ['Line 1', 'Line 2'];
      const height = calculateTextHeight(lines, 16, 1.5);

      expect(height).toBe(2 * 16 * 1.5);
    });

    it('should handle empty lines array', () => {
      const height = calculateTextHeight([], 16);

      expect(height).toBe(0);
    });

    it('should handle different font sizes', () => {
      const lines = ['Line 1', 'Line 2'];
      const h1 = calculateTextHeight(lines, 16, 1.2);
      const h2 = calculateTextHeight(lines, 32, 1.2);

      expect(h2).toBe(h1 * 2);
    });
  });
});
