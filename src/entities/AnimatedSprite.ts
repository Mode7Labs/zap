import type { SpriteOptions } from '../types';
import { Sprite } from './Sprite';

export interface Animation {
  frames: number[];
  fps?: number;
  loop?: boolean;
}

export interface AnimatedSpriteOptions extends SpriteOptions {
  frameWidth: number;
  frameHeight: number;
  animations?: Record<string, Animation>;
}

/**
 * Animated sprite with frame-based animation
 */
export class AnimatedSprite extends Sprite {
  public frameWidth: number;
  public frameHeight: number;
  private animations: Map<string, Animation> = new Map();
  private currentAnimation: string | null = null;
  private currentFrame: number = 0;
  private frameTime: number = 0;
  private frameDuration: number = 100; // ms per frame
  private isPlaying: boolean = false;
  private loop: boolean = true;

  constructor(options: AnimatedSpriteOptions) {
    super(options);

    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;

    if (options.animations) {
      Object.entries(options.animations).forEach(([name, anim]) => {
        this.addAnimation(name, anim);
      });
    }
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
   * Update animation
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
   * Draw the current frame
   */
  protected draw(ctx: CanvasRenderingContext2D): void {
    if (!this.image || !this.currentAnimation) {
      super.draw(ctx);
      return;
    }

    const animation = this.animations.get(this.currentAnimation);
    if (!animation) {
      super.draw(ctx);
      return;
    }

    const frameIndex = animation.frames[this.currentFrame];
    const framesPerRow = Math.floor(this.image.width / this.frameWidth);
    const frameX = (frameIndex % framesPerRow) * this.frameWidth;
    const frameY = Math.floor(frameIndex / framesPerRow) * this.frameHeight;

    const offsetX = -this.width * this.anchorX;
    const offsetY = -this.height * this.anchorY;

    ctx.drawImage(
      this.image,
      frameX, frameY,
      this.frameWidth, this.frameHeight,
      offsetX, offsetY,
      this.width, this.height
    );
  }
}
