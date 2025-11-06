---
title: Entities
description: Understanding the entity system and lifecycle
---

# Entities

Entities are the building blocks of your game. Everything you see on screen is an entity - sprites, text, buttons, and more. All entities extend the base `Entity` class and share common properties, methods, and behaviors.

## Entity Types

Zap provides several built-in entity types:

- **[Sprite](/visual/sprites)** - Colored rectangles, image sprites, and sprite sheet animations
- **[Text](/visual/text)** - Rendered text with custom fonts
- **[Button](/ui/button)** - Interactive UI buttons with states
- **[NinePatch](/ui/ninepatch)** - Scalable UI panels
- **[Particle](/animation/particles)** / **ParticleEmitter** - Visual effects

All entities share common functionality through the `Entity` base class.

## Common Properties

### Transform Properties

Every entity has transform properties for positioning, rotation, scaling, and opacity:

```javascript
const sprite = new Sprite({
  x: 100,           // X position (pixels)
  y: 100,           // Y position (pixels)
  rotation: 0,      // Rotation in radians
  scaleX: 1,        // Horizontal scale (1 = 100%)
  scaleY: 1,        // Vertical scale (1 = 100%)
  alpha: 1          // Opacity (0 = transparent, 1 = opaque)
});

// Modify after creation
sprite.x = 200;
sprite.rotation = Math.PI / 4;  // 45 degrees
sprite.alpha = 0.5;              // 50% opacity
```

**Defaults:**
- `x`, `y`, `rotation`: `0`
- `scaleX`, `scaleY`: `1`
- `alpha`: `1`

### Size Properties

Control entity dimensions with `width` and `height`:

```javascript
const sprite = new Sprite({
  width: 100,
  height: 100
});
```

**Note:** For interactive entities, `width` and `height` are **required** for gesture detection to work.

**Defaults:** `0`

### Anchor Point

The anchor determines the origin point for positioning and transformations. Values range from `0` to `1`:

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

**Anchor reference:**
- `0` = left/top edge
- `0.5` = center (default)
- `1` = right/bottom edge

**Defaults:** `0.5` (centered)

### State Properties

#### active

Controls whether the entity updates each frame.

```javascript
sprite.active = true;   // Update (default)
sprite.active = false;  // Don't update
```

Inactive entities don't update physics, collisions, or animations, but still render.

**Default:** `true`

#### visible

Controls whether the entity renders.

```javascript
sprite.visible = true;   // Render (default)
sprite.visible = false;  // Don't render
```

Hidden entities still update but don't draw.

**Default:** `true`

#### zIndex

Controls render order. Higher values render on top.

```javascript
background.zIndex = 0;   // Render first (back)
player.zIndex = 10;      // Render middle
ui.zIndex = 100;         // Render last (front)
```

**Default:** `0`

## Entity Options

All entity constructors accept these common options:

### Transform Options

- `x`, `y` - Position in pixels
- `rotation` - Rotation in radians
- `scaleX`, `scaleY` - Scale multipliers
- `alpha` - Opacity (0-1)

### Size Options

- `width`, `height` - Dimensions in pixels
- `radius` - Corner radius (for Sprite)
- `anchorX`, `anchorY` - Anchor point (0-1)

### State Options

- `active` - Whether entity updates
- `visible` - Whether entity renders
- `interactive` - Whether entity responds to [gestures](/gestures/tap)
- `zIndex` - Render order

### Physics Options

- `vx`, `vy` - Velocity in pixels/second
- `gravity` - Downward acceleration in pixels/second²
- `friction` - Velocity dampening (0-1)
- `bounciness` - Bounce restitution coefficient (0-1)
- `static` - Mark as immovable (for walls, platforms)

See [Physics documentation](/physics/physics) for details.

### Collision Options

- `checkCollisions` - Enable collision detection
- `collisionTags` - Array of tags to collide with (empty = all entities)
- `static` - Mark as immovable

See [Collision Detection documentation](/physics/collision-detection) for details.

## Entity Methods

### Transform Methods

#### getWorldPosition()

Get the entity's position in world coordinates, accounting for parent transforms.

```javascript
const worldPos = entity.getWorldPosition();
console.log(worldPos.x, worldPos.y);
```

Returns `{ x: number, y: number }`. Useful when working with entity hierarchies.

#### getWorldTransform()

Get the complete world transform including position, rotation, scale, and alpha.

```javascript
const transform = entity.getWorldTransform();
// { x, y, rotation, scaleX, scaleY, alpha }
```

Returns the accumulated transform from all parent entities.

#### getBounds()

Get the entity's bounding box in world coordinates.

```javascript
const bounds = entity.getBounds();
console.log(bounds.left, bounds.right, bounds.top, bounds.bottom);
```

Accounts for rotation and parent transforms. Returns `{ left, right, top, bottom }`.

### Scene Methods

#### getScene()

Get the scene this entity is attached to.

