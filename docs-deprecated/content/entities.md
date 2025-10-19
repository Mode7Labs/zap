---
id: entities
title: Entities
category: core
description: Visual objects in your game
imports: [Sprite, Text, ParticleEmitter]
---

# Entities

Entities are the building blocks of your game. Every visual element (sprites, text, particles) extends the Entity base class.

## Common Properties

All entities share these properties:

```zap-demo
const sprite = new Sprite({
  // Position
  x: 100,
  y: 100,

  // Size
  width: 50,
  height: 50,

  // Transform
  rotation: 0,
  scaleX: 1,
  scaleY: 1,

  // Appearance
  alpha: 1,
  visible: true,

  // Interaction
  interactive: true,

  // Organization
  tag: 'player'
});

scene.add(sprite);
```

## Parent-Child Hierarchy

Entities can have children, creating a transform hierarchy where child positions and rotations are relative to their parent.

```zap-demo
const parent = new Sprite({
  x: 200, y: 150,
  width: 60, height: 60,
  color: '#e94560',
  radius: 10
});

const child = new Sprite({
  x: 40, y: 0,
  width: 30, height: 30,
  color: '#4fc3f7',
  radius: 15
});

parent.addChild(child);

// Rotating parent also rotates child
parent.tween(
  { rotation: Math.PI * 2 },
  { duration: 3000, loop: true }
);

scene.add(parent);
```

## Entity Methods

Common methods available on all entities:

- `entity.tween(props, options)` - Animate properties
- `entity.on(event, handler)` - Listen to events
- `entity.addChild(child)` - Add a child entity
- `entity.removeChild(child)` - Remove a child entity
- `entity.destroy()` - Clean up and remove

## Entity Types

- **Sprite:** Rectangles, circles, rounded shapes, images
- **Text:** Rendered text with custom fonts and alignment
- **ParticleEmitter:** Visual effects and particles

Use parent-child relationships to create complex objects. For example, a button can be a sprite with a text child.
