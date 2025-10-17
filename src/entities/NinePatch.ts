import type { SpriteOptions } from '../types';
import { Sprite } from './Sprite';

export interface NinePatchOptions extends SpriteOptions {
  corners: number; // Size of corner patches
}

/**
 * Nine-patch sprite for scalable UI elements
 */
export class NinePatch extends Sprite {
  public corners: number;

  constructor(options: NinePatchOptions) {
    super(options);
    this.corners = options.corners;
  }

  /**
   * Draw nine-patch
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    if (!this.image) {
      super.draw(ctx);
      return;
    }

    const offsetX = -this.width * this.anchorX;
    const offsetY = -this.height * this.anchorY;
    const c = this.corners;
    const iw = this.image.width;
    const ih = this.image.height;
    const w = this.width;
    const h = this.height;

    // Top-left
    ctx.drawImage(this.image, 0, 0, c, c, offsetX, offsetY, c, c);

    // Top-right
    ctx.drawImage(this.image, iw - c, 0, c, c, offsetX + w - c, offsetY, c, c);

    // Bottom-left
    ctx.drawImage(this.image, 0, ih - c, c, c, offsetX, offsetY + h - c, c, c);

    // Bottom-right
    ctx.drawImage(this.image, iw - c, ih - c, c, c, offsetX + w - c, offsetY + h - c, c, c);

    // Top edge
    ctx.drawImage(this.image, c, 0, iw - c * 2, c, offsetX + c, offsetY, w - c * 2, c);

    // Bottom edge
    ctx.drawImage(this.image, c, ih - c, iw - c * 2, c, offsetX + c, offsetY + h - c, w - c * 2, c);

    // Left edge
    ctx.drawImage(this.image, 0, c, c, ih - c * 2, offsetX, offsetY + c, c, h - c * 2);

    // Right edge
    ctx.drawImage(this.image, iw - c, c, c, ih - c * 2, offsetX + w - c, offsetY + c, c, h - c * 2);

    // Center
    ctx.drawImage(
      this.image,
      c, c, iw - c * 2, ih - c * 2,
      offsetX + c, offsetY + c, w - c * 2, h - c * 2
    );
  }
}
