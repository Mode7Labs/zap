import type { TextOptions } from '../types';
import { Entity } from './Entity';
import { wrapText, calculateTextHeight } from '../utils/text';

/**
 * Text entity for rendering text
 */
export class Text extends Entity {
  public text: string;
  private _fontSize: number;
  private _fontFamily: string;
  public color: string;
  public align: 'left' | 'center' | 'right';
  public baseline: 'top' | 'middle' | 'bottom' | 'alphabetic';
  public maxWidth?: number;
  public lineHeight: number;

  // Font string cache
  private cachedFontString: string = '';
  private dimensionsCached: boolean = false;
  private wrappedLines: string[] = [];
  private wrappedLinesCached: boolean = false;

  constructor(options: TextOptions) {
    super(options);

    this.text = options.text;
    this._fontSize = options.fontSize ?? 16;
    this._fontFamily = options.fontFamily ?? 'Arial, sans-serif';
    this.color = options.color ?? '#ffffff';
    this.align = options.align ?? 'center';
    this.baseline = options.baseline ?? 'middle';
    this.maxWidth = options.maxWidth;
    this.lineHeight = options.lineHeight ?? 1.2;

    // Initialize cache
    this.cachedFontString = `${this._fontSize}px ${this._fontFamily}`;
  }

  /**
   * Get/set font size
   */
  get fontSize(): number {
    return this._fontSize;
  }

  set fontSize(value: number) {
    if (this._fontSize !== value) {
      this._fontSize = value;
      this.cachedFontString = `${this._fontSize}px ${this._fontFamily}`;
      this.wrappedLinesCached = false; // Invalidate wrap cache
    }
  }

  /**
   * Get/set font family
   */
  get fontFamily(): string {
    return this._fontFamily;
  }

  set fontFamily(value: string) {
    if (this._fontFamily !== value) {
      this._fontFamily = value;
      this.cachedFontString = `${this._fontSize}px ${this._fontFamily}`;
      this.wrappedLinesCached = false; // Invalidate wrap cache
    }
  }

  /**
   * Get font string (cached)
   */
  private getFontString(): string {
    return this.cachedFontString;
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
   * Get wrapped lines (cached)
   */
  private getWrappedLines(ctx: CanvasRenderingContext2D): string[] {
    if (!this.wrappedLinesCached && this.maxWidth) {
      this.wrappedLines = wrapText(this.text, this.maxWidth, ctx, this.getFontString());
      this.wrappedLinesCached = true;
    }
    return this.wrappedLines;
  }

  /**
   * Draw the text
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.getFontString();
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;

    // Handle wrapped text
    if (this.maxWidth) {
      const lines = this.getWrappedLines(ctx);
      const lineSpacing = this.fontSize * this.lineHeight;

      // Auto-measure dimensions for wrapped text
      if (!this.dimensionsCached && (this.width === 0 || this.height === 0)) {
        if (this.width === 0) this.width = this.maxWidth;
        if (this.height === 0) this.height = calculateTextHeight(lines, this.fontSize, this.lineHeight);
        this.dimensionsCached = true;
      }

      // Draw each line
      const startY = this.baseline === 'top' ? 0 : -(lines.length - 1) * lineSpacing / 2;

      for (let i = 0; i < lines.length; i++) {
        const y = startY + i * lineSpacing;
        ctx.fillText(lines[i], 0, y);
      }
    } else {
      // Single line text
      // Auto-measure dimensions on first render for hit detection (if not explicitly set)
      if (!this.dimensionsCached && (this.width === 0 || this.height === 0)) {
        const measured = this.measureText(ctx);
        if (this.width === 0) this.width = measured.width;
        if (this.height === 0) this.height = measured.height;
        this.dimensionsCached = true;
      }

      ctx.fillText(this.text, 0, 0);
    }
  }
}
