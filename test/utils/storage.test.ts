import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage } from '../../src/utils/storage';

describe('Storage', () => {
  let localStorageMock: Map<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = new Map<string, string>();

    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        localStorageMock.delete(key);
      }),
      clear: vi.fn(() => {
        localStorageMock.clear();
      }),
      get length() {
        return localStorageMock.size;
      },
      key: vi.fn((index: number) => {
        const keys = Array.from(localStorageMock.keys());
        return keys[index] ?? null;
      })
    } as any;

    // Make Object.keys(localStorage) return the map keys
    // We do this by making localStorage iterable
    Object.defineProperty(global.localStorage, Symbol.iterator, {
      value: function* () {
        yield* localStorageMock.keys();
      }
    });

    // Override Object.keys for localStorage
    const originalKeys = Object.keys;
    Object.keys = function(obj: any) {
      if (obj === global.localStorage) {
        return Array.from(localStorageMock.keys());
      }
      return originalKeys(obj);
    };

    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('set()', () => {
    it('should store a string value', () => {
      Storage.set('name', 'player1');
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_name', '"player1"');
    });

    it('should store a number value', () => {
      Storage.set('score', 1000);
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_score', '1000');
    });

    it('should store an object', () => {
      const data = { level: 5, coins: 100 };
      Storage.set('save', data);
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_save', '{"level":5,"coins":100}');
    });

    it('should store an array', () => {
      const data = [1, 2, 3, 4, 5];
      Storage.set('inventory', data);
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_inventory', '[1,2,3,4,5]');
    });

    it('should store a boolean', () => {
      Storage.set('completed', true);
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_completed', 'true');
    });

    it('should store null', () => {
      Storage.set('empty', null);
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_empty', 'null');
    });

    it('should handle circular references gracefully', () => {
      const circular: any = { a: 1 };
      circular.self = circular;

      Storage.set('circular', circular);

      // Should log error but not throw
      expect(console.error).toHaveBeenCalled();
    });

    it('should prefix keys with "zap_"', () => {
      Storage.set('test', 'value');
      expect(localStorage.setItem).toHaveBeenCalledWith('zap_test', expect.any(String));
    });
  });

  describe('get()', () => {
    it('should retrieve a stored string', () => {
      Storage.set('name', 'player1');
      const value = Storage.get<string>('name');
      expect(value).toBe('player1');
    });

    it('should retrieve a stored number', () => {
      Storage.set('score', 1000);
      const value = Storage.get<number>('score');
      expect(value).toBe(1000);
    });

    it('should retrieve a stored object', () => {
      const data = { level: 5, coins: 100 };
      Storage.set('save', data);
      const value = Storage.get<typeof data>('save');
      expect(value).toEqual(data);
    });

    it('should retrieve a stored array', () => {
      const data = [1, 2, 3, 4, 5];
      Storage.set('inventory', data);
      const value = Storage.get<number[]>('inventory');
      expect(value).toEqual(data);
    });

    it('should retrieve a stored boolean', () => {
      Storage.set('completed', true);
      const value = Storage.get<boolean>('completed');
      expect(value).toBe(true);
    });

    it('should return null for non-existent key', () => {
      const value = Storage.get('nonexistent');
      expect(value).toBeNull();
    });

    it('should return default value for non-existent key', () => {
      const value = Storage.get('nonexistent', 'default');
      expect(value).toBe('default');
    });

    it('should return default value for parse errors', () => {
      // Manually set invalid JSON
      localStorageMock.set('zap_invalid', 'not valid json {]');
      const value = Storage.get('invalid', 'fallback');
      expect(value).toBe('fallback');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle complex nested objects', () => {
      const data = {
        player: {
          name: 'test',
          stats: {
            health: 100,
            mana: 50
          }
        },
        inventory: [
          { id: 1, name: 'sword' },
          { id: 2, name: 'shield' }
        ]
      };

      Storage.set('gamedata', data);
      const value = Storage.get<typeof data>('gamedata');
      expect(value).toEqual(data);
    });
  });

  describe('remove()', () => {
    it('should remove a stored value', () => {
      Storage.set('temp', 'value');
      Storage.remove('temp');
      expect(localStorage.removeItem).toHaveBeenCalledWith('zap_temp');
      expect(Storage.get('temp')).toBeNull();
    });

    it('should not throw on removing non-existent key', () => {
      expect(() => Storage.remove('nonexistent')).not.toThrow();
    });

    it('should handle remove errors gracefully', () => {
      vi.mocked(localStorage.removeItem).mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      Storage.remove('key');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clear()', () => {
    it('should clear all prefixed keys', () => {
      Storage.set('key1', 'value1');
      Storage.set('key2', 'value2');
      Storage.set('key3', 'value3');

      Storage.clear();

      expect(Storage.get('key1')).toBeNull();
      expect(Storage.get('key2')).toBeNull();
      expect(Storage.get('key3')).toBeNull();
    });

    it('should not clear non-prefixed keys', () => {
      // Add non-prefixed key
      localStorageMock.set('other_key', 'other_value');
      Storage.set('game_key', 'game_value');

      Storage.clear();

      expect(localStorageMock.has('other_key')).toBe(true);
      expect(Storage.get('game_key')).toBeNull();
    });

    it('should handle clear errors gracefully', () => {
      vi.spyOn(Object, 'keys').mockImplementationOnce(() => {
        throw new Error('Keys error');
      });

      Storage.clear();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('has()', () => {
    it('should return true for existing key', () => {
      Storage.set('exists', 'value');
      expect(Storage.has('exists')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(Storage.has('nonexistent')).toBe(false);
    });

    it('should return false after removal', () => {
      Storage.set('temp', 'value');
      expect(Storage.has('temp')).toBe(true);

      Storage.remove('temp');
      expect(Storage.has('temp')).toBe(false);
    });
  });

  describe('keys()', () => {
    it('should return empty array when no keys exist', () => {
      expect(Storage.keys()).toEqual([]);
    });

    it('should return all stored keys without prefix', () => {
      Storage.set('key1', 'value1');
      Storage.set('key2', 'value2');
      Storage.set('key3', 'value3');

      const keys = Storage.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys.length).toBe(3);
    });

    it('should not return non-prefixed keys', () => {
      localStorageMock.set('other_key', 'other_value');
      Storage.set('game_key', 'game_value');

      const keys = Storage.keys();
      expect(keys).toContain('game_key');
      expect(keys).not.toContain('other_key');
    });

    it('should strip prefix from returned keys', () => {
      Storage.set('test', 'value');

      const keys = Storage.keys();
      expect(keys[0]).toBe('test');
      expect(keys[0]).not.toContain('zap_');
    });
  });

  describe('Integration', () => {
    it('should handle multiple operations in sequence', () => {
      // Set
      Storage.set('score', 100);
      expect(Storage.has('score')).toBe(true);

      // Get
      expect(Storage.get<number>('score')).toBe(100);

      // Update
      Storage.set('score', 200);
      expect(Storage.get<number>('score')).toBe(200);

      // Remove
      Storage.remove('score');
      expect(Storage.has('score')).toBe(false);
      expect(Storage.get<number>('score')).toBeNull();
    });

    it('should handle save game scenario', () => {
      const saveData = {
        playerName: 'Hero',
        level: 10,
        position: { x: 100, y: 200 },
        inventory: ['sword', 'shield', 'potion'],
        completed: false
      };

      // Save
      Storage.set('savegame', saveData);

      // Load
      const loaded = Storage.get<typeof saveData>('savegame');
      expect(loaded).toEqual(saveData);

      // Check existence
      expect(Storage.has('savegame')).toBe(true);

      // Delete save
      Storage.remove('savegame');
      expect(Storage.has('savegame')).toBe(false);
    });

    it('should handle high scores list', () => {
      const scores = [
        { name: 'Player1', score: 1000 },
        { name: 'Player2', score: 900 },
        { name: 'Player3', score: 800 }
      ];

      Storage.set('highscores', scores);

      const loaded = Storage.get<typeof scores>('highscores');
      expect(loaded).toHaveLength(3);
      expect(loaded?.[0].score).toBe(1000);
    });

    it('should maintain separate namespaces with prefix', () => {
      // Set game data
      Storage.set('settings', { volume: 0.8 });

      // Manually set non-game data
      localStorageMock.set('user_settings', JSON.stringify({ theme: 'dark' }));

      // Game keys should only show game data
      const keys = Storage.keys();
      expect(keys).toContain('settings');
      expect(keys).not.toContain('user_settings');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string key', () => {
      Storage.set('', 'value');
      expect(Storage.get('')).toBe('value');
    });

    it('should handle keys with special characters', () => {
      Storage.set('key-with-dashes', 'value1');
      Storage.set('key_with_underscores', 'value2');
      Storage.set('key.with.dots', 'value3');

      expect(Storage.get('key-with-dashes')).toBe('value1');
      expect(Storage.get('key_with_underscores')).toBe('value2');
      expect(Storage.get('key.with.dots')).toBe('value3');
    });

    it('should handle very large objects', () => {
      const largeArray = Array(1000).fill(0).map((_, i) => ({
        id: i,
        data: `item_${i}`
      }));

      Storage.set('large', largeArray);
      const loaded = Storage.get<typeof largeArray>('large');
      expect(loaded).toHaveLength(1000);
    });

    it('should handle unicode characters', () => {
      const data = {
        name: '你好世界',
        emoji: '🎮🕹️',
        arabic: 'مرحبا'
      };

      Storage.set('unicode', data);
      const loaded = Storage.get<typeof data>('unicode');
      expect(loaded).toEqual(data);
    });

    it('should handle undefined as null', () => {
      Storage.set('undef', undefined);
      const value = Storage.get('undef');
      expect(value).toBeNull();
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-01-01');
      Storage.set('date', date);

      // Dates serialize to strings, so we get a string back
      const loaded = Storage.get<string>('date');
      expect(loaded).toBe(date.toISOString());
    });
  });
});