```javascript
const scene = entity.getScene();
if (scene) {
  const game = scene.getGame();
}
```

Returns `Scene | null`.

### Hierarchy Methods

#### addChild()

Add a child entity. Child transforms are relative to the parent.

```javascript
const parent = new Sprite({ x: 100, y: 100 });
const child = new Sprite({ x: 50, y: 0, width: 30, height: 30 });

parent.addChild(child);

// Child position is relative to parent
parent.rotation = Math.PI / 4;  // Child rotates too
parent.x = 200;                  // Child moves too
```

**Important:** If the parent is `interactive: true`, it **must have `width` and `height`**. Without dimensions, there's no hit area for gesture detection.

```javascript
// ❌ WRONG - Interactive container without dimensions
const container = new Sprite({
  x: 200, y: 150,
  interactive: true  // Won't work!
});

// ✅ CORRECT - Interactive container with dimensions
const container = new Sprite({
  x: 200, y: 150,
  width: 300,
  height: 400,
  interactive: true
});
```

Returns `this` for chaining.

#### removeChild()

Remove a child entity.

```javascript
parent.removeChild(child);
```

Returns `this` for chaining.

### Tag Methods

Tags allow you to group and find entities easily.

#### addTag()

Add a tag to an entity.

```javascript
player.addTag('player');
player.addTag('friendly');
```

Returns `this` for chaining.

#### removeTag()

Remove a tag from an entity.

```javascript
player.removeTag('friendly');
```

Returns `this` for chaining.

#### hasTag()

Check if entity has a tag.

```javascript
if (entity.hasTag('enemy')) {
  // Handle enemy
}
```

Returns `boolean`.

**Tag usage example:**

```javascript
// Tag entities
enemy.addTag('enemy');
enemy.addTag('hostile');

// Find by tag in scene
const enemies = scene.getEntitiesByTag('enemy');
enemies.forEach(enemy => {
  // AI logic
});
```

### Utility Methods

#### containsPoint()

Check if a point is inside the entity's bounds.

```javascript
const isInside = entity.containsPoint(mouseX, mouseY);
```

Returns `boolean`. Takes world coordinates into account.

#### intersects()

Check if this entity intersects with another entity.

```javascript
const isColliding = entity1.intersects(entity2);
```

Returns `boolean`. Used internally for collision detection.

#### bounce()

Manually bounce the entity off a surface. Used for custom physics.

```javascript
// Bounce off a wall (normal points away from wall)
entity.bounce(1, 0, 0.8);  // normalX, normalY, restitution

// Bounce off floor
entity.bounce(0, 1, 0.7);
```

**Parameters:**
- `normalX`, `normalY` - Surface normal (should be normalized)
- `restitution` - Bounce energy retention (0-1, default: 0.8)

#### distanceTo()

Calculate distance to another entity (center to center).

```javascript
const distance = player.distanceTo(enemy);
if (distance < 50) {
  // Enemy is nearby
}
```

Returns `number` (distance in pixels).

#### getCollisions()

Get all entities currently colliding with this entity. Only works if `checkCollisions: true`.

```javascript
const collisions = player.getCollisions();
collisions.forEach(other => {
  if (other.hasTag('enemy')) {
    // Handle enemy collision
  }
});
```

Returns `Entity[]`.

#### destroy()

Clean up the entity. Removes from scene, removes all children, clears event listeners.

```javascript
entity.destroy();
```

### Animation Methods

#### tween()

Animate entity properties smoothly.

```javascript
sprite.tween(
  { x: 400, rotation: Math.PI },
  { duration: 1000, easing: 'easeInOutQuad' }
);
```

Returns a `Tween` instance for chaining.

See [Tweening documentation](/animation/tweening) for complete details on chaining, looping, callbacks, and easing functions.

## Interactivity

Make entities respond to user input by setting `interactive: true` and listening for gesture events.

```javascript
const sprite = new Sprite({
  x: 100,
  y: 100,
  width: 50,    // Required for gestures!
  height: 50,   // Required for gestures!
  interactive: true
});

sprite.on('tap', () => {
  console.log('Tapped!');
});

sprite.on('drag', (e) => {
  sprite.x += e.delta.x;
  sprite.y += e.delta.y;
});
```

**Important:** Interactive entities **must have `width` and `height`** specified. Without dimensions, gesture detection has no hit area.

### Available Gesture Events

- `'tap'` - Quick touch/click
- `'drag'` - Continuous dragging
- `'dragstart'` - Drag begins
- `'dragend'` - Drag ends
- `'swipe'` - Directional swipe
- `'longpress'` - Press and hold
- `'pointerover'` - Pointer enters entity
- `'pointerout'` - Pointer leaves entity
- `'pinch'` - Two-finger pinch gesture

See individual gesture documentation:
- [Tap](/gestures/tap)
- [Drag](/gestures/drag)
- [Swipe](/gestures/swipe)
- [Pinch](/gestures/pinch)

