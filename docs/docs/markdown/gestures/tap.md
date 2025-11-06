---
title: Tap Gesture
description: Tap/click detection for interactive elements
---

# Tap Gesture

The tap gesture detects quick taps/clicks on interactive entities. Perfect for buttons, game objects, and any clickable UI elements.

## Basic Tap

Make an entity tappable with `interactive: true`:

```javascript
import { Sprite } from '@mode-7/zap';

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 80,
  color: '#e94560',
  interactive: true  // Enable tap detection
});

sprite.on('tap', () => {
  console.log('Tapped!');

  // Rotate on tap
  sprite.tween(
    { rotation: sprite.rotation + Math.PI },
    { duration: 280, easing: 'easeOutBack' }
  );
});

scene.add(sprite);
```

> **Note**: Examples assume basic setup with `Game` and `Scene`. See [Getting Started](/getting-started/quickstart) if you're new to Zap.

## Tap Detection

A tap is detected when:
- Touch/click starts and ends within **10 pixels**
- Duration is less than **300 milliseconds**
- Works on both mouse and touch devices

## Long Press

For press-and-hold interactions, use the `longpress` event:

```javascript
sprite.on('longpress', (event) => {
  console.log('Long press detected!');
  // {
  //   type: 'longpress',
  //   position: { x: 200, y: 150 },
  //   target: sprite
  // }
});
```

Long press fires after holding for **500 milliseconds** without moving more than 10 pixels.

## Tap Event

The tap event provides information about the tap:

```javascript
sprite.on('tap', (event) => {
  console.log(event);
  // {
  //   type: 'tap',
  //   position: { x: 200, y: 150 },
  //   target: sprite
  // }
});
```

### Event Properties

- **type**: `'tap'` - The gesture type
- **position**: `{ x, y }` - World position where tap occurred
- **target**: The entity that was tapped

## Visual Feedback

Provide instant feedback on tap:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const button = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 50,
  color: '#4fc3f7',
  radius: 8,
  interactive: true
});

scene.add(button);

button.on('tap', () => {
  // Scale down and back up
  button.tween(
    { scaleX: 0.9, scaleY: 0.9 },
    { duration: 100, easing: 'easeOutQuad' }
  ).then(() => {
    button.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100, easing: 'easeOutBack' }
    );
  });
});

game.setScene(scene);
game.start();
```

## Canvas-Level Taps

Listen for taps anywhere on the canvas:

```javascript
import { Game } from '@mode-7/zap';

const game = new Game({
  width: 400,
  height: 300
});

// Detect taps on the canvas itself
game.on('tap', (event) => {
  console.log('Canvas tapped at:', event.position);
  // Create ripple effect, spawn particles, etc.
});
```

## Common Patterns

### Button Press Effect

```javascript
const button = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 40,
  color: '#4fc3f7',
  radius: 8,
  interactive: true
});

button.on('tap', () => {
  // Quick press animation
  button.tween({ scaleY: 0.85 }, { duration: 80 })
    .then(() => button.tween({ scaleY: 1 }, { duration: 120, easing: 'easeOutBack' }));
});
```

### Toggle State

```javascript
let isOn = false;

toggleButton.on('tap', () => {
  isOn = !isOn;
  toggleButton.color = isOn ? '#51cf66' : '#888';
  toggleButton.tween(
    { scaleX: 1.1, scaleY: 1.1 },
    { duration: 100 }
  ).then(() => {
    toggleButton.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100 }
    );
  });
});
```

### Counter/Clicker

```javascript
let score = 0;
const scoreText = new Text({ text: '0', x: 200, y: 50, fontSize: 24 });

