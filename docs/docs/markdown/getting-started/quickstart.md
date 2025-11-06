---
title: Quick Start
description: Build your first interactive demo in 5 minutes
---

# Quick Start

Let's create your first interactive demo with Zap! You'll learn the basic concepts and have something running in minutes.

## Your First Demo

Every Zap application needs three things:

1. A **Game** instance
2. A **Scene** to hold your entities
3. Some **Entities** (sprites, text, etc.)

Here's the simplest possible example:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

// Create the game
const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

// Create a scene
const scene = new Scene();

// Create a colored square
const square = new Sprite({
  x: 200,
  y: 150,
  width: 60,
  height: 60,
  color: '#e94560'
});

// Add square to scene
scene.add(square);

// Set the scene and start
game.setScene(scene);
game.start();
```

## Making It Interactive

Now let's make the square respond to taps with a smooth animation:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create an interactive square
const square = new Sprite({
  x: 200,
  y: 150,
  width: 60,
  height: 60,
  color: '#e94560',
  interactive: true  // Enable gestures
});

// Respond to taps
square.on('tap', () => {
  // Animate rotation and scale
  square.tween(
    { rotation: square.rotation + Math.PI * 2, scaleX: 1.5, scaleY: 1.5 },
    { duration: 400, easing: 'easeOutBack' }
  ).then(() => {
    // Return to normal size
    square.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 300, easing: 'easeInOut' }
    );
  });
});

scene.add(square);
game.setScene(scene);
game.start();
```

## Key Concepts

### Game Instance

The `Game` class manages your canvas, the game loop, and scene transitions. You create one at the start:

```javascript
const game = new Game({
  width: 800,
  height: 600,
  backgroundColor: '#0f3460'
});
```

### Scene

A `Scene` is a container for all your game entities. Think of it like a level or screen:

```javascript
const scene = new Scene();
scene.add(sprite);
game.setScene(scene);
```

### Entities

Entities are the visual elements in your game. The most common is `Sprite`:

```javascript
const sprite = new Sprite({
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  color: '#667eea'
});
```

### Gestures

Make entities interactive by setting `interactive: true` and listening for gesture events:

```javascript
sprite.interactive = true;
sprite.on('tap', () => console.log('Tapped!'));
sprite.on('drag', (e) => {
  sprite.x += e.delta.x;
  sprite.y += e.delta.y;
});
```

### Tweening

Animate properties smoothly with the `tween` method:

```javascript
sprite.tween(
  { x: 400, rotation: Math.PI },
  { duration: 1000, easing: 'easeInOutQuad' }
);
```

## Next Steps

You now know the basics! Explore these topics next:

- [Architecture](/core/architecture) - Understand how Zap is structured
- [Game Configuration](/core/game) - Learn all Game options
- [Scenes](/core/scenes) - Manage multiple scenes and transitions
- [Sprites](/visual/sprites) - Deep dive into visual entities
