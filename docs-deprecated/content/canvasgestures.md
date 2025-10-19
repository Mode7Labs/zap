---
id: canvasgestures
title: Canvas Gestures
category: gestures
description: Tap, swipe, drag, and long press on the canvas
imports: [Sprite, Text, ParticleEmitter, delay]
---

# Canvas Gestures

Handle gesture events directly on the canvas, just like entity gestures. Canvas gestures work with both mouse and touch input.

## Tap Gesture

```zap-demo
game.on('tap', (event) => {
  console.log('Canvas tapped at:', event.position);
  // event.target is the entity if tapped on one, or null

  const circle = new Sprite({
    x: event.position.x,
    y: event.position.y,
    width: 10,
    height: 10,
    color: '#e94560',
    radius: 5
  });
  scene.add(circle);

  circle.tween(
    { scaleX: 3, scaleY: 3, alpha: 0 },
    { duration: 400, onComplete: () => scene.remove(circle) }
  );
});
```

## Swipe Gesture

```zap-demo
const swipeIndicator = new Sprite({
  x: 200, y: 150,
  width: 60, height: 60,
  color: '#16a085',
  radius: 30,
  alpha: 0
});

game.on('swipe', (event) => {
  console.log('Swiped:', event.direction);
  console.log('Velocity:', event.velocity);
  console.log('Distance:', event.distance);

  swipeIndicator.x = event.position.x;
  swipeIndicator.y = event.position.y;
  swipeIndicator.alpha = 1;

  swipeIndicator.tween(
    { alpha: 0, scaleX: 2, scaleY: 2 },
    { duration: 500 }
  );
});

scene.add(swipeIndicator);
```

## Drag Gestures

```zap-demo
let dragTrail = [];

game.on('dragstart', (event) => {
  console.log('Drag started at:', event.position);
  dragTrail = [];
});

game.on('drag', (event) => {
  console.log('Dragging, delta:', event.delta);

  const dot = new Sprite({
    x: event.position.x,
    y: event.position.y,
    width: 5,
    height: 5,
    color: '#9b59b6',
    radius: 2.5,
    alpha: 0.8
  });
  scene.add(dot);
  dragTrail.push(dot);

  // Fade out and remove after delay
  delay(500, () => {
    dot.tween({ alpha: 0 }, {
      duration: 200,
      onComplete: () => scene.remove(dot)
    });
  });
});

game.on('dragend', (event) => {
  console.log('Drag ended at:', event.position);
});
```

## Long Press

```zap-demo
game.on('longpress', (event) => {
  console.log('Long pressed at:', event.position);

  const burst = new ParticleEmitter({
    x: event.position.x,
    y: event.position.y,
    rate: 0,
    colors: ['#f39c12', '#e94560', '#4fc3f7'],
    sizeRange: { min: 3, max: 6 },
    lifetimeRange: { min: 0.5, max: 1 },
    velocityRange: {
      min: { x: -100, y: -100 },
      max: { x: 100, y: 100 }
    }
  });
  scene.add(burst);
  burst.burst(20);

  delay(1500, () => scene.remove(burst));
});
```
