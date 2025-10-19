---
title: Storage
description: Save and load game data with localStorage
---

# Storage

The Storage utility provides easy localStorage access for persisting game data, with automatic JSON serialization and type-safe retrieval.

## Save Data

Store data in localStorage:

```codemirror
import { Game, Scene, Sprite, Text, Storage } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

let score = 0;

const scoreText = new Text({
  text: `Score: ${score}`,
  x: 200,
  y: 100,
  fontSize: 20,
  color: '#4fc3f7',
  align: 'center'
});

const button = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 50,
  color: '#51cf66',
  radius: 8,
  interactive: true
});

const buttonLabel = new Text({
  text: 'Add Point',
  fontSize: 14,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

button.addChild(buttonLabel);

button.on('tap', () => {
  score++;
  scoreText.text = `Score: ${score}`;

  // Save score
  Storage.set('score', score);
});

scene.add(scoreText);
scene.add(button);

game.setScene(scene);
game.start();
```

## Load Data

Retrieve saved data:

```javascript
import { Storage } from '@mode-7/zap';

// Load score (returns null if not found)
const score = Storage.get('score');

if (score !== null) {
  console.log('Loaded score:', score);
} else {
  console.log('No saved score');
}

// Load with default value
const highScore = Storage.get('highScore', 0);
```

## Store Objects

Save complex data structures:

```javascript
import { Storage } from '@mode-7/zap';

// Save player data
const playerData = {
  name: 'Player1',
  level: 5,
  health: 100,
  position: { x: 200, y: 150 },
  inventory: ['sword', 'shield', 'potion']
};

Storage.set('player', playerData);

// Load player data
const loadedPlayer = Storage.get('player');
console.log(loadedPlayer.name);       // 'Player1'
console.log(loadedPlayer.level);      // 5
console.log(loadedPlayer.inventory);  // ['sword', 'shield', 'potion']
```

## Delete Data

Remove specific saved data:

```codemirror
import { Game, Scene, Sprite, Text, Storage } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Save initial score
Storage.set('score', 100);

const status = new Text({
  text: 'Score saved: 100',
  x: 200,
  y: 100,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

const deleteBtn = new Sprite({
  x: 200,
  y: 150,
  width: 140,
  height: 45,
  color: '#e94560',
  radius: 8,
  interactive: true
});

const deleteLabel = new Text({
  text: 'Delete Score',
  fontSize: 14,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

deleteBtn.addChild(deleteLabel);

deleteBtn.on('tap', () => {
  Storage.remove('score');
  status.text = 'Score deleted!';
  status.color = '#888';
});

scene.add(status);
scene.add(deleteBtn);

game.setScene(scene);
game.start();
```

## Clear All Data

Remove all game data:

```javascript
import { Storage } from '@mode-7/zap';

// Clear all saved game data
Storage.clear();

console.log('All game data cleared');
```

## Check if Exists

Check if a key exists in storage:

```javascript
import { Storage } from '@mode-7/zap';

if (Storage.has('player')) {
  // Load existing save
  const player = Storage.get('player');
  console.log('Continuing game...');
} else {
  // New game
  console.log('Starting new game...');
}
```

## List All Keys

Get all saved keys:

```javascript
import { Storage } from '@mode-7/zap';

const keys = Storage.keys();
console.log('Saved data:', keys);  // ['score', 'highScore', 'player', ...]
```

## Common Patterns

### Save/Load Game State

Complete game state management:

```javascript
function saveGame() {
  const gameState = {
    score: player.score,
    level: currentLevel,
    position: { x: player.x, y: player.y },
    health: player.health,
    inventory: player.inventory,
    timestamp: Date.now()
  };

  Storage.set('saveGame', gameState);
  console.log('Game saved!');
}

function loadGame() {
  const saveData = Storage.get('saveGame');

  if (saveData) {
    player.score = saveData.score;
    currentLevel = saveData.level;
    player.x = saveData.position.x;
    player.y = saveData.position.y;
    player.health = saveData.health;
    player.inventory = saveData.inventory;

    console.log('Game loaded!');
    return true;
  }

  return false;
}

// Auto-save every 30 seconds
interval(30000, saveGame);
```

### High Score System

Track and display high scores:

```javascript
function checkHighScore(score) {
  const currentHigh = Storage.get('highScore', 0);

  if (score > currentHigh) {
    Storage.set('highScore', score);
    showMessage('New High Score!');
    return true;
  }

  return false;
}

// Usage
if (checkHighScore(playerScore)) {
  // Celebrate!
}
```

