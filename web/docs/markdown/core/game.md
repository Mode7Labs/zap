---
title: Game Configuration
description: Configure your Game instance with all available options
---

# Game Configuration

The `Game` class is the root of your Zap application. It manages the canvas, game loop, and all core systems.

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

## Display Options

### Canvas Size

Control the dimensions of your game:

```javascript
const game = new Game({
  width: 1024,
  height: 768
});
```

### Custom Parent

Append the canvas to a specific element:

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

### Existing Canvas

Use an existing canvas element:

```javascript
const canvas = document.querySelector('canvas');
const game = new Game({
  canvas: canvas,
  width: 800,
  height: 600
});
```

### Background Color

Set the default background color:

```javascript
const game = new Game({
  backgroundColor: '#0f3460'
});
```

### Responsive Mode

Make the canvas automatically resize with its container:

```javascript
const game = new Game({
  responsive: true
});
```

**With Aspect Ratio Control:**

Combine `responsive: true` with `width` and `height` to maintain a specific aspect ratio:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

// Creates a responsive game that maintains 16:9 aspect ratio
const game = new Game({
  parent: '#app',
  width: 1920,
  height: 1080,  // 16:9 aspect ratio
  responsive: true,
  backgroundColor: '#1a1a2e'
});

const scene = new Scene();

// Game will automatically add letterboxing/pillarboxing to maintain aspect ratio
// Your game logic always works with the specified dimensions (1920x1080)

const player = new Sprite({
  x: game.width / 2,  // Always 960 (half of 1920)
  y: game.height / 2,  // Always 540 (half of 1080)
  width: 50,
  height: 50,
  color: '#e94560'
});

scene.add(player);
game.setScene(scene);
game.start();
```

**Common Aspect Ratios:**
- `width: 1920, height: 1080` - 16:9 landscape (HD/Full HD)
- `width: 1280, height: 720` - 16:9 landscape (HD)
- `width: 800, height: 600` - 4:3 landscape (classic)
- `width: 1080, height: 1920` - 9:16 portrait (mobile)
- `width: 720, height: 1280` - 9:16 portrait (mobile)

**Benefits:**
- Canvas automatically scales to fit container
- Aspect ratio is always maintained with letterboxing/pillarboxing
- Your code always uses the same coordinate system
- No complex responsive calculations needed
- `game.width` and `game.height` stay constant

## Rendering Quality

### Pixel Ratio

Control pixel density for high-DPI displays:

```javascript
// Use device pixel ratio (default)
const game = new Game({
  pixelRatio: window.devicePixelRatio
});

// Force 1x for pixel art
const game = new Game({
  pixelRatio: 1,
  antialias: false
});
```

### Antialiasing

Control image smoothing:

```javascript
const game = new Game({
  antialias: true,  // Smooth rendering (default)
  imageSmoothingQuality: 'high'  // 'low', 'medium', or 'high'
});
```

For pixel-perfect rendering:

```javascript
const game = new Game({
  antialias: false,
  pixelRatio: 1
});
```

## Performance Options

### Target FPS

Limit the frame rate:

```javascript
const game = new Game({
  targetFPS: 30  // Run at 30 FPS instead of 60
});
```

### Max Delta Time

Prevent spiral of death during lag:

```javascript
const game = new Game({
  maxDeltaTime: 0.1  // Cap delta at 100ms (default)
});
```

## Canvas Context Options

### Transparent Canvas

Allow transparency:

```javascript
const game = new Game({
  alpha: true,
  backgroundColor: 'transparent'
});
```

### Desynchronized Rendering

Hint for better performance (enabled by default):

```javascript
const game = new Game({
  desynchronized: true  // default
});
```

## Features

### Touch Trail

Enable visual touch trails:

```javascript
const game = new Game({
  enableTouchTrail: true
});

// Access the touch trail
game.touchTrail.color = '#4fc3f7';
game.touchTrail.width = 20;
```

## Debug Options

### FPS Counter

Show frames per second:

```javascript
const game = new Game({
  showFPS: true
});
```

The FPS counter appears in the top-left corner.

## Complete Example

Here's a game with all common options:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  // Display
  width: 400,
  height: 300,
  backgroundColor: '#0f3460',
  parent: document.body,

  // Quality
  pixelRatio: window.devicePixelRatio,
  antialias: true,
  imageSmoothingQuality: 'high',

  // Debug
  showFPS: true
});

const scene = new Scene();

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 60,
  height: 60,
  color: '#e94560'
});

scene.add(sprite);
game.setScene(scene);
game.start();
```

## Game Methods

### setScene()

Switch to a new scene:

```javascript
game.setScene(newScene);
```

With a transition:

```javascript
game.setScene(newScene, {
  transition: 'fade',
  duration: 500
});
```

Available transitions: `'fade'`, `'slide-left'`, `'slide-right'`, `'slide-up'`, `'slide-down'`

### start()

Start the game loop:

```javascript
game.start();
```

### stop()

Pause the game loop:

```javascript
game.stop();
```

### destroy()

Clean up and remove the game:

```javascript
game.destroy();
```

## Game Properties

Access useful properties:

```javascript
game.width          // Canvas width
game.height         // Canvas height
game.canvas         // HTMLCanvasElement
game.ctx            // CanvasRenderingContext2D
game.camera         // Camera instance
game.gestures       // GestureManager instance
game.currentScene   // Current Scene (read-only)
```

## Next Steps

- [Scenes](/core/scenes) - Learn about scene management
- [Camera](/camera/camera) - Control the viewport
- [Gestures](/interactions/tap) - Handle user input
