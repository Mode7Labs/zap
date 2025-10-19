---
title: Easing Functions
description: Timing functions for smooth, natural animations
---

# Easing Functions

Easing functions control the timing and feel of animations. Instead of linear motion, easing creates natural acceleration and deceleration, making animations feel more polished and realistic.

## Understanding Easing

All easing functions take a value from 0 to 1 (representing animation progress) and return a value from 0 to 1 (representing the eased progress):

```javascript
import { Easing } from '@mode-7/zap';

// Linear: constant speed
Easing.linear(0.5);  // Returns 0.5

// EaseOutQuad: starts fast, ends slow
Easing.easeOutQuad(0.5);  // Returns ~0.75
```

## Using Easing with Tweens

Apply easing to any tween animation:

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
  color: '#e94560',
  radius: 30
});

scene.add(sprite);

// Animate with easing
sprite.tween(
  { x: 350 },
  { duration: 2000, easing: 'easeOutBounce' }
);

game.setScene(scene);
game.start();
```

## Easing Types

### Linear

**No easing** - constant speed throughout.

```javascript
// Linear motion
sprite.tween({ x: 300 }, { duration: 1000, easing: 'linear' });
```

**Use for**: Progress bars, loading indicators, anything that should move at constant speed.

**Feel**: Robotic, mechanical, predictable.

---

### Quad (Quadratic)

**Gentle acceleration/deceleration** - subtle, smooth easing.

```javascript
// Ease in: slow start, fast end
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInQuad' });

// Ease out: fast start, slow end
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutQuad' });

// Ease in-out: slow start, slow end
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutQuad' });
```

**Use for**: Subtle UI animations, cards sliding in, gentle movements.

**Feel**: Smooth, natural, understated.

---

### Cubic

**Moderate acceleration/deceleration** - noticeable curve.

```javascript
// Ease in: gradual acceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInCubic' });

// Ease out: gradual deceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutCubic' });

// Ease in-out: smooth curve
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutCubic' });
```

**Use for**: General purpose animations, menu transitions, modal dialogs.

**Feel**: Smooth, polished, professional.

---

### Quart (Quartic)

**Strong acceleration/deceleration** - dramatic curve.

```javascript
// Ease in: rapid acceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInQuart' });

// Ease out: rapid deceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutQuart' });

// Ease in-out: dramatic curve
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutQuart' });
```

**Use for**: Dramatic reveals, hero animations, important UI elements.

**Feel**: Energetic, impactful, attention-grabbing.

---

### Quint (Quintic)

**Very strong acceleration/deceleration** - extreme curve.

```javascript
// Ease in: very rapid acceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInQuint' });

// Ease out: very rapid deceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutQuint' });

// Ease in-out: extreme curve
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutQuint' });
```

**Use for**: Super dramatic effects, splash screens, cinematic transitions.

**Feel**: Intense, powerful, cinematic.

---

### Sine

**Sinusoidal curve** - very smooth and natural.

```javascript
// Ease in: gentle sinusoidal acceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInSine' });

// Ease out: gentle sinusoidal deceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutSine' });

// Ease in-out: smooth sinusoidal curve
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutSine' });
```

**Use for**: Subtle animations, floating elements, ambient motion.

**Feel**: Organic, fluid, calming.

---

### Expo (Exponential)

**Exponential acceleration/deceleration** - very dramatic.

```javascript
// Ease in: explosive acceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInExpo' });

// Ease out: explosive deceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutExpo' });

// Ease in-out: explosive curve
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutExpo' });
```

**Use for**: Fast actions, snappy UI, attention-demanding effects.

**Feel**: Explosive, snappy, aggressive.

---

### Circ (Circular)

**Circular curve** - smooth and pronounced.

```javascript
// Ease in: circular acceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInCirc' });

// Ease out: circular deceleration
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutCirc' });

// Ease in-out: circular curve
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutCirc' });
```

**Use for**: Rounded motion, smooth reveals, polished UI.

**Feel**: Rounded, smooth, refined.

---

### Back

**Overshoots target** - pulls back before/after movement.

```javascript
// Ease in: pulls back, then launches forward
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInBack' });

// Ease out: overshoots, then settles back
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutBack' });

