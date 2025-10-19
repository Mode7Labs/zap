---
id: sprite
title: Sprites & Shapes
category: entities
description: Visual entities for rendering shapes and images
imports: ["Sprite"]
---

# Sprites & Shapes

Sprites are the fundamental visual building blocks of your Zap game. They can render colored shapes (rectangles, circles, rounded rectangles) or images.

## Constructor

Create a sprite with flexible options:

```javascript
new Sprite({
  x: number,              // X position
  y: number,              // Y position
  width: number,          // Width in pixels
  height: number,         // Height in pixels
  color: string,          // Fill color (hex)
  image: string | Image,  // Image URL or HTMLImageElement
  radius: number,         // Corner radius (0 = sharp corners)
  interactive: boolean,   // Enable touch/mouse events
  visible: boolean,       // Visibility (default: true)
  rotation: number,       // Rotation in radians
  scaleX: number,         // Horizontal scale (default: 1)
  scaleY: number,         // Vertical scale (default: 1)
  alpha: number,          // Opacity 0-1 (default: 1)
  anchorX: number,        // Anchor X (0-1, default: 0.5 center)
  anchorY: number         // Anchor Y (0-1, default: 0.5 center)
})
```

## Shape Examples

### Circle

To create a perfect circle, set `width` and `height` equal, and `radius` to half the width:

```zap-demo
const circle = new Sprite({
  x: 100, y: 150,
  width: 60, height: 60,
  radius: 30,  // radius = width / 2 makes perfect circle
  color: '#e94560'
});

scene.add(circle);
```

### Rectangle

```zap-demo
const rect = new Sprite({
  x: 200, y: 150,
  width: 80, height: 60,
  color: '#16a085',
  radius: 0  // Sharp corners
});

scene.add(rect);
```

### Rounded Rectangle

```zap-demo
const rounded = new Sprite({
  x: 320, y: 150,
  width: 80, height: 60,
  color: '#f39c12',
  radius: 15  // Rounded corners
});

scene.add(rounded);
```

## Image Sprites

Load and display images:

```javascript
const sprite = new Sprite({
  x: 200, y: 150,
  width: 100, height: 100,
  image: 'path/to/image.png'
});

// Listen for image load
sprite.on('imageload', (img) => {
  console.log('Image loaded:', img);
});

scene.add(sprite);
```

## Properties

All constructor properties are public and can be modified after creation:

```javascript
sprite.x = 300;
sprite.y = 200;
sprite.rotation = Math.PI / 4;  // 45 degrees
sprite.scaleX = 1.5;
sprite.alpha = 0.5;  // Semi-transparent
sprite.color = '#51cf66';  // Change color
```

## Methods

- `sprite.tween(props, options)` - Animate properties
- `sprite.on(event, callback)` - Listen to events (if interactive)
- `sprite.addChild(entity)` - Add child entity
- `sprite.destroy()` - Remove and cleanup

## Tips

💡 **Perfect Circles**: Set `width === height` and `radius === width / 2`

💡 **Anchor Point**: Default is center (0.5, 0.5). Use (0, 0) for top-left positioning.

💡 **Performance**: Colored sprites are faster than image sprites. Use batching for many sprites.
