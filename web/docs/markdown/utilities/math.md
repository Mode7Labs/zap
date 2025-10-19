---
title: Math Utilities
description: Helpful math functions for game development
---

# Math Utilities

Zap provides commonly-used math functions for clamping, interpolation, mapping ranges, and random generation.

## Clamp

Constrain a value between minimum and maximum:

```codemirror
import { Game, Scene, Sprite, Text, MathZ } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const player = new Sprite({
  x: 200,
  y: 150,
  width: 50,
  height: 50,
  color: '#e94560',
  radius: 25,
  interactive: true
});

const info = new Text({
  text: 'Drag the circle',
  x: 200,
  y: 30,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

scene.add(player);
scene.add(info);

// Keep player within bounds
player.on('drag', (event) => {
  player.x = MathZ.clamp(player.x + event.delta.x, 50, 350);
  player.y = MathZ.clamp(player.y + event.delta.y, 50, 250);
});

game.setScene(scene);
game.start();
```

## Lerp (Linear Interpolation)

Blend smoothly between two values:

```codemirror
import { Game, Scene, Sprite, MathZ } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const target = new Sprite({
  x: 350,
  y: 150,
  width: 40,
  height: 40,
  color: '#51cf66',
  radius: 20
});

const follower = new Sprite({
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  color: '#4fc3f7',
  radius: 15
});

scene.add(target);
scene.add(follower);

// Smoothly follow target
scene.on('update', () => {
  follower.x = MathZ.lerp(follower.x, target.x, 0.05);
  follower.y = MathZ.lerp(follower.y, target.y, 0.05);
});

// Move target with mouse
game.on('drag', (event) => {
  target.x = event.position.x;
  target.y = event.position.y;
});

game.setScene(scene);
game.start();
```

## Map Range

Convert a value from one range to another:

```javascript
import { MathZ } from '@mode-7/zap';

// Map mouse X (0-400) to rotation (0-2π)
const mouseX = 200;
const rotation = MathZ.map(mouseX, 0, 400, 0, Math.PI * 2);

// Map health (0-100) to color (red to green)
const health = 75;
const greenValue = MathZ.map(health, 0, 100, 0, 255);

// Map distance (0-500) to volume (1.0-0.0)
const distance = 250;
const volume = MathZ.map(distance, 0, 500, 1.0, 0.0);
```

## Random Integer

Generate random whole numbers:

```codemirror
import { Game, Scene, Text, MathZ } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const result = new Text({
  text: 'Click to roll dice',
  x: 200,
  y: 120,
  fontSize: 32,
  color: '#4fc3f7',
  align: 'center'
});

const instruction = new Text({
  text: 'Click anywhere',
  x: 200,
  y: 180,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

scene.add(result);
scene.add(instruction);

game.on('tap', () => {
  const roll = MathZ.randomInt(1, 6);
  result.text = `Rolled: ${roll}`;
});

game.setScene(scene);
game.start();
```

## Random Float

Generate random decimal numbers:

```javascript
import { MathZ } from '@mode-7/zap';

// Random speed between 50 and 150
const speed = MathZ.randomFloat(50, 150);

// Random opacity
const alpha = MathZ.randomFloat(0.5, 1.0);

// Random position
const x = MathZ.randomFloat(0, game.canvas.width);
const y = MathZ.randomFloat(0, game.canvas.height);
```

## Random Item

Pick a random element from an array:

```codemirror
import { Game, Scene, Sprite, Text, MathZ } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const colors = ['#e94560', '#4fc3f7', '#51cf66', '#f39c12', '#9b59b6'];

const box = new Sprite({
  x: 200,
  y: 120,
  width: 100,
  height: 100,
  color: '#4fc3f7',
  radius: 12,
  interactive: true
});

const label = new Text({
  text: 'Click to change color',
  x: 200,
  y: 200,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

scene.add(box);
scene.add(label);

box.on('tap', () => {
  box.color = MathZ.randomItem(colors);
});

game.setScene(scene);
game.start();
```

## Common Patterns

### Smooth Camera Follow

```javascript
import { MathZ } from '@mode-7/zap';

scene.on('update', () => {
  // Smoothly follow player (0.1 = smooth, 1.0 = instant)
  game.camera.x = MathZ.lerp(game.camera.x, player.x, 0.1);
  game.camera.y = MathZ.lerp(game.camera.y, player.y, 0.1);
});
```

### Health Bar Color