// Ease in-out: pulls back, overshoots, settles
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutBack' });
```

**Use for**: Playful UI, attention-grabbing buttons, fun animations.

**Feel**: Playful, exaggerated, springy.

---

### Elastic

**Spring-like oscillation** - bounces at start or end.

```javascript
// Ease in: spring compression before launch
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInElastic' });

// Ease out: spring oscillation at end
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutElastic' });

// Ease in-out: spring oscillation at both ends
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutElastic' });
```

**Use for**: Rubber band effects, playful UI, cartoonish motion.

**Feel**: Bouncy, elastic, fun.

---

### Bounce

**Bounces like a ball** - simulates gravity and bounce.

```javascript
// Ease in: reverse bounce before movement
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInBounce' });

// Ease out: bounces at destination
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeOutBounce' });

// Ease in-out: bounces at start and end
sprite.tween({ x: 300 }, { duration: 1000, easing: 'easeInOutBounce' });
```

**Use for**: Dropping elements, playful interactions, game effects.

**Feel**: Physical, bouncy, playful.

---

## Complete Reference

All 31 available easing functions:

```javascript
// Linear
'linear'

// Quad (gentle)
'easeInQuad'
'easeOutQuad'
'easeInOutQuad'

// Cubic (moderate)
'easeInCubic'
'easeOutCubic'
'easeInOutCubic'

// Quart (strong)
'easeInQuart'
'easeOutQuart'
'easeInOutQuart'

// Quint (very strong)
'easeInQuint'
'easeOutQuint'
'easeInOutQuint'

// Sine (smooth)
'easeInSine'
'easeOutSine'
'easeInOutSine'

// Expo (explosive)
'easeInExpo'
'easeOutExpo'
'easeInOutExpo'

// Circ (circular)
'easeInCirc'
'easeOutCirc'
'easeInOutCirc'

// Back (overshoot)
'easeInBack'
'easeOutBack'
'easeInOutBack'

// Elastic (spring)
'easeInElastic'
'easeOutElastic'
'easeInOutElastic'

// Bounce (gravity)
'easeInBounce'
'easeOutBounce'
'easeInOutBounce'
```

## Choosing the Right Easing

### In, Out, or In-Out?

- **EaseIn**: Starts slow, ends fast. Use for elements leaving the screen.
- **EaseOut**: Starts fast, ends slow. Use for elements entering the screen.
- **EaseInOut**: Slow start and end. Use for elements moving within the screen.

### By Use Case

**Subtle, professional UI**:
- `easeOutQuad` - Smooth, understated
- `easeInOutCubic` - General purpose
- `easeOutSine` - Very smooth

**Attention-grabbing UI**:
- `easeOutBack` - Playful overshoot
- `easeOutBounce` - Bouncy landing
- `easeOutElastic` - Spring effect

**Dramatic reveals**:
- `easeOutExpo` - Explosive deceleration
- `easeOutQuint` - Very strong deceleration
- `easeOutQuart` - Strong impact

**Natural motion**:
- `easeInOutSine` - Organic movement
- `easeOutCubic` - Natural deceleration
- `easeInOutQuad` - Gentle curves

## Common Patterns

### Button Press

```javascript
button.on('tap', () => {
  // Press down
  button.tween(
    { scaleX: 0.9, scaleY: 0.9 },
    { duration: 100, easing: 'easeOutQuad' }
  ).then(() => {
    // Release back
    button.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 200, easing: 'easeOutBack' }  // Slight overshoot
    );
  });
});
```

### Modal Dialog

```javascript
// Enter with dramatic slow-down
modal.scaleX = 0;
modal.scaleY = 0;

modal.tween(
  { scaleX: 1, scaleY: 1 },
  { duration: 400, easing: 'easeOutBack' }
);

// Exit quickly
function closeModal() {
  modal.tween(
    { scaleX: 0, scaleY: 0 },
    { duration: 200, easing: 'easeInQuad' }
  );
}
```

### Smooth Camera Pan

```javascript
function panTo(x, y) {
  const duration = 1000;
  const startTime = Date.now();
  const startX = game.camera.x;
  const startY = game.camera.y;

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use imported Easing object
    const { Easing } = require('@mode-7/zap');
    const eased = Easing.easeInOutCubic(progress);

    game.camera.x = startX + (x - startX) * eased;
    game.camera.y = startY + (y - startY) * eased;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}