### Settings Menu

Save player preferences:

```javascript
// Default settings
const defaultSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.7,
  difficulty: 'normal'
};

// Load settings
function loadSettings() {
  return Storage.get('settings', defaultSettings);
}

// Save settings
function saveSettings(settings) {
  Storage.set('settings', settings);
}

// Usage
const settings = loadSettings();

if (settings.soundEnabled) {
  playSound('click');
}
```

### Level Progress

Track completed levels:

```javascript
function unlockLevel(levelNumber) {
  const progress = Storage.get('levelProgress', []);

  if (!progress.includes(levelNumber)) {
    progress.push(levelNumber);
    Storage.set('levelProgress', progress);
  }
}

function isLevelUnlocked(levelNumber) {
  const progress = Storage.get('levelProgress', []);
  return levelNumber === 1 || progress.includes(levelNumber - 1);
}

// Usage
unlockLevel(5);
if (isLevelUnlocked(5)) {
  startLevel(5);
}
```

### Achievement System

Track player achievements:

```javascript
function unlockAchievement(id, name) {
  const achievements = Storage.get('achievements', {});

  if (!achievements[id]) {
    achievements[id] = {
      name,
      unlockedAt: Date.now()
    };

    Storage.set('achievements', achievements);
    showAchievementNotification(name);
  }
}

function hasAchievement(id) {
  const achievements = Storage.get('achievements', {});
  return achievements.hasOwnProperty(id);
}

// Usage
unlockAchievement('first_win', 'First Victory');
```

### Multiple Save Slots

Manage multiple save files:

```javascript
function saveToSlot(slot, gameState) {
  Storage.set(`save_slot_${slot}`, {
    ...gameState,
    savedAt: Date.now()
  });
}

function loadFromSlot(slot) {
  return Storage.get(`save_slot_${slot}`);
}

function deleteSlot(slot) {
  Storage.remove(`save_slot_${slot}`);
}

function getSaveSlots() {
  return [1, 2, 3].map(slot => ({
    slot,
    data: loadFromSlot(slot)
  }));
}

// Usage
saveToSlot(1, gameState);  // Save to slot 1
const save = loadFromSlot(1);  // Load from slot 1
```

### Statistics Tracking

Track player statistics:

```javascript
function incrementStat(stat, amount = 1) {
  const stats = Storage.get('stats', {});
  stats[stat] = (stats[stat] || 0) + amount;
  Storage.set('stats', stats);
}

function getStat(stat) {
  const stats = Storage.get('stats', {});
  return stats[stat] || 0;
}

// Usage
incrementStat('enemiesDefeated');
incrementStat('coinsCollected', 10);

console.log('Enemies defeated:', getStat('enemiesDefeated'));
```

### First-Time User Detection

Detect new vs returning users:

```javascript
function isFirstVisit() {
  return !Storage.has('hasVisited');
}

function markVisited() {
  Storage.set('hasVisited', true);
  Storage.set('firstVisitDate', Date.now());
}

// Show tutorial for first-time users
if (isFirstVisit()) {
  showTutorial();
  markVisited();
}
```

### Last Played Timestamp

Track when user last played:

```javascript
function updateLastPlayed() {
  Storage.set('lastPlayed', Date.now());
}

function getTimeSinceLastPlayed() {
  const lastPlayed = Storage.get('lastPlayed');

  if (!lastPlayed) return null;

  const elapsed = Date.now() - lastPlayed;
  const hours = elapsed / (1000 * 60 * 60);

  return hours;
}

// Welcome back message
const hoursSince = getTimeSinceLastPlayed();

if (hoursSince && hoursSince > 24) {
  showMessage('Welcome back!');
}

updateLastPlayed();
```

### Daily Rewards

Implement daily login rewards:

```javascript
function canClaimDailyReward() {
  const lastClaim = Storage.get('lastDailyReward');

  if (!lastClaim) return true;

  const hoursSince = (Date.now() - lastClaim) / (1000 * 60 * 60);
  return hoursSince >= 24;
}

function claimDailyReward() {
  if (canClaimDailyReward()) {
    Storage.set('lastDailyReward', Date.now());

    // Increment streak
    const streak = Storage.get('loginStreak', 0);
    Storage.set('loginStreak', streak + 1);

    giveReward();
    return true;
  }

  return false;
}
```

### Migration/Versioning

Handle save data format changes:

