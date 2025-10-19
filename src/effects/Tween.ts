import type { TweenOptions, EasingFunction } from '../types';
import { Easing, type EasingName } from '../utils/easing';

/**
 * Tween class for animating object properties
 */
export class Tween<T extends Record<string, any>> {
  private target: T;
  private startValues: Partial<T> = {};
  private endValues: Partial<T>;
  private duration: number;
  private easing: EasingFunction;
  private delay: number;
  private onUpdate?: (progress: number) => void;
  private onComplete?: () => void;

  private elapsed: number = 0;
  private delayElapsed: number = 0;
  private started: boolean = false;
  private completed: boolean = false;
  private active: boolean = true;

  constructor(target: T, endValues: Partial<T>, options: TweenOptions) {
    this.target = target;
    this.endValues = endValues;
    this.duration = options.duration;
    this.delay = options.delay ?? 0;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    // Resolve easing function
    if (typeof options.easing === 'function') {
      this.easing = options.easing;
    } else if (typeof options.easing === 'string') {
      this.easing = Easing[options.easing as EasingName] ?? Easing.linear;
    } else {
      this.easing = Easing.linear;
    }
  }

  /**
   * Update the tween
   */
  update(deltaTime: number): void {
    if (!this.active || this.completed) return;

    // Handle delay
    if (this.delayElapsed < this.delay) {
      this.delayElapsed += deltaTime * 1000;
      return;
    }

    // Initialize start values on first update after delay
    if (!this.started) {
      for (const key in this.endValues) {
        this.startValues[key] = this.target[key];
      }
      this.started = true;
    }

    // Update elapsed time
    this.elapsed += deltaTime * 1000;
    const progress = Math.min(this.elapsed / this.duration, 1);
    const easedProgress = this.easing(progress);

    // Update target values
    for (const key in this.endValues) {
      const start = this.startValues[key] as number;
      const end = this.endValues[key] as number;
      (this.target[key] as number) = start + (end - start) * easedProgress;
    }

    // Call update callback
    if (this.onUpdate) {
      this.onUpdate(progress);
    }

    // Check if completed
    if (progress >= 1) {
      this.completed = true;
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  /**
   * Stop the tween
   */
  stop(): void {
    this.active = false;
  }

  /**
   * Check if tween is completed
   */
  isCompleted(): boolean {
    return this.completed;
  }

  /**
   * Check if tween is active
   */
  isActive(): boolean {
    return this.active && !this.completed;
  }

  /**
   * Promise-like interface for chaining
   */
  then(onComplete?: () => void): Tween<T> {
    if (onComplete) {
      const existingCallback = this.onComplete;
      this.onComplete = () => {
        if (existingCallback) existingCallback();
        onComplete();
      };
    }
    return this;
  }
}
