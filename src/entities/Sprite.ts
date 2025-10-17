import type { SpriteOptions } from '../types';
import { Entity } from './Entity';

/**
 * Sprite entity for rendering images or colored rectangles
 */
export class Sprite extends Entity {
  public color: string | null = null;
  public image: HTMLImageElement | null = null;
  public radius: number = 0;

  constructor(options: SpriteOptions = {}) {
    super(options);

    this.color = options.color ?? null;
    this.radius = options.radius ?? 0;

    if (options.image) {
      if (typeof options.image === 'string') {
        this.loadImage(options.image);
      } else {
        this.image = options.image;
      }
    }
  }

  /**
   * Load an image from URL
   */
  async loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        if (!this.width) this.width = img.width;
        if (!this.height) this.height = img.height;
        this.emit('imageload', img);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Draw the sprite
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    const offsetX = -this.width * this.anchorX;
    const offsetY = -this.height * this.anchorY;

    if (this.image) {
      // Draw image
      ctx.drawImage(this.image, offsetX, offsetY, this.width, this.height);
    } else if (this.color) {
      ctx.fillStyle = this.color;

      if (this.radius > 0) {
        // Draw rounded rectangle
        this.drawRoundedRect(ctx, offsetX, offsetY, this.width, this.height, this.radius);
      } else {
        // Draw rectangle
        ctx.fillRect(offsetX, offsetY, this.width, this.height);
      }
    }
  }

  /**
   * Draw a rounded rectangle
   */
  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }
}
