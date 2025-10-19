---
id: touchtrail
title: Touch Trail
category: effects
description: Visual feedback for touch and mouse movements
imports: [Sprite, Text]
---

# Touch Trail

Enable built-in touch trail effects that appear when users click and drag on the canvas, providing visual feedback for interactions.

## Enable Touch Trail

```zap-demo {"gameOptions":{"enableTouchTrail":true,"backgroundColor":"#040a1c"}}
const title = new Text({
  text: 'Drag or swipe to draw light trails',
  x: 200,
  y: 40,
  fontSize: 15,
  color: '#4fc3f7',
  align: 'center'
});

const colorButton = new Sprite({
  x: 200,
  y: 240,
  width: 160,
  height: 46,
  radius: 10,
  color: '#1a2848',
  interactive: true
});

const colorLabel = new Text({
  text: 'Tap to cycle trail color',
  x: 200,
  y: 240,
  fontSize: 14,
  color: '#a5b4fc',
  align: 'center',
  baseline: 'middle'
});

const colors = ['#4fc3f7', '#f39c12', '#e94560', '#9b59b6'];
let index = 0;

colorButton.on('tap', () => {
  index = (index + 1) % colors.length;
  const color = colors[index];
  colorLabel.color = color;
  colorLabel.text = `Trail color: ${color.toUpperCase()}`;
  if (game.touchTrail) {
    game.touchTrail.setColor(color);
  }
  colorButton.tween({ scaleX: 1.05, scaleY: 1.05 }, { duration: 120 })
    .then(() => colorButton.tween({ scaleX: 1, scaleY: 1 }, { duration: 120 }));
});

scene.add(title);
scene.add(colorButton);
scene.add(colorLabel);
```

The touch trail feature is perfect for playable ads and interactive experiences where you want to provide visual feedback for user interactions without writing custom trail logic. Enable it in `Game` options and optionally customize the color at runtime via `game.touchTrail.setColor(...)`.