```javascript
const CURRENT_VERSION = 2;

function migrateData() {
  const version = Storage.get('dataVersion', 1);

  if (version < 2) {
    // Migrate from v1 to v2
    const oldPlayer = Storage.get('player');
    if (oldPlayer) {
      oldPlayer.newField = 'defaultValue';
      Storage.set('player', oldPlayer);
    }
  }

  Storage.set('dataVersion', CURRENT_VERSION);
}

// Run on game start
migrateData();
```

## Type Safety

Use TypeScript for type-safe storage:

```typescript
interface PlayerData {
  name: string;
  level: number;
  score: number;
  inventory: string[];
}

// Type-safe save
const player: PlayerData = {
  name: 'Hero',
  level: 5,
  score: 1000,
  inventory: ['sword']
};

Storage.set<PlayerData>('player', player);

// Type-safe load
const loaded = Storage.get<PlayerData>('player');
console.log(loaded?.name);  // TypeScript knows this is a string
```

## Storage Limits

Be aware of localStorage limits:

```javascript
// Check available space (approximate)
function getStorageSize() {
  let total = 0;
  const keys = Storage.keys();

  keys.forEach(key => {
    const value = Storage.get(key);
    total += JSON.stringify(value).length;
  });

  const kb = total / 1024;
  const mb = kb / 1024;

  return { bytes: total, kb, mb };
}

const size = getStorageSize();
console.log(`Storage used: ${size.kb.toFixed(2)} KB`);
```

## API Reference

### `Storage.set(key, data)`

Store data in localStorage.

**Parameters**:
- `key` (string) - Storage key
- `data` (any) - Data to store (auto-serialized to JSON)

**Returns**: void

```javascript
Storage.set('score', 100);
Storage.set('player', { name: 'Hero', level: 5 });
```

### `Storage.get(key, defaultValue?)`

Retrieve data from localStorage.

**Parameters**:
- `key` (string) - Storage key
- `defaultValue` (any) - Optional default if key doesn't exist

**Returns**: Stored data or default value or null

```javascript
const score = Storage.get('score');  // null if not found
const highScore = Storage.get('highScore', 0);  // 0 if not found
```

### `Storage.remove(key)`

Delete specific key from localStorage.

**Parameters**:
- `key` (string) - Storage key to remove

**Returns**: void

```javascript
Storage.remove('score');
```

### `Storage.clear()`

Remove all game data (keys with "zap_" prefix).

**Returns**: void

```javascript
Storage.clear();
```

### `Storage.has(key)`

Check if key exists in storage.

**Parameters**:
- `key` (string) - Storage key

**Returns**: boolean

```javascript
if (Storage.has('player')) {
  // Load existing save
}
```

### `Storage.keys()`

Get all storage keys (without "zap_" prefix).

**Returns**: string[]

```javascript
const keys = Storage.keys();
console.log('Saved keys:', keys);
```

## Best Practices

- **Save frequently** - Auto-save progress to prevent data loss
- **Validate loaded data** - Check data structure before using
- **Use default values** - Provide sensible defaults with `get()`
- **Handle errors gracefully** - Storage can fail (private browsing, quota exceeded)
- **Keep data small** - LocalStorage has size limits (~5-10MB)
- **Clear old saves** - Remove outdated data

## Common Mistakes

### Not providing defaults

```javascript
// ❌ Wrong - might be null
const score = Storage.get('score');
const newScore = score + 10;  // Error if score is null!

// ✅ Right - provide default
const score = Storage.get('score', 0);
const newScore = score + 10;  // Safe
```

### Forgetting to save

```javascript
// ❌ Wrong - changes not saved
player.score += 100;
// Lost on page reload!

// ✅ Right - save changes
player.score += 100;
Storage.set('player', player);
```

### Storing functions

```javascript
// ❌ Wrong - functions can't be serialized
const obj = {
  name: 'Player',
  move: function() { /* ... */ }
};
Storage.set('player', obj);  // move() will be lost!

// ✅ Right - only store data
const obj = {
  name: 'Player',
  x: 100,
  y: 100
};
Storage.set('player', obj);
```

## Tips

- **Auto-save on important events** - Level completion, score milestones
- **Clear on reset** - Use `Storage.clear()` for "reset game" functionality
- **Namespace your keys** - Use prefixes for organization: `level_1_score`
- **Test private browsing** - localStorage may not work in private mode
- **Compress large data** - Consider compression for large save files
- **Backup important saves** - Provide export/import functionality

## Next Steps

- [Timers](/utilities/timers) - Auto-save with intervals
- [Scenes](/core/scenes) - Save/load scene state
- [Game](/core/game) - Initialize from saved data
