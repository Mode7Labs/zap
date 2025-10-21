---
title: Image Sprites
description: Load and display images with Sprite
---

# Image Sprites

Sprites can display images loaded from URLs or image elements. They support automatic sizing, event handling, and all standard transform properties.

## Loading Images

Load an image by providing a URL to the `image` property:

```javascript
import { Sprite } from '@mode-7/zap';

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: '/assets/character.png'
});

// Listen for when the image loads
sprite.on('imageload', (img) => {
  console.log('Image loaded:', img.width, img.height);
});
```

## Auto-Sizing

If you don't specify `width` and `height`, the sprite will automatically size to match the image dimensions:

```javascript
const sprite = new Sprite({
  x: 200,
  y: 150,
  image: '/assets/logo.png'  // Will use image's natural size
});
```

## Using HTMLImageElement

You can also pass an existing `HTMLImageElement`:

```javascript
const img = new Image();
img.src = '/assets/sprite.png';

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: img
});
```

## Image Loading Demo

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 200,
  y: 120,
  width: 100,
  height: 100,
  image: '../assets/pixel-girl.png',
  scaleX: 0,
  scaleY: 0
});

const status = new Text({
  x: 200,
  y: 220,
  text: 'Loading image...',
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(sprite);
scene.add(status);

// Listen for when the image loads
sprite.on('imageload', () => {
  status.text = 'Image loaded!';
  // Animate in
  sprite.tween(
    { scaleX: 1, scaleY: 1 },
    { duration: 400, easing: 'easeOutBack' }
  );
});

game.setScene(scene);
game.start();
```

## Scaling Images

Control how images are displayed with `width` and `height`:

```javascript
// Original size (if known)
const sprite1 = new Sprite({
  x: 100,
  y: 150,
  width: 64,
  height: 64,
  image: '/assets/icon.png'
});

// Scaled up
const sprite2 = new Sprite({
  x: 200,
  y: 150,
  width: 128,   // 2x larger
  height: 128,
  image: '/assets/icon.png'
});

// Scaled with transform
sprite1.scaleX = 2;  // 2x width
sprite1.scaleY = 2;  // 2x height
```

## Circular Clip

Create circular image sprites:

```javascript
const avatar = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 80,
  radius: 40,  // Half of width/height for circle
  image: '/assets/profile.jpg'
});
```

### Rounded Image Demo

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 320,
  backgroundColor: '#0b132b'
});

const scene = new Scene();

const title = new Text({
  x: 200,
  y: 50,
  text: 'Rounded Sprites',
  fontSize: 20,
  color: '#4fc3f7',
  align: 'center'
});

const avatar = new Sprite({
  x: 200,
  y: 170,
  width: 160,
  height: 160,
  radius: 80,
  image: '../assets/bg.jpg',
  alpha: 0
});

scene.add(title);
scene.add(avatar);

avatar.on('imageload', () => {
  avatar.tween(
    { alpha: 1, scaleX: 1, scaleY: 1 },
    { duration: 400, easing: 'easeOutBack' }
  );
});

avatar.scaleX = 0.6;
avatar.scaleY = 0.6;

game.setScene(scene);
game.start();
```

## Preloading Images

Use AssetLoader to preload images before creating sprites:

```javascript
import { assetLoader, Sprite } from '@mode-7/zap';

// Preload images
await assetLoader.loadImages({
  hero: '/assets/hero.png',
  enemy: '/assets/enemy.png',
  background: '/assets/bg.png'
});

// Use preloaded images
const hero = new Sprite({
  x: 200,
  y: 150,
  width: 64,
  height: 64,
  image: assetLoader.getImage('hero')
});
```

## Properties

Image sprites support all sprite properties:

```javascript
sprite.x = 300;
sprite.y = 200;
sprite.rotation = Math.PI / 4;   // 45 degrees
sprite.scaleX = 1.5;              // Scale width
sprite.scaleY = 1.5;              // Scale height
sprite.alpha = 0.8;               // 80% opacity
sprite.anchorX = 0;               // Change anchor point
sprite.anchorY = 0;
```

## Interactive Images

Make images respond to touch/mouse events:

```javascript
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: '/assets/button.png',
  interactive: true  // Enable gestures
});

sprite.on('tap', () => {
  sprite.tween(
    { scaleX: 1.1, scaleY: 1.1 },
    { duration: 100 }
  ).then(() => {
    sprite.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100 }
    );
  });
});
```

## Error Handling

Handle image loading errors:

```javascript
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100
});

try {
  await sprite.loadImage('/assets/missing.png');
} catch (error) {
  console.error('Failed to load image:', error);
  // Fallback to colored sprite
  sprite.color = '#e94560';
}
```

## Performance Tips

- **Preload images**: Use AssetLoader for better performance
- **Reuse images**: Share Image objects between sprites
- **Appropriate sizes**: Load images at the size you'll display them
- **Sprite atlases**: Use sprite sheets for multiple images (see Animation docs)
- **Power of 2**: Use power-of-2 dimensions (64, 128, 256, etc.) for best performance

## Common Patterns

### Card Sprite

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

card.on('tap', () => {
  // Flip animation
  card.tween(
    { scaleX: 0, rotation: Math.PI },
    { duration: 200 }
  ).then(async () => {
    await card.loadImage('/assets/card-front.png');
    card.tween(
      { scaleX: 1 },
      { duration: 200 }
    );
  });
});
```

### Parallax Background

```javascript
const bg1 = new Sprite({
  x: 400,
  y: 300,
  width: 800,
  height: 600,
  image: '/assets/bg-layer1.png',
  zIndex: 0
});

const bg2 = new Sprite({
  x: 400,
  y: 300,
  width: 800,
  height: 600,
  image: '/assets/bg-layer2.png',
  zIndex: 1
});

// Move backgrounds at different speeds
game.on('update', (dt) => {
  bg1.x -= 20 * dt;
  bg2.x -= 40 * dt;  // Faster for depth effect
});
```

## Next Steps

- [Sprite Animation](/visual/animation) - Animate sprite sheets
- [Shapes](/visual/shapes) - Create colored shapes
- [Asset Loader](/utilities/assetloader) - Preload images efficiently
