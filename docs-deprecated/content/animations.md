---
id: animations
title: Animations & Tweens
category: effects
description: Smooth property animations with easing functions
imports: [Sprite, Text, "Easing"]
---

# Animations & Tweens

Zap provides a powerful tweening system for animating any numeric property smoothly over time.

## Basic Tween

Animate any property on an entity:

```zap-demo
const sprite = new Sprite({
  x: 50, y: 150,
  width: 60, height: 60,
  radius: 30,
  color: '#667eea'
});

scene.add(sprite);

// Animate to new position
sprite.tween(
  { x: 350 },
  { duration: 2000, easing: 'easeInOutCubic' }
);
```

## Multiple Properties

Animate several properties at once:

```zap-demo
const sprite = new Sprite({
  x: 200, y: 150,
  width: 60, height: 60,
  radius: 30,
  color: '#e94560'
});

scene.add(sprite);

// Rotate and scale
sprite.tween(
  {
    rotation: Math.PI * 2,
    scaleX: 2,
    scaleY: 2
  },
  {
    duration: 1500,
    easing: 'easeInOutBack'
  }
);
```

## Chaining Tweens

Chain animations with `.then()`:

```zap-demo
const sprite = new Sprite({
  x: 200, y: 100,
  width: 50, height: 50,
  radius: 25,
  color: '#51cf66'
});

scene.add(sprite);

// Move down, then up, repeatedly
function bounce() {
  sprite.tween(
    { y: 200 },
    { duration: 600, easing: 'easeOutBounce' }
  ).then(() => {
    sprite.tween(
      { y: 100 },
      { duration: 600, easing: 'easeInQuad' }
    ).then(bounce);
  });
}

bounce();
```

## Tween Options

```javascript
entity.tween(
  { /* target values */ },
  {
    duration: number,        // Duration in milliseconds
    easing: string,          // Easing function name
    delay: number,           // Delay before starting (ms)
    onUpdate: (progress) => {}, // Called each frame
    onComplete: () => {}     // Called when done
  }
)
```

## Easing Functions

Choose from 36 easing functions:

**Quad**: `easeInQuad`, `easeOutQuad`, `easeInOutQuad`

**Cubic**: `easeInCubic`, `easeOutCubic`, `easeInOutCubic`

**Quart**: `easeInQuart`, `easeOutQuart`, `easeInOutQuart`

**Quint**: `easeInQuint`, `easeOutQuint`, `easeInOutQuint`

**Sine**: `easeInSine`, `easeOutSine`, `easeInOutSine`

**Expo**: `easeInExpo`, `easeOutExpo`, `easeInOutExpo`

**Circ**: `easeInCirc`, `easeOutCirc`, `easeInOutCirc`

**Back**: `easeInBack`, `easeOutBack`, `easeInOutBack`

**Elastic**: `easeInElastic`, `easeOutElastic`, `easeInOutElastic`

**Bounce**: `easeInBounce`, `easeOutBounce`, `easeInOutBounce`

Plus: `linear`

## Progress Callback

Track animation progress:

```zap-demo
const sprite = new Sprite({
  x: 50, y: 120,
  width: 60, height: 60,
  radius: 30,
  color: '#f39c12'
});

const progressText = new Text({
  text: '0%',
  x: 200, y: 220,
  fontSize: 18,
  color: '#fff'
});

scene.add(sprite);
scene.add(progressText);

sprite.tween(
  { x: 350 },
  {
    duration: 3000,
    easing: 'linear',
    onUpdate: (progress) => {
      progressText.text = Math.round(progress * 100) + '%';
    },
    onComplete: () => {
      progressText.text = 'Done!';
    }
  }
);
```

## Stopping Tweens

Store and control tweens:

```javascript
const tween = sprite.tween({ x: 500 }, { duration: 2000 });

// Stop the tween
tween.stop();
```

## Tips

💡 **Performance**: Tweens are optimized and automatically cleaned up when complete

💡 **Easing**: Use "Out" easings for UI (easeOutCubic, easeOutBack) for snappy feel

💡 **Chaining**: Build complex animation sequences with `.then()`
