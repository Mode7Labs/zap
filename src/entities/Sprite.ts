import type { SpriteOptions, Animation } from '../types';
import { Entity } from './Entity';

/**
 * Sprite entity for rendering images, colored rectangles, and sprite sheet animations
 */
export class Sprite extends Entity {
  public color: string | null = null;
  public image: HTMLImageElement | null = null;
  public radius: number = 0;

  // Animation support (optional)
  public frameWidth?: number;
  public frameHeight?: number;
  private animations: Map<string, Animation> = new Map();
  private currentAnimation: string | null = null;
  private currentFrame: number = 0;
  private frameTime: number = 0;
  private frameDuration: number = 100; // ms per frame
  private isPlaying: boolean = false;
  private loop: boolean = true;

  constructor(options: SpriteOptions = {}) {
    super(options);

    this.color = options.color ?? null;
    this.radius = options.radius ?? 0;

    // Animation setup (optional)
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;

    if (options.animations) {
      Object.entries(options.animations).forEach(([name, anim]) => {
        this.addAnimation(name, anim);
      });
    }

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
   * Add an animation
   */
  addAnimation(name: string, animation: Animation): void {
    this.animations.set(name, animation);
  }

  /**
   * Play an animation
   */
  play(name: string, options: { fps?: number; loop?: boolean } = {}): void {
    const animation = this.animations.get(name);
    if (!animation) {
      console.warn(`Animation "${name}" not found`);
      return;
    }

    this.currentAnimation = name;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.isPlaying = true;
    this.loop = options.loop ?? animation.loop ?? true;

    const fps = options.fps ?? animation.fps ?? 10;
    this.frameDuration = 1000 / fps;
  }

  /**
   * Stop animation
   */
  stop(): void {
    this.isPlaying = false;
  }

  /**
   * Pause animation
   */
  pause(): void {
    this.isPlaying = false;
  }

  /**
   * Resume animation
   */
  resume(): void {
    this.isPlaying = true;
  }

  /**
   * Update animation (called by scene)
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    if (!this.isPlaying || !this.currentAnimation) return;

    const animation = this.animations.get(this.currentAnimation);
    if (!animation) return;

    this.frameTime += deltaTime * 1000;

    if (this.frameTime >= this.frameDuration) {
      this.frameTime -= this.frameDuration;
      this.currentFrame++;

      if (this.currentFrame >= animation.frames.length) {
        if (this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = animation.frames.length - 1;
          this.isPlaying = false;
          this.emit('animationcomplete', this.currentAnimation);
        }
      }
    }
  }

  /**
   * Draw the sprite
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    const offsetX = -this.width * this.anchorX;
    const offsetY = -this.height * this.anchorY;
    const circleRadius = this.getCircleRadius();

    if (this.image) {
      // If frameWidth/frameHeight are defined, this is a sprite sheet
      // Only render if an animation is active
      if (this.frameWidth && this.frameHeight) {
        if (!this.currentAnimation) {
          // Don't render anything if no animation is playing yet
          return;
        }

        const animation = this.animations.get(this.currentAnimation);
        if (animation) {
          const frameIndex = animation.frames[this.currentFrame];
          const framesPerRow = Math.floor(this.image.width / this.frameWidth);
          const frameX = (frameIndex % framesPerRow) * this.frameWidth;
          const frameY = Math.floor(frameIndex / framesPerRow) * this.frameHeight;

          this.drawImageWithOptionalRadius(
            ctx,
            () => ctx.drawImage(
              this.image as HTMLImageElement,
              frameX, frameY,
              this.frameWidth as number, this.frameHeight as number,
              offsetX, offsetY,
              this.width, this.height
            ),
            offsetX,
            offsetY,
            circleRadius
          );
        }
        // Don't fall through - sprite sheets should only render via animations
        return;
      }

      // Draw full image (for non-animated sprites only)
      this.drawImageWithOptionalRadius(
        ctx,
        () => ctx.drawImage(this.image as HTMLImageElement, offsetX, offsetY, this.width, this.height),
        offsetX,
        offsetY,
        circleRadius
      );
    } else if (this.color) {
      ctx.fillStyle = this.color;

      if (this.radius > 0) {
        if (circleRadius !== null) {
          const circleCenterX = offsetX + this.width / 2;
          const circleCenterY = offsetY + this.height / 2;
          this.drawCircle(ctx, circleCenterX, circleCenterY, circleRadius);
        } else {
          // Draw rounded rectangle
          this.drawRoundedRect(ctx, offsetX, offsetY, this.width, this.height, this.radius);
        }
      } else {
        // Draw rectangle
        ctx.fillRect(offsetX, offsetY, this.width, this.height);
      }
    }
  }

  /**
   * Determine if the sprite should render as a perfect circle and return the circle radius.
   */
  private getCircleRadius(): number | null {
    if (this.radius <= 0 || this.width <= 0 || this.height <= 0) {
      return null;
    }

    const minDimension = Math.min(this.width, this.height);
    const sizeTolerance = Math.max(1, minDimension * 0.01);

    if (Math.abs(this.width - this.height) > sizeTolerance) {
      return null;
    }

    const requiredRadius = minDimension / 2;
    if (this.radius + sizeTolerance < requiredRadius) {
      return null;
    }

    return requiredRadius;
  }

  /**
   * Draw a filled circle (used when we need a perfect circle).
   */
  private drawCircle(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ): void {
    this.createCirclePath(ctx, centerX, centerY, radius);
    ctx.fill();
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
    this.createRoundedRectPath(ctx, x, y, width, height, radius);
    ctx.fill();
  }

  private drawImageWithOptionalRadius(
    ctx: CanvasRenderingContext2D,
    drawFn: () => void,
    offsetX: number,
    offsetY: number,
    circleRadius: number | null
  ): void {
    if (this.radius > 0) {
      ctx.save();
      const circleCenterX = offsetX + this.width / 2;
      const circleCenterY = offsetY + this.height / 2;
      if (circleRadius !== null) {
        this.createCirclePath(ctx, circleCenterX, circleCenterY, circleRadius);
      } else {
        // Draw rounded rectangle
        this.createRoundedRectPath(ctx, offsetX, offsetY, this.width, this.height, this.radius);
      }
      ctx.clip();
      drawFn();
      ctx.restore();
      return;
    }

    drawFn();
  }

  private createCirclePath(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
  }

  private createRoundedRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    const clampedRadius = Math.max(0, Math.min(radius, Math.min(width, height) / 2));

    ctx.beginPath();
    ctx.moveTo(x + clampedRadius, y);
    ctx.lineTo(x + width - clampedRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + clampedRadius);
    ctx.lineTo(x + width, y + height - clampedRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - clampedRadius, y + height);
    ctx.lineTo(x + clampedRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - clampedRadius);
    ctx.lineTo(x, y + clampedRadius);
    ctx.quadraticCurveTo(x, y, x + clampedRadius, y);
    ctx.closePath();
  }
}
