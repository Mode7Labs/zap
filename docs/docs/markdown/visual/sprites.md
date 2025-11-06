---
title: Image Sprites
description: Load and display images with Sprite
---

# Image Sprites

Image sprites are [Sprite](/visual/sprites) [entities](/core/entities) that display images. They can load images from URL strings or use existing `HTMLImageElement` objects, with support for automatic sizing, rounded/circular clipping, and all standard [entity properties](/core/entities#common-properties).

## Creating Image Sprites

Load images from a URL string or pass an existing `HTMLImageElement`:

```javascript
import { Sprite } from '@mode-7/zap';

// Load from URL string
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: '/assets/character.png'
});

// Or use an HTMLImageElement
const img = new Image();
img.src = '/assets/sprite.png';
const sprite2 = new Sprite({
  x: 300,
  y: 150,
  width: 100,
  height: 100,
  image: img
});
```

## Basic Example

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: '../assets/pixel-girl.png'
});

scene.add(sprite);
game.setScene(scene);
game.start();
```

## Image-Specific Properties

### image

The image to display. Can be a URL string or an `HTMLImageElement`.

```javascript
// URL string
sprite.image = '/assets/character.png';

// HTMLImageElement
const img = new Image();
img.src = '/assets/sprite.png';
sprite.image = img;
```

**Type:** `HTMLImageElement | string | null`
**Default:** `null`

### width / height

Image dimensions in pixels. If not specified, the sprite will automatically size to match the image's natural dimensions when it loads.

```javascript
// Explicit sizing
const sprite = new Sprite({
  image: '/assets/icon.png',
  width: 64,
  height: 64
});

// Auto-sizing (uses image dimensions)
const logo = new Sprite({
  image: '/assets/logo.png'  // width/height set on load
});
```

**Note:** Until the image loads, auto-sized sprites will have `width: 0` and `height: 0`.

**Type:** `number`
**Default:** `0` (or image dimensions if not specified)

### radius

Corner radius for rounded or circular image clipping. Same behavior as [shapes](/visual/shapes).

```javascript
// Rounded corners
sprite.radius = 10;

// Perfect circle (radius = width / 2, where width === height)
const avatar = new Sprite({
  width: 80,
  height: 80,
  radius: 40,
  image: '/assets/profile.jpg'
});
```

**Type:** `number`
**Default:** `0` (no clipping)

## Inherited Properties

Image sprites are [Sprite](/visual/sprites) [entities](/core/entities), so they inherit all [entity properties](/core/entities#common-properties):

- **Transform:** `x`, `y`, `rotation`, `scaleX`, `scaleY`, `alpha`
- **Anchor:** `anchorX`, `anchorY`
- **State:** `active`, `visible`, `zIndex`
- **Interactivity:** `interactive`

```javascript
sprite.rotation = Math.PI / 4;  // Rotate 45 degrees
sprite.scaleX = 2;               // Scale 2x horizontally
sprite.alpha = 0.8;              // 80% opacity
sprite.interactive = true;       // Enable gestures
```

## Sprite Methods

### loadImage()

Asynchronously load an image from a URL. Returns a `Promise` that resolves when the image loads.

```javascript
loadImage(url: string): Promise<void>
```

**Parameters:**
- `url` - Image URL to load

**Example:**

```javascript
const sprite = new Sprite({ x: 200, y: 150 });

try {
  await sprite.loadImage('/assets/character.png');
  console.log('Image loaded!');
} catch (error) {
  console.error('Failed to load image:', error);
  // Fallback to a colored shape
  sprite.color = '#e94560';
  sprite.width = 64;
  sprite.height = 64;
}
```

**Note:** The `image` option in the constructor also supports URL strings, which internally call `loadImage()`.

## Image Events

### imageload

Emitted when an image finishes loading. The loaded `HTMLImageElement` is passed to the event handler.

```javascript
sprite.on('imageload', (img) => {
  console.log(`Image loaded: ${img.width}x${img.height}`);

  // Animate sprite in
  sprite.tween(
    { alpha: 1, scaleX: 1, scaleY: 1 },
    { duration: 400, easing: 'easeOutBack' }
  );
});
```

**Event data:** `HTMLImageElement`

## Image Loading Strategies

### Inline Loading

Load images directly in the constructor:

```javascript
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: '/assets/character.png'
});
```

The image loads asynchronously. Listen for `'imageload'` if you need to know when it's ready.

### Explicit Loading

Use `loadImage()` for error handling and loading control:

```javascript
const sprite = new Sprite({ x: 200, y: 150 });

try {
  await sprite.loadImage('/assets/character.png');
} catch (error) {
  console.error('Failed to load:', error);
  // Handle error
}
```

### Preloading with Asset Loader

Preload images before creating sprites for instant display:

```javascript
import { assetLoader, Sprite } from '@mode-7/zap';

// Preload all images
await assetLoader.loadImages({
  hero: '/assets/hero.png',
  enemy: '/assets/enemy.png',
  background: '/assets/bg.png'
});

