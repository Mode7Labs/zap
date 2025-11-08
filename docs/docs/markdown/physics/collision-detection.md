---
title: Collision Detection
description: Detect overlaps and handle collisions between entities
---

# Collision Detection

Zap provides built-in shape-aware collision detection with event-based collision handling. It automatically uses circle collision for entities with `radius` and rectangle collision (AABB) for entities with `width`/`height`.

## Important: How Collision Detection Works

Collision detection in Zap is **automatic** and **event-driven**. Just enable it and listen for events:

1. **Enable collision checking** on the entity: `entity.checkCollisions = true`
2. **Listen for collision events**: `entity.on('collisionenter', ...)`

The Scene automatically checks collisions every frame for all entities with `checkCollisions = true`.

## Basic Collision

Detect when two entities overlap:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const player = new Sprite({
  x: 100,
  y: 150,
  width: 50,
  height: 50,
  color: '#4fc3f7',
  radius: 25,
  interactive: true
});

const enemy = new Sprite({
  x: 300,
  y: 150,
  width: 50,
  height: 50,
  color: '#e94560',
  radius: 25,
  checkCollisions: true
});

scene.add(player);
scene.add(enemy);

// Enable collision checking on player
player.checkCollisions = true;

// Listen for collisions
player.on('collisionenter', (event) => {
  console.log('Hit enemy!');
  player.color = '#f39c12';
});

player.on('collisionexit', () => {
  console.log('Separated from enemy');
  player.color = '#4fc3f7';
});

// Make player draggable
player.on('drag', (event) => {
  player.x += event.delta.x;
  player.y += event.delta.y;
});

game.setScene(scene);
game.start();
```

## Static vs Dynamic Objects

Entities can be marked as **static** (immovable) or **dynamic** (movable):

```javascript
// Dynamic object (default) - can move and respond to physics
const player = new Sprite({
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  vx: 0,
  vy: 0,
  gravity: 980,
  checkCollisions: true,
  static: false  // Default, can be omitted
});

// Static object - immovable (walls, platforms, obstacles)
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

**Key Differences:**
- **Dynamic objects** (`static: false` or omitted):
  - Can move and respond to physics (velocity, gravity, friction)
  - Automatically bounce off static objects when colliding
  - Can push other dynamic objects

- **Static objects** (`static: true`):
  - Cannot be moved by collisions
  - Don't need physics properties (vx, vy, gravity, etc.)
  - Perfect for walls, platforms, and terrain
  - More efficient - no physics calculations needed

## Physics Integration

When entities have both **collision detection** and **physics properties** enabled, they automatically respond to collisions:

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
  bounciness: 0.8,       // Bounce energy retention
  checkCollisions: true  // Enable automatic collision response
});

const floor = new Sprite({
  x: 200,
  y: 280,
  width: 400,
  height: 40,
  checkCollisions: true,
  static: true  // Immovable platform
});

scene.add(ball);
scene.add(floor);

