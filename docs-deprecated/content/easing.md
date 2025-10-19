---
id: easing
title: Easing Functions
category: effects
description: Different easing effects for animations
imports: [Sprite, Easing]
---

# Easing Functions

Apply different easing functions to animations for more natural and appealing motion effects.

## Comparing Easing Functions

```zap-demo
const linearSprite = new Sprite({
  x: 80, y: 50,
  width: 40, height: 40,
  color: '#e94560',
  radius: 20
});

const bounceSprite = new Sprite({
  x: 200, y: 50,
  width: 40, height: 40,
  color: '#4fc3f7',
  radius: 20
});

const elasticSprite = new Sprite({
  x: 320, y: 50,
  width: 40, height: 40,
  color: '#f39c12',
  radius: 20
});

function animate() {
  linearSprite.y = 50;
  bounceSprite.y = 50;
  elasticSprite.y = 50;

  linearSprite.tween({ y: 230 }, {
    duration: 1500,
    easing: Easing.linear
  });

  bounceSprite.tween({ y: 230 }, {
    duration: 1500,
    easing: Easing.easeOutBounce
  });

  elasticSprite.tween({ y: 230 }, {
    duration: 1500,
    easing: Easing.easeOutElastic,
    onComplete: () => {
      setTimeout(animate, 500);
    }
  });
}

animate();

scene.add(linearSprite);
scene.add(bounceSprite);
scene.add(elasticSprite);
```

## Available Easing Functions

Common easing functions include:

- `Easing.linear` - Constant speed
- `Easing.easeInQuad` - Accelerate from zero
- `Easing.easeOutQuad` - Decelerate to zero
- `Easing.easeInOutQuad` - Accelerate then decelerate
- `Easing.easeOutBounce` - Bouncing effect
- `Easing.easeOutElastic` - Elastic spring effect
- `Easing.easeOutBack` - Overshoot and settle

And many more variations with cubic, quart, quint, sine, expo, and circ curves.
