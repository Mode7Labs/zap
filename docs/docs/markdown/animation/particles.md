---
title: Particles
description: Particle systems for visual effects
---

# Particles

Particle systems create visual effects like explosions, smoke, fire, sparkles, and trails. Zap provides both individual Particle entities and ParticleEmitter for continuous effects.

## Basic Particle Emitter

Create a particle emitter with rate, colors, and velocity:

```javascript
import { ParticleEmitter } from '@mode-7/zap';

const emitter = new ParticleEmitter({
  x: 200,
  y: 150,
  rate: 20,  // Particles per second
  colors: ['#4fc3f7', '#51cf66', '#f39c12'],
  sizeRange: { min: 3, max: 8 },
  lifetimeRange: { min: 0.5, max: 1.5 },
  velocityRange: {
    min: { x: -100, y: -100 },
    max: { x: 100, y: -50 }
  }
});

scene.add(emitter);
```

> **Note**: Examples assume basic setup with `Game` and `Scene`. See [Getting Started](/getting-started/quickstart) if you're new to Zap.

## Particle Emitter Options

```javascript
const emitter = new ParticleEmitter({
  x: 200,
  y: 150,

  // Emission rate (default: 10)
  rate: 10,  // Particles per second

  // Velocity range in pixels/second (default: -50 to 50 for both x and y)
  velocityRange: {
    min: { x: -50, y: -50 },
    max: { x: 50, y: 50 }
  },

  // Size range (default: 2 to 6)
  sizeRange: { min: 2, max: 6 },

  // Lifetime range in seconds (default: 0.5 to 1.5)
  lifetimeRange: { min: 0.5, max: 1.5 },

  // Colors array - randomly chosen for each particle (default: ['#ffffff'])
  colors: ['#ff0000', '#00ff00', '#0000ff'],

  // Additional particle options
  particleOptions: {
    gravity: 100,    // Downward acceleration (default: 0)
    friction: 0.98   // Velocity dampening (default: 1 = no friction)
  }
});
```

## Particle Burst

Emit many particles at once:

```codemirror
import { Game, Scene, ParticleEmitter, Sprite } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const emitter = new ParticleEmitter({
  x: 200,
  y: 150,
  rate: 0,  // Don't emit continuously
  colors: ['#e94560', '#f39c12', '#f1c40f'],
  sizeRange: { min: 4, max: 10 },
  lifetimeRange: { min: 0.8, max: 1.5 },
  velocityRange: {
    min: { x: -150, y: -150 },
    max: { x: 150, y: -50 }
  },
  particleOptions: {
    gravity: 200
  }
});

const button = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  radius: 50,
  color: '#e94560',
  interactive: true
});

scene.add(emitter);
scene.add(button);

button.on('tap', () => {
  emitter.burst(50);  // Emit 50 particles at once
  button.tween({ scaleX: 0.9, scaleY: 0.9 }, { duration: 100 })
    .then(() => button.tween({ scaleX: 1, scaleY: 1 }, { duration: 100 }));
});

game.setScene(scene);
game.start();
```

## Individual Particles

Create single particles manually:

```javascript
import { Particle } from '@mode-7/zap';

const particle = new Particle({
  x: 200,
  y: 150,
  velocity: { x: 50, y: -100 },  // Optional (default: {x: 0, y: 0})
  color: '#4fc3f7',               // Optional (default: '#ffffff')
  size: 6,                        // Optional (default: 4)
  lifetime: 2,                    // Optional (default: 1) - seconds before fading out
  gravity: 100,                   // Optional (default: 0) - pixels/second²
  friction: 0.99                  // Optional (default: 1) - velocity multiplier per frame
});

scene.add(particle);
```

## Common Effects

### Explosion

```javascript
const explosion = new ParticleEmitter({
  x: targetX,
  y: targetY,
  rate: 0,
  colors: ['#ff6b6b', '#f39c12', '#f1c40f', '#fff'],
  sizeRange: { min: 6, max: 14 },
  lifetimeRange: { min: 0.4, max: 1.2 },
  velocityRange: {
    min: { x: -200, y: -200 },
    max: { x: 200, y: 200 }
  },
  particleOptions: {
    gravity: 50,
    friction: 0.95
  }
});

explosion.burst(80);
```

### Fire

