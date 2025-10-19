/**
 * Local storage helper for persisting game data
 */

const PREFIX = 'zap_';

export class Storage {
  /**
   * Set data in local storage
   */
  static set<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(PREFIX + key, serialized);
    } catch (error) {
      console.error('Failed to set storage:', error);
    }
  }

  /**
   * Get data from local storage
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const serialized = localStorage.getItem(PREFIX + key);
      if (serialized === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Failed to get from storage:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove data from local storage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      console.error('Failed to remove from storage:', error);
    }
  }

  /**
   * Clear all game data
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Check if key exists
   */
  static has(key: string): boolean {
    return localStorage.getItem(PREFIX + key) !== null;
  }

  /**
   * Get all keys
   */
  static keys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(PREFIX))
      .map(key => key.substring(PREFIX.length));
  }
}
