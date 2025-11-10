/**
 * Text utilities for measuring and wrapping text
 */

/**
 * Wrap text to fit within a maximum width
 *
 * @param text - The text to wrap
 * @param maxWidth - Maximum width in pixels
 * @param ctx - Canvas rendering context (for text measurement)
 * @param font - Font string (e.g., "16px Arial")
 * @returns Array of text lines
 *
 * @example
 * const ctx = canvas.getContext('2d');
 * const lines = wrapText(
 *   'This is a long piece of text that needs to be wrapped',
 *   300,
 *   ctx,
 *   '16px Arial'
 * );
 * // lines = ['This is a long piece', 'of text that needs', 'to be wrapped']
 */
export function wrapText(
  text: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D,
  font: string
): string[] {
  ctx.save();
  ctx.font = font;

  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        // Line is too long, push current line and start new one
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    // Push remaining text
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  ctx.restore();
  return lines;
}

/**
 * Measure text dimensions
 *
 * @param text - The text to measure
 * @param ctx - Canvas rendering context
 * @param font - Font string (e.g., "16px Arial")
 * @returns Width and height in pixels
 *
 * @example
 * const ctx = canvas.getContext('2d');
 * const { width, height } = measureText('Hello World', ctx, '24px Arial');
 */
export function measureText(
  text: string,
  ctx: CanvasRenderingContext2D,
  font: string
): { width: number; height: number } {
  ctx.save();
  ctx.font = font;
  const metrics = ctx.measureText(text);
  ctx.restore();

  // Extract font size from font string for height estimation
  const fontSize = parseInt(font.match(/(\d+)px/)?.[1] || '16');

  return {
    width: metrics.width,
    height: fontSize,
  };
}

/**
 * Truncate text with ellipsis if it exceeds maxWidth
 *
 * @param text - The text to truncate
 * @param maxWidth - Maximum width in pixels
 * @param ctx - Canvas rendering context
 * @param font - Font string (e.g., "16px Arial")
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * const ctx = canvas.getContext('2d');
 * const truncated = truncateText(
 *   'This is a very long text',
 *   100,
 *   ctx,
 *   '16px Arial'
 * );
 * // truncated = 'This is a...'
 */
export function truncateText(
  text: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D,
  font: string,
  ellipsis: string = '...'
): string {
  ctx.save();
  ctx.font = font;

  const metrics = ctx.measureText(text);
  if (metrics.width <= maxWidth) {
    ctx.restore();
    return text;
  }

  // Binary search for the longest substring that fits
  let low = 0;
  let high = text.length;
  let result = '';

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const testText = text.substring(0, mid) + ellipsis;
    const testMetrics = ctx.measureText(testText);

    if (testMetrics.width <= maxWidth) {
      result = testText;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  ctx.restore();
  return result || ellipsis;
}

/**
 * Calculate total height of wrapped text
 *
 * @param lines - Array of text lines
 * @param fontSize - Font size in pixels
 * @param lineHeight - Line height multiplier (default: 1.2)
 * @returns Total height in pixels
 *
 * @example
 * const lines = wrapText('Long text...', 300, ctx, '16px Arial');
 * const height = calculateTextHeight(lines, 16, 1.5);
 */
export function calculateTextHeight(
  lines: string[],
  fontSize: number,
  lineHeight: number = 1.2
): number {
  return lines.length * fontSize * lineHeight;
}
