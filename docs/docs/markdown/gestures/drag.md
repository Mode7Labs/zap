---
title: Drag Gesture
description: Dragging and moving interactive entities
---

# Drag Gesture

The drag gesture lets users move entities around the canvas with mouse or touch. Perfect for draggable UI, puzzle pieces, and interactive game objects.

## Basic Drag

Make an entity draggable:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 70,
  height: 70,
  color: '#9b59b6',
  radius: 10,
  interactive: true
});

const status = new Text({
  text: 'Drag the square',
  x: 200,
  y: 60,
  fontSize: 15,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(sprite);
scene.add(status);

sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
  status.text = `Position: (${Math.round(sprite.x)}, ${Math.round(sprite.y)})`;
});

game.setScene(scene);
game.start();
```

## Drag Events

Three events track the drag lifecycle:

### dragstart

Fired when dragging begins:

```javascript
sprite.on('dragstart', (event) => {
  console.log('Drag started at:', event.position);
  sprite.alpha = 0.7;  // Visual feedback
});
```

### drag

Fired continuously while dragging:

```javascript
sprite.on('drag', (event) => {
  // event.delta contains the movement since last frame
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
});
```

### dragend

Fired when drag ends:

```javascript
sprite.on('dragend', (event) => {
  console.log('Drag ended at:', event.position);
  sprite.alpha = 1;  // Restore opacity
});
```

## Drag Event Properties

Each drag event provides:

- **type**: `'drag'`, `'dragstart'`, or `'dragend'`
- **position**: `{ x, y }` - Current world position
- **delta**: `{ x, y }` - Movement since last frame (drag event only)
- **target**: The entity being dragged

**IMPORTANT**: The event does NOT have `event.x` or `event.y` properties directly. Always use `event.position.x` or `event.delta.x`:

```javascript
// ❌ WRONG - event.x and event.y don't exist
sprite.on('drag', (event) => {
  sprite.x = event.x;  // This will NOT work!
  sprite.y = event.y;
});

// ✅ CORRECT - Use event.position or event.delta
sprite.on('drag', (event) => {
  sprite.x = event.position.x;  // Works!
  sprite.y = event.position.y;
  // OR
  sprite.x += event.delta.x;  // Works!
  sprite.y += event.delta.y;
});
```

## Two Ways to Move Entities

### Using Delta (Recommended)

Smooth, relative movement:

```javascript
sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
});
```

### Using Position (Direct)

Direct positioning (can be jumpy on some devices):

```javascript
sprite.on('drag', (event) => {
  sprite.x = event.position.x;
  sprite.y = event.position.y;
});
```

**Note**: Delta movement is smoother and handles anchor points better. Use position for simple cases where the entity follows the cursor exactly.

## Complete Drag Example

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

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
  radius: 12,
  interactive: true
});

const label = new Text({
  text: 'Drag me!',
  x: 200,
  y: 50,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

scene.add(box);
scene.add(label);

let isDragging = false;

box.on('dragstart', () => {
  isDragging = true;
  box.alpha = 0.7;
  box.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 150, easing: 'easeOutQuad' });
  label.text = 'Dragging...';
  label.color = '#4fc3f7';
});

box.on('drag', (event) => {
  box.x += event.delta.x;
  box.y += event.delta.y;
});

box.on('dragend', () => {
  isDragging = false;
  box.alpha = 1;
  box.tween({ scaleX: 1, scaleY: 1 }, { duration: 150, easing: 'easeOutQuad' });
  label.text = 'Drag me!';
  label.color = '#888';
});

game.setScene(scene);
game.start();
```

## Constrained Dragging

Limit dragging to specific areas:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Boundary box
const bounds = new Sprite({
  x: 200,
  y: 150,
  width: 300,
  height: 200,
  color: '#16213e',
  radius: 8
});

const slider = new Sprite({
  x: 200,
  y: 150,
  width: 50,
  height: 50,
  color: '#4fc3f7',
  radius: 8,
  interactive: true
});

scene.add(bounds);
scene.add(slider);

slider.on('drag', (event) => {
  // Update position
  slider.x += event.delta.x;
  slider.y += event.delta.y;

  // Constrain to bounds
  const minX = 50 + slider.width / 2;
  const maxX = 350 - slider.width / 2;
  const minY = 50 + slider.height / 2;
  const maxY = 250 - slider.height / 2;

  slider.x = Math.max(minX, Math.min(maxX, slider.x));
  slider.y = Math.max(minY, Math.min(maxY, slider.y));
});

game.setScene(scene);
game.start();
```

## Common Patterns

### Horizontal Slider

Drag only on the X axis:

```javascript
const slider = new Sprite({
  x: 200, y: 150,
  width: 60, height: 40,
  color: '#4fc3f7',
  radius: 8,
  interactive: true
});

const minX = 100;
const maxX = 300;

slider.on('drag', (event) => {
  slider.x += event.delta.x;
  // Constrain to horizontal range
  slider.x = Math.max(minX, Math.min(maxX, slider.x));
});
```

### Vertical Slider

Drag only on the Y axis:

```javascript
const slider = new Sprite({
  x: 200, y: 150,
  width: 40, height: 60,
  color: '#51cf66',
  radius: 8,
  interactive: true
});

const minY = 100;
const maxY = 200;

