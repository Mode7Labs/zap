---
id: canvasevents
title: Canvas Events
category: gestures
description: Listen to pointer events on the canvas
imports: [Sprite, Text]
---

# Canvas Events

Listen to pointer events directly on the game canvas. Positions are automatically converted to game coordinates, making it easy to handle clicks and interactions anywhere on the canvas.

## Pointer Events

```zap-demo
const status = new Text({
  text: 'Tap or drag on the canvas',
  x: 200,
  y: 60,
  fontSize: 15,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(status);

game.on('pointerdown', (event) => {
  status.text = `Pointer down at (${event.position.x.toFixed(0)}, ${event.position.y.toFixed(0)})`;
});

game.on('pointermove', (event) => {
  status.text = `Moving: (${event.position.x.toFixed(0)}, ${event.position.y.toFixed(0)})`;
});

game.on('pointerup', (event) => {
  status.text = `Pointer up at (${event.position.x.toFixed(0)}, ${event.position.y.toFixed(0)})`;
});
```

## Click Events

```zap-demo
const marker = new Sprite({
  x: -100, y: -100,
  width: 20, height: 20,
  color: '#e94560',
  radius: 10,
  alpha: 0
});

game.on('click', (event) => {
  console.log('Clicked at:', event.position);

  // Show marker at click position
  marker.x = event.position.x;
  marker.y = event.position.y;
  marker.alpha = 1;

  marker.tween(
    { alpha: 0, scaleX: 2, scaleY: 2 },
    { duration: 500 }
  );
});

scene.add(marker);
```

## Drag Detection

```zap-demo
const posText = new Text({
  text: 'Click and drag anywhere',
  x: 200, y: 150,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

game.on('pointermove', (event) => {
  if (event.originalEvent.buttons > 0) {
    // User is dragging
    posText.text = `Drag at (${Math.round(event.position.x)}, ${Math.round(event.position.y)})`;
    posText.color = '#f39c12';
  }
});

game.on('pointerup', () => {
  posText.text = 'Click and drag anywhere';
  posText.color = '#888';
});

scene.add(posText);
```
