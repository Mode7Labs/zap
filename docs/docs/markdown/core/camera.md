---
title: Camera
description: Viewport control with follow, zoom, and screen shake
---

# Camera

The Camera controls the game viewport, providing follow, zoom, rotation, and screen shake effects. Perfect for creating dynamic game experiences and smooth character following.

## Accessing the Camera

Every [game](/core/game) has a camera accessible via `game.camera`:

```javascript
import { Game } from '@mode-7/zap';

const game = new Game({ width: 400, height: 300 });

// Access the camera
game.camera.setZoom(2);
game.camera.setPosition(100, 100);
```

## Camera Properties

### x / y

Camera position in world coordinates. The camera looks at this position.

```javascript
game.camera.x = 500;
game.camera.y = 300;
```

**Default:** `0, 0`

### zoom

Zoom level. `1` is normal, `2` is 2x magnification, `0.5` is zoomed out.

```javascript
game.camera.zoom = 2;   // Zoom in 2x
game.camera.zoom = 0.5; // Zoom out 2x
```

**Default:** `1`

**Note:** Use `setZoom()` method instead of setting directly to ensure minimum zoom of `0.1`.

### rotation

Camera rotation in radians. Rotates the entire viewport.

```javascript
game.camera.rotation = Math.PI / 4;  // 45 degrees
game.camera.rotation = 0;             // Reset
```

**Default:** `0`

### width / height

Viewport dimensions. Read-only, matches the [game canvas](/core/game) size.

```javascript
console.log(game.camera.width, game.camera.height);
```

## Camera Methods

### follow()

Make the camera smoothly follow an [entity](/core/entities).

```javascript
follow(entity: Entity, offset?: Point, speed?: number): void
```

**Parameters:**
- `entity` - The entity to follow
- `offset` - Optional offset from entity position `{ x: 0, y: 0 }`
- `speed` - Follow speed multiplier (default: `1`)

**Examples:**

```javascript
// Basic follow
game.camera.follow(player);

// Follow with offset (look ahead)
game.camera.follow(player, { x: 50, y: 0 });

// Smooth, cinematic follow (slower)
game.camera.follow(player, { x: 0, y: 0 }, 0.5);

// Fast, responsive follow
game.camera.follow(player, { x: 0, y: 0 }, 2.0);
```

**Follow speed guide:**
- `0.1` - Very slow, cinematic
- `0.5` - Smooth, cinematic
- `1.0` - Normal (default)
- `1.5` - Responsive
- `2.0` - Quick, snappy

### stopFollow()

Stop following the current entity.

```javascript
game.camera.stopFollow();
```

### setPosition()

Set camera position directly.

```javascript
setPosition(x: number, y: number): void
```

**Parameters:**
- `x` - World X coordinate
- `y` - World Y coordinate

```javascript
// Center on specific coordinates
game.camera.setPosition(500, 300);
```

**Note:** This is overridden if `follow()` is active. Call `stopFollow()` first for manual positioning.

### setZoom()

Set camera zoom level with automatic minimum clamping.

```javascript
setZoom(zoom: number): void
```

**Parameters:**
- `zoom` - Zoom level (minimum `0.1`)

```javascript
// Zoom in
game.camera.setZoom(2);    // 2x magnification

// Zoom out
game.camera.setZoom(0.5);  // Show 2x more area

// Reset
game.camera.setZoom(1);
```

The method automatically clamps zoom to a minimum of `0.1` to prevent division by zero.

### shake()

Add screen shake effect for impacts and explosions.

```javascript
shake(intensity?: number, duration?: number): void
```

**Parameters:**
- `intensity` - Shake magnitude in pixels (default: `10`)
- `duration` - Duration in milliseconds (default: `300`)

**Examples:**

```javascript
// Default shake
game.camera.shake();

// Subtle shake
game.camera.shake(5, 200);

// Medium shake
game.camera.shake(10, 300);

// Intense shake
game.camera.shake(20, 500);
```

### screenToWorld()

Convert screen/canvas coordinates to world coordinates. Useful for mouse/touch input.

```javascript
screenToWorld(screenX: number, screenY: number): Point
```

**Parameters:**
- `screenX` - X coordinate on canvas
- `screenY` - Y coordinate on canvas

Returns `{ x: number, y: number }` in world coordinates.

```javascript
game.on('tap', (event) => {
  const worldPos = game.camera.screenToWorld(event.position.x, event.position.y);
  console.log('Tapped world position:', worldPos);
});
```

Accounts for camera position, zoom, and rotation.

### worldToScreen()

Convert world coordinates to screen/canvas coordinates. Useful for UI overlays.

