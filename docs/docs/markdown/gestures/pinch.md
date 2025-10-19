---
title: Pinch
description: Multi-touch pinch gesture for zooming and scaling
---

# Pinch Gesture

`pinch` fires whenever two touch points move closer together or further apart on the canvas. The event carries the pinch center, the absolute distance between touches, and a `scale` value relative to where the gesture started (1 = distance at gesture start).

## Listen on the Game

```javascript
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 80,
  height: 80,
  color: '#4fc3f7'
});

scene.add(sprite);
game.setScene(scene);
game.start();

game.on('pinch', (event) => {
  const nextScale = Math.max(0.5, Math.min(2, event.scale));
  game.camera.setZoom(nextScale);
});
```

## Pinch Interactive Entities

Entities marked `interactive: true` receive `pinch` just like `tap` or `drag`:

```javascript
sprite.interactive = true;

sprite.on('pinch', (event) => {
  sprite.scaleX = event.scale;
  sprite.scaleY = event.scale;
});
```

## Event Shape

```typescript
interface PinchEvent {
  type: 'pinch';
  position: { x: number; y: number }; // Center of touches in world space
  distance: number;                    // Absolute distance between touches
  scale: number;                       // distance / startDistance
  target?: Entity;                     // Interactively hit entity, if any
}
```

Reset any state you derive from `scale` once the gesture ends, as the value resets to `1` at the beginning of each new pinch.
