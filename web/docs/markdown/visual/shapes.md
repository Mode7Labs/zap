---
title: Shapes
description: Create colored rectangles, rounded rectangles, and circles
---

# Shapes

Sprites can render colored shapes including rectangles, rounded rectangles, and perfect circles. Shapes are the fastest rendering option in Zap.

## Creating Shapes

Create a shape by specifying a `color` property and no `image`:

```javascript
import { Sprite } from '@mode-7/zap';

const rect = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 60,
  color: '#e94560'
});
```

## Rectangle

A basic rectangle with sharp corners:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const rect = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 70,
  color: '#e94560',
  radius: 0  // Sharp corners (default)
});

scene.add(rect);
game.setScene(scene);
game.start();
```

## Rounded Rectangle

Add rounded corners with the `radius` property:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const rounded = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 70,
  color: '#4fc3f7',
  radius: 15  // Rounded corners
});

scene.add(rounded);
game.setScene(scene);
game.start();
```

The `radius` controls how rounded the corners are. Larger values create more rounded corners.

## Circle

Create a perfect circle by setting `width` equal to `height` and `radius` to half the width:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const circle = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 80,
  radius: 40,  // radius = width / 2 for perfect circle
  color: '#2ecc71'
});

scene.add(circle);
game.setScene(scene);
game.start();
```

**Formula for perfect circle**: `radius = width / 2` (where `width === height`)

## Multiple Shapes

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Rectangle
const rect = new Sprite({
  x: 100,
  y: 150,
  width: 60,
  height: 80,
  color: '#e94560'
});

// Rounded rectangle
const rounded = new Sprite({
  x: 200,
  y: 150,
  width: 60,
  height: 80,
  color: '#f39c12',
  radius: 10
});

// Circle
const circle = new Sprite({
  x: 300,
  y: 150,
  width: 60,
  height: 60,
  radius: 30,
  color: '#2ecc71'
});

scene.add(rect);
scene.add(rounded);
scene.add(circle);

game.setScene(scene);
game.start();
```

## Properties

All shape properties can be modified after creation:

```javascript
sprite.color = '#51cf66';      // Change color
sprite.radius = 20;            // Change corner radius
sprite.width = 120;            // Change size
sprite.height = 90;
sprite.alpha = 0.5;            // Make semi-transparent
```

## Performance Tips

- **Shapes are fastest**: Colored shapes render faster than images
- **Avoid transparency**: Fully opaque shapes (`alpha: 1`) render fastest
- **Batch rendering**: Zap automatically batches shapes for optimal performance
- **Reuse sprites**: Modify existing sprites instead of creating new ones

## Common Patterns

### Button-like Shape

```javascript
const button = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 50,
  color: '#667eea',
  radius: 25,  // Half the height for pill shape
  interactive: true
});

button.on('tap', () => {
  button.color = '#5a67d8';  // Darken on tap
});
```

### Animated Circle

```javascript
const circle = new Sprite({
  x: 200,
  y: 150,
  width: 40,
  height: 40,
  radius: 20,
  color: '#4fc3f7'
});

// Pulse animation
circle.tween(
  { scaleX: 1.5, scaleY: 1.5, alpha: 0.3 },
  { duration: 1000, loop: true, easing: 'easeInOutQuad' }
);
```

## Next Steps

- [Sprites](/visual/sprites) - Load and display images
- [Sprite Animation](/visual/animation) - Animate sprite sheets
- [Text](/visual/text) - Render text
