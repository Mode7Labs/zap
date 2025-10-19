# Zap Documentation Modules

This directory contains modular demo definitions for the Zap documentation page.

## Structure

Each demo is a separate JavaScript module that exports a default object with the following structure:

### Interactive Demo Format

```javascript
export default {
  title: 'Demo Title',
  description: 'Brief description of the demo',
  code: `// Code example shown in the docs
const sprite = new Sprite({...});`,
  init: async (container) => {
    // Import required classes
    const { Game, Scene, Sprite } = await import('/dist/index.mjs');

    // Create and initialize the demo
    const game = new Game({ parent: container, ... });
    // ... demo setup

    return game; // Must return game instance for cleanup
  }
};
```

### Documentation Page Format

```javascript
export default {
  title: 'Doc Page Title',
  description: 'Brief description',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Section Title</h3>
      <p>Documentation content with HTML...</p>
    </div>
  `
};
```

## Available Demos

### Getting Started
- `installation.js` - Installation instructions
- `quickstart.js` - Quick start guide

### Core Concepts
- `architecture.js` - Engine architecture overview
- `game.js` - Game configuration options
- `scenes.js` - Scene management
- `entities.js` - Entity system basics

### Visual Elements
- `sprites.js` - Sprite shapes and colors
- `images.js` - Loading image sprites
- `animatedsprite.js` - Frame-based animations
- `ninepatch.js` - Scalable UI panels
- `text.js` - Text rendering
- `fonts.js` - Google Fonts integration

### UI Components
- `button.js` - Interactive button component

### Camera
- `camera.js` - Camera controls (follow, zoom, shake)

### Audio
- `audio.js` - Sound effects and music

### Interactions
- `tap.js` - Tap gesture demo
- `swipe.js` - Swipe gesture demo
- `drag.js` - Drag gesture demo
- `touchtrail.js` - Touch trail effect
- `canvasevents.js` - Canvas-level pointer events
- `canvasgestures.js` - Canvas-level gesture events

### Animation & Effects
- `animations.js` - Tween animations
- `easing.js` - Easing functions
- `particles.js` - Particle system

### Utilities
- `collision.js` - Collision detection system
- `layout.js` - Layout helpers
- `assetloader.js` - Asset preloading
- `storage.js` - LocalStorage wrapper
- `timer.js` - Delay and interval utilities

## Loader System

The `loader.js` module provides dynamic demo loading:

```javascript
import { loadDemo } from './demos/loader.js';

const demo = await loadDemo('sprites');
if (demo) {
  // Use demo.title, demo.code, demo.init(), etc.
}
```

## Adding New Demos

1. Create a new `.js` file in this directory
2. Export a default object following the format above
3. Add the demo key to `loader.js` in the `demoFiles` mapping
4. Add a navigation item in `documentation.html` with `data-demo="your-key"`

## Benefits of This Structure

- **Maintainability**: Each demo is isolated in its own file
- **Performance**: Demos are loaded on-demand, not all at once
- **Readability**: Easier to find and edit specific demos
- **File Size**: Main documentation.html reduced from 2,889 to 460 lines (84% smaller)
- **Collaboration**: Multiple developers can work on different demos simultaneously