// Ball automatically bounces off floor - no manual bounce() needed!
// The bounciness property controls how much energy is retained
```

**Automatic Behaviors:**
- Dynamic objects **bounce off** static objects based on `bounciness` property
- Overlapping entities are **automatically separated**
- Velocity is **adjusted** to prevent tunneling through objects
- Collision **events still fire** for custom game logic

**Manual Control:**
If you want full control over collision response, disable automatic response by not setting physics properties, and use the collision events:

```javascript
player.on('collisionenter', (event) => {
  if (event.other.hasTag('wall')) {
    // Custom response - stop movement
    player.vx = 0;
    player.vy = 0;
  }
});
```

## Collision Events

Three collision events are available:

### collisionenter

Fired once when collision starts:

```javascript
player.on('collisionenter', (event) => {
  console.log('Collision started with:', event.other);
  playSound('hit');
});
```

### collide

Fired every frame while colliding:

```javascript
player.on('collide', (event) => {
  // Continuous collision
  player.health -= 0.1 * deltaTime;
});
```

### collisionexit

Fired once when collision ends:

```javascript
player.on('collisionexit', (event) => {
  console.log('Collision ended with:', event.other);
});
```

## Manual Collision Check

Check collision without events:

```javascript
if (player.intersects(enemy)) {
  console.log('Player touching enemy!');
}
```

## Collision Tags

Filter collisions by tags:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const player = new Sprite({
  x: 100,
  y: 150,
  width: 40,
  height: 40,
  color: '#4fc3f7',
  radius: 20,
  interactive: true,
  checkCollisions: true
});

// Only collide with entities tagged 'coin'
player.collisionTags = ['coin'];

// Create coins
for (let i = 0; i < 3; i++) {
  const coin = new Sprite({
    x: 200 + i * 70,
    y: 150,
    width: 30,
    height: 30,
    color: '#f39c12',
    radius: 15,
    checkCollisions: true
  });

  coin.addTag('coin');
  scene.add(coin);
}

// Create enemies (won't collide with player)
const enemy = new Sprite({
  x: 300,
  y: 200,
  width: 40,
  height: 40,
  color: '#e94560',
  radius: 20
});

enemy.addTag('enemy');
scene.add(enemy);
scene.add(player);

// Collect coins
player.on('collisionenter', (event) => {
  if (event.other.hasTag('coin')) {
    event.other.destroy();
    console.log('Coin collected!');
  }
});

// Drag player
player.on('drag', (event) => {
  player.x += event.delta.x;
  player.y += event.delta.y;
});

game.setScene(scene);
game.start();
```

## Distance Check

Check distance between entities:

```javascript
const distance = player.distanceTo(enemy);

if (distance < 100) {
  console.log('Enemy nearby!');
}
```

## Contains Point

Check if a point is inside an entity:

```javascript
game.on('tap', (event) => {
  if (player.containsPoint(event.position.x, event.position.y)) {
    console.log('Clicked on player!');
  }
});
```

## Get Bounding Box

Access entity bounds:

```javascript
const bounds = player.getBounds();

console.log('Left:', bounds.left);
console.log('Right:', bounds.right);
console.log('Top:', bounds.top);
console.log('Bottom:', bounds.bottom);
```

## Common Patterns

### Player vs Enemies

Detect when player hits enemies:

```javascript
const player = new Sprite({ /* ... */ });
player.checkCollisions = true;
player.collisionTags = ['enemy'];

const enemies = [];
for (let i = 0; i < 5; i++) {
  const enemy = new Sprite({ /* ... */ });
  enemy.addTag('enemy');
  enemies.push(enemy);
  scene.add(enemy);
}

player.on('collisionenter', (event) => {
  if (event.other.hasTag('enemy')) {
    player.health -= 20;
    event.other.destroy();
  }
});
```

### Collectibles

Pickup coins, powerups, etc:

```javascript
const player = new Sprite({ /* ... */ });
player.checkCollisions = true;
player.collisionTags = ['collectible'];

let score = 0;

player.on('collisionenter', (event) => {
  const item = event.other;

  if (item.hasTag('coin')) {
    score += 10;
    item.destroy();
    playSound('coin');
  } else if (item.hasTag('powerup')) {
    player.invincible = true;
    item.destroy();

    delay(5000, () => {
      player.invincible = false;
    });
  }
});
```

### Trigger Zones

Areas that activate when player enters:

```javascript
const trigger = new Sprite({
  x: 300,
  y: 200,
  width: 100,
  height: 100,
  color: '#51cf66',
  alpha: 0.3  // Semi-transparent
});

trigger.addTag('trigger');
scene.add(trigger);

player.checkCollisions = true;
player.collisionTags = ['trigger'];

player.on('collisionenter', (event) => {
  if (event.other.hasTag('trigger')) {
    console.log('Entered trigger zone!');
    openDoor();
  }
});

player.on('collisionexit', (event) => {
  if (event.other.hasTag('trigger')) {
    console.log('Left trigger zone!');
    closeDoor();
  }
});
```