clickableSprite.on('tap', () => {
  score += 1;
  scoreText.text = score.toString();

  // Spawn floating "+1" text
  const floatingText = new Text({
    text: '+1',
    x: clickableSprite.x,
    y: clickableSprite.y,
    fontSize: 20,
    color: '#51cf66',
    alpha: 1
  });

  scene.add(floatingText);

  floatingText.tween(
    { y: floatingText.y - 50, alpha: 0 },
    { duration: 1000, easing: 'easeOutQuad', onComplete: () => {
      floatingText.destroy();
    }}
  );
});
```

### Color Picker

```javascript
const colors = ['#e94560', '#51cf66', '#4fc3f7', '#f39c12', '#9b59b6'];
let selectedColor = colors[0];

colors.forEach((color, i) => {
  const swatch = new Sprite({
    x: 50 + i * 60,
    y: 100,
    width: 50,
    height: 50,
    color: color,
    radius: 8,
    interactive: true
  });

  swatch.on('tap', () => {
    selectedColor = color;
    // Highlight selected
    swatch.tween({ scaleX: 1.2, scaleY: 1.2 }, { duration: 200 });
  });

  scene.add(swatch);
});
```

## Entity Layering

Taps detect the topmost interactive entity:

```javascript
// Create overlapping sprites
const bottom = new Sprite({
  x: 180,
  y: 140,
  width: 100,
  height: 100,
  color: '#e94560',
  interactive: true
});

const top = new Sprite({
  x: 220,
  y: 160,
  width: 100,
  height: 100,
  color: '#4fc3f7',
  interactive: true
});

scene.add(bottom);  // Added first (bottom layer)
scene.add(top);     // Added second (top layer)

// Tapping overlapping area triggers 'top' only
top.on('tap', () => console.log('Top tapped'));
bottom.on('tap', () => console.log('Bottom tapped'));
```

## Disabling Tap

Temporarily disable tap detection:

```javascript
sprite.interactive = false;  // Disable taps
sprite.interactive = true;   // Re-enable taps
```

## Tips

- **Always set `interactive: true`** on entities you want to be tappable
- **Must have dimensions** - `width` and `height` are REQUIRED for tap detection. Without dimensions, there's no hit area and taps won't work!
- **Provide visual feedback** - Users expect immediate response
- **Use easing functions** - `easeOutBack` and `easeOutQuad` feel great for buttons
- **Keep tap areas large** - Minimum 44x44 pixels for touch-friendly targets
- **Test on mobile** - Taps work on both mouse and touch devices

## Common Mistakes

### Missing width and height

```javascript
// ❌ CRITICAL ERROR - No hit area, tap won't work!
const sprite = new Sprite({
  x: 100,
  y: 100,
  interactive: true  // Useless without dimensions
});
// Tap events will NEVER fire!

// ✅ CORRECT - Must have dimensions for hit detection
const sprite = new Sprite({
  x: 100,
  y: 100,
  width: 80,    // Required!
  height: 80,   // Required!
  interactive: true
});
```

**This is the #1 mistake!** Interactive sprites MUST have `width` and `height`. Without dimensions, gesture detection has no bounding box to test against, so all touch/mouse events pass through.

### Forgetting interactive flag

```javascript
// ❌ Wrong - won't receive taps
const sprite = new Sprite({ x: 100, y: 100, width: 50, height: 50, color: '#fff' });
sprite.on('tap', () => console.log('tapped'));

// ✅ Right - interactive enabled
const sprite = new Sprite({
  x: 100, y: 100, width: 50, height: 50, color: '#fff',
  interactive: true
});
sprite.on('tap', () => console.log('tapped'));
```

### Overlapping tap handlers

```javascript
// ⚠️  Both handlers will fire
sprite.on('tap', () => console.log('First handler'));
sprite.on('tap', () => console.log('Second handler'));

// Use .off() to remove previous handlers if needed
sprite.off('tap');
sprite.on('tap', () => console.log('Only handler'));
```

## Next Steps

- [Drag Gesture](/gestures/drag) - Dragging and moving entities
- [Swipe Gesture](/gestures/swipe) - Swipe detection
- [Button Component](/ui/button) - Pre-built button with tap handling