## Entity Events

The `Entity` class extends [`EventEmitter`](/core/architecture#event-system). Listen for events with `entity.on()`:

### Lifecycle Events

```javascript
entity.on('added', () => {
  console.log('Added to scene');
});

entity.on('removed', () => {
  console.log('Removed from scene');
});
```

### Update Event

```javascript
entity.on('update', (deltaTime) => {
  // Called every frame
  // deltaTime is in seconds (e.g., 0.016 for 60 FPS)
});
```

### Collision Events

Only emitted if `checkCollisions: true`. See [Collision Detection](/physics/collision-detection) for details.

```javascript
entity.on('collisionenter', ({ other, normal }) => {
  console.log('Collision started with:', other);
  console.log('Collision normal:', normal);
});

entity.on('collide', ({ other, normal }) => {
  console.log('Colliding with:', other);
});

entity.on('collisionexit', ({ other }) => {
  console.log('Collision ended with:', other);
});
```

## Entity Lifecycle

Entities follow a simple lifecycle:

1. **Created** - `new Sprite()`, `new Text()`, etc.
2. **Added to Scene** - `scene.add(entity)` - emits `'added'` event
3. **Updated & Rendered** - Every frame while `active` and in scene
4. **Removed from Scene** - `scene.remove(entity)` - emits `'removed'` event
5. **Destroyed** - `entity.destroy()` - cleans up resources

```javascript
const sprite = new Sprite({ x: 100, y: 100 });  // 1. Created
scene.add(sprite);                              // 2. Added - 'added' event
// 3. Updates and renders every frame
scene.remove(sprite);                           // 4. Removed - 'removed' event
sprite.destroy();                               // 5. Destroyed
```

## Best Practices

1. **Set dimensions for interactive entities** - Always specify `width` and `height` when using `interactive: true`
2. **Reuse entities** - Don't create/destroy frequently; use object pools for bullets, particles, etc.
3. **Use tags** - Group related entities with tags for easy retrieval
4. **Set z-index explicitly** - Don't rely on add order for render order
5. **Use hierarchy wisely** - Parent-child relationships are great for composite objects
6. **Clean up listeners** - Remove event listeners when done to prevent memory leaks
7. **Hide vs Remove** - Use `visible = false` for temporary hiding instead of removing from scene

## Common Patterns

### Object Pooling

Reuse entities instead of creating new ones for better performance:

```javascript
const bulletPool = [];

function getBullet() {
  return bulletPool.pop() || new Sprite({
    width: 5,
    height: 10,
    color: '#fff'
  });
}

function fireBullet(x, y) {
  const bullet = getBullet();
  bullet.x = x;
  bullet.y = y;
  bullet.visible = true;
  scene.add(bullet);
}

function releaseBullet(bullet) {
  bullet.visible = false;
  scene.remove(bullet);
  bulletPool.push(bullet);
}
```

### Entity Groups with Tags

Use tags to manage groups of entities:

```javascript
// Create enemies
for (let i = 0; i < 10; i++) {
  const enemy = new Sprite({
    x: i * 50,
    y: 100,
    width: 40,
    height: 40,
    color: '#e94560'
  });
  enemy.addTag('enemy');
  scene.add(enemy);
}

// Later, update all enemies
const enemies = scene.getEntitiesByTag('enemy');
enemies.forEach(enemy => {
  enemy.y += 1;  // Move all enemies down
});

// Remove all enemies
enemies.forEach(enemy => enemy.destroy());
```

### Composite Objects

Use parent-child relationships for complex objects:

```javascript
// Create a car with rotating wheels
const car = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 40,
  color: '#e94560'
});

const wheel1 = new Sprite({
  x: -25,  // Relative to car
  y: 15,
  width: 15,
  height: 15,
  radius: 7.5,
  color: '#333'
});

const wheel2 = new Sprite({
  x: 25,   // Relative to car
  y: 15,
  width: 15,
  height: 15,
  radius: 7.5,
  color: '#333'
});

car.addChild(wheel1);
car.addChild(wheel2);

scene.add(car);

// Animate wheels
scene.on('update', (dt) => {
  wheel1.rotation += dt * 5;
  wheel2.rotation += dt * 5;
  car.x += dt * 100;  // Wheels move with car
});
```

### Temporary Entities

Hide entities temporarily instead of removing:

```javascript
// Hide instead of remove (better performance)
powerup.visible = false;

// Later, reuse
powerup.x = 300;
powerup.y = 200;
powerup.visible = true;
```

## Next Steps

- [Sprites](/visual/sprites) - Learn about the Sprite entity
- [Text](/visual/text) - Add text to your game
- [Tweening](/animation/tweening) - Master property animations
- [Gestures](/gestures/tap) - Handle user input
- [Physics](/physics/physics) - Add physics to entities
- [Collision Detection](/physics/collision-detection) - Detect and respond to collisions