```javascript
worldToScreen(worldX: number, worldY: number): Point
```

**Parameters:**
- `worldX` - World X coordinate
- `worldY` - World Y coordinate

Returns `{ x: number, y: number }` in screen coordinates.

```javascript
const screenPos = game.camera.worldToScreen(entity.x, entity.y);
// Draw UI at screenPos
```

## Follow Camera Example

Make the camera smoothly follow a player through a larger world:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create a larger world with reference points
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 10; j++) {
    const dot = new Sprite({
      x: i * 100,
      y: j * 100,
      width: 6,
      height: 6,
      color: '#1a1a2e',
      radius: 3
    });
    scene.add(dot);
  }
}

// Add some landmarks
const landmarks = [
  { x: 300, y: 200, color: '#4fc3f7', label: 'A' },
  { x: 800, y: 300, color: '#51cf66', label: 'B' },
  { x: 500, y: 600, color: '#f39c12', label: 'C' },
  { x: 1200, y: 400, color: '#9b59b6', label: 'D' }
];

landmarks.forEach(lm => {
  const landmark = new Sprite({
    x: lm.x,
    y: lm.y,
    width: 50,
    height: 50,
    color: lm.color,
    radius: 25
  });
  const label = new Text({
    text: lm.label,
    fontSize: 20,
    color: '#fff',
    align: 'center',
    baseline: 'middle'
  });
  landmark.addChild(label);
  scene.add(landmark);
});

// Player
const player = new Sprite({
  x: 300,
  y: 200,
  width: 40,
  height: 40,
  color: '#e94560',
  radius: 20
});

