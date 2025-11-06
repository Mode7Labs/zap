---
title: Storage
description: Persist game data with localStorage helpers
---

# Storage

The Storage utility provides a simple wrapper around `localStorage` for persisting game data with automatic JSON serialization and a namespace prefix.

## API Reference

### `Storage.set<T>(key, data): void`

Save data to localStorage with automatic JSON serialization.

**Parameters**:
- `key` (string) - Storage key (automatically prefixed with `zap_`)
- `data` (T) - Data to store (will be JSON stringified)

```javascript
import { Storage } from '@mode-7/zap';

// Save high score
Storage.set('highScore', 1000);

// Save player data
Storage.set('player', {
  name: 'Player1',
  level: 5,
  inventory: ['sword', 'shield']
});

// Save settings
Storage.set('settings', {
  volume: 0.8,
  difficulty: 'normal'
});
```

### `Storage.get<T>(key, defaultValue?): T | null`

Retrieve data from localStorage with automatic JSON parsing.

**Parameters**:
- `key` (string) - Storage key
- `defaultValue` (T) - Optional default if key doesn't exist

**Returns**: Stored data or default value or null

```javascript
// Get high score (returns null if not found)
const highScore = Storage.get('highScore');

// Get with default value
const settings = Storage.get('settings', { volume: 1.0, difficulty: 'easy' });

// TypeScript: specify type
const player = Storage.get<PlayerData>('player');
```

### `Storage.remove(key): void`

Remove a specific key from storage.

```javascript
Storage.remove('highScore');
Storage.remove('tempData');
```

### `Storage.clear(): void`

Clear all game data (only keys prefixed with `zap_`).

```javascript
// Clear all saved data
Storage.clear();
```

### `Storage.has(key): boolean`

Check if a key exists in storage.

```javascript
if (Storage.has('saveData')) {
  // Load save
} else {
  // New game
}
```

### `Storage.keys(): string[]`

Get all storage keys (without `zap_` prefix).

```javascript
const allKeys = Storage.keys();  // ['highScore', 'player', 'settings']
```

## Common Patterns

### Save/Load Game

```javascript
// Save game state
function saveGame() {
  Storage.set('saveData', {
    level: currentLevel,
    score: player.score,
    position: { x: player.x, y: player.y },
    timestamp: Date.now()
  });
}

// Load game state
function loadGame() {
  const saveData = Storage.get('saveData');
  if (saveData) {
    currentLevel = saveData.level;
    player.score = saveData.score;
    player.x = saveData.position.x;
    player.y = saveData.position.y;
    return true;
  }
  return false;
}
```

### High Score

```javascript
function checkHighScore(score) {
  const highScore = Storage.get('highScore', 0);

  if (score > highScore) {
    Storage.set('highScore', score);
    return true; // New high score!
  }
  return false;
}
```

### User Settings

```javascript
// Load settings on startup
const settings = Storage.get('settings', {
  volume: 1.0,
  musicVolume: 0.8,
  sfxVolume: 1.0,
  difficulty: 'normal'
});

audioManager.setMasterVolume(settings.volume);
audioManager.setMusicVolume(settings.musicVolume);
audioManager.setSFXVolume(settings.sfxVolume);

// Save when settings change
function updateSettings(newSettings) {
  Storage.set('settings', newSettings);
}
```

### Level Progress

```javascript
// Track unlocked levels
function unlockLevel(levelNum) {
  const unlockedLevels = Storage.get('unlockedLevels', [1]);
  if (!unlockedLevels.includes(levelNum)) {
    unlockedLevels.push(levelNum);
    Storage.set('unlockedLevels', unlockedLevels);
  }
}

function isLevelUnlocked(levelNum) {
  const unlockedLevels = Storage.get('unlockedLevels', [1]);
  return unlockedLevels.includes(levelNum);
}
```

### Achievement System

```javascript
const achievements = Storage.get('achievements', []);

function unlockAchievement(id) {
  if (!achievements.includes(id)) {
    achievements.push(id);
    Storage.set('achievements', achievements);
    showAchievementPopup(id);
  }
}
```

## Tips

- **Automatic prefix** - All keys automatically prefixed with `zap_` to avoid conflicts
- **JSON serialization** - Objects, arrays, numbers, strings all handled automatically
- **Use defaults** - Provide default values to `get()` for graceful fallbacks
- **Type safety** - Use TypeScript generics: `Storage.get<MyType>('key')`
- **Error handling** - All methods catch and log errors gracefully

## Storage Limits

- **Browser limit** - Most browsers allow 5-10MB localStorage
- **Check availability** - localStorage may be disabled in private browsing
- **Don't store sensitive data** - localStorage is not encrypted

## Next Steps

- [Timers](/utilities/timers) - Delayed saving and auto-save
- [Game](/core/game) - Managing game state
