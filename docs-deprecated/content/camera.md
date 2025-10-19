---
id: camera
title: Camera Control
category: core
description: Follow targets, zoom, and screen shake
imports: [Camera, Sprite, Text]
---

# Camera Control

Control the game viewport with camera features like following targets, zooming, panning, and screen shake effects.

## Follow Target

```zap-demo
const player = new Sprite({
  x: 200, y: 150,
  width: 40, height: 40,
  color: '#e94560',
  radius: 20,
  interactive: true
});

// Make camera follow the player
game.camera.follow(player);

player.on('drag', (event) => {
  player.x += event.delta.x;
  player.y += event.delta.y;
});

scene.add(player);
```

## Zoom

```zap-demo
const player = new Sprite({
  x: 200, y: 150,
  width: 40, height: 40,
  color: '#e94560',
  interactive: true
});

const zoomButton = new Sprite({
  x: 150, y: 50,
  width: 100, height: 35,
  color: '#16213e',
  radius: 8,
  interactive: true
});

let zoomed = false;
zoomButton.on('tap', () => {
  zoomed = !zoomed;
  game.camera.setZoom(zoomed ? 1.5 : 1);
});

scene.add(player);
scene.add(zoomButton);
```

## Screen Shake

```zap-demo
const shakeButton = new Sprite({
  x: 200, y: 150,
  width: 120, height: 40,
  color: '#e94560',
  radius: 8,
  interactive: true
});

shakeButton.on('tap', () => {
  // Shake with intensity 3 for 400ms
  game.camera.shake(3, 400);
});

scene.add(shakeButton);
```

## Pan to Position

```zap-demo
const target = new Sprite({
  x: 500, y: 300,
  width: 30, height: 30,
  color: '#f39c12',
  radius: 15
});

const panButton = new Sprite({
  x: 200, y: 150,
  width: 100, height: 35,
  color: '#16213e',
  radius: 8,
  interactive: true
});

panButton.on('tap', () => {
  // Pan to position (x, y, duration in ms)
  game.camera.panTo(500, 300, 1000);
});

scene.add(target);
scene.add(panButton);
```
