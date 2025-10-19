---
title: Timers
description: Delays, intervals, and time-based utilities
---

# Timers

Zap provides timer utilities for delays, intervals, and time-based game logic with easy cancellation and management.

## Delay

Execute a callback after a delay:

```codemirror
import { Game, Scene, Sprite, Text, delay } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const box = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 80,
  color: '#e94560',
  radius: 8,
  interactive: true
});

const label = new Text({
  text: 'Click me!',
  x: 200,
  y: 230,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

box.on('tap', () => {
  label.text = 'Exploding in 2 seconds...';
  label.color = '#f39c12';

  // Execute after 2 seconds
  delay(2000, () => {
    box.visible = false;
    label.text = 'Boom!';
    label.color = '#e94560';
  });
});

scene.add(box);
scene.add(label);

game.setScene(scene);
game.start();
```

## Interval

Execute a callback repeatedly at regular intervals:

```codemirror
import { Game, Scene, Text, interval } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

let count = 0;

const counter = new Text({
  text: `Count: ${count}`,
  x: 200,
  y: 150,
  fontSize: 24,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(counter);

// Increment every second
interval(1000, () => {
  count++;
  counter.text = `Count: ${count}`;
});

game.setScene(scene);
game.start();
```

## Wait (Async)

Promise-based delay for async/await:

```javascript
import { wait } from '@mode-7/zap';

async function sequence() {
  console.log('Starting...');

  await wait(1000);
  console.log('1 second passed');

  await wait(1000);
  console.log('2 seconds passed');

  await wait(1000);
  console.log('3 seconds passed');
}

sequence();
```

## Cancel Timers

Cancel delays and intervals before they execute:

```codemirror
import { Game, Scene, Sprite, Text, delay } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const box = new Sprite({
  x: 200,
  y: 120,
  width: 80,
  height: 80,
  color: '#e94560',
  radius: 8,
  interactive: true
});

const cancelBtn = new Sprite({
  x: 200,
  y: 200,
  width: 100,
  height: 40,
  color: '#888',
  radius: 6,
  interactive: true
});

const cancelLabel = new Text({
  text: 'Cancel',
  fontSize: 14,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

cancelBtn.addChild(cancelLabel);

const status = new Text({
  text: 'Click box to start timer',
  x: 200,
  y: 260,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

let timer = null;

box.on('tap', () => {
  status.text = 'Timer started (3s)...';
  status.color = '#4fc3f7';

  timer = delay(3000, () => {
    box.visible = false;
    status.text = 'Box disappeared!';
  });
});

cancelBtn.on('tap', () => {
  if (timer) {
    timer.cancel();
    status.text = 'Timer cancelled!';
    status.color = '#f39c12';
    timer = null;
  }
});

scene.add(box);
scene.add(cancelBtn);
scene.add(status);

game.setScene(scene);
game.start();
```

## Common Patterns

### Countdown Timer

Create a countdown:

```javascript
import { interval } from '@mode-7/zap';

let timeLeft = 60;  // 60 seconds

const timer = interval(1000, () => {
  timeLeft--;
  countdownText.text = `Time: ${timeLeft}s`;

  if (timeLeft <= 0) {
    timer.cancel();
    gameOver();
  }
});
```

### Respawn Timer

Delay before respawning:

```javascript
player.on('death', () => {
  player.visible = false;

  delay(3000, () => {
    player.x = spawnPoint.x;
    player.y = spawnPoint.y;
    player.health = 100;
    player.visible = true;
  });
});
```

### Flash Effect

Make an element flash repeatedly:

```javascript
import { interval } from '@mode-7/zap';

let flashCount = 0;
const maxFlashes = 6;

const flashTimer = interval(200, () => {
  sprite.visible = !sprite.visible;
  flashCount++;

  if (flashCount >= maxFlashes) {
    flashTimer.cancel();
    sprite.visible = true;
  }
});
```

### Power-Up Duration

Temporary power-up:

```javascript
function activatePowerUp(duration) {
  player.speed *= 2;
  player.color = '#f39c12';

  delay(duration, () => {
    player.speed /= 2;
    player.color = '#4fc3f7';
  });
}

// 5-second speed boost
activatePowerUp(5000);
```

### Sequential Events

Chain multiple timed events:

```javascript
import { wait } from '@mode-7/zap';

async function intro() {
  titleText.text = 'Welcome';
  await wait(1500);

  titleText.text = 'to';
  await wait(1000);

  titleText.text = 'My Game!';
  await wait(2000);

  // Start game
  game.setScene(gameScene);
}

intro();
```

### Spawn Waves

Spawn enemies in waves:

```javascript
import { interval } from '@mode-7/zap';

let wave = 1;

const waveTimer = interval(10000, () => {
  console.log(`Spawning wave ${wave}`);

  for (let i = 0; i < wave * 3; i++) {
    spawnEnemy();
  }

  wave++;

  if (wave > 10) {
    waveTimer.cancel();
    console.log('All waves complete!');
  }
});
```

### Auto-Save

Periodic auto-save:

```javascript
import { interval } from '@mode-7/zap';

// Auto-save every 30 seconds
interval(30000, () => {
  saveGame();
  console.log('Game auto-saved');
});
```

### Delayed Message

Show temporary message:

```javascript
function showMessage(text, duration = 2000) {
  messageText.text = text;
  messageText.visible = true;

  delay(duration, () => {
    messageText.visible = false;
  });
}

// Usage
showMessage('Level Complete!', 3000);
```

### Blinking Cursor

Animated cursor effect:

```javascript
import { interval } from '@mode-7/zap';

interval(500, () => {
  cursor.visible = !cursor.visible;
});
```

