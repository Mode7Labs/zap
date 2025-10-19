import type { TextOptions } from '../types';
import { Entity } from './Entity';

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

  // Font string cache
  private cachedFontString: string = '';
  private dimensionsCached: boolean = false;

  constructor(options: TextOptions) {
    super(options);

    this.text = options.text;
    this._fontSize = options.fontSize ?? 16;
    this._fontFamily = options.fontFamily ?? 'Arial, sans-serif';
    this.color = options.color ?? '#ffffff';
    this.align = options.align ?? 'center';
    this.baseline = options.baseline ?? 'middle';

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
   * Draw the text
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    // Auto-measure dimensions on first render for hit detection (if not explicitly set)
    if (!this.dimensionsCached && (this.width === 0 || this.height === 0)) {
      const measured = this.measureText(ctx);
      if (this.width === 0) this.width = measured.width;
      if (this.height === 0) this.height = measured.height;
      this.dimensionsCached = true;
    }

    ctx.font = this.getFontString();
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;

    // Text alignment handles positioning, no offset needed
    ctx.fillText(this.text, 0, 0);
  }
}
