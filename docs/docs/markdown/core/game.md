---
title: Game Configuration
description: Configure your Game instance with all available options
---

# Game Configuration

The [`Game`](/core/game) class is the root of your Zap application. It manages the canvas, game loop, and all core systems including the [camera](/core/camera), [gestures](/core/architecture#gesture-manager), and [scene](/core/scenes) management.

## Basic Setup

The simplest game requires no configuration:

```javascript
import { Game, Scene } from '@mode-7/zap';

const game = new Game();
const scene = new Scene();
game.setScene(scene);
game.start();
```

This creates a 800x600 canvas appended to `document.body`.

## Configuration Options

All options are passed to the `Game` constructor as an object.

### Display Options

#### width / height

Set the canvas dimensions in pixels.

```javascript
const game = new Game({
  width: 1024,
  height: 768
});
```

**Default:** `800` x `600`

#### parent

Specify where to append the canvas. Accepts a CSS selector string or an `HTMLElement`.

```javascript
// Using a selector
const game = new Game({
  parent: '#game-container'
});

// Using an element reference
const container = document.getElementById('game-container');
const game = new Game({
  parent: container
});
```

**Default:** `document.body`

#### canvas

Use an existing canvas element instead of creating a new one.

```javascript
const canvas = document.querySelector('canvas');
const game = new Game({
  canvas: canvas,
  width: 800,
  height: 600
});
```

**Default:** Creates a new canvas element

#### backgroundColor

Set the default background color. Can be overridden per [scene](/core/scenes).

```javascript
const game = new Game({
  backgroundColor: '#0f3460'
});
```

**Default:** `'#000000'` (black)

#### responsive

Make the canvas automatically resize to fit its container while maintaining the aspect ratio defined by `width` and `height`.

```javascript
const game = new Game({
  width: 1920,
  height: 1080,  // 16:9 aspect ratio
  responsive: true
});
```

When enabled:
- Canvas scales to fill the container
- Aspect ratio is maintained with letterboxing/pillarboxing
- Game coordinates (`game.width` and `game.height`) remain constant
- No responsive calculations needed in your code

**Common aspect ratios:**
- `1920 x 1080` - 16:9 landscape (Full HD)
- `1280 x 720` - 16:9 landscape (HD)
- `800 x 600` - 4:3 landscape (classic)
- `1080 x 1920` - 9:16 portrait (mobile)

**Default:** `false`

### Rendering Quality

#### pixelRatio

Control pixel density for high-DPI displays. Set to `1` for pixel-perfect art.

```javascript
// Use device pixel ratio (crisp on retina displays)
const game = new Game({
  pixelRatio: window.devicePixelRatio
});

// Force 1x for pixel art
const game = new Game({
  pixelRatio: 1,
  antialias: false
});
```

**Default:** `window.devicePixelRatio ?? 1`

#### antialias

Enable or disable image smoothing.

```javascript
const game = new Game({
  antialias: true,  // Smooth rendering
  imageSmoothingQuality: 'high'
});
```

For pixel-perfect rendering, disable antialiasing:

```javascript
const game = new Game({
  antialias: false,
  pixelRatio: 1
});
```

**Default:** `true`

#### imageSmoothingQuality

Set the image smoothing quality when `antialias` is enabled.

```javascript
const game = new Game({
  imageSmoothingQuality: 'high'  // 'low', 'medium', or 'high'
});
```

**Default:** `'high'`

### Performance Options

#### targetFPS

Limit the maximum frame rate. Useful for battery conservation or performance tuning.

```javascript
const game = new Game({
  targetFPS: 30  // Run at 30 FPS instead of 60
});
```

**Default:** `null` (runs at monitor refresh rate, typically 60 FPS)

#### maxDeltaTime

Cap the maximum delta time (in seconds) to prevent "spiral of death" during lag spikes.

```javascript
const game = new Game({
  maxDeltaTime: 0.1  // Cap at 100ms
});
```

**Default:** `0.1` (100 milliseconds)

### Canvas Context Options

#### alpha

Allow transparency in the canvas. Enables seeing through the canvas to the page behind it.

```javascript
const game = new Game({
  alpha: true,
  backgroundColor: 'transparent'
});
```

**Default:** `false`

#### desynchronized

Hint to the browser for better rendering performance by reducing latency. Generally should stay enabled.

```javascript
const game = new Game({
  desynchronized: true
});
```

**Default:** `true`

### Features

#### enableTouchTrail

Enable visual [touch trails](/animation/touch-trail) that follow pointer movement.

```javascript
const game = new Game({
  enableTouchTrail: true
});

// Configure the touch trail
if (game.touchTrail) {
  game.touchTrail.color = '#4fc3f7';
  game.touchTrail.width = 20;
}
```

**Default:** `false`

See [Touch Trail documentation](/animation/touch-trail) for more details.

### Debug Options

#### showFPS

Display frames per second in the top-left corner.

```javascript
const game = new Game({
  showFPS: true
});
```

**Default:** `false`

#### debug

Enable debug mode for additional logging and diagnostics.

```javascript
const game = new Game({
  debug: true
});
```

**Default:** `false`

## Complete Configuration Example

Here's a game with commonly used options:

```javascript
import { Game } from '@mode-7/zap';

const game = new Game({
  // Display
  width: 1280,
  height: 720,
  parent: '#game-container',
  backgroundColor: '#0f3460',
  responsive: true,

  // Quality
  pixelRatio: window.devicePixelRatio,
  antialias: true,
  imageSmoothingQuality: 'high',

  // Performance
  targetFPS: 60,
  maxDeltaTime: 0.1,

  // Features
  enableTouchTrail: false,

  // Debug
  showFPS: false,
  debug: false
});
```

## Game Methods

### setScene()

Switch to a new [scene](/core/scenes). Optionally specify a transition effect.

```javascript
// Instant switch
game.setScene(newScene);

// With transition
await game.setScene(newScene, {
  transition: 'fade',
  duration: 500
});
```

**Available transitions:**
- `'fade'` - Fade to black and back
- `'slide-left'` - Slide left
- `'slide-right'` - Slide right
- `'slide-up'` - Slide up
- `'slide-down'` - Slide down

Returns a `Promise` that resolves when the transition completes.

### transitionTo()

Directly trigger a scene transition. This is called internally by `setScene()` when a transition is specified.

```javascript
await game.transitionTo(newScene, {
  type: 'fade',
  duration: 500
});
```

### getScene()

Get the currently active scene.

```javascript
const currentScene = game.getScene();
```

Returns the current `Scene` or `null` if no scene is set.

### start()

Start the game loop. Call this after setting the initial scene.

```javascript
game.start();
```

Emits `'start'` event. If the game was paused, also emits `'resume'` event.

### stop()

Stop the game loop. Use this to pause the game.

```javascript
game.stop();
```

Emits `'stop'` and `'pause'` events.

### resize()

Manually trigger a canvas resize. This is called automatically when `responsive: true` is enabled.

```javascript
game.resize();
```

### canvasToGame()

Convert canvas/screen coordinates to game coordinates. Useful for pointer events.

```javascript
canvas.addEventListener('click', (e) => {
  const gamePos = game.canvasToGame(e.clientX, e.clientY);
  console.log('Clicked at:', gamePos.x, gamePos.y);
});
```

Returns `{ x: number, y: number }` in game coordinate space.

### destroy()

Clean up and remove the game. Stops the game loop, removes event listeners, and cleans up resources.

```javascript
game.destroy();
```

## Game Properties

Access these properties to interact with the game state:

### Dimensions

```javascript
game.width   // Canvas width in game coordinates
game.height  // Canvas height in game coordinates
```

### Canvas & Context

```javascript
game.canvas  // HTMLCanvasElement
game.ctx     // CanvasRenderingContext2D
```

### Systems

```javascript
game.camera       // Camera instance - see Camera documentation
game.gestures     // GestureManager instance
game.touchTrail   // TouchTrail instance (if enabled) or null
```

**See also:**
- [Camera documentation](/core/camera)
- [Touch Trail documentation](/animation/touch-trail)

### Scene

```javascript
const scene = game.getScene();  // Get currently active Scene
```

## Game Events

The `Game` class extends [`EventEmitter`](/core/architecture#event-system). Listen for events with `game.on()`:

### Lifecycle Events

```javascript
game.on('start', () => {
  console.log('Game loop started');
});

game.on('stop', () => {
  console.log('Game loop stopped');
});

game.on('pause', () => {
  console.log('Game paused');
});

game.on('resume', () => {
  console.log('Game resumed');
});
```

### Frame Events

```javascript
game.on('update', (deltaTime) => {
  // Called every frame before rendering
  // deltaTime is in seconds (e.g., 0.016 for 60 FPS)
});

game.on('render', (ctx) => {
  // Called every frame after rendering
  // Useful for custom overlays
  // ctx is the CanvasRenderingContext2D
});
```

### Scene Events

```javascript
game.on('scenechange', (scene) => {
  console.log('Scene changed to:', scene);
});
```

### Resize Event

Fired when canvas is resized (only when `responsive: true`):

```javascript
game.on('resize', (event) => {
  // event.displayWidth, event.displayHeight - actual display size
  // event.designWidth, event.designHeight - design resolution
  console.log(`Display: ${event.displayWidth}x${event.displayHeight}`);
});
```

### Pointer Events

Low-level pointer events (consider using [gestures](/gestures/tap) instead):

```javascript
game.on('pointerdown', (event) => {
  // event.position = { x, y }
  // event.originalEvent = PointerEvent
});

game.on('pointermove', (event) => {
  // Pointer moved
});

game.on('pointerup', (event) => {
  // Pointer released
});

game.on('click', (event) => {
  // Canvas clicked
});
```

For interactive elements, use [gesture events](/gestures/tap) on entities instead.

## Next Steps

- [Scenes](/core/scenes) - Organize your game with scenes
- [Entities](/core/entities) - Add visual elements to your scenes
- [Camera](/core/camera) - Control the viewport
- [Gestures](/gestures/tap) - Handle user input