### Combo Timer

Reset combo after inactivity:

```javascript
let comboCount = 0;
let comboTimer = null;

function registerHit() {
  comboCount++;
  comboText.text = `Combo x${comboCount}`;

  // Cancel existing timer
  if (comboTimer) {
    comboTimer.cancel();
  }

  // Reset combo after 2 seconds of no hits
  comboTimer = delay(2000, () => {
    comboCount = 0;
    comboText.text = '';
  });
}
```

### Animation Loop

Simple repeating animation:

```javascript
import { wait } from '@mode-7/zap';

async function animateLoop() {
  while (true) {
    await sprite.tween({ y: 200 }, { duration: 1000 });
    await wait(500);
    await sprite.tween({ y: 100 }, { duration: 1000 });
    await wait(500);
  }
}

animateLoop();
```

### Delayed Callback Chain

Execute callbacks in sequence:

```javascript
import { delay } from '@mode-7/zap';

delay(1000, () => {
  console.log('Step 1');

  delay(1000, () => {
    console.log('Step 2');

    delay(1000, () => {
      console.log('Step 3');
    });
  });
});

// Better with async/await
async function steps() {
  await wait(1000);
  console.log('Step 1');

  await wait(1000);
  console.log('Step 2');

  await wait(1000);
  console.log('Step 3');
}
```

### Rate Limiting

Prevent rapid repeated actions:

```javascript
let canFire = true;

button.on('tap', () => {
  if (!canFire) return;

  fireBullet();
  canFire = false;

  // Cooldown
  delay(500, () => {
    canFire = true;
  });
});
```

### Timed Challenge

Time-limited task:

```javascript
function startChallenge() {
  challengeActive = true;
  challengeText.text = 'Collect 10 coins in 30 seconds!';

  delay(30000, () => {
    challengeActive = false;

    if (coinsCollected >= 10) {
      showMessage('Challenge Complete!');
    } else {
      showMessage('Challenge Failed!');
    }
  });
}
```

## Clear All Timers

Cancel all active timers at once:

```javascript
import { timerManager } from '@mode-7/zap';

// When changing scenes or ending game
timerManager.clearAll();
```

## API Reference

### `delay(ms, callback)`

Execute callback after delay.

**Parameters**:
- `ms` (number) - Delay in milliseconds
- `callback` (function) - Function to execute

**Returns**: TimerHandle with `cancel()` method

```javascript
const timer = delay(2000, () => {
  console.log('2 seconds later');
});

// Cancel if needed
timer.cancel();
```

### `interval(ms, callback)`

Execute callback repeatedly at interval.

**Parameters**:
- `ms` (number) - Interval in milliseconds
- `callback` (function) - Function to execute

**Returns**: TimerHandle with `cancel()` method

```javascript
const timer = interval(1000, () => {
  console.log('Every second');
});

// Stop interval
timer.cancel();
```

### `wait(ms)`

Promise-based delay.

**Parameters**:
- `ms` (number) - Delay in milliseconds

**Returns**: Promise<void>

```javascript
await wait(1000);
console.log('1 second later');
```

### `timerManager.clearAll()`

Cancel all active timers.

**Returns**: void

```javascript
timerManager.clearAll();
```

## Delay vs Wait

Choose based on your needs:

### Use `delay()` for:

- Simple callbacks
- Non-async code
- When you need cancellation

```javascript
const timer = delay(1000, () => {
  console.log('Done');
});

timer.cancel();  // Can cancel
```

### Use `wait()` for:

- Async/await code
- Sequential operations
- Promise chains

```javascript
async function sequence() {
  await wait(1000);
  console.log('Step 1');

  await wait(1000);
  console.log('Step 2');
}
```

## Performance Considerations

- **Use timers wisely**: Too many timers can impact performance
- **Cancel when done**: Always cancel timers you don't need
- **Clear on scene change**: Use `clearAll()` when switching scenes
- **Prefer tweens for animation**: Use tweens instead of intervals for smooth animation

## Common Mistakes

### Forgetting to cancel

```javascript
// ❌ Wrong - timer keeps running
function startGame() {
  interval(1000, updateScore);
}

// Call multiple times = multiple intervals!
startGame();
startGame();
startGame();

// ✅ Right - store and cancel previous
let scoreTimer = null;

function startGame() {
  if (scoreTimer) {
    scoreTimer.cancel();
  }
  scoreTimer = interval(1000, updateScore);
}
```

### Using delay instead of tween

```javascript
// ❌ Wrong - choppy animation
let x = 0;
interval(16, () => {
  x += 1;
  sprite.x = x;
});

// ✅ Right - smooth tween
sprite.tween({ x: 100 }, { duration: 1000 });
```

### Not handling scene changes

```javascript
// ❌ Wrong - timers continue after scene change
delay(5000, () => {
  // This runs even if scene changed!
  gameScene.showMessage('Time up!');
});

game.setScene(menuScene);  // Scene changed, but timer still runs

// ✅ Right - clear timers on scene change
timerManager.clearAll();
game.setScene(menuScene);
```

## Tips

- **Store timer handles** - Keep references if you need to cancel
- **Use wait() for sequences** - Cleaner than nested delays
- **Clear on cleanup** - Cancel timers in cleanup/destroy methods
- **Avoid tiny intervals** - Use 16ms minimum (60fps), prefer tweens for animation
- **Name your timers** - Use descriptive variable names (e.g., `respawnTimer`)

## Next Steps

- [Tweening](/animation/tweening) - Smooth property animations
- [Scenes](/core/scenes) - Managing game scenes
- [Storage](/utilities/storage) - Saving timer state