```

### Bouncing Ball

```javascript
ball.tween(
  { y: groundY },
  { duration: 800, easing: 'easeOutBounce' }
);
```

### Menu Slide In

```javascript
// Menu starts off-screen
menu.x = -menu.width;

// Slides in with slight overshoot
menu.tween(
  { x: 0 },
  { duration: 400, easing: 'easeOutBack' }
);
```

### Elastic Button Hover

```javascript
button.on('tap', () => {
  // Compress
  button.tween(
    { scaleX: 0.8, scaleY: 0.8 },
    { duration: 100, easing: 'easeInQuad' }
  ).then(() => {
    // Elastic release
    button.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 600, easing: 'easeOutElastic' }
    );
  });
});
```

### Loading Spinner

```javascript
// Constant rotation (linear)
function spin() {
  spinner.rotation = 0;
  spinner.tween(
    { rotation: Math.PI * 2 },
    { duration: 1000, easing: 'linear' }
  ).then(() => {
    spin();  // Loop
  });
}

spin();
```

## Custom Easing

Access the Easing object directly for custom implementations:

```javascript
import { Easing } from '@mode-7/zap';

function customAnimation(progress) {
  // Apply easing manually
  const eased = Easing.easeOutBounce(progress);

  sprite.x = startX + (endX - startX) * eased;
  sprite.y = startY + (endY - startY) * eased;
}
```

## Comparison Guide

**From gentlest to most dramatic**:

1. `linear` - No easing
2. `easeInOutQuad` - Very subtle
3. `easeInOutSine` - Gentle and smooth
4. `easeInOutCubic` - Moderate
5. `easeInOutQuart` - Strong
6. `easeInOutQuint` - Very strong
7. `easeInOutExpo` - Explosive
8. `easeInOutBack` - Overshoots
9. `easeInOutElastic` - Spring-like
10. `easeInOutBounce` - Most dramatic

**Most commonly used**:

- `easeOutQuad` - 40% of use cases (general UI)
- `easeInOutCubic` - 30% of use cases (smooth motion)
- `easeOutBack` - 15% of use cases (playful UI)
- `easeOutBounce` - 10% of use cases (fun effects)
- Others - 5% of use cases (special effects)

## Performance

All easing functions are lightweight mathematical calculations:

- **No overhead**: Pure math functions, no memory allocation
- **Fast execution**: Simple polynomial or trigonometric calculations
- **Safe for many tweens**: Can run hundreds simultaneously

## Tips

- **Start with easeOutQuad** - Works for 90% of UI animations
- **Use easeOut for entrances** - Elements entering the screen
- **Use easeIn for exits** - Elements leaving the screen
- **Use easeInOut for movement** - Elements moving within view
- **Match easing to intent** - Playful vs professional, subtle vs dramatic
- **Don't overuse dramatic easings** - Back/Elastic/Bounce can be distracting
- **Test different durations** - Easing + duration = feel

## Common Mistakes

### Wrong easing direction

```javascript
// ❌ Wrong - element enters screen with easeIn (starts slow)
panel.x = -panel.width;
panel.tween({ x: 0 }, { duration: 400, easing: 'easeInQuad' });

// ✅ Right - element enters with easeOut (ends slow, more natural)
panel.x = -panel.width;
panel.tween({ x: 0 }, { duration: 400, easing: 'easeOutQuad' });
```

### Too dramatic for subtle UI

```javascript
// ❌ Wrong - distracting for simple button
button.tween({ scaleX: 1.1 }, { easing: 'easeOutElastic' });

// ✅ Right - subtle for UI element
button.tween({ scaleX: 1.1 }, { easing: 'easeOutQuad' });
```

### Linear for organic motion

```javascript
// ❌ Wrong - feels robotic
character.tween({ x: 500 }, { duration: 1000, easing: 'linear' });

// ✅ Right - feels natural
character.tween({ x: 500 }, { duration: 1000, easing: 'easeInOutCubic' });
```

## Next Steps

- [Tweening](/animation/tweening) - Using easing in animations
- [Camera](/core/camera) - Smooth camera movements
- [Button](/ui/button) - Animated UI interactions
