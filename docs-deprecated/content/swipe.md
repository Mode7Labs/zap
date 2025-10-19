---
id: swipe
title: Swipe Gesture
category: gestures
description: Swipe the sprite to move it
imports: [Sprite, Text]
---

# Swipe Gesture

Detect swipe gestures on sprites to create directional movement and navigation controls.

## Basic Swipe Detection

```zap-demo
const sprite = new Sprite({
  x: 200, y: 150,
  width: 60, height: 60,
  color: '#16a085',
  radius: 10,
  interactive: true
});

const instructions = new Text({
  text: 'Swipe in any direction',
  x: 200, y: 70,
  fontSize: 15,
  color: '#4fc3f7',
  align: 'center'
});

const directionText = new Text({
  text: 'Waiting for swipe…',
  x: 200, y: 230,
  fontSize: 14,
  color: '#ffffff',
  align: 'center'
});

sprite.on('swipe', (event) => {
  directionText.text = `Swiped ${event.direction.toUpperCase()} (velocity ${event.velocity.toFixed(2)})`;

  if (event.direction === 'left') sprite.x -= 50;
  if (event.direction === 'right') sprite.x += 50;
  if (event.direction === 'up') sprite.y -= 50;
  if (event.direction === 'down') sprite.y += 50;

  sprite.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 120 })
    .then(() => sprite.tween({ scaleX: 1, scaleY: 1 }, { duration: 120 }));
});

scene.add(sprite);
scene.add(instructions);
scene.add(directionText);
```

## Swipe Event Properties

The swipe event provides:
- `event.direction` - Direction of swipe: 'left', 'right', 'up', or 'down'
- `event.velocity` - Speed of the swipe
- `event.distance` - Distance swiped
