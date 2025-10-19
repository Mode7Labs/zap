---
title: NinePatch
description: Scalable UI panels with preserved corners
---

# NinePatch

NinePatch sprites scale UI elements like panels and dialogs while preserving corner and edge details. The image is divided into 9 sections, with corners staying fixed and edges/center stretching.

## What is Nine-Patch?

A nine-patch image divides a texture into 9 regions:

```
┌─────┬─────────┬─────┐
│  1  │    2    │  3  │  ← Top (fixed height)
├─────┼─────────┼─────┤
│  4  │    5    │  6  │  ← Middle (stretches)
├─────┼─────────┼─────┤
│  7  │    8    │  9  │  ← Bottom (fixed height)
└─────┴─────────┴─────┘
  ↑       ↑       ↑
Fixed  Stretch  Fixed
width   width   width
```

- **Corners (1, 3, 7, 9)**: Never stretch, maintain original size
- **Edges (2, 4, 6, 8)**: Stretch in one direction only
- **Center (5)**: Stretches in both directions

This allows UI elements to scale to any size without distortion.

## Basic NinePatch

Create a nine-patch panel that animates to show corners staying fixed:

```codemirror
import { Game, Scene, NinePatch, Text, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create a nine-patch image programmatically
const canvas = document.createElement('canvas');
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, 64, 64);

// Border
ctx.strokeStyle = '#4fc3f7';
ctx.lineWidth = 2;
ctx.strokeRect(1, 1, 62, 62);

// Decorative corners (16x16 patches)
ctx.fillStyle = '#4fc3f7';
ctx.beginPath();
ctx.arc(8, 8, 6, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(56, 8, 6, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(8, 56, 6, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(56, 56, 6, 0, Math.PI * 2);
ctx.fill();

// Inner border accent
ctx.strokeStyle = '#2ecc71';
ctx.lineWidth = 1;
ctx.strokeRect(4, 4, 56, 56);

const img = new Image();
img.src = canvas.toDataURL();

img.onload = () => {
  // Create nine-patch panel
  const panel = new NinePatch({
    x: 200, y: 150,
    width: 180, height: 140,
    image: img,
    corners: 16  // 16px corners stay fixed
  });

  const title = new Text({
    text: 'Dialog Panel',
    x: 200, y: 110,
    fontSize: 18,
    color: '#4fc3f7',
    align: 'center'
  });

  const description = new Text({
    text: 'Corners stay sharp',
    x: 200, y: 140,
    fontSize: 13,
    color: '#aaa',
    align: 'center'
  });

  const button = new Sprite({
    x: 200, y: 175,
    width: 100, height: 30,
    color: '#2ecc71',
    radius: 6
  });

  const buttonText = new Text({
    text: 'OK',
    x: 200, y: 175,
    fontSize: 14,
    color: '#ffffff',
    align: 'center',
    baseline: 'middle'
  });

  const subtitle = new Text({
    text: 'Watch the decorative corners stay fixed',
    x: 200, y: 260,
    fontSize: 12,
    color: '#888',
    align: 'center'
  });

  // Animate size - corners won't distort!
  let growing = true;
  function animate() {
    const targetWidth = growing ? 280 : 180;
    const targetHeight = growing ? 200 : 140;

    panel.tween(
      { width: targetWidth, height: targetHeight },
      { duration: 2000, easing: 'easeInOutQuad', onComplete: () => { growing = !growing; animate(); } }
    );

    button.tween({ y: growing ? 205 : 175 }, { duration: 2000, easing: 'easeInOutQuad' });
    buttonText.tween({ y: growing ? 205 : 175 }, { duration: 2000, easing: 'easeInOutQuad' });
    description.tween({ y: growing ? 155 : 140 }, { duration: 2000, easing: 'easeInOutQuad' });
  }

  animate();

  scene.add(panel);
  scene.add(title);
  scene.add(description);
  scene.add(button);
  scene.add(buttonText);
  scene.add(subtitle);
};

game.setScene(scene);
game.start();
```

With an actual NinePatch image:

```javascript
import { NinePatch } from '@mode-7/zap';

const panel = new NinePatch({
  x: 200,
  y: 150,
  width: 300,      // Can be any width
  height: 200,     // Can be any height
  image: '/ui/panel.png',  // Nine-patch image
  corners: 16      // Corner size in pixels
});

scene.add(panel);
```

