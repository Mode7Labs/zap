---
title: Physics
description: Built-in velocity, gravity, and friction for realistic movement
---

# Physics

Zap provides built-in physics simulation with velocity, gravity, and friction. Physics properties work on all entities automatically - just set velocity and the entity will move!

## Quick Start

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create a ball with physics
const ball = new Sprite({
  x: 200,
  y: 50,
  width: 40,
  height: 40,
  radius: 20,    // Makes it a circle
  color: '#4fc3f7',
  vx: 100,       // Horizontal velocity (pixels/sec)
  vy: 0,         // Vertical velocity (pixels/sec)
  gravity: 980,  // Gravity acceleration (pixels/sec²)
  friction: 0.99 // Friction multiplier (0.99 = 1% loss)
});

scene.add(ball);

// Bounce off screen edges
scene.on('update', () => {
  const r = 20; // Ball radius

  // Bottom
  if (ball.y + r > game.height) {
    ball.y = game.height - r;
    ball.bounce(0, 1, 0.7); // Bounce up with 70% energy
  }

  // Sides
  if (ball.x - r < 0) {
    ball.x = r;
    ball.bounce(-1, 0, 0.9);
  }
  if (ball.x + r > game.width) {
    ball.x = game.width - r;
    ball.bounce(1, 0, 0.9);
  }
});

game.setScene(scene);
game.start();
```

## Physics Properties

### Velocity (vx, vy)

Velocity is the speed of movement in pixels per second:

```javascript
const sprite = new Sprite({
  x: 100,
  y: 100,
  vx: 150,    // Move right at 150 pixels/second
  vy: -200    // Move up at 200 pixels/second
});

// Change velocity at runtime
sprite.vx = 0;     // Stop horizontal movement
sprite.vy = -500;  // Jump up
```

### Gravity

Gravity accelerates entities downward (or upward if negative):

```javascript
const ball = new Sprite({
  x: 200,
  y: 100,
  vy: 0,
  gravity: 980  // Earth-like gravity (pixels/sec²)
});

// Gravity affects vy every frame
// Positive = falls down
// Negative = floats up
// 0 or undefined = no gravity
```

**Common gravity values:**
- `980` - Earth-like gravity
- `1500` - Heavy/fast falling
- `500` - Moon-like, floaty
- `-100` - Gentle upward drift
- `0` - No gravity (space)

### Friction

Friction reduces velocity over time:

```javascript
const sprite = new Sprite({
  x: 100,
  y: 100,
  vx: 300,
  friction: 0.98  // 2% velocity loss per frame
});

// Friction values:
// 1.0  = no friction
// 0.99 = very slight slowdown
// 0.95 = medium slowdown
// 0.8  = heavy drag
// 0.5  = stops quickly
```

### Bounciness

Bounciness controls energy retention when bouncing off surfaces:

```javascript
const ball = new Sprite({
  x: 200,
  y: 100,
  width: 40,
  height: 40,
  radius: 20,
  vx: 150,
  vy: 0,
  gravity: 980,
  bounciness: 0.8,       // Retain 80% of energy when bouncing
  checkCollisions: true  // Enable automatic collision response
});
```

**Bounciness values:**
- `1.0` - Perfect bounce (no energy loss)
- `0.8` - Realistic bounce (20% energy loss)
- `0.5` - Soft bounce (50% energy loss)
- `0.0` - No bounce (sticks to surface)

**Note**: Bounciness is used automatically when `checkCollisions` is enabled. Entities bounce off static objects (walls, platforms) with no manual bounce() calls needed!

### Static Objects

Mark objects as immovable (walls, platforms, obstacles):

```javascript
const wall = new Sprite({
  x: 300,
  y: 200,
  width: 100,
  height: 400,
  color: '#2c3e50',
  checkCollisions: true,
  static: true  // Cannot be moved by collisions
});
```

**Static vs Dynamic:**
- `static: true` - Immovable (walls, platforms, terrain)
- `static: false` (default) - Can move and respond to physics
- Static objects don't need physics properties (vx, vy, gravity, etc.)
- Dynamic objects automatically bounce off static objects

## Bouncing

Use the `bounce()` method to reflect velocity off surfaces:

```javascript
ball.bounce(normalX, normalY, restitution);
```

**Parameters:**
- `normalX, normalY` - Surface normal (perpendicular direction)
- `restitution` - Bounciness (0 = no bounce, 1 = perfect bounce)

### Bounce Examples

```javascript
// Bounce off floor (normal points up)
ball.bounce(0, 1, 0.8);

// Bounce off ceiling (normal points down)
ball.bounce(0, -1, 0.8);

// Bounce off left wall (normal points right)
ball.bounce(1, 0, 0.8);

// Bounce off right wall (normal points left)
ball.bounce(-1, 0, 0.8);

// Bounce off diagonal surface (45°)
const normalX = Math.cos(Math.PI / 4);
const normalY = Math.sin(Math.PI / 4);
ball.bounce(normalX, normalY, 0.8);
```

## Common Patterns

### Falling Object

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const box = new Sprite({
  x: 200,
  y: 50,
  width: 40,
  height: 40,
  color: '#e94560',
  radius: 5,
  vy: 0,
  gravity: 980
});

scene.add(box);

// Stop at bottom
scene.on('update', () => {
  if (box.y + box.height / 2 > game.height) {
    box.y = game.height - box.height / 2;
    box.vy = 0;
    box.gravity = 0;
  }
});

game.setScene(scene);
game.start();
```

### Platformer Jump

