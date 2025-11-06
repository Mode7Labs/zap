---
title: Tweening
description: Smooth property animations with easing functions
---

# Tweening

Tweening animates entity properties smoothly over time using easing functions. Perfect for movement, scaling, rotation, fading, and complex animation sequences.

## Basic Tween

Animate any numeric property:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 50,
  y: 150,
  width: 60,
  height: 60,
  radius: 30,
  color: '#667eea'
});

scene.add(sprite);

// Animate to new position
sprite.tween(
  { x: 350 },
  { duration: 2000, easing: 'easeInOutCubic' }
);

game.setScene(scene);
game.start();
```

## Multiple Properties

Animate several properties simultaneously:

```codemirror
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
  width: 60,
  height: 60,
  radius: 30,
  color: '#e94560'
});

scene.add(sprite);

// Rotate and scale together
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

game.setScene(scene);
game.start();
```

## Chaining Tweens

Chain animations with `.then()` for sequences:

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 200,
  y: 100,
  width: 50,
  height: 50,
  radius: 25,
  color: '#51cf66'
});

scene.add(sprite);

// Bouncing animation loop
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

game.setScene(scene);
game.start();
```

## Tween Options

All available options:

```javascript
entity.tween(
  { x: 100, y: 200 },  // Target values
  {
    duration: 1000,           // Duration in milliseconds (required)
    easing: 'easeOutCubic',   // Easing function (default: 'linear')
    delay: 500,               // Delay before starting in ms (default: 0)
    onUpdate: (progress) => {}, // Called each frame with 0-1 progress
    onComplete: () => {}      // Called when animation finishes
  }
);
```

## Progress Tracking

Monitor animation progress:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 50,
  y: 120,
  width: 60,
  height: 60,
  radius: 30,
  color: '#f39c12'
});

const progressText = new Text({
  text: '0%',
  x: 200,
  y: 220,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
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
      progressText.color = '#51cf66';
    }
  }
);

game.setScene(scene);
game.start();
```

## Easing Functions

Choose from 31 easing functions for different animation feels:

**Linear**: `linear` - Constant speed

**Quad**: `easeInQuad`, `easeOutQuad`, `easeInOutQuad`

**Cubic**: `easeInCubic`, `easeOutCubic`, `easeInOutCubic`

**Quart**: `easeInQuart`, `easeOutQuart`, `easeInOutQuart`

**Quint**: `easeInQuint`, `easeOutQuint`, `easeInOutQuint`

**Sine**: `easeInSine`, `easeOutSine`, `easeInOutSine`

**Expo**: `easeInExpo`, `easeOutExpo`, `easeInOutExpo`

**Circ**: `easeInCirc`, `easeOutCirc`, `easeInOutCirc`

**Back**: `easeInBack`, `easeOutBack`, `easeInOutBack` - Overshoots then settles

**Elastic**: `easeInElastic`, `easeOutElastic`, `easeInOutElastic` - Spring-like bounce

**Bounce**: `easeInBounce`, `easeOutBounce`, `easeInOutBounce` - Bouncing effect

### Easing Guide

- **In**: Starts slow, accelerates
- **Out**: Starts fast, decelerates (best for UI)
- **InOut**: Slow start and end, fast middle

## Stopping Tweens

Control tweens programmatically:

```javascript
// Store reference
const tween = sprite.tween({ x: 500 }, { duration: 2000 });

// Stop the tween at any time
tween.stop();

// Check if tween is active
if (tween.isActive()) {
  console.log('Still animating');
}

// Check if completed
if (tween.isCompleted()) {
  console.log('Animation finished');
}
```

## Common Patterns

### Fade In/Out

```javascript
// Fade in
sprite.alpha = 0;
sprite.tween({ alpha: 1 }, { duration: 500, easing: 'easeOutQuad' });

// Fade out
sprite.tween({ alpha: 0 }, { duration: 500, easing: 'easeInQuad' });
```

### Pulse Effect

```javascript
function pulse() {
  sprite.tween(
    { scaleX: 1.2, scaleY: 1.2 },
    { duration: 400, easing: 'easeOutQuad' }
  ).then(() => {
    sprite.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 400, easing: 'easeInQuad' }
    ).then(pulse);
  });
}

pulse();
```

### Shake Effect

```javascript
const originalX = sprite.x;

function shake(intensity = 10, duration = 50) {
  sprite.tween(
    { x: originalX + intensity },
    { duration: duration, easing: 'linear' }
  ).then(() => {
    sprite.tween(
      { x: originalX - intensity },
      { duration: duration, easing: 'linear' }
    ).then(() => {
      sprite.tween(
        { x: originalX },
        { duration: duration, easing: 'linear' }
      );
    });
  });
}

shake();
```

### Sequential Animation

```javascript
// Move right, then down, then left, then up
sprite.tween({ x: 300 }, { duration: 500 }).then(() => {
  sprite.tween({ y: 200 }, { duration: 500 }).then(() => {
    sprite.tween({ x: 100 }, { duration: 500 }).then(() => {
      sprite.tween({ y: 100 }, { duration: 500 });
    });
  });
});
```

### Delayed Start

```javascript
// Wait 1 second before starting
sprite.tween(
  { x: 300 },
  {
    duration: 1000,
    delay: 1000,
    easing: 'easeOutCubic'
  }
);
```

### Button Press

```javascript
button.on('tap', () => {
  // Quick press down and release
  button.tween(
    { scaleX: 0.95, scaleY: 0.95 },
    { duration: 100, easing: 'easeOutQuad' }
  ).then(() => {
    button.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100, easing: 'easeOutBack' }
    );
  });
});
```

## Performance Tips

- **Minimize simultaneous tweens**: More than 100 active tweens may impact performance
- **Reuse tween patterns**: Create functions for common animations
- **Stop unused tweens**: Always stop tweens when entities are destroyed
- **Choose appropriate durations**: 200-500ms feels snappy, 1000-2000ms feels smooth

## Common Mistakes

### Tweening non-numeric properties

```javascript
// ❌ Wrong - color is a string
sprite.tween({ color: '#ff0000' }, { duration: 1000 });

// ✅ Right - tween numeric properties
sprite.tween({ alpha: 0 }, { duration: 1000 });
```

### Not nesting tween chains

```javascript
// ❌ Wrong - second tween won't wait for first
sprite.tween({ x: 100 }, { duration: 500 });
sprite.tween({ y: 100 }, { duration: 500 });  // Starts immediately!

// ✅ Right - nest with .then() to sequence
sprite.tween({ x: 100 }, { duration: 500 }).then(() => {
  sprite.tween({ y: 100 }, { duration: 500 });
});
```

## Next Steps

- [Particles](/animation/particles) - Particle effects
- [Touch Trail](/animation/touch-trail) - Visual touch trails
- [Easing Functions](/utilities/easing) - Complete easing reference
