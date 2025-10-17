/**
 * Timer utilities for delays and intervals
 */

export type TimerCallback = () => void;

export interface TimerHandle {
  id: number;
  cancel: () => void;
}

class TimerManager {
  private timers: Map<number, number> = new Map();
  private nextId: number = 0;

  /**
   * Execute callback after delay
   */
  delay(ms: number, callback: TimerCallback): TimerHandle {
    const id = this.nextId++;
    const timeoutId = window.setTimeout(() => {
      callback();
      this.timers.delete(id);
    }, ms);

    this.timers.set(id, timeoutId);

    return {
      id,
      cancel: () => {
        const tid = this.timers.get(id);
        if (tid !== undefined) {
          clearTimeout(tid);
          this.timers.delete(id);
        }
      }
    };
  }

  /**
   * Execute callback repeatedly at interval
   */
  interval(ms: number, callback: TimerCallback): TimerHandle {
    const id = this.nextId++;
    const intervalId = window.setInterval(callback, ms);

    this.timers.set(id, intervalId);

    return {
      id,
      cancel: () => {
        const tid = this.timers.get(id);
        if (tid !== undefined) {
          clearInterval(tid);
          this.timers.delete(id);
        }
      }
    };
  }

  /**
   * Cancel all timers
   */
  clearAll(): void {
    this.timers.forEach(timerId => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    this.timers.clear();
  }
}

export const timerManager = new TimerManager();

/**
 * Simple delay helper
 */
export function delay(ms: number, callback: TimerCallback): TimerHandle {
  return timerManager.delay(ms, callback);
}

/**
 * Simple interval helper
 */
export function interval(ms: number, callback: TimerCallback): TimerHandle {
  return timerManager.interval(ms, callback);
}

/**
 * Promise-based delay
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
