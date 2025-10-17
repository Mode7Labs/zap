import { Tween } from './Tween';

/**
 * Global tween manager for managing all active tweens
 */
export class TweenManager {
  private tweens: Set<Tween<any>> = new Set();

  /**
   * Add a tween to the manager
   */
  add<T extends Record<string, any>>(tween: Tween<T>): void {
    this.tweens.add(tween);
  }

  /**
   * Remove a tween from the manager
   */
  remove<T extends Record<string, any>>(tween: Tween<T>): void {
    this.tweens.delete(tween);
  }

  /**
   * Update all active tweens
   */
  update(deltaTime: number): void {
    for (const tween of this.tweens) {
      tween.update(deltaTime);

      // Remove completed tweens
      if (tween.isCompleted()) {
        this.tweens.delete(tween);
      }
    }
  }

  /**
   * Clear all tweens
   */
  clear(): void {
    this.tweens.clear();
  }

  /**
   * Get the number of active tweens
   */
  getCount(): number {
    return this.tweens.size;
  }
}

// Global tween manager instance
export const tweenManager = new TweenManager();
