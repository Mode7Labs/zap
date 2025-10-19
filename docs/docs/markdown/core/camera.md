---
title: Camera
description: Viewport control with follow, zoom, and screen shake
---

# Camera

The Camera controls the game viewport, providing follow, zoom, rotation, and screen shake effects. Perfect for creating dynamic game experiences and smooth character following.

## Accessing the Camera

Every game has a camera accessible via `game.camera`:

```javascript
import { Game } from '@mode-7/zap';

const game = new Game({ width: 400, height: 300 });

// Access the camera
game.camera.setZoom(2);
game.camera.setPosition(100, 100);
```

## Follow Entity

Make the camera smoothly follow an entity as it moves through a larger world:

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

## Follow with Offset

Offset the camera from the target:

```javascript
// Follow with offset (useful for looking ahead)
game.camera.follow(player, { x: 50, y: 0 });  // 50px ahead horizontally
```

## Follow Speed

Control how quickly the camera catches up:

```javascript
// Smooth following (0 = instant, 1 = normal, <1 = slower)
game.camera.follow(player, { x: 0, y: 0 }, 0.5);  // Slower, cinematic

// Fast following
game.camera.follow(player, { x: 0, y: 0 }, 2.0);  // Quick response
```

## Stop Following

Stop camera follow:

```javascript
game.camera.stopFollow();
```

## Zoom

Control camera zoom level:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const player = new Sprite({
  x: 200,
  y: 150,
  width: 40,
  height: 40,
  color: '#e94560',
  radius: 20
});

const zoomInBtn = new Sprite({
  x: 80,
  y: 40,
  width: 70,
  height: 35,
  color: '#4fc3f7',
  radius: 8,
  interactive: true
});