```javascript
import { MathZ } from '@mode-7/zap';

function getHealthColor(health, maxHealth) {
  // Clamp health to valid range
  health = MathZ.clamp(health, 0, maxHealth);

  // Map health to hue (0=red, 120=green)
  const hue = MathZ.map(health, 0, maxHealth, 0, 120);

  return `hsl(${hue}, 70%, 50%)`;
}

healthBar.color = getHealthColor(player.health, 100);
```

### Distance-Based Volume

```javascript
import { MathZ } from '@mode-7/zap';

function getVolumeByDistance(distance, maxDistance = 500) {
  const clampedDistance = MathZ.clamp(distance, 0, maxDistance);
  return MathZ.map(clampedDistance, 0, maxDistance, 1.0, 0.0);
}

const dx = player.x - sound.x;
const dy = player.y - sound.y;
const distance = Math.sqrt(dx * dx + dy * dy);

sound.volume = getVolumeByDistance(distance);
```

### Random Enemy Spawn

```javascript
import { MathZ } from '@mode-7/zap';

function spawnEnemy() {
  const types = ['zombie', 'skeleton', 'ghost'];
  const type = MathZ.randomItem(types);

  const enemy = new Sprite({
    x: MathZ.randomInt(50, 350),
    y: MathZ.randomInt(50, 250),
    width: 40,
    height: 40,
    image: assetLoader.getImage(type)
  });

  enemy.speed = MathZ.randomFloat(50, 150);
  enemy.health = MathZ.randomInt(20, 50);

  scene.add(enemy);
}
```

### Constrain to Bounds

```javascript
import { clamp } from '@mode-7/zap';

scene.on('update', (deltaTime) => {
  // Move player
  player.x += velocity.x * deltaTime;
  player.y += velocity.y * deltaTime;

  // Keep within game bounds
  player.x = MathZ.clamp(player.x, 0, game.canvas.width);
  player.y = MathZ.clamp(player.y, 0, game.canvas.height);
});
```

### Smooth Rotation

```javascript
import { lerp } from '@mode-7/zap';

scene.on('update', () => {
  // Calculate target angle to mouse
  const dx = mouse.x - sprite.x;
  const dy = mouse.y - sprite.y;
  const targetAngle = Math.atan2(dy, dx);

  // Smoothly rotate toward target
  sprite.rotation = MathZ.lerp(sprite.rotation, targetAngle, 0.1);
});
```

### Random Particle Spawn

```javascript
import { MathZ } from '@mode-7/zap';

function createParticle(x, y) {
  const colors = ['#ff6b6b', '#f39c12', '#f1c40f'];

  const particle = new Particle({
    x,
    y,
    velocity: {
      x: MathZ.randomFloat(-100, 100),
      y: MathZ.randomFloat(-150, -50)
    },
    color: MathZ.randomItem(colors),
    size: MathZ.randomFloat(4, 10),
    lifetime: MathZ.randomFloat(0.5, 1.5)
  });

  scene.add(particle);
}
```

### Map Joystick to Speed

```javascript
import { map } from '@mode-7/zap';

// Joystick gives -1 to 1
const joystickX = 0.7;

// Map to speed (-200 to 200)
const speedX = MathZ.map(joystickX, -1, 1, -200, 200);

player.velocityX = speedX;
```

### Difficulty Scaling

```javascript
import { MathZ } from '@mode-7/zap';

function getDifficulty(level) {
  // Clamp level to reasonable range
  level = MathZ.clamp(level, 1, 50);

  return {
    enemyCount: Math.floor(MathZ.map(level, 1, 50, 3, 20)),
    enemySpeed: MathZ.map(level, 1, 50, 50, 200),
    enemyHealth: Math.floor(MathZ.map(level, 1, 50, 20, 200)),
    spawnRate: MathZ.map(level, 1, 50, 3000, 500)
  };
}

const difficulty = getDifficulty(currentLevel);
```

### Screenshake Intensity

```javascript
import { MathZ } from '@mode-7/zap';

function shake(damage) {
  // Map damage (0-100) to intensity (0-20)
  const intensity = MathZ.map(MathZ.clamp(damage, 0, 100), 0, 100, 0, 20);
  const duration = MathZ.map(MathZ.clamp(damage, 0, 100), 0, 100, 200, 600);

  game.camera.shake(intensity, duration);
}
```

### Random Color Generation

