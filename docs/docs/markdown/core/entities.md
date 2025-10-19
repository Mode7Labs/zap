---
title: Entities
description: Understanding the entity system and lifecycle
---

# Entities

Entities are the building blocks of your game. Everything you see on screen is an entity - sprites, text, buttons, and more.

## Entity Types

Zap provides several built-in entity types:

- **Sprite** - Colored rectangles and image sprites
- **Text** - Rendered text with custom fonts
- **Button** - Interactive UI buttons
- **AnimatedSprite** - Frame-by-frame animations
- **NinePatch** - Scalable UI panels

All entities extend the base `Entity` class and share common properties and methods.

## Common Properties

### Transform Properties

Every entity has transform properties:

```javascript
const sprite = new Sprite({
  x: 100,           // X position
  y: 100,           // Y position
  rotation: 0,      // Rotation in radians
  scaleX: 1,        // Horizontal scale
  scaleY: 1,        // Vertical scale
  alpha: 1          // Opacity (0-1)
});

// Modify after creation
sprite.x = 200;
sprite.rotation = Math.PI / 4;
sprite.alpha = 0.5;
```

### Size Properties

Control entity dimensions:

```javascript
const sprite = new Sprite({
  width: 100,
  height: 100
});
```

### Anchor Point

The anchor determines the origin point for transformations:

```javascript
const sprite = new Sprite({
  anchorX: 0.5,  // Center horizontally (default)
  anchorY: 0.5   // Center vertically (default)
});

// Top-left anchor
sprite.anchorX = 0;
sprite.anchorY = 0;

// Bottom-right anchor
sprite.anchorX = 1;
sprite.anchorY = 1;
```

Anchor values range from 0 to 1:
- `0` = left/top edge
- `0.5` = center (default)
- `1` = right/bottom edge

### Visibility

Control whether an entity renders:

```javascript
sprite.visible = true;   // Render (default)
sprite.visible = false;  // Don't render
```

Hidden entities still update but don't draw.

### Z-Index

Control render order:

```javascript
background.zIndex = 0;   // Render first (back)
player.zIndex = 10;      // Render middle
ui.zIndex = 100;         // Render last (front)
```

Higher z-index renders on top.

## Interactivity

Make entities respond to gestures:

```javascript
const sprite = new Sprite({
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  interactive: true  // Enable gestures
});

sprite.on('tap', () => {
  console.log('Tapped!');
});

sprite.on('drag', (e) => {
  sprite.x = e.x;
  sprite.y = e.y;
});
```

Available gesture events:
- `tap` - Quick touch/click
- `drag` - Move while holding
- `swipe` - Quick swipe gesture
- `longpress` - Hold for duration

## Tags

Tag entities for easy grouping and retrieval:

```javascript
player.addTag('player');
player.addTag('friendly');

enemy.addTag('enemy');
enemy.addTag('hostile');

// Check tags
if (entity.hasTag('enemy')) {
  // Handle enemy
}

// Find by tag
const enemies = scene.getEntitiesByTag('enemy');
```

## Hierarchy

Create parent-child relationships:

```javascript
const parent = new Sprite({
  x: 100,
  y: 100,
  width: 100,   // Dimensions needed for interactive containers
  height: 100
});

const child = new Sprite({
  x: 50,
  y: 0,
  width: 30,
  height: 30,
  color: '#4fc3f7'
});

parent.addChild(child);

// Child transforms relative to parent
parent.rotation = Math.PI / 4;  // Child rotates too
parent.x = 200;                  // Child moves too
```

**IMPORTANT**: If the parent sprite is `interactive: true`, it **must have `width` and `height`** specified. Without dimensions, gesture detection won't work because there's no hit area to detect touches.

```javascript
// ❌ WRONG - Interactive container without dimensions
const cardGroup = new Sprite({
  x: 200, y: 150,
  interactive: true  // Won't work without width/height!
});

// ✅ CORRECT - Interactive container with dimensions
const cardGroup = new Sprite({
  x: 200, y: 150,
  width: 300,   // Must specify for gestures to work
  height: 400,
  interactive: true
});
```

Remove children:

```javascript
parent.removeChild(child);
```

## Animation (Tweening)

Animate entity properties smoothly:

```javascript
sprite.tween(
  { x: 400, rotation: Math.PI },
  { duration: 1000, easing: 'easeInOutQuad' }
);
```

Chain animations:

```javascript
sprite.tween(
  { x: 400 },
  { duration: 500 }
).then(() => {
  return sprite.tween(
    { y: 300 },
    { duration: 500 }
  );
});
```

Loop forever:

```javascript
sprite.tween(
  { rotation: Math.PI * 2 },
  { duration: 2000, loop: true }
);
```

## Complete Example

Here's an entity using many features:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create a player sprite
const player = new Sprite({
  x: 200,
  y: 150,
  width: 40,
  height: 40,
  color: '#e94560',
  anchorX: 0.5,
  anchorY: 0.5,
  interactive: true,
  zIndex: 10
});

// Add tag
player.addTag('player');

// Make it draggable
player.on('drag', (e) => {
  player.x = e.x;
  player.y = e.y;
});

// Rotate on tap
player.on('tap', () => {
  player.tween(
    { rotation: player.rotation + Math.PI * 2 },
    { duration: 500, easing: 'easeOutBack' }
  );
});

// Create a child that orbits
const child = new Sprite({
  x: 60,
  y: 0,
  width: 20,
  height: 20,
  color: '#4fc3f7',
  anchorX: 0.5,
  anchorY: 0.5
});

player.addChild(child);

// Animate child orbit
child.tween(
  { rotation: Math.PI * 2 },
  { duration: 3000, loop: true }
);

scene.add(player);
game.setScene(scene);
game.start();
```

## Lifecycle

Entities have a simple lifecycle:

1. **Created** - `new Sprite()`
2. **Added to Scene** - `scene.add(entity)`
3. **Updated & Rendered** - Every frame while in scene
4. **Removed from Scene** - `scene.remove(entity)`

Handle lifecycle events:

```javascript
// When added to scene
entity.on('added', () => {
  console.log('Added to scene');
});

// When removed from scene
entity.on('removed', () => {
  console.log('Removed from scene');
});
```

## Best Practices

1. **Reuse entities** - Don't create/destroy frequently
2. **Use tags** - Group related entities
3. **Set z-index** - Control render order explicitly
4. **Parent wisely** - Use hierarchy for related transforms
5. **Clean up listeners** - Remove event listeners when done
6. **Hide vs Remove** - Use `visible = false` for temporary hiding

## Common Patterns

### Object Pooling

Reuse entities instead of creating new ones:

```javascript
const bulletPool = [];

function getBullet() {
  return bulletPool.pop() || new Sprite({ width: 5, height: 10 });
}

function releaseBullet(bullet) {
  bullet.visible = false;
  bulletPool.push(bullet);
}
```

### Entity Groups

Use tags to manage groups:

```javascript
// Create enemies
for (let i = 0; i < 10; i++) {
  const enemy = new Sprite({ x: i * 50, y: 100 });
  enemy.addTag('enemy');
  scene.add(enemy);
}

// Update all enemies
const enemies = scene.getEntitiesByTag('enemy');
enemies.forEach(enemy => {
  enemy.y += 1;
});
```

## Next Steps

- [Sprites](/visual/sprite) - Learn about the Sprite entity
- [Text](/visual/text) - Add text to your game
- [Animations](/animation/animations) - Master tweening
- [Gestures](/interactions/tap) - Handle user input
