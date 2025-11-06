---
title: Math Utilities
description: Helpful math functions for game development
---

# Math Utilities

Zap provides commonly-used math functions for clamping, interpolation, mapping ranges, random generation, and vector operations.

## API Reference

### Basic Math

#### `clamp(value, min, max): number`

Constrain a value between min and max.

```javascript
MathZ.clamp(150, 0, 100);   // 100
MathZ.clamp(-10, 0, 100);   // 0
MathZ.clamp(50, 0, 100);    // 50
```

#### `lerp(start, end, t): number`

Linear interpolation between two values. `t` is typically 0-1.

```javascript
MathZ.lerp(0, 100, 0);     // 0
MathZ.lerp(0, 100, 0.5);   // 50
MathZ.lerp(0, 100, 1);     // 100

// Smooth camera follow
camera.x = MathZ.lerp(camera.x, player.x, 0.1);
```

#### `map(value, inMin, inMax, outMin, outMax): number`

Map a value from one range to another.

```javascript
MathZ.map(50, 0, 100, 0, 1);           // 0.5
MathZ.map(200, 0, 400, 0, Math.PI*2);  // π
MathZ.map(75, 0, 100, 0, 255);         // 191.25

// Map health to color hue
const hue = MathZ.map(health, 0, 100, 0, 120);  // 0=red, 120=green
```

### Random Functions

#### `randomInt(min, max): number`

Generate random integer (inclusive on both ends).

```javascript
MathZ.randomInt(1, 6);     // 1, 2, 3, 4, 5, or 6
MathZ.randomInt(0, 10);    // 0 through 10
```

#### `randomFloat(min, max): number`

Generate random float.

```javascript
MathZ.randomFloat(0, 1);      // 0.0 to 1.0
MathZ.randomFloat(50, 150);   // 50.0 to 150.0
```

#### `randomItem<T>(items: T[]): T`

Pick random item from array.

```javascript
MathZ.randomItem([1, 2, 3, 4, 5]);
MathZ.randomItem(['red', 'blue', 'green']);
MathZ.randomItem([weapon1, weapon2, weapon3]);
```

### Distance Functions

#### `distance(x1, y1, x2, y2): number`

Calculate distance between two points.

```javascript
const dist = MathZ.distance(0, 0, 3, 4);  // 5

// Distance from player to enemy
const dist = MathZ.distance(player.x, player.y, enemy.x, enemy.y);
```

#### `distanceSquared(x1, y1, x2, y2): number`

Squared distance (faster, no square root). Use for comparisons.

```javascript
// Check if entities are close (faster than distance())
if (MathZ.distanceSquared(a.x, a.y, b.x, b.y) < 100 * 100) {
  // Within 100 pixels
}
```

### Vector Operations

#### `length(x, y): number`

Calculate vector magnitude/length.

```javascript
const len = MathZ.length(3, 4);  // 5

// Speed of moving object
const speed = MathZ.length(velocityX, velocityY);
```

#### `lengthSquared(x, y): number`

Squared magnitude (faster, no square root).

```javascript
// Check if moving fast enough
if (MathZ.lengthSquared(vx, vy) > minSpeed * minSpeed) {
  // Fast enough
}
```

#### `normalize(x, y): { x: number, y: number }`

Normalize vector to length 1. Returns `{x: 0, y: 0}` if length is 0.

```javascript
const dir = MathZ.normalize(targetX - playerX, targetY - playerY);
// Move in direction
player.x += dir.x * speed * deltaTime;
player.y += dir.y * speed * deltaTime;
```

#### `dot(x1, y1, x2, y2): number`

Dot product of two vectors.

```javascript
const dot = MathZ.dot(v1x, v1y, v2x, v2y);

// Check if facing target (> 0 means same direction)
const facingDir = MathZ.dot(lookX, lookY, toTargetX, toTargetY);
```

### Rotation Functions

#### `rotate(x, y, angle): { x: number, y: number }`

Rotate a point around origin by angle (radians).

```javascript
const rotated = MathZ.rotate(10, 0, Math.PI / 2);  // Rotate 90°
// rotated = { x: 0, y: 10 }
```

#### `rotateAround(x, y, centerX, centerY, angle): { x: number, y: number }`

Rotate a point around a specific center point.

```javascript
// Rotate point around (200, 150) by 45 degrees
const rotated = MathZ.rotateAround(
  pointX, pointY,
  200, 150,
  Math.PI / 4
);
```

## Common Patterns

### Smooth Camera Follow

```javascript
scene.on('update', () => {
  camera.x = MathZ.lerp(camera.x, player.x, 0.1);
  camera.y = MathZ.lerp(camera.y, player.y, 0.1);
});
```

### Health Bar Color

```javascript
function getHealthColor(health, maxHealth) {
  const hue = MathZ.map(
    MathZ.clamp(health, 0, maxHealth),
    0, maxHealth,
    0, 120  // Red to green
  );
  return `hsl(${hue}, 70%, 50%)`;
}
```

### Distance-Based Volume

```javascript
const dist = MathZ.distance(player.x, player.y, soundX, soundY);
const volume = MathZ.map(
  MathZ.clamp(dist, 0, 500),
  0, 500,
  1.0, 0.0
);
```

### Move Toward Target

```javascript
// Normalize direction and move at constant speed
const dir = MathZ.normalize(targetX - x, targetY - y);
x += dir.x * speed * deltaTime;
y += dir.y * speed * deltaTime;
```

### Collision Detection

```javascript
// Use distanceSquared for performance
const minDist = entity1.radius + entity2.radius;
if (MathZ.distanceSquared(e1.x, e1.y, e2.x, e2.y) < minDist * minDist) {
  // Collision!
}
```

### Random Enemy Spawn

```javascript
const types = ['zombie', 'skeleton', 'ghost'];
const enemy = new Sprite({
  x: MathZ.randomInt(50, 350),
  y: MathZ.randomInt(50, 250),
  image: MathZ.randomItem(types)
});
enemy.speed = MathZ.randomFloat(50, 150);
```

## Tips

- **Use `clamp` for boundaries** - Prevent values going out of range
- **Use `lerp` for smooth motion** - Better than instant jumps
- **Use `map` for conversions** - Convert between different value ranges
- **Use squared distance for comparisons** - Much faster, avoid `sqrt()`
- **Normalize before moving** - Ensures constant speed in all directions
- **Cache calculations** - Store `Math.PI` values, don't recalculate

## Common Mistakes

### Lerp with t > 1

```javascript
// ❌ Wrong - t should be 0-1
const x = MathZ.lerp(0, 100, 5);  // Overshoots to 500!

// ✅ Right - clamp t to 0-1
const t = MathZ.clamp(progress, 0, 1);
const x = MathZ.lerp(0, 100, t);
```

### Forgetting to normalize

```javascript
// ❌ Wrong - moves faster diagonally
x += (targetX - x) * 0.1;
y += (targetY - y) * 0.1;

// ✅ Right - normalize for consistent speed
const dir = MathZ.normalize(targetX - x, targetY - y);
x += dir.x * speed * deltaTime;
y += dir.y * speed * deltaTime;
```

### Using distance() for comparisons

```javascript
// ❌ Slow - unnecessary square root
if (MathZ.distance(x1, y1, x2, y2) < 100) { }

// ✅ Fast - use distanceSquared
if (MathZ.distanceSquared(x1, y1, x2, y2) < 100 * 100) { }
```

## Next Steps

- [Layout](/utilities/layout) - Positioning helpers using math
- [Tweening](/animation/tweening) - Smooth animations with lerp
- [Camera](/core/camera) - Clamping and smooth following
