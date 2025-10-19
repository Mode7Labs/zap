---
title: Collision Detection
description: Detect overlaps and handle collisions between entities
---

# Collision Detection

Zap provides built-in collision detection using Axis-Aligned Bounding Boxes (AABB) with event-based collision handling.

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
  radius: 25
});

scene.add(player);
scene.add(enemy);

// Enable collision checking
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
    radius: 15
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

Activate when player gets close:

```javascript
scene.on('update', () => {
  const distance = player.distanceTo(npc);

  if (distance < 50) {
    // Show interaction prompt
    promptText.visible = true;

    // Press E to interact
    if (keyboard.isPressed('e')) {
      startDialogue();
    }
  } else {
    promptText.visible = false;
  }
});
```

### Collision Groups

Multiple collision layers:

```javascript
// Setup
const player = new Sprite({ /* ... */ });
player.checkCollisions = true;
player.collisionTags = ['enemy', 'collectible', 'wall'];

// Enemies
const enemy = new Sprite({ /* ... */ });
enemy.addTag('enemy');

// Walls
const wall = new Sprite({ /* ... */ });
wall.addTag('wall');

// Collectibles
const coin = new Sprite({ /* ... */ });
coin.addTag('collectible');

// Handle different collision types
player.on('collisionenter', (event) => {
  const other = event.other;

  if (other.hasTag('enemy')) {
    player.health -= 20;
  } else if (other.hasTag('collectible')) {
    player.score += 10;
    other.destroy();
  } else if (other.hasTag('wall')) {
    // Stop movement (simple approach)
    player.velocityX = 0;
    player.velocityY = 0;
  }
});
```

### Knockback on Hit

Push player away from enemy:

```javascript
player.on('collisionenter', (event) => {
  if (event.other.hasTag('enemy')) {
    player.health -= 10;

    // Calculate knockback direction
    const dx = player.x - event.other.x;
    const dy = player.y - event.other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and apply knockback
    player.velocityX = (dx / distance) * 200;
    player.velocityY = (dy / distance) * 200;

    // Flash red
    player.color = '#e94560';
    delay(200, () => {
      player.color = '#4fc3f7';
    });
  }
});
```

### Door Unlock

Collision with key unlocks door:

```javascript
const player = new Sprite({ /* ... */ });
player.checkCollisions = true;
player.collisionTags = ['key', 'door'];
player.hasKey = false;

player.on('collisionenter', (event) => {
  if (event.other.hasTag('key')) {
    player.hasKey = true;
    event.other.destroy();
    showMessage('Key obtained!');
  } else if (event.other.hasTag('door')) {
    if (player.hasKey) {
      event.other.destroy();
      showMessage('Door unlocked!');
    } else {
      showMessage('Door is locked. Find a key!');
    }
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

## Limitations

- **AABB Only**: Uses axis-aligned bounding boxes (rectangles)
- **No rotation**: Rotated entities still use upright bounding boxes
- **No physics**: Collision detection only, no automatic physics response

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