```javascript
import { MathZ } from '@mode-7/zap';

function randomColor() {
  const r = MathZ.randomInt(0, 255);
  const g = MathZ.randomInt(0, 255);
  const b = MathZ.randomInt(0, 255);

  return `rgb(${r}, ${g}, ${b})`;
}

sprite.color = randomColor();
```

### Weighted Random Choice

```javascript
import { randomFloat } from '@mode-7/zap';

function weightedRandom(items, weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let random = MathZ.randomFloat(0, total);

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

// 70% common, 25% rare, 5% legendary
const loot = weightedRandom(
  ['common', 'rare', 'legendary'],
  [70, 25, 5]
);
```

## API Reference

### `clamp(value, min, max)`

Constrain a value between min and max.

**Parameters**:
- `value` (number) - Value to clamp
- `min` (number) - Minimum value
- `max` (number) - Maximum value

**Returns**: number

```javascript
clamp(150, 0, 100);   // Returns 100
clamp(-10, 0, 100);   // Returns 0
clamp(50, 0, 100);    // Returns 50
```

### `lerp(start, end, t)`

Linear interpolation between two values.

**Parameters**:
- `start` (number) - Start value
- `end` (number) - End value
- `t` (number) - Interpolation factor (0-1)

**Returns**: number

```javascript
lerp(0, 100, 0);     // Returns 0
lerp(0, 100, 0.5);   // Returns 50
lerp(0, 100, 1);     // Returns 100
lerp(0, 100, 0.25);  // Returns 25
```

### `map(value, inMin, inMax, outMin, outMax)`

Map a value from one range to another.

**Parameters**:
- `value` (number) - Value to map
- `inMin` (number) - Input range minimum
- `inMax` (number) - Input range maximum
- `outMin` (number) - Output range minimum
- `outMax` (number) - Output range maximum

**Returns**: number

```javascript
map(50, 0, 100, 0, 1);        // Returns 0.5
map(200, 0, 400, 0, Math.PI * 2);  // Returns π
map(75, 0, 100, 0, 255);      // Returns 191.25
```

### `randomInt(min, max)`

Generate random integer (inclusive).

**Parameters**:
- `min` (number) - Minimum value (inclusive)
- `max` (number) - Maximum value (inclusive)

**Returns**: number

```javascript
randomInt(1, 6);     // Returns 1, 2, 3, 4, 5, or 6
randomInt(0, 10);    // Returns 0 through 10
randomInt(100, 200); // Returns 100 through 200
```

### `randomFloat(min, max)`

Generate random float.

**Parameters**:
- `min` (number) - Minimum value
- `max` (number) - Maximum value

**Returns**: number

```javascript
randomFloat(0, 1);      // Returns 0.0 to 1.0
randomFloat(50, 150);   // Returns 50.0 to 150.0
randomFloat(-1, 1);     // Returns -1.0 to 1.0
```

### `randomItem(items)`

Pick random item from array.

**Parameters**:
- `items` (T[]) - Array of items

**Returns**: T

```javascript
randomItem([1, 2, 3, 4, 5]);           // Returns random number
randomItem(['red', 'blue', 'green']);  // Returns random color
randomItem([weapon1, weapon2]);        // Returns random weapon
```

## Tips

- **Use clamp for boundaries** - Prevent values from going out of range
- **Use lerp for smooth motion** - Better than instant jumps
- **Use map for conversions** - Convert between different value ranges
- **Random for variety** - Add unpredictability to games
- **Combine functions** - Use together for complex behaviors

## Common Mistakes

### Lerp with t > 1

```javascript
// ❌ Wrong - t should be 0-1
const x = lerp(0, 100, 5);  // Overshoots to 500!

// ✅ Right - clamp t to 0-1
const t = clamp(progress, 0, 1);
const x = lerp(0, 100, t);
```

### Map with inverted ranges

```javascript
// ❌ Wrong - ranges don't match direction
const volume = map(distance, 0, 500, 0, 1);  // Volume increases with distance!

// ✅ Right - flip output range
const volume = map(distance, 0, 500, 1, 0);  // Volume decreases with distance
```

### randomInt off-by-one

```javascript
// ❌ Wrong - won't include 6
const roll = randomInt(1, 5);  // Only 1-5

// ✅ Right - inclusive max
const roll = randomInt(1, 6);  // 1-6 (proper die roll)
```

## Next Steps

- [Layout](/utilities/layout) - Uses math for positioning
- [Tweening](/animation/tweening) - Smooth animations with lerp
- [Camera](/core/camera) - Clamping and smooth following