// Use preloaded images (instant display, no loading delay)
const hero = new Sprite({
  x: 200,
  y: 150,
  width: 64,
  height: 64,
  image: assetLoader.getImage('hero')
});
```

See [Asset Loader documentation](/utilities/asset-loader) for complete details.

## Performance Tips

- **Preload images**: Use [Asset Loader](/utilities/asset-loader) to preload images before scenes
- **Reuse images**: Share the same `HTMLImageElement` between multiple sprites
- **Appropriate sizes**: Load images at the size you'll display them to save memory
- **Use sprite sheets**: For animations, use [sprite sheet animations](/visual/animation) instead of multiple images
- **Power of 2**: Use power-of-2 dimensions (64, 128, 256, 512) for optimal rendering

## Common Patterns

### Interactive Sprite

Make image sprites respond to [gestures](/gestures/tap):

```javascript
const button = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 50,
  image: '/assets/button.png',
  interactive: true  // Enable gesture detection
});

button.on('tap', () => {
  // Scale feedback animation
  button.tween(
    { scaleX: 1.1, scaleY: 1.1 },
    { duration: 100 }
  ).then(() => {
    button.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100 }
    );
  });
});
```

### Circular Avatar

Create circular profile images:

```javascript
const avatar = new Sprite({
  x: 100,
  y: 100,
  width: 80,
  height: 80,
  radius: 40,  // Perfect circle
  image: '/assets/profile.jpg'
});
```

### Card Flip Animation

Flip between two images with rotation:

```javascript
const card = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 140,
  image: '/assets/card-back.png',
  radius: 8,  // Rounded corners
  interactive: true
});

card.on('tap', async () => {
  // Flip to reveal front
  await card.tween(
    { scaleX: 0, rotation: Math.PI },
    { duration: 200 }
  );

  await card.loadImage('/assets/card-front.png');

  await card.tween(
    { scaleX: 1 },
    { duration: 200 }
  );
});
```

### Parallax Background Layers

Create depth with multiple scrolling layers:

```javascript
const bg1 = new Sprite({
  x: 400,
  y: 300,
  width: 800,
  height: 600,
  image: '/assets/bg-layer1.png',
  zIndex: -2
});

const bg2 = new Sprite({
  x: 400,
  y: 300,
  width: 800,
  height: 600,
  image: '/assets/bg-layer2.png',
  zIndex: -1
});

scene.add(bg1);
scene.add(bg2);

// Move backgrounds at different speeds for parallax effect
scene.on('update', (dt) => {
  bg1.x -= 20 * dt;   // Slow - far background
  bg2.x -= 40 * dt;   // Fast - near background
});

## Best Practices

1. **Preload for production**: Use [Asset Loader](/utilities/asset-loader) to preload images before showing scenes
2. **Handle loading states**: Show loading indicators or use the `imageload` event for smooth UX
3. **Set dimensions**: Specify `width` and `height` for predictable layouts (don't rely on auto-sizing)
4. **Reuse images**: Share `HTMLImageElement` objects between sprites to save memory
5. **Use appropriate formats**: PNG for transparency, JPG for photos, WebP for best compression

## Common Mistakes

### Missing Width/Height for Interactivity

```javascript
// ❌ Wrong - interactive sprite without dimensions
const sprite = new Sprite({
  image: '/assets/button.png',
  interactive: true  // Won't work until image loads!
});

// ✅ Right - specify dimensions for immediate interaction
const sprite = new Sprite({
  width: 120,
  height: 50,
  image: '/assets/button.png',
  interactive: true
});
```

### Not Handling Load Errors

```javascript
// ❌ Wrong - no error handling
const sprite = new Sprite({
  image: '/assets/might-not-exist.png'
});

// ✅ Right - handle loading errors
const sprite = new Sprite({ x: 200, y: 150 });

sprite.on('imageload', () => {
  console.log('Image loaded successfully');
});

try {
  await sprite.loadImage('/assets/might-not-exist.png');
} catch (error) {
  console.error('Failed to load image:', error);
  // Fallback to a colored shape
  sprite.color = '#e94560';
  sprite.width = 64;
  sprite.height = 64;
}
```

### Forgetting zIndex for Layering

```javascript
// ❌ Wrong - background renders on top of game objects
const background = new Sprite({
  image: '/assets/bg.png',
  width: 800,
  height: 600
});
const player = new Sprite({
  image: '/assets/player.png',
  width: 64,
  height: 64
});

// ✅ Right - use zIndex to control render order
const background = new Sprite({
  image: '/assets/bg.png',
  width: 800,
  height: 600,
  zIndex: -1  // Render behind everything
});
const player = new Sprite({
  image: '/assets/player.png',
  width: 64,
  height: 64,
  zIndex: 10  // Render in front
});
```

## Next Steps

- [Entities](/core/entities) - Learn about the entity system that powers sprites
- [Shapes](/visual/shapes) - Create colored shapes without images
- [Sprite Animation](/visual/animation) - Animate sprite sheets for character animations
- [Text](/visual/text) - Render text elements
- [Asset Loader](/utilities/asset-loader) - Preload images and assets efficiently
- [Gestures](/gestures/tap) - Add interactivity to sprites
- [Tweening](/animation/tweening) - Animate sprite properties