const instruction = new Text({
  text: 'Tap anywhere to move',
  x: 200,
  y: 20,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

scene.add(player);
scene.add(instruction);

// Camera follows player smoothly
game.camera.follow(player, { x: 0, y: 0 }, 0.1);

// Tap to move player
game.on('tap', (event) => {
  player.tween(
    { x: event.position.x, y: event.position.y },
    { duration: 1000, easing: 'easeInOutQuad' }
  );
});

game.setScene(scene);
game.start();
```

## Screen Shake Example

Add screen shake for impacts and effects:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const shakeBtn = new Sprite({
  x: 200,
  y: 150,
  width: 140,
  height: 50,
  color: '#e94560',
  radius: 8,
  interactive: true
});

const label = new Text({
  text: 'Shake!',
  fontSize: 16,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

shakeBtn.addChild(label);

const instruction = new Text({
  text: 'Tap to shake the screen',
  x: 200,
  y: 230,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

scene.add(shakeBtn);
scene.add(instruction);

shakeBtn.on('tap', () => {
  // Shake(intensity, duration in ms)
  game.camera.shake(10, 400);

  shakeBtn.tween(
    { scaleX: 0.9, scaleY: 0.9 },
    { duration: 100 }
  ).then(() => {
    shakeBtn.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100 }
    );
  });
});

game.setScene(scene);
game.start();
```

## Zoom Control

Control camera zoom programmatically:

```javascript
// Zoom in gradually
const zoomIn = () => {
  const newZoom = Math.min(3, game.camera.zoom * 1.2);
  game.camera.setZoom(newZoom);
};

// Zoom out gradually
const zoomOut = () => {
  const newZoom = Math.max(0.5, game.camera.zoom / 1.2);
  game.camera.setZoom(newZoom);
};

// Reset zoom
const resetZoom = () => {
  game.camera.setZoom(1);
};
```

## Common Patterns

### Camera Boundaries

Constrain camera to level boundaries:

```javascript
game.camera.follow(player);

scene.on('update', () => {
  // Define level size
  const levelWidth = 2000;
  const levelHeight = 1500;

  // Calculate boundaries
  const halfWidth = game.width / 2;
  const halfHeight = game.height / 2;

  // Clamp camera position
  game.camera.x = Math.max(
    halfWidth,
    Math.min(levelWidth - halfWidth, game.camera.x)
  );
  game.camera.y = Math.max(
    halfHeight,
    Math.min(levelHeight - halfHeight, game.camera.y)
  );
});
```

### Zoom on Mouse Wheel

Zoom with mouse wheel:

```javascript
game.canvas.addEventListener('wheel', (event) => {
  event.preventDefault();

  const zoomSpeed = 0.1;
  const delta = -Math.sign(event.deltaY);

  const newZoom = game.camera.zoom + delta * zoomSpeed;
  game.camera.setZoom(Math.max(0.5, Math.min(3, newZoom)));
});
```

### Look Ahead

Camera leads in movement direction:

```javascript
let playerVelocity = { x: 0, y: 0 };

player.on('drag', (event) => {
  playerVelocity = event.delta;
  player.x += event.delta.x;
  player.y += event.delta.y;
});

// Camera looks ahead in movement direction
game.camera.follow(player, {
  x: playerVelocity.x * 20,
  y: playerVelocity.y * 20
}, 0.5);
```

### Smooth Zoom Transition

Animate zoom changes smoothly:

```javascript
function smoothZoom(targetZoom, duration = 500) {
  const startZoom = game.camera.zoom;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easing for smooth feel (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3);
    game.camera.setZoom(startZoom + (targetZoom - startZoom) * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

// Usage
smoothZoom(2.0);  // Zoom to 2x smoothly
```

### Smooth Pan Transition

Animate camera movement:

```javascript
function panTo(targetX, targetY, duration = 1000) {
  const startX = game.camera.x;
  const startY = game.camera.y;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easing for smooth movement
    const eased = 1 - Math.pow(1 - progress, 3);

    game.camera.x = startX + (targetX - startX) * eased;
    game.camera.y = startY + (targetY - startY) * eased;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

// Usage
panTo(500, 300, 2000);  // Pan to position over 2 seconds
```

### Impact Shake

Different shake intensities for different events:

```javascript
// Small hit
enemy.on('hit', () => {
  game.camera.shake(3, 150);
});

// Explosion
bomb.on('explode', () => {
  game.camera.shake(15, 400);
});

// Boss stomp
boss.on('stomp', () => {
  game.camera.shake(25, 600);
});
```

### Drag to Pan Camera

Pan camera by dragging the canvas:

```javascript
let isDragging = false;

game.on('dragstart', (event) => {
  isDragging = true;
  // Stop following while dragging
  game.camera.stopFollow();
});

game.on('drag', (event) => {
  if (isDragging) {
    game.camera.x -= event.delta.x;
    game.camera.y -= event.delta.y;
  }
});

game.on('dragend', () => {
  isDragging = false;
});
```

### Cutscene Camera

Scripted camera movements for cutscenes:

```javascript
async function cutscene() {
  // Stop following player
  game.camera.stopFollow();

  // Pan to location 1
  await panTo(500, 300, 2000);

  // Wait
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Zoom in smoothly
  await new Promise(resolve => {
    smoothZoom(2, 1000);
    setTimeout(resolve, 1000);
  });

  // Pan to location 2
  await panTo(800, 600, 2000);

  // Zoom out
  await new Promise(resolve => {
    smoothZoom(1, 1000);
    setTimeout(resolve, 1000);
  });

  // Resume following player
  game.camera.follow(player);
}

// Trigger cutscene
cutscene();
```

## Best Practices

1. **Use follow for player cameras** - Smoother and easier than manual updates
2. **Constrain zoom** - Prevent users from zooming too far in/out (recommend 0.5 to 3.0 range)
3. **Shake sparingly** - Too much shake is disorienting; reserve for significant impacts
4. **Consider boundaries** - Prevent camera from showing empty space beyond level edges
5. **Follow speed matters** - `0.5-1.0` feels cinematic, `1.5-2.0` feels responsive
6. **Stop following when needed** - Stop camera follow during cutscenes or scene transitions

## Common Mistakes

### Forgetting to Stop Follow

```javascript
// ❌ Wrong - camera still tries to follow old target
game.setScene(newScene);
game.camera.follow(newPlayer);  // Might still track old player

// ✅ Right - stop following first
game.camera.stopFollow();
game.setScene(newScene);
game.camera.follow(newPlayer);
```

### No Zoom Limits

```javascript
// ❌ Wrong - no limits, can zoom infinitely
zoomInButton.on('tap', () => {
  game.camera.setZoom(game.camera.zoom * 2);
});

// ✅ Right - clamp zoom to reasonable range
zoomInButton.on('tap', () => {
  const newZoom = Math.min(3, game.camera.zoom * 1.5);
  game.camera.setZoom(newZoom);
});
```

### Setting Position While Following

```javascript
// ❌ Wrong - position gets overridden by follow
game.camera.follow(player);
game.camera.setPosition(500, 300);  // Immediately overridden

// ✅ Right - stop following first, or don't use both
game.camera.stopFollow();
game.camera.setPosition(500, 300);
```

## Next Steps

- [Scenes](/core/scenes) - Manage game scenes and transitions
- [Entities](/core/entities) - Create game objects to follow
- [Tweening](/animation/tweening) - Animate camera movements
- [Game Configuration](/core/game) - Configure your game instance
