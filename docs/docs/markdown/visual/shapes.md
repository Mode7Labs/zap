---
title: Shapes
description: Create colored rectangles, rounded rectangles, and circles
---

# Shapes

[Sprites](/visual/sprites) can render colored shapes including rectangles, rounded rectangles, and perfect circles. Shapes are [Sprite](/visual/sprites) [entities](/core/entities) with a `color` property but no `image`. Shapes are the fastest rendering option in Zap.

## Creating Shapes

Create a shape by specifying a `color` property (and no `image`):

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

The `radius` controls how rounded the corners are. Larger values create more rounded corners. The radius is automatically clamped to prevent it from exceeding half the smallest dimension.

**Default:** `0` (sharp corners)

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

## Shape-Specific Properties

### color

The fill color of the shape. Accepts any valid CSS color string.

```javascript
sprite.color = '#51cf66';      // Hex color
sprite.color = 'rgb(81, 207, 102)';  // RGB
sprite.color = 'rgba(81, 207, 102, 0.5)';  // RGBA with alpha
sprite.color = 'hsl(142, 58%, 60%)';  // HSL
```

**Type:** `string | null`
**Default:** `null`

### radius

Corner radius for rounded rectangles and circles. Set to `0` for sharp corners, or to `width / 2` (where `width === height`) for a perfect circle.

```javascript
sprite.radius = 0;   // Sharp corners (rectangle)
sprite.radius = 10;  // Rounded corners
sprite.radius = 40;  // Circle (if width and height are both 80)
```

The radius is automatically clamped to a maximum of half the smallest dimension.

**Type:** `number`
**Default:** `0`

### width / height

Shape dimensions in pixels. For circles, set both to the same value.

```javascript
sprite.width = 120;
sprite.height = 90;
```

**Type:** `number`
**Default:** `0`

## Inherited Properties

Shapes are [Sprite](/visual/sprites) [entities](/core/entities), so they inherit all [entity properties](/core/entities#common-properties) including:

- **Transform:** `x`, `y`, `rotation`, `scaleX`, `scaleY`, `alpha`
- **Anchor:** `anchorX`, `anchorY`
- **State:** `active`, `visible`, `zIndex`
- **Interactivity:** `interactive` (requires `width` and `height`)

```javascript
sprite.alpha = 0.5;            // Make semi-transparent
sprite.rotation = Math.PI / 4; // Rotate 45 degrees
sprite.scaleX = 1.5;           // Scale horizontally
sprite.interactive = true;     // Enable gesture detection
```

See [Entity documentation](/core/entities) for complete details.

## Performance Tips

- **Shapes are fastest**: Colored shapes render significantly faster than [image sprites](/visual/sprites)
- **Avoid transparency**: Fully opaque shapes (`alpha: 1`) render fastest
- **Batch rendering**: Zap automatically batches shapes for optimal performance
- **Reuse sprites**: Modify existing [entity](/core/entities) properties instead of creating new ones
- **Use object pooling**: For frequently created/destroyed shapes (like bullets), use [object pooling](/core/entities#object-pooling)

## Common Patterns

### Button-like Shape

Create interactive buttons using shapes with [gesture detection](/gestures/tap):

```javascript
const button = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 50,
  color: '#667eea',
  radius: 25,  // Half the height for pill shape
  interactive: true  // Enable gestures
});

button.on('tap', () => {
  button.color = '#5a67d8';  // Darken on tap
});
```

See [Button component](/ui/button) for a full-featured button implementation.

### Animated Circle

Animate shapes using [tweening](/animation/tweening):

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

See [Tweening documentation](/animation/tweening) for more animation options.

## Best Practices

1. **Use shapes for UI**: Shapes are perfect for buttons, panels, and UI elements
2. **Set dimensions for interactivity**: Shapes must have `width` and `height` to use [gestures](/gestures/tap)
3. **Combine with physics**: Shapes work great with [physics](/physics/physics) and [collision detection](/physics/collision-detection)
4. **Layer with zIndex**: Use `zIndex` to control render order (backgrounds, game objects, UI)
5. **Prefer shapes over images**: When you don't need texture detail, shapes render much faster

## Common Mistakes

### Missing Dimensions for Interactivity

```javascript
// ❌ Wrong - no width/height means no gesture detection
const button = new Sprite({
  x: 200,
  y: 150,
  color: '#667eea',
  interactive: true  // Won't work!
});

// ✅ Right - width and height required for gestures
const button = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 50,
  color: '#667eea',
  interactive: true
});
```

### Incorrect Circle Radius

```javascript
// ❌ Wrong - radius too small, renders as rounded rect
const circle = new Sprite({
  width: 80,
  height: 80,
  radius: 20,  // Should be 40!
  color: '#4fc3f7'
});

// ✅ Right - radius = width / 2 for perfect circle
const circle = new Sprite({
  width: 80,
  height: 80,
  radius: 40,  // Perfect circle
  color: '#4fc3f7'
});
```

### Using Image and Color Together

```javascript
// ❌ Wrong - both image and color defined
const sprite = new Sprite({
  image: 'player.png',
  color: '#e94560'  // Ignored when image exists
});

// ✅ Right - use one or the other
const shape = new Sprite({
  color: '#e94560'  // Shape
});

const imageSprite = new Sprite({
  image: 'player.png'  // Image sprite
});
```

## Next Steps

- [Entities](/core/entities) - Learn about the entity system that powers shapes
- [Sprites](/visual/sprites) - Load and display image sprites
- [Sprite Animation](/visual/animation) - Animate sprite sheets
- [Text](/visual/text) - Render text elements
- [Tweening](/animation/tweening) - Animate shape properties
- [Gestures](/gestures/tap) - Add interactivity to shapes
