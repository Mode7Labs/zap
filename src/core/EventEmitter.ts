import type { EventCallback } from '../types';

/**
 * Simple event emitter for game entities
 */
export class EventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to an event
   */
  on<T = any>(event: string, callback: EventCallback<T>): this {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return this;
  }

  /**
   * Subscribe to an event once
   */
  once<T = any>(event: string, callback: EventCallback<T>): this {
    const wrapper = (data: T) => {
      callback(data);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback?: EventCallback): this {
    if (!callback) {
      this.events.delete(event);
      return this;
    }

    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
    return this;
  }

  /**
   * Emit an event
   */
  emit<T = any>(event: string, data?: T): this {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
    return this;
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events.clear();
  }
}