### Bullet Collision

Projectiles hitting targets:

```javascript
function fireBullet() {
  const bullet = new Sprite({
    x: player.x,
    y: player.y,
    width: 10,
    height: 10,
    color: '#fff',
    radius: 5,
    checkCollisions: true,
    collisionTags: ['enemy']
  });

  bullet.velocityX = 300;
  scene.add(bullet);

  bullet.on('collisionenter', (event) => {
    if (event.other.hasTag('enemy')) {
      event.other.health -= 10;
      bullet.destroy();
    }
  });
}
```

### Platform Collision

Simple platform detection:

```javascript
player.checkCollisions = true;
player.collisionTags = ['platform'];

player.on('collisionenter', (event) => {
  if (event.other.hasTag('platform')) {
    // Stop falling
    player.velocityY = 0;
    player.onGround = true;

    // Position on top of platform
    const platformTop = event.other.getBounds().top;
    player.y = platformTop - player.height / 2;
  }
});

player.on('collisionexit', (event) => {
  if (event.other.hasTag('platform')) {
    player.onGround = false;
  }
});
```

### Proximity Detection

```javascript
scene.on('update', () => {
  if (player.distanceTo(npc) < 50) {
    promptText.visible = true;
    if (keyboard.isPressed('e')) startDialogue();
  } else {
    promptText.visible = false;
  }
});
```

### Knockback on Hit

```javascript
player.on('collisionenter', (event) => {
  if (event.other.hasTag('enemy')) {
    const dx = player.x - event.other.x;
    const dy = player.y - event.other.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    player.vx = (dx / dist) * 200;
    player.vy = (dy / dist) * 200;
  }
});
```

## Performance Tips

The Scene automatically optimizes collision detection by:

- Only checking entities with `checkCollisions = true`
- Skipping inactive entities
- Using efficient AABB overlap tests

For large numbers of entities (100+), consider:

- Using `collisionTags` to filter what each entity collides with
- Only enabling `checkCollisions` on entities that need it
- Using `distanceTo()` for proximity checks before expensive operations

## API Reference

### `entity.intersects(other)`

Check if two entities overlap.

**Parameters**:
- `other` (Entity) - Entity to check against

**Returns**: boolean

```javascript
if (player.intersects(enemy)) {
  console.log('Collision!');
}
```

### `entity.checkCollision(other)`

Manually check collision with a specific entity and emit events.

**Note**: The Scene automatically calls this for all entities with `checkCollisions = true`. Only use this method for advanced scenarios where you need manual control.

**Parameters**:
- `other` (Entity) - Entity to check against

**Returns**: void

```javascript
// Advanced: Manual collision check
player.checkCollision(enemy);
```

### `entity.distanceTo(other)`

Get distance between entities.

**Parameters**:
- `other` (Entity) - Entity to measure to

**Returns**: number

```javascript
const distance = player.distanceTo(enemy);
```

### `entity.containsPoint(x, y)`

Check if point is inside entity.

**Parameters**:
- `x` (number) - X coordinate
- `y` (number) - Y coordinate

**Returns**: boolean

```javascript
if (entity.containsPoint(mouseX, mouseY)) {
  console.log('Mouse over entity!');
}
```

### `entity.getBounds()`

Get entity bounding box.

**Returns**: { left, right, top, bottom }

```javascript
const bounds = entity.getBounds();
console.log(bounds.left, bounds.right, bounds.top, bounds.bottom);
```

### `entity.getCollisions()`

Get all currently colliding entities.

**Returns**: Entity[]

```javascript
const colliding = player.getCollisions();
console.log(`Colliding with ${colliding.length} entities`);
```

## Properties

### `checkCollisions`

Enable/disable collision checking:

```javascript
entity.checkCollisions = true;  // Enable
entity.checkCollisions = false; // Disable
```

### `collisionTags`

Filter which entities to collide with:

```javascript
entity.collisionTags = ['enemy', 'wall'];
```

### `static`

Mark entity as immovable by collisions:

```javascript
entity.static = true;  // Immovable (walls, platforms)
entity.static = false; // Movable (default)
```

Static entities:
- Cannot be moved by collision forces
- Don't need physics properties (vx, vy, gravity)
- More efficient for fixed obstacles
- Dynamic objects automatically bounce off them

## Collision Detection Types

Zap automatically detects the collision type based on entity properties:

- **Circle collision**: When entity has `radius` property that matches its dimensions (within 20% tolerance)
- **Rectangle collision**: When entity has `width` and `height` properties
- **Rotated rectangle collision**: Automatically uses SAT (Separating Axis Theorem) for accurate rotated rectangle detection
- **Circle-rectangle**: Automatically handled when checking between different types

This means you get accurate collision detection without any extra configuration!

### Shape Detection

Zap intelligently determines whether to use circle or rectangle collision:

```javascript
// Circle - radius matches dimensions
const circle = new Sprite({
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  radius: 20  // 20 = 40/2, so this is treated as a circle
});

// Rounded rectangle - radius is just for visual corners
const roundedRect = new Sprite({
  x: 200,
  y: 100,
  width: 80,
  height: 40,
  radius: 8  // Small radius = visual rounding only, uses rectangle collision
});
```

## Advanced Features

### Continuous Collision Detection (CCD)

Zap automatically prevents fast-moving objects from tunneling through walls using binary search-based swept collision detection. This works seamlessly with all collision types including rotated rectangles.

```javascript
const bullet = new Sprite({
  x: 50,
  y: 100,
  width: 10,
  height: 10,
  vx: 2000,  // Very fast - won't tunnel!
  checkCollisions: true
});
```

No configuration needed - CCD is always active for entities with `checkCollisions` enabled.

### Velocity Constraints

Dynamic objects automatically have their velocity adjusted when pushing into static surfaces to prevent tunneling and jittery behavior:

```javascript
const ball = new Sprite({
  x: 100,
  y: 100,
  width: 30,
  height: 30,
  radius: 15,
  vx: 0,
  vy: 0,
  gravity: 980,
  friction: 0.995,
  bounciness: 0.9,
  checkCollisions: true
});
```

When the ball hits a wall, its velocity is automatically projected along the collision normal to prevent it from pushing through. Gentle rolling motion (< 50 px/s) is preserved to avoid sticky behavior.

## Limitations

- **Automatic physics** only applies to entities with physics properties (vx, vy, gravity, etc.) - for custom collision response, use collision events

## Tips

- **Use tags** - Organize entities with collision tags for filtering
- **Enable selectively** - Only set `checkCollisions = true` on entities that need it
- **Handle in events** - Use collision events for clean separation of concerns
- **Filter with tags** - Use `collisionTags` to limit what each entity collides with
- **Use intersects() for one-time checks** - For simple overlap tests without events

## Common Mistakes

### Forgetting to enable

```javascript
// ❌ Wrong - checkCollisions not enabled
player.on('collisionenter', () => { /* never fires */ });

// ✅ Right - enable collision checking
player.checkCollisions = true;
player.on('collisionenter', () => { /* fires correctly */ });
```

### Wrong event

```javascript
// ❌ Wrong - 'collision' event doesn't exist
player.on('collision', () => { /* never fires */ });

// ✅ Right - use correct event names
player.on('collisionenter', () => { /* ... */ });
player.on('collide', () => { /* ... */ });
player.on('collisionexit', () => { /* ... */ });
```

## Next Steps

- [Entities](/core/entities) - Understanding entity system
- [Tags](/core/entities#tags) - Using tags for organization
- [Events](/core/entities#events) - Entity event system