## Corner Size

The `corners` parameter defines the size of the fixed corner regions:

```javascript
// Small corners (8px)
const panel1 = new NinePatch({
  x: 100, y: 100,
  width: 200, height: 150,
  image: '/ui/panel.png',
  corners: 8
});

// Medium corners (16px) - typical
const panel2 = new NinePatch({
  x: 100, y: 100,
  width: 200, height: 150,
  image: '/ui/panel.png',
  corners: 16
});

// Large corners (32px)
const panel3 = new NinePatch({
  x: 100, y: 100,
  width: 200, height: 150,
  image: '/ui/panel.png',
  corners: 32
});
```

## Creating Nine-Patch Images

### Image Requirements

1. **Square corners**: Corner regions must be equal size
2. **Symmetrical**: Top/bottom and left/right should match
3. **Repeatable edges**: Edge graphics should tile seamlessly
4. **Stretchable center**: Center content should handle stretching

### Example Structure

For a panel with 16px corners from a 48x48 source image:

```
Source image: 48x48 pixels
- Corners: 16x16px each (4 corners)
- Edges: 16px wide/tall, center 16px long
- Center: 16x16px
```

## Common Patterns

### Dialog Box

Scalable dialog with content:

```javascript
const dialog = new NinePatch({
  x: 200,
  y: 150,
  width: 320,
  height: 240,
  image: '/ui/dialog-panel.png',
  corners: 20
});

const title = new Text({
  text: 'Warning',
  x: 200,
  y: 80,
  fontSize: 18,
  color: '#fff',
  align: 'center'
});

const message = new Text({
  text: 'Are you sure you want to continue?',
  x: 200,
  y: 150,
  fontSize: 14,
  color: '#ccc',
  align: 'center'
});

scene.add(dialog);
scene.add(title);
scene.add(message);
```

### Tooltip

Small nine-patch for tooltips:

```javascript
const tooltip = new NinePatch({
  x: mouseX,
  y: mouseY - 40,
  width: 120,
  height: 40,
  image: '/ui/tooltip.png',
  corners: 8
});

const tooltipText = new Text({
  text: 'Health Potion',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

tooltip.addChild(tooltipText);
scene.add(tooltip);
```

### Progress Bar Background

Use for resizable progress bar containers:

```javascript
const progressBg = new NinePatch({
  x: 200,
  y: 50,
  width: 300,
  height: 30,
  image: '/ui/progress-bg.png',
  corners: 8
});

const progressFill = new Sprite({
  x: 200,
  y: 50,
  width: 150,  // 50% progress
  height: 26,
  color: '#51cf66',
  anchorX: 0.5,
  anchorY: 0.5
});

scene.add(progressBg);
scene.add(progressFill);
```

### Inventory Slots

Grid of scalable slots:

```javascript
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 5; col++) {
    const slot = new NinePatch({
      x: 100 + col * 65,
      y: 100 + row * 65,
      width: 60,
      height: 60,
      image: '/ui/inventory-slot.png',
      corners: 12,
      interactive: true
    });

    slot.on('tap', () => {
      console.log(`Slot ${row},${col} clicked`);
    });

    scene.add(slot);
  }
}
```

### Speech Bubble

Nine-patch for character dialogue:

```javascript
const bubble = new NinePatch({
  x: character.x,
  y: character.y - 80,
  width: 200,
  height: 60,
  image: '/ui/speech-bubble.png',
  corners: 16
});

const dialogue = new Text({
  text: 'Hello, traveler!',
  fontSize: 14,
  color: '#000',
  align: 'center',
  baseline: 'middle'
});

bubble.addChild(dialogue);
scene.add(bubble);
```

### Dynamic Sizing

Resize nine-patch based on content:

```javascript
const text = 'This is a message that might be very long or very short';

// Measure text (approximate)
const textWidth = text.length * 8;  // Rough estimate
const padding = 40;

const panel = new NinePatch({
  x: 200,
  y: 150,
  width: Math.max(200, Math.min(380, textWidth + padding)),
  height: 100,
  image: '/ui/panel.png',
  corners: 16
});

const label = new Text({
  text: text,
  fontSize: 14,
  align: 'center',
  baseline: 'middle'
});

panel.addChild(label);
scene.add(panel);
```

