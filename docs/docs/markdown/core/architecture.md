---
title: Architecture
description: Understanding how Zap is structured
---

# Architecture

Zap follows a simple, hierarchical structure that makes it easy to build interactive experiences.

## The Hierarchy

```
Game
└── Scene(s)
    ├── Entity (Sprite, Text, etc.)
    ├── Entity
    └── Entity
```

Every Zap application follows this pattern:

1. **[Game](/core/game)** - The root container that manages the canvas, game loop, and systems
2. **[Scene](/core/scenes)** - A container for entities (like a level or screen)
3. **[Entities](/core/entities)** - Visual elements (sprites, text, buttons, etc.)

## Core Components

### Game

The [`Game`](/core/game) class is your application's entry point and extends `EventEmitter`. It:

- Creates and manages the HTML5 canvas
- Runs the game loop (updates and renders at 60 FPS by default)
- Handles [scene](/core/scenes) management and transitions
- Provides gesture recognition via `GestureManager`
- Manages the [camera](/core/camera)
- Supports pause/resume functionality
- Optional features: FPS control, responsive canvas, [touch trails](/animation/touch-trail), FPS display

There is typically one `Game` instance per application.

### Scene

A [`Scene`](/core/scenes) is a container for entities and extends `EventEmitter`. Use scenes to organize different screens or levels:

- **Menu scene** - Start screen with buttons
- **Game scene** - The actual gameplay
- **Results scene** - End screen showing scores

Scenes provide:
- Lifecycle methods: `onEnter()` and `onExit()`
- [Timer utilities](/utilities/timers): `delay()` and `interval()`
- Background support: color or image
- Smooth [transitions](/core/scenes) between scenes

### Entity

[Entities](/core/entities) are the building blocks of your game and extend `EventEmitter`. They represent visual elements like:

- [`Sprite`](/visual/sprites) - Colored rectangles, image sprites, and sprite sheet animations
- [`Text`](/visual/text) - Rendered text with custom fonts
- [`Button`](/ui/button) - Interactive UI buttons
- [`NinePatch`](/ui/ninepatch) - Scalable UI panels
- [`Particle` / `ParticleEmitter`](/animation/particles) - Visual effects like explosions, smoke, and trails

All entities share common properties like position, rotation, scale, opacity, [physics](/physics/physics) (velocity, gravity, friction), and [collision detection](/physics/collision-detection).

## Systems

Zap includes several systems that work together:

### Gesture Manager

Handles touch and mouse input, recognizing:
- **[Tap](/gestures/tap)** - Quick touch/click
- **[Swipe](/gestures/swipe)** - Directional swipes (up, down, left, right)
- **[Drag](/gestures/drag)** - Continuous dragging with dragstart, drag, and dragend events
- **Long press** - Press and hold
- **[Pinch](/gestures/pinch)** - Two-finger pinch for zoom gestures
- **Pointer** - Low-level pointerover and pointerout events for hover states

### Tween Manager

Manages all animations created with [`.tween()`](/animation/tweening). Automatically updates and removes completed tweens.

### Touch Trail

Optional visual effect that creates trailing particles following touch/mouse movement. Enable with `enableTouchTrail: true` in Game options. See [Touch Trail](/animation/touch-trail).

### Audio Manager

Handles [sound effects](/audio/sound-effects) and [music](/audio/music) playback with [volume control](/audio/volume) and sprite sheet support.

### Asset Loader

Pre-loads images, sounds, and [fonts](/utilities/fonts) before your game starts. See [Asset Loader](/utilities/asset-loader).

### Camera

Controls the viewport, allowing you to pan, zoom, and follow entities. See [Camera](/core/camera).

## Event System

Zap uses an event-driven architecture. All core classes (Game, Scene, Entity) extend `EventEmitter`:

```javascript
// Listen for events
sprite.on('tap', () => console.log('Tapped!'));
sprite.on('drag', (e) => console.log(e.position.x, e.position.y, e.delta.x, e.delta.y));

// Listen once
sprite.once('animationcomplete', () => console.log('Animation done!'));

// Emit custom events
sprite.emit('custom-event', { data: 'hello' });

// Remove listeners
sprite.off('tap');  // Remove all tap listeners
sprite.clearEvents();  // Remove all listeners
```

## The Game Loop

Zap runs a standard game loop:

1. **Update** - Update entity properties, animations, and physics
2. **Render** - Draw all entities to the canvas
3. **Repeat** - Continue at 60 FPS (or your target FPS)

The loop is managed automatically - you just add entities and they render.

## Rendering Order

Entities render in the order they were added to the scene (painter's algorithm):

```javascript
scene.add(background);  // Renders first (back)
scene.add(player);      // Renders second (middle)
scene.add(ui);          // Renders last (front)
```

Change render order with `zIndex`:

```javascript
player.zIndex = 100;
background.zIndex = 0;
```

## Memory Management

Zap automatically manages most resources, but you should:

- Call `entity.destroy()` to remove entities and clean up children
- Remove event listeners when no longer needed
- Clear timers when scenes exit

```javascript
sprite.off('tap', handler);  // Remove specific listener
sprite.off('tap');           // Remove all 'tap' listeners
sprite.clearEvents();        // Remove all event listeners
sprite.destroy();            // Remove from scene and destroy children
scene.remove(sprite);        // Remove from scene (without destroying)
```

## Best Practices

1. **One game instance** - Create a single `Game` per application
2. **Scene organization** - Use scenes for different screens/levels
3. **Entity reuse** - Pool frequently created/destroyed entities
4. **Event cleanup** - Remove listeners when not needed
5. **Asset preloading** - Load images/sounds before displaying

## Next Steps

- [Game Configuration](/core/game) - All Game configuration options
- [Scenes](/core/scenes) - Working with scenes and transitions
- [Entities](/core/entities) - Understanding the entity lifecycle
