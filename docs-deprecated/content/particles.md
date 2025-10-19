---
id: particles
title: Particle Effects
category: effects
description: Create particle explosions and effects
imports: [ParticleEmitter]
---

# Particle Effects

Create dynamic particle effects for explosions, trails, and visual feedback with the ParticleEmitter.

## Burst Effect

```zap-demo
const emitter = new ParticleEmitter({
  x: 200, y: 150,
  rate: 0,
  colors: ['#e94560', '#4fc3f7', '#f39c12'],
  sizeRange: { min: 3, max: 8 },
  lifetimeRange: { min: 0.5, max: 1.2 },
  velocityRange: {
    min: { x: -150, y: -150 },
    max: { x: 150, y: 150 }
  }
});

// Trigger burst on click
game.canvas.addEventListener('click', () => {
  emitter.burst(30);
});

scene.add(emitter);
```

## Continuous Emission

```zap-demo
const emitter = new ParticleEmitter({
  x: 200, y: 150,
  rate: 20,  // Emit 20 particles per second
  colors: ['#e94560', '#4fc3f7', '#f39c12'],
  sizeRange: { min: 3, max: 8 },
  lifetimeRange: { min: 0.5, max: 1.2 },
  velocityRange: {
    min: { x: -100, y: -100 },
    max: { x: 100, y: 100 }
  }
});

scene.add(emitter);
```