## Combining with Buttons

Buttons inside panels:

```javascript
const settingsPanel = new NinePatch({
  x: 200,
  y: 150,
  width: 280,
  height: 200,
  image: '/ui/panel.png',
  corners: 20
});

const saveButton = new Button({
  x: 200,
  y: 180,
  text: 'Save Settings',
  onClick: () => {
    saveSettings();
  }
});

scene.add(settingsPanel);
scene.add(saveButton);
```

## Animated Panels

Animate nine-patch size:

```javascript
const panel = new NinePatch({
  x: 200,
  y: 150,
  width: 100,   // Start small
  height: 80,
  image: '/ui/panel.png',
  corners: 16,
  scaleX: 0,
  scaleY: 0
});

scene.add(panel);

// Animate in
panel.tween(
  { scaleX: 1, scaleY: 1 },
  { duration: 300, easing: 'easeOutBack' }
);

// Then expand
panel.tween(
  { width: 300, height: 200 },
  { duration: 400, easing: 'easeOutQuad', delay: 300 }
);
```

## Design Tips

### Creating Nine-Patch Graphics

1. **Start with corners**: Design distinctive corners first
2. **Make edges tileable**: Ensure edges repeat seamlessly
3. **Test at multiple sizes**: Check how it looks small and large
4. **Avoid detail in center**: Center will stretch, keep it simple
5. **Use consistent border width**: All edges should be the same thickness

### Good Use Cases

- Dialog boxes
- Panels and windows
- Tooltips
- Progress bar containers
- Inventory slots
- Speech bubbles
- Button backgrounds (alternative to solid color)

### Bad Use Cases

- Small icons (just use regular sprites)
- Decorative elements that shouldn't stretch
- Images with important center content
- Complex patterns that don't tile well

## Properties

NinePatch extends Sprite, so it has all sprite properties:

```javascript
const panel = new NinePatch({
  x: 200,
  y: 150,
  width: 300,
  height: 200,
  image: '/ui/panel.png',
  corners: 16,

  // Sprite properties also work
  alpha: 0.9,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  interactive: true,
  anchorX: 0.5,
  anchorY: 0.5
});
```

## Performance

- **Efficient rendering**: Uses single image with 9 draw calls
- **Better than tiling**: More efficient than creating tile grid
- **Cache friendly**: Source image stays in memory
- **Scale vs Size**: Changing `width`/`height` is better than `scaleX`/`scaleY`

## Common Mistakes

### Wrong corner size

```javascript
// ❌ Wrong - corners too large for image
const panel = new NinePatch({
  image: '/ui/panel-24x24.png',  // 24x24 image
  corners: 16  // Corners would overlap!
});

// ✅ Right - corners fit within image
const panel = new NinePatch({
  image: '/ui/panel-48x48.png',  // 48x48 image
  corners: 16  // Leaves 16px for center
});
```

### Scaling instead of resizing

```javascript
// ❌ Wrong - scales entire nine-patch (defeats the purpose)
panel.scaleX = 2;
panel.scaleY = 2;

// ✅ Right - resize to preserve corner detail
panel.width *= 2;
panel.height *= 2;
```

### Forgetting to set image

```javascript
// ❌ Wrong - no image provided
const panel = new NinePatch({
  x: 200, y: 150,
  width: 200, height: 150,
  corners: 16
});
// Will render nothing or fall back to sprite behavior

// ✅ Right - provide image
const panel = new NinePatch({
  x: 200, y: 150,
  width: 200, height: 150,
  image: '/ui/panel.png',
  corners: 16
});
```

## Alternative: CSS-Style Borders

If you don't have nine-patch images, you can create similar effects with Sprite borders:

```javascript
// Use colored sprite with rounded corners
const panel = new Sprite({
  x: 200,
  y: 150,
  width: 300,
  height: 200,
  color: '#16213e',
  radius: 12  // Rounded corners simulate nine-patch effect
});
```

## Next Steps

- [Button](/ui/button) - Interactive button component
- [Sprites](/visual/sprites) - Understanding sprite rendering
- [Text](/visual/text) - Adding text to panels