```javascript
const fire = new ParticleEmitter({
  x: 200,
  y: 250,
  rate: 30,
  colors: ['#ff6b6b', '#f39c12', '#f1c40f'],
  sizeRange: { min: 4, max: 12 },
  lifetimeRange: { min: 0.3, max: 0.8 },
  velocityRange: {
    min: { x: -20, y: -120 },
    max: { x: 20, y: -80 }
  },
  particleOptions: {
    gravity: -30,  // Negative = upward
    friction: 0.98
  }
});
```

### Sparkles

```javascript
const sparkles = new ParticleEmitter({
  x: 200,
  y: 150,
  rate: 15,
  colors: ['#fff', '#4fc3f7', '#51cf66', '#f39c12'],
  sizeRange: { min: 2, max: 5 },
  lifetimeRange: { min: 0.5, max: 1.2 },
  velocityRange: {
    min: { x: -30, y: -30 },
    max: { x: 30, y: 30 }
  },
  particleOptions: {
    friction: 0.96
  }
});
```

### Smoke

```javascript
const smoke = new ParticleEmitter({
  x: 200,
  y: 280,
  rate: 10,
  colors: ['#555', '#666', '#777'],
  sizeRange: { min: 8, max: 20 },
  lifetimeRange: { min: 1.5, max: 3 },
  velocityRange: {
    min: { x: -15, y: -60 },
    max: { x: 15, y: -40 }
  },
  particleOptions: {
    gravity: -10,
    friction: 0.99
  }
});
```

### Confetti

```javascript
const confetti = new ParticleEmitter({
  x: 200,
  y: 50,
  rate: 0,
  colors: ['#e94560', '#51cf66', '#4fc3f7', '#f39c12', '#9b59b6'],
  sizeRange: { min: 6, max: 12 },
  lifetimeRange: { min: 2, max: 4 },
  velocityRange: {
    min: { x: -100, y: -50 },
    max: { x: 100, y: 100 }
  },
  particleOptions: {
    gravity: 150,
    friction: 0.99
  }
});

confetti.burst(100);
```

### Trail Effect

```javascript
const trail = new ParticleEmitter({
  x: player.x,
  y: player.y,
  rate: 40,
  colors: ['#4fc3f7'],
  sizeRange: { min: 3, max: 6 },
  lifetimeRange: { min: 0.2, max: 0.5 },
  velocityRange: {
    min: { x: -10, y: -10 },
    max: { x: 10, y: 10 }
  },
  particleOptions: {
    friction: 0.95
  }
});

// Update emitter position to follow player
scene.on('update', () => {
  trail.x = player.x;
  trail.y = player.y;
});
```

## Physics Properties

Particles use Zap's built-in physics system, which is available on all entities. See the [Physics](/physics/physics) documentation for more details.

### Gravity

Accelerates particles downward (or upward if negative):

```javascript
gravity: 100    // Falls down
gravity: -50    // Floats up
gravity: 0      // No gravity
```

### Friction

Reduces velocity over time (0 = stop immediately, 1 = no friction):

```javascript
friction: 1.0   // No slowdown
friction: 0.98  // Slight slowdown
friction: 0.9   // Medium slowdown
friction: 0.5   // Heavy drag
```

> **Note:** These physics properties (`gravity`, `friction`, `vx`, `vy`) work on all Entity types, not just Particles. Particles simply leverage the Entity physics system for movement.

## Dynamic Emitters

Attach emitter to moving entities:

```javascript
// Rocket exhaust
const exhaust = new ParticleEmitter({
  rate: 50,
  colors: ['#ff6b6b', '#f39c12'],
  velocityRange: {
    min: { x: -20, y: 50 },
    max: { x: 20, y: 100 }
  }
});

rocket.addChild(exhaust);  // Follows rocket
```

## Controlling Emission

Control particle emission rate:

```javascript
// Stop emitting (set rate to 0)
emitter.rate = 0;

// Start/resume emitting
emitter.rate = 20;

// Remove emitter and all its particles
emitter.destroy();
```

## Performance Tips

- Limit particle count (100-200 on screen max)
- Use shorter lifetimes for performance
- Lower emission rate for mobile
- Remove emitters when off-screen
- Use simple colors (avoid gradients)

## Tips

- **Match colors to theme** - Particle colors should fit your visual style
- **Combine effects** - Layer multiple emitters for complex effects
- **Tune velocity ranges** - Wider ranges = more chaotic
- **Short lifetimes** - 0.5-2 seconds is usually enough
- **Burst for impacts** - Continuous for ambient effects

## Next Steps

- [Touch Trail](/animation/touch-trail) - Visual touch trails
- [Tweening](/animation/tweening) - Property animations
