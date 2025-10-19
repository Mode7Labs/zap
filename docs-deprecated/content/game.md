---
id: game
title: Game Configuration
category: core
description: Configure your game with flexible options including responsive canvas
imports: ["Game"]
---

# Game Configuration

The `Game` class is the heart of your Zap application. It manages the canvas, game loop, and scenes.

## Basic Setup

```javascript
import { Game } from '@mode-7/zap';

const game = new Game({
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: '#app'
});

game.start();
```

## All Options

```javascript
new Game({
  // Display
  width: 800,                       // Canvas width (default: 800)
  height: 600,                      // Canvas height (default: 600)
  backgroundColor: '#000000',       // Background color
  parent: '#app',                   // Parent element or selector
  canvas: HTMLCanvasElement,        // Existing canvas (optional)
  responsive: false,                // Auto-resize to parent

  // Rendering Quality
  pixelRatio: window.devicePixelRatio,  // Device pixel ratio
  antialias: true,                  // Image smoothing
  imageSmoothingQuality: 'high',    // 'low' | 'medium' | 'high'
  alpha: false,                     // Canvas transparency
  desynchronized: true,             // Performance hint

  // Performance
  targetFPS: null,                  // Lock to specific FPS (or null)
  maxDeltaTime: 0.1,                // Max time step (seconds)

  // Features
  enableTouchTrail: false,          // Show touch trail effect

  // Debug
  showFPS: false,                   // Show FPS counter
  debug: false                      // Enable debug mode
})
```

## Responsive Canvas

Enable responsive mode to auto-scale your game while maintaining aspect ratio:

```javascript
const game = new Game({
  width: 720,        // Design width
  height: 1280,      // Design height
  responsive: true,  // Enable auto-scaling
  parent: '#container'
});

// Listen for resize events
game.on('resize', ({ displayWidth, displayHeight, designWidth, designHeight }) => {
  console.log(`Display: ${displayWidth}×${displayHeight}`);
  console.log(`Design: ${designWidth}×${designHeight}`);
});

// Manually trigger resize
game.resize();
```

**How it works:**
- Your game logic uses fixed design coordinates (e.g., 720×1280)
- Canvas automatically scales to fit parent container
- Maintains aspect ratio with letterboxing if needed
- Uses ResizeObserver for automatic updates

## Performance Options

### Frame Rate Limiting

Limit FPS to save battery:

```javascript
const game = new Game({
  targetFPS: 30  // Lock to 30 FPS
});
```

### Delta Time Clamping

Prevent physics breaking when tab is inactive:

```javascript
const game = new Game({
  maxDeltaTime: 0.05  // Clamp to 50ms max
});
```

## Debug Mode

Show FPS counter during development:

```javascript
const game = new Game({
  showFPS: true,
  debug: true
});
```

## Methods

### Game Control

```javascript
game.start()                    // Start game loop
game.stop()                     // Stop game loop
game.destroy()                  // Cleanup and destroy
```

### Scene Management

```javascript
game.setScene(scene)            // Set current scene
game.getScene()                 // Get current scene

// Transition with animation
await game.transitionTo(scene, {
  type: 'fade',
  duration: 500
})
```

### Coordinate Conversion

```javascript
const gamePos = game.canvasToGame(clientX, clientY)
```

## Properties

```javascript
game.canvas      // HTMLCanvasElement
game.ctx         // CanvasRenderingContext2D
game.width       // Canvas width
game.height      // Canvas height
game.camera      // Camera instance
game.gestures    // GestureManager instance
```

## Events

Listen to game events:

```javascript
game.on('start', () => {
  console.log('Game started');
});

game.on('stop', () => {
  console.log('Game stopped');
});

game.on('scenechange', (scene) => {
  console.log('Scene changed:', scene);
});

game.on('update', (deltaTime) => {
  // Called every frame
});

// Responsive canvas events
game.on('resize', ({ displayWidth, displayHeight }) => {
  console.log('Canvas resized');
});
```

## Tips

💡 **Responsive Mode**: Perfect for playable ads that need to work across different screen sizes

💡 **Performance**: Use `targetFPS: 30` for battery-conscious games on mobile

💡 **Delta Time**: Always use `maxDeltaTime` to prevent "spiral of death" physics bugs
