import type { GameOptions } from '../types';
import { EventEmitter } from './EventEmitter';
import type { Scene } from './Scene';
import { GestureManager } from '../gestures/GestureManager';
import { tweenManager } from '../effects/TweenManager';
import { Camera } from './Camera';
import { TouchTrail } from '../effects/TouchTrail';

export type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down';

/**
 * Main game instance - manages canvas, game loop, and scenes
 */
export class Game extends EventEmitter {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  public pixelRatio: number;
  public gestures: GestureManager;
  public camera: Camera;
  public touchTrail: TouchTrail | null;

  private currentScene: Scene | null = null;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private running: boolean = false;
  private backgroundColor: string;
  private transitioning: boolean = false;
  private transitionProgress: number = 0;

  // Performance
  private targetFPS: number | null = null;
  private frameTime: number = 0;
  private maxDeltaTime: number;

  // Debug
  private showFPS: boolean = false;
  private fps: number = 0;
  private fpsFrames: number = 0;
  private fpsLastTime: number = 0;

  constructor(options: GameOptions = {}) {
    super();

    // Apply defaults
    this.width = options.width ?? 800;
    this.height = options.height ?? 600;
    this.pixelRatio = options.pixelRatio ?? window.devicePixelRatio ?? 1;
    this.backgroundColor = options.backgroundColor ?? '#000000';
    this.targetFPS = options.targetFPS ?? null;
    this.maxDeltaTime = options.maxDeltaTime ?? 0.1;
    this.showFPS = options.showFPS ?? false;

    if (this.targetFPS !== null) {
      this.frameTime = 1000 / this.targetFPS;
    }

    // Setup canvas
    if (options.canvas) {
      this.canvas = options.canvas;
    } else {
      this.canvas = document.createElement('canvas');
      const parent = typeof options.parent === 'string'
        ? document.querySelector(options.parent)
        : options.parent ?? document.body;
      parent?.appendChild(this.canvas);
    }

    // Set canvas size
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Get context
    const ctx = this.canvas.getContext('2d', {
      alpha: options.alpha ?? false,
      desynchronized: options.desynchronized ?? true,
    });

    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }

    this.ctx = ctx;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    if (options.antialias !== false) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = options.imageSmoothingQuality ?? 'high';
    }

    // Initialize systems
    this.gestures = new GestureManager(this);
    this.camera = new Camera(this.width, this.height);
    this.touchTrail = options.enableTouchTrail ? new TouchTrail() : null;

    // Track touch/mouse for trail (only if enabled)
    if (this.touchTrail) {
      this.canvas.addEventListener('pointermove', (e) => {
        const pos = this.canvasToGame(e.clientX, e.clientY);
        if (e.buttons > 0 || e.pointerType === 'touch') {
          this.touchTrail!.addPoint(pos.x, pos.y);
        }
      });
    }
  }

  /**
   * Set the current scene
   */
  setScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.onExit();
    }

    this.currentScene = scene;
    scene.setGame(this);
    scene.onEnter();

    this.emit('scenechange', scene);
  }

  /**
   * Transition to a new scene with animation
   */
  async transitionTo(
    scene: Scene,
    options: { type?: TransitionType; duration?: number } = {}
  ): Promise<void> {
    if (this.transitioning) return;

    // TODO: Implement different transition types (options.type)
    const duration = options.duration ?? 500;

    this.transitioning = true;
    this.transitionProgress = 0;

    const startTime = performance.now();

    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = performance.now() - startTime;
        this.transitionProgress = Math.min(elapsed / duration, 1);

        if (this.transitionProgress >= 0.5 && this.currentScene !== scene) {
          this.setScene(scene);
        }

        if (this.transitionProgress >= 1) {
          this.transitioning = false;
          this.transitionProgress = 0;
          resolve();
        } else {
          requestAnimationFrame(animate);
        }
      };

      animate();
    });
  }

  /**
   * Get current scene
   */
  getScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
    this.emit('start');
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (!this.running) return;

    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.emit('stop');
  }

  /**
   * Main game loop
   */
  private loop = (currentTime: number): void => {
    if (!this.running) return;

    // FPS limiting
    if (this.targetFPS !== null) {
      const elapsed = currentTime - this.lastTime;
      if (elapsed < this.frameTime) {
        this.rafId = requestAnimationFrame(this.loop);
        return;
      }
    }

    let deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp delta time to prevent spiral of death
    deltaTime = Math.min(deltaTime, this.maxDeltaTime);

    // Track FPS
    this.fpsFrames++;
    if (currentTime - this.fpsLastTime >= 1000) {
      this.fps = this.fpsFrames;
      this.fpsFrames = 0;
      this.fpsLastTime = currentTime;
    }

    // Clear canvas
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Update systems
    tweenManager.update(deltaTime);
    this.camera.update(deltaTime);
    if (this.touchTrail) {
      this.touchTrail.update(deltaTime);
    }

    // Apply camera transform
    this.ctx.save();
    this.camera.applyTransform(this.ctx);

    // Update and render scene
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
      this.currentScene.render(this.ctx);
    }

    this.ctx.restore();

    // Render touch trail (without camera transform)
    if (this.touchTrail) {
      this.ctx.save();
      this.touchTrail.render(this.ctx);
      this.ctx.restore();
    }

    // Render transition overlay
    if (this.transitioning) {
      this.renderTransition();
    }

    // Render FPS counter
    if (this.showFPS) {
      this.renderFPS();
    }

    this.emit('update', deltaTime);

    this.rafId = requestAnimationFrame(this.loop);
  };

  /**
   * Convert canvas coordinates to game coordinates
   */
  canvasToGame(x: number, y: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((x - rect.left) / rect.width) * this.width,
      y: ((y - rect.top) / rect.height) * this.height,
    };
  }

  /**
   * Render transition effect
   */
  private renderTransition(): void {
    const progress = this.transitionProgress;
    let alpha: number;

    if (progress < 0.5) {
      // Fade out
      alpha = progress * 2;
    } else {
      // Fade in
      alpha = 2 - progress * 2;
    }

    this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Render FPS counter
   */
  private renderFPS(): void {
    this.ctx.save();
    this.ctx.font = '14px monospace';
    this.ctx.fillStyle = '#00ff00';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    const text = `FPS: ${this.fps}`;
    this.ctx.strokeText(text, 10, 20);
    this.ctx.fillText(text, 10, 20);
    this.ctx.restore();
  }

  /**
   * Destroy the game instance
   */
  destroy(): void {
    this.stop();
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.gestures.destroy();
    this.clearEvents();
  }
}
