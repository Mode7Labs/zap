import type { TextOptions } from '../types';
import { Entity } from './Entity';

/**
 * Text entity for rendering text
 */
export class Text extends Entity {
  public text: string;
  public fontSize: number;
  public fontFamily: string;
  public color: string;
  public align: 'left' | 'center' | 'right';
  public baseline: 'top' | 'middle' | 'bottom' | 'alphabetic';

  constructor(options: TextOptions) {
    super(options);

    this.text = options.text;
    this.fontSize = options.fontSize ?? 16;
    this.fontFamily = options.fontFamily ?? 'Arial, sans-serif';
    this.color = options.color ?? '#ffffff';
    this.align = options.align ?? 'center';
    this.baseline = options.baseline ?? 'middle';
  }

  /**
   * Get font string
   */
  private getFontString(): string {
    return `${this.fontSize}px ${this.fontFamily}`;
  }

  /**
   * Measure text dimensions
   */
  measureText(ctx: CanvasRenderingContext2D): { width: number; height: number } {
    ctx.save();
    ctx.font = this.getFontString();
    const metrics = ctx.measureText(this.text);
    ctx.restore();

    return {
      width: metrics.width,
      height: this.fontSize, // Approximate height
    };
  }

  /**
   * Draw the text
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.getFontString();
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;

    // Text alignment handles positioning, no offset needed
    ctx.fillText(this.text, 0, 0);
  }
}