slider.on('drag', (event) => {
  slider.y += event.delta.y;
  // Constrain to vertical range
  slider.y = Math.max(minY, Math.min(maxY, slider.y));
});
```

### Snap to Grid

Snap dragged position to grid:

```javascript
const gridSize = 40;

sprite.on('dragend', () => {
  // Snap to nearest grid position
  sprite.x = Math.round(sprite.x / gridSize) * gridSize;
  sprite.y = Math.round(sprite.y / gridSize) * gridSize;

  // Animate to snapped position
  sprite.tween(
    { x: sprite.x, y: sprite.y },
    { duration: 200, easing: 'easeOutQuad' }
  );
});
```

### Drag with Rotation

Rotate sprite while dragging:

```javascript
let lastPos = { x: sprite.x, y: sprite.y };

sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;

  // Calculate rotation based on movement direction
  const angle = Math.atan2(event.delta.y, event.delta.x);
  sprite.rotation = angle;

  lastPos = { x: sprite.x, y: sprite.y };
});
```

### Drop Zones

Detect when dragged entity enters a zone:

```javascript
const dropZone = new Sprite({
  x: 300, y: 150,
  width: 100, height: 100,
  color: '#16213e',
  radius: 8
});

scene.add(dropZone);

sprite.on('drag', () => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;

  // Check if inside drop zone
  const inZone = sprite.x > 250 && sprite.x < 350 &&
                 sprite.y > 100 && sprite.y < 200;

  dropZone.color = inZone ? '#51cf66' : '#16213e';
});

sprite.on('dragend', () => {
  const inZone = sprite.x > 250 && sprite.x < 350 &&
                 sprite.y > 100 && sprite.y < 200;

  if (inZone) {
    console.log('Dropped in zone!');
    // Snap to center of zone
    sprite.tween(
      { x: dropZone.x, y: dropZone.y },
      { duration: 300, easing: 'easeOutBack' }
    );
  }
});
```

### Drag Multiple Objects

Drag multiple entities simultaneously:

```javascript
const entities = [];

for (let i = 0; i < 3; i++) {
  const entity = new Sprite({
    x: 100 + i * 100,
    y: 150,
    width: 60,
    height: 60,
    color: ['#e94560', '#51cf66', '#4fc3f7'][i],
    radius: 8,
    interactive: true
  });

  entity.on('drag', (event) => {
    // Move all entities together
    entities.forEach(e => {
      e.x += event.delta.x;
      e.y += event.delta.y;
    });
  });

  entities.push(entity);
  scene.add(entity);
}
```

### Momentum/Flick

Add momentum when drag ends:

```javascript
let velocity = { x: 0, y: 0 };
const friction = 0.95;

sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;

  // Track velocity
  velocity.x = event.delta.x * 60;  // Convert to pixels/second
  velocity.y = event.delta.y * 60;
});

sprite.on('dragend', () => {
  // Apply momentum
  function applyMomentum() {
    if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
      return;  // Stop when velocity is low
    }

    sprite.x += velocity.x / 60;
    sprite.y += velocity.y / 60;

    velocity.x *= friction;
    velocity.y *= friction;

    requestAnimationFrame(applyMomentum);
  }

  applyMomentum();
});
```

## Canvas-Level Drag Events

Listen for drag events on the entire canvas:

```javascript
// Fired when any drag starts
game.on('dragstart', (event) => {
  console.log('Drag started:', event.target);
});

// Fired during any drag
game.on('drag', (event) => {
  console.log('Dragging:', event.position);
});

// Fired when any drag ends
game.on('dragend', (event) => {
  console.log('Drag ended');
});
```

## Tips

- **Always set `interactive: true`** on draggable entities
- **Must have dimensions** - `width` and `height` are REQUIRED for gesture detection. Without dimensions, there's no hit area and gestures won't work!
- **Provide visual feedback** - Change alpha, scale, or color during drag
- **Constrain movement** - Prevent dragging off-screen or into invalid areas
- **Use dragend for snapping** - Snap to grid, drop zones, or final positions
- **Test on mobile** - Drag works seamlessly on both mouse and touch

## Common Mistakes

### Missing width and height

```javascript
// ❌ CRITICAL ERROR - No hit area, drag won't work!
const sprite = new Sprite({
  x: 200,
  y: 150,
  interactive: true  // Useless without dimensions
});
// Drag events will NEVER fire!

// ✅ CORRECT - Must have dimensions for hit detection
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,   // Required!
  height: 100,  // Required!
  interactive: true
});
```

**This is the #1 mistake!** Interactive sprites MUST have `width` and `height`. Without dimensions, gesture detection has no bounding box to test against, so all touch/mouse events pass through.

### Not applying delta correctly

```javascript
// ❌ Wrong - overwrites position
sprite.on('drag', (event) => {
  sprite.x = event.position.x;  // Jumpy movement
  sprite.y = event.position.y;
});

// ✅ Right - adds delta for smooth movement
sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
});
```

### Forgetting to handle dragend

```javascript
// ❌ Wrong - visual feedback never restored
sprite.on('dragstart', () => {
  sprite.alpha = 0.5;
});
sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
});
// Missing dragend!

// ✅ Right - restore on dragend
sprite.on('dragend', () => {
  sprite.alpha = 1;
});
```

## Next Steps

- [Tap Gesture](/gestures/tap) - Tap/click detection
- [Swipe Gesture](/gestures/swipe) - Swipe gestures
- [Camera](/core/camera) - Drag to pan the camera
