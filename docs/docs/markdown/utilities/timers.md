---
title: Timers
description: Delays, intervals, and promise-based timing
---

# Timers

Timer utilities provide delay(), interval(), and promise-based wait() functions with automatic cleanup.

## API Reference

### `delay(ms, callback): TimerHandle`

Execute callback after a delay.

**Parameters**:
- `ms` (number) - Milliseconds to wait
- `callback` (function) - Function to execute

**Returns**: `TimerHandle` with `.cancel()` method

```javascript
import { delay } from '@mode-7/zap';

// Delay 1 second
delay(1000, () => {
  console.log('1 second passed');
});

// Cancelable delay
const timer = delay(2000, () => {
  console.log('This might not run');
});

// Cancel before it fires
timer.cancel();
```

### `interval(ms, callback): TimerHandle`

Execute callback repeatedly at an interval.

**Parameters**:
- `ms` (number) - Milliseconds between executions
- `callback` (function) - Function to execute repeatedly

**Returns**: `TimerHandle` with `.cancel()` method

```javascript
import { interval } from '@mode-7/zap';

// Spawn enemy every 3 seconds
const spawner = interval(3000, () => {
  spawnEnemy();
});

// Stop spawning
spawner.cancel();
```

### `wait(ms): Promise<void>`

Promise-based delay (use with async/await).

**Parameters**:
- `ms` (number) - Milliseconds to wait

**Returns**: Promise that resolves after delay

```javascript
import { wait } from '@mode-7/zap';

async function showSequence() {
  showMessage('Get Ready!');
  await wait(1000);

  showMessage('Set!');
  await wait(1000);

  showMessage('Go!');
  await wait(1000);

  startGame();
}
```

## Common Patterns

### Delayed Action

```javascript
// Show popup after 2 seconds
delay(2000, () => {
  showPopup('Welcome!');
});

// Spawn powerup after 5 seconds
delay(5000, () => {
  spawnPowerup();
});
```

### Countdown Timer

```javascript
let timeLeft = 60;

const countdown = interval(1000, () => {
  timeLeft--;
  timerText.text = `Time: ${timeLeft}`;

  if (timeLeft <= 0) {
    countdown.cancel();
    gameOver();
  }
});
```

### Enemy Spawner

```javascript
let spawnerActive = true;

const spawner = interval(2000, () => {
  if (spawnerActive) {
    const enemy = createEnemy();
    scene.add(enemy);
  }
});

// Stop spawning
function stopSpawning() {
  spawner.cancel();
}
```

### Animated Sequence

```javascript
async function levelComplete() {
  showMessage('Level Complete!');
  await wait(1500);

  showStars(3);
  await wait(1000);

  showScore(player.score);
  await wait(2000);

  loadNextLevel();
}
```

### Auto-Save

```javascript
// Auto-save every 30 seconds
const autoSave = interval(30000, () => {
  saveGame();
  showNotification('Game saved');
});

// Cancel on game over
game.on('gameover', () => {
  autoSave.cancel();
});
```

### Temporary Powerup

```javascript
function activatePowerup(duration) {
  player.isPoweredUp = true;
  player.color = '#f1c40f';

  delay(duration, () => {
    player.isPoweredUp = false;
    player.color = '#4fc3f7';
  });
}

activatePowerup(5000); // 5 second powerup
```

### Spawn Wave

```javascript
async function spawnWave(count) {
  for (let i = 0; i < count; i++) {
    spawnEnemy();
    await wait(500); // 0.5s between each
  }
}

spawnWave(10); // Spawn 10 enemies over 5 seconds
```

### Countdown with Warning

```javascript
let timeLeft = 10;

const countdown = interval(1000, () => {
  timeLeft--;
  timerText.text = `${timeLeft}`;

  if (timeLeft <= 3) {
    timerText.color = '#e94560'; // Red warning
  }

  if (timeLeft <= 0) {
    countdown.cancel();
    explode();
  }
});
```

## Tips

- **Always cancel** - Cancel timers when no longer needed to prevent memory leaks
- **Use wait() for sequences** - Cleaner than nested delays
- **Store timer handles** - Keep references to cancel later
- **Scene cleanup** - Cancel all timers when changing scenes

## Common Mistakes

### Forgetting to cancel

```javascript
// ❌ Wrong - timer keeps running after scene change
interval(1000, () => {
  updateUI();
});

// ✅ Right - cancel on scene exit
const uiUpdater = interval(1000, () => {
  updateUI();
});

scene.onExit = () => {
  uiUpdater.cancel();
};
```

### Using setTimeout directly

```javascript
// ❌ Wrong - can't cancel easily
setTimeout(() => {
  spawnEnemy();
}, 3000);

// ✅ Right - use delay() for cancellation
const spawn = delay(3000, () => {
  spawnEnemy();
});

// Can cancel if needed
if (gameEnded) spawn.cancel();
```

## Next Steps

- [Storage](/utilities/storage) - Auto-save with timers
- [Scenes](/core/scenes) - Timer cleanup on scene changes
- [Tweening](/animation/tweening) - Timed animations
