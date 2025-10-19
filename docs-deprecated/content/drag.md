---
id: drag
title: Drag Gesture
category: gestures
description: Drag sprites around the canvas
imports: [Sprite, Text]
---

# Drag Gesture

Enable drag interactions on sprites to create draggable UI elements and interactive game objects.

## Basic Drag

```zap-demo
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 70,
  height: 70,
  color: '#9b59b6',
  radius: 10,
  interactive: true
});

const status = new Text({
  text: 'Drag the square',
  x: 200,
  y: 60,
  fontSize: 15,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(sprite);
scene.add(status);

sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
  status.text = `Position: (${sprite.x.toFixed(0)}, ${sprite.y.toFixed(0)})`;
});
```
