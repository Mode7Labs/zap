---
id: tap
title: Tap Gesture
category: gestures
description: Tap the sprite to trigger animations
imports: [Sprite, Text, Easing]
---

# Tap Gesture

Detect tap/click events on sprites to create interactive buttons and game objects.

## Basic Tap Handler

```zap-demo
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 80,
  color: '#e94560',
  radius: 14,
  interactive: true // Enable gestures
});

let taps = 0;
const label = new Text({
  text: 'Tap the square',
  x: 200,
  y: 70,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(sprite);
scene.add(label);

sprite.on('tap', () => {
  taps += 1;
  label.text = `Taps: ${taps}`;

  sprite.tween(
    { rotation: sprite.rotation + Math.PI },
    { duration: 280, easing: Easing.easeOutBack }
  );
});
```
