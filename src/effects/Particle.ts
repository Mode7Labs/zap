import type { Point } from '../types';
import { Entity } from '../entities/Entity';

export interface ParticleOptions {
  x: number;
  y: number;
  velocity?: Point;
  color?: string;
  size?: number;
  lifetime?: number;
  gravity?: number;
  friction?: number;
}

/**
 * Single particle entity
 */
export class Particle extends Entity {
  public velocity: Point;
  public color: string;
  public size: number;
  public lifetime: number;
  public age: number = 0;
  public gravity: number;
  public friction: number;

  constructor(options: ParticleOptions) {
    super(options);

    this.velocity = options.velocity ?? { x: 0, y: 0 };
    this.color = options.color ?? '#ffffff';
    this.size = options.size ?? 4;
    this.lifetime = options.lifetime ?? 1;
    this.gravity = options.gravity ?? 0;
    this.friction = options.friction ?? 1;
  }

  update(deltaTime: number): void {
    // Apply velocity
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;

    // Apply gravity
    this.velocity.y += this.gravity * deltaTime;

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Age the particle
    this.age += deltaTime;

    // Fade out over lifetime
    this.alpha = 1 - this.age / this.lifetime;

    // Mark for removal if expired
    if (this.age >= this.lifetime) {
      this.destroy();
    }

    super.update(deltaTime);
  }

  protected draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export interface ParticleEmitterOptions {
  x?: number;
  y?: number;
  rate?: number;
  particleOptions?: Partial<ParticleOptions>;
  velocityRange?: { min: Point; max: Point };
  sizeRange?: { min: number; max: number };
  lifetimeRange?: { min: number; max: number };
  colors?: string[];
}

/**
 * Particle emitter for creating particle effects
 */
export class ParticleEmitter extends Entity {
  private rate: number;
  private particleOptions: Partial<ParticleOptions>;
  private velocityRange: { min: Point; max: Point };
  private sizeRange: { min: number; max: number };
  private lifetimeRange: { min: number; max: number };
  private colors: string[];
  private timeSinceEmit: number = 0;

  constructor(options: ParticleEmitterOptions = {}) {
    super(options);

    this.rate = options.rate ?? 10; // particles per second
    this.particleOptions = options.particleOptions ?? {};
    this.velocityRange = options.velocityRange ?? {
      min: { x: -50, y: -50 },
      max: { x: 50, y: 50 },
    };
    this.sizeRange = options.sizeRange ?? { min: 2, max: 6 };
    this.lifetimeRange = options.lifetimeRange ?? { min: 0.5, max: 1.5 };
    this.colors = options.colors ?? ['#ffffff'];
  }

  update(deltaTime: number): void {
    this.timeSinceEmit += deltaTime;

    const emitInterval = 1 / this.rate;

    while (this.timeSinceEmit >= emitInterval) {
      this.emitParticle();
      this.timeSinceEmit -= emitInterval;
    }

    super.update(deltaTime);
  }

  /**
   * Emit a single particle
   */
  emitParticle(): void {
    const scene = this.getScene();
    if (!scene) return;

    const worldPos = this.getWorldPosition();

    const particle = new Particle({
      x: worldPos.x,
      y: worldPos.y,
      velocity: {
        x: this.randomRange(this.velocityRange.min.x, this.velocityRange.max.x),
        y: this.randomRange(this.velocityRange.min.y, this.velocityRange.max.y),
      },
      size: this.randomRange(this.sizeRange.min, this.sizeRange.max),
      lifetime: this.randomRange(this.lifetimeRange.min, this.lifetimeRange.max),
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      ...this.particleOptions,
    });

    scene.add(particle);
  }

  /**
   * Burst particles all at once
   */
  burst(count: number): void {
    for (let i = 0; i < count; i++) {
      this.emitParticle();
    }
  }

  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  protected draw(_ctx: CanvasRenderingContext2D): void {
    // Emitter itself is invisible
  }
}