const zoomInLabel = new Text({
  text: 'Zoom In',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

zoomInBtn.addChild(zoomInLabel);

const zoomOutBtn = new Sprite({
  x: 160,
  y: 40,
  width: 80,
  height: 35,
  color: '#51cf66',
  radius: 8,
  interactive: true
});

const zoomOutLabel = new Text({
  text: 'Zoom Out',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

zoomOutBtn.addChild(zoomOutLabel);

const resetBtn = new Sprite({
  x: 250,
  y: 40,
  width: 60,
  height: 35,
  color: '#888',
  radius: 8,
  interactive: true
});

const resetLabel = new Text({
  text: 'Reset',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

resetBtn.addChild(resetLabel);

scene.add(player);
scene.add(zoomInBtn);
scene.add(zoomOutBtn);
scene.add(resetBtn);

zoomInBtn.on('tap', () => {
  game.camera.setZoom(game.camera.zoom * 1.2);
});

zoomOutBtn.on('tap', () => {
  game.camera.setZoom(game.camera.zoom / 1.2);
});

resetBtn.on('tap', () => {
  game.camera.setZoom(1);
});

game.setScene(scene);
game.start();
```

## Manual Positioning

Set camera position directly:

```javascript
// Center on specific coordinates
game.camera.setPosition(500, 300);

// Pan to position with tweening
const currentX = game.camera.x;
const currentY = game.camera.y;

// Manually tween camera (camera itself doesn't have .tween())
function panTo(targetX, targetY, duration = 1000) {
  const startX = game.camera.x;
  const startY = game.camera.y;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    game.camera.x = startX + (targetX - startX) * progress;
    game.camera.y = startY + (targetY - startY) * progress;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

panTo(500, 300);
```

## Screen Shake

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

### Shake Parameters

```javascript
// Subtle shake
game.camera.shake(5, 200);

// Medium shake (default)
game.camera.shake(10, 300);

// Intense shake
game.camera.shake(20, 500);
```

## Common Patterns

### Player Follow with Boundaries

Constrain camera to level boundaries:

```javascript
game.camera.follow(player);

// In update loop or after following
scene.on('update', () => {
  // Constrain camera to level boundaries
  const levelWidth = 2000;
  const levelHeight = 1500;
  const halfWidth = game.canvas.width / 2;
  const halfHeight = game.canvas.height / 2;

  game.camera.x = Math.max(halfWidth, Math.min(levelWidth - halfWidth, game.camera.x));
  game.camera.y = Math.max(halfHeight, Math.min(levelHeight - halfHeight, game.camera.y));
});
```

### Zoom on Scroll

Zoom with mouse wheel:

```javascript
game.canvas.addEventListener('wheel', (event) => {
  event.preventDefault();

  const zoomSpeed = 0.1;
  const delta = -Math.sign(event.deltaY);

  game.camera.setZoom(
    Math.max(0.5, Math.min(3, game.camera.zoom + delta * zoomSpeed))
  );
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

### Cutscene Camera

Scripted camera movements:

```javascript
async function cutscene() {
  // Stop following player
  game.camera.stopFollow();

  // Pan to location 1
  await panTo(500, 300, 2000);

  // Zoom in
  await new Promise(resolve => {
    const startZoom = game.camera.zoom;
    const targetZoom = 2;
    const duration = 1000;
    const startTime = Date.now();

    function update() {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      game.camera.setZoom(startZoom + (targetZoom - startZoom) * progress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    }

    update();
  });

  // Pan to location 2
  await panTo(800, 600, 2000);

  // Resume following player
  game.camera.follow(player);
}
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

### Smooth Zoom Transition

Animate zoom changes:

```javascript
function smoothZoom(targetZoom, duration = 500) {
  const startZoom = game.camera.zoom;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easing for smooth feel
    const eased = 1 - Math.pow(1 - progress, 3);  // easeOutCubic
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

### Drag to Pan Camera

Pan camera by dragging canvas:

```javascript
let isDragging = false;
let dragStart = { x: 0, y: 0 };

game.on('dragstart', (event) => {
  isDragging = true;
  dragStart = { x: event.position.x, y: event.position.y };
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

### Split Screen Effect

Create split-screen by rendering twice with different camera positions:

```javascript
// This is advanced - requires custom rendering
// Not directly supported but possible with manual rendering
```

## Camera Properties

Direct property access:

```javascript
// Position
console.log(game.camera.x, game.camera.y);

// Zoom level (1 = normal, 2 = 2x zoom, 0.5 = zoomed out)
console.log(game.camera.zoom);

// Rotation (in radians)
game.camera.rotation = Math.PI / 4;  // 45 degrees

// Size (read-only, matches canvas)
console.log(game.camera.width, game.camera.height);
```

## Coordinate Conversion

Convert between screen and world coordinates:

```javascript
// Screen to world (useful for mouse/touch input)
const worldPos = game.camera.screenToWorld(mouseX, mouseY);

// World to screen (useful for UI overlays)
const screenPos = game.camera.worldToScreen(entity.x, entity.y);
```

## Tips

- **Use follow for player cameras** - Smoother than manual updates
- **Constrain zoom** - Prevent users from zooming too far in/out
- **Shake sparingly** - Too much shake is disorienting
- **Consider boundaries** - Prevent camera from showing empty space
- **Follow speed matters** - 0.5-1.0 feels cinematic, 1.5-2.0 feels responsive

## Common Mistakes

### Forgetting to stop follow

```javascript
// ❌ Wrong - camera still follows old target
game.setScene(newScene);
game.camera.follow(newPlayer);  // Follows old player too!

// ✅ Right - stop following first
game.camera.stopFollow();
game.setScene(newScene);
game.camera.follow(newPlayer);
```

### Zoom limits

```javascript
// ❌ Wrong - no limits
zoomInButton.on('tap', () => {
  game.camera.setZoom(game.camera.zoom * 2);  // Can zoom infinitely
});

// ✅ Right - clamp zoom
zoomInButton.on('tap', () => {
  const newZoom = Math.min(3, game.camera.zoom * 1.5);
  game.camera.setZoom(newZoom);
});
```

## Next Steps

- [Scenes](/core/scenes) - Manage game scenes
- [Entities](/core/entities) - Create game objects
- [Tweening](/animation/tweening) - Animate camera movements