```javascript
const player = new Sprite({
  x: 100,
  y: 250,
  width: 40,
  height: 60,
  vx: 0,
  vy: 0,
  gravity: 1500
});

let onGround = false;

// Jump on tap
player.on('tap', () => {
  if (onGround) {
    player.vy = -600;  // Jump velocity
    onGround = false;
  }
});

// Move left/right
scene.on('update', () => {
  if (keyboard.isPressed('ArrowLeft')) {
    player.vx = -200;
  } else if (keyboard.isPressed('ArrowRight')) {
    player.vx = 200;
  } else {
    player.vx = 0;
  }

  // Check ground collision
  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    onGround = true;
  }
});
```

### Projectile Launch

```javascript
const projectile = new Sprite({
  x: player.x,
  y: player.y,
  width: 16,
  height: 16,
  radius: 8,
  color: '#f39c12',
  vx: 400,     // Launch velocity
  vy: -300,
  gravity: 980,
  friction: 0.99
});

scene.add(projectile);

// Follows realistic ballistic arc automatically
```

### Bouncing Ball

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const ball = new Sprite({
  x: 200,
  y: 150,
  width: 30,
  height: 30,
  radius: 15,
  color: '#51cf66',
  vx: 200,
  vy: -300,
  gravity: 980,
  friction: 0.995
});

scene.add(ball);

// Bounce off all edges
scene.on('update', () => {
  const r = 15; // Ball radius

  // Floor
  if (ball.y + r > game.height) {
    ball.y = game.height - r;
    ball.bounce(0, 1, 0.7);
  }

  // Ceiling
  if (ball.y - r < 0) {
    ball.y = r;
    ball.bounce(0, -1, 0.7);
  }

  // Left wall
  if (ball.x - r < 0) {
    ball.x = r;
    ball.bounce(-1, 0, 0.9);
  }

  // Right wall
  if (ball.x + r > game.width) {
    ball.x = game.width - r;
    ball.bounce(1, 0, 0.9);
  }
});

game.setScene(scene);
game.start();
```

### Bouncing Off Entities

```javascript
ball.checkCollisions = true;

ball.on('collide', ({ other }) => {
  if (other.hasTag('bumper')) {
    const dx = ball.x - other.x;
    const dy = ball.y - other.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) ball.bounce(dx / len, dy / len, 0.8);
  }
});
```

### Slingshot Launch

```javascript
const bird = new Sprite({
  x: 100, y: 400, radius: 15,
  color: '#e94560', interactive: true
});

bird.on('dragend', () => {
  const dx = 100 - bird.x;
  const dy = 400 - bird.y;
  bird.vx = dx * 3;
  bird.vy = dy * 3;
  bird.gravity = 980;
});
```

## Combining with Collision Detection

Physics and collision detection work great together:

```javascript
const ball = new Sprite({
  x: 200,
  y: 100,
  width: 30,
  height: 30,
  radius: 15,
  vx: 200,
  vy: 0,
  gravity: 980,
  friction: 0.99,
  checkCollisions: true,
  collisionTags: ['bumper', 'wall']
});

const bumper = new Sprite({
  x: 300,
  y: 250,
  width: 80,
  height: 80,
  radius: 40,
  color: '#e94560'
});
bumper.addTag('bumper');

// Bounce on collision
ball.on('collide', ({ other }) => {
  const dx = ball.x - other.x;
  const dy = ball.y - other.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len > 0) {
    ball.bounce(dx / len, dy / len, 0.8);
  }
});
```

## Performance Tips

- Physics only runs when `vx` or `vy` is set (zero overhead otherwise)
- Set `vx` and `vy` to `undefined` to completely disable physics
- Use friction to gradually stop entities instead of setting velocity to 0
- Friction applies every frame, so values close to 1.0 are most realistic

## API Reference

### Properties

```typescript
entity.vx: number | undefined      // Horizontal velocity (pixels/sec)
entity.vy: number | undefined      // Vertical velocity (pixels/sec)
entity.gravity: number | undefined // Gravity acceleration (pixels/sec²)
entity.friction: number | undefined // Friction multiplier (0-1)
```

### Methods

```typescript
// Bounce off a surface
entity.bounce(
  normalX: number,     // X component of surface normal
  normalY: number,     // Y component of surface normal
  restitution: number  // Bounciness (0-1), defaults to 0.8
): void
```

## Tips

- **Gravity affects vy only** - Horizontal velocity (vx) is not affected by gravity
- **Friction affects both vx and vy** - Reduces all velocity over time
- **Delta time is handled automatically** - Velocity values are in pixels/second
- **Combine with tweens** - Use physics for natural motion, tweens for controlled animation
- **Set to undefined to disable** - `entity.vx = undefined` stops physics updates

## Common Mistakes

### Forgetting to set initial velocity

```javascript
// ❌ Wrong - gravity won't move entity without vy
const ball = new Sprite({ gravity: 980 });

// ✅ Right - set initial velocity
const ball = new Sprite({ vy: 0, gravity: 980 });
```

### Using friction > 1.0

```javascript
// ❌ Wrong - friction > 1 increases velocity!
entity.friction = 1.5;

// ✅ Right - friction should be 0-1
entity.friction = 0.98;
```

### Incorrect bounce normal

```javascript
// ❌ Wrong - normal should be normalized (length = 1)
ball.bounce(10, 5, 0.8);

// ✅ Right - normalize the normal vector
const dx = 10, dy = 5;
const len = Math.sqrt(dx*dx + dy*dy);
ball.bounce(dx/len, dy/len, 0.8);
```

## Next Steps

- [Collision Detection](/physics/collision-detection) - Detect and respond to collisions
- [Particles](/animation/particles) - Particles use the same physics system
- [Tweening](/animation/tweening) - Combine physics with animated transitions
