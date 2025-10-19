---
title: Installation
description: Get started with Zap in your project
---

# Installation

Zap is a lightweight, gesture-first 2D game engine perfect for creating interactive demos and playable ads. Get up and running in seconds.

## NPM Installation

The recommended way to install Zap is via npm:

```bash
npm install @mode-7/zap
```

Or using yarn:

```bash
yarn add @mode-7/zap
```

## CDN Usage

For quick prototyping or simple projects, you can use Zap directly from a CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Zap Demo</title>
</head>
<body>
  <script type="module">
    import { Game, Scene, Sprite } from 'https://esm.sh/@mode-7/zap@0.1.2';

    const game = new Game({ width: 800, height: 600 });
    const scene = new Scene();
    game.setScene(scene);
    game.start();
  </script>
</body>
</html>
```

## TypeScript Support

Zap is written in TypeScript and includes type definitions out of the box. No additional setup required!

```javascript
import { Game, Scene, Sprite } from '@mode-7/zap';

const game = new Game({
  width: 800,
  height: 600,
  backgroundColor: '#0f3460'
});
```

## What's Included

When you install Zap, you get:

- **Core** - Game instance, Scene management, Camera control
- **Entities** - Sprite, Text, AnimatedSprite, NinePatch
- **UI** - Button components
- **Effects** - Tweening, Particles, Touch trails
- **Gestures** - Tap, swipe, drag, and long-press recognition
- **Audio** - Sound and music management
- **Utils** - Layout helpers, easing functions, asset loading, storage

## Browser Support

Zap works in all modern browsers that support:
- HTML5 Canvas
- ES6+ JavaScript
- Modules (import/export)

This includes the latest versions of Chrome, Firefox, Safari, and Edge.

## Next Steps

Now that Zap is installed, head over to the [Quick Start](/getting-started/quickstart) guide to create your first interactive demo!
