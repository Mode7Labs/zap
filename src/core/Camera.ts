import type { Entity } from '../entities/Entity';
import type { Point } from '../types';

/**
 * Camera for viewport control and effects
 */
export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1;
  public rotation: number = 0;

  private following: Entity | null = null;
  private followOffset: Point = { x: 0, y: 0 };
  private followSpeed: number = 1;

  // Screen shake
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeElapsed: number = 0;
  private shakeOffset: Point = { x: 0, y: 0 };

  constructor(public width: number, public height: number) {}

  /**
   * Follow an entity
   */
  follow(entity: Entity, offset: Point = { x: 0, y: 0 }, speed: number = 1): void {
    this.following = entity;
    this.followOffset = offset;
    this.followSpeed = speed;
  }

  /**
   * Stop following
   */
  stopFollow(): void {
    this.following = null;
  }

  /**
   * Set camera position
   */
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Set camera zoom
   */
  setZoom(zoom: number): void {
    this.zoom = Math.max(0.1, zoom);
  }

  /**
   * Screen shake effect
   */
  shake(intensity: number = 10, duration: number = 300): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeElapsed = 0;
  }

  /**
   * Update camera
   */
  update(deltaTime: number): void {
    // Update following
    if (this.following) {
      const targetX = this.following.x + this.followOffset.x - this.width / 2;
      const targetY = this.following.y + this.followOffset.y - this.height / 2;

      this.x += (targetX - this.x) * this.followSpeed * deltaTime * 10;
      this.y += (targetY - this.y) * this.followSpeed * deltaTime * 10;
    }

    // Update shake
    if (this.shakeElapsed < this.shakeDuration) {
      this.shakeElapsed += deltaTime * 1000;
      const progress = this.shakeElapsed / this.shakeDuration;
      const currentIntensity = this.shakeIntensity * (1 - progress);

      this.shakeOffset.x = (Math.random() - 0.5) * currentIntensity * 2;
      this.shakeOffset.y = (Math.random() - 0.5) * currentIntensity * 2;
    } else {
      this.shakeOffset.x = 0;
      this.shakeOffset.y = 0;
    }
  }

  /**
   * Apply camera transform to context
   */
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate(this.rotation);
    ctx.translate(
      -this.x - this.width / 2 + this.shakeOffset.x,
      -this.y - this.height / 2 + this.shakeOffset.y
    );
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX: number, screenY: number): Point {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Translate to camera space
    let x = (screenX - centerX) / this.zoom;
    let y = (screenY - centerY) / this.zoom;

    // Apply rotation
    if (this.rotation !== 0) {
      const cos = Math.cos(-this.rotation);
      const sin = Math.sin(-this.rotation);
      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;
      x = rotatedX;
      y = rotatedY;
    }

    // Add camera position
    return {
      x: x + this.x + centerX,
      y: y + this.y + centerY
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX: number, worldY: number): Point {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Subtract camera position
    let x = worldX - this.x - centerX;
    let y = worldY - this.y - centerY;

    // Apply rotation
    if (this.rotation !== 0) {
      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);
      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;
      x = rotatedX;
      y = rotatedY;
    }

    // Apply zoom
    return {
      x: x * this.zoom + centerX,
      y: y * this.zoom + centerY
    };
  }
}
