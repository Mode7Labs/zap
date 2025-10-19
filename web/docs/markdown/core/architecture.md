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

1. **Game** - The root container that manages the canvas, game loop, and systems
2. **Scene** - A container for entities (like a level or screen)
3. **Entities** - Visual elements (sprites, text, buttons, etc.)

## Core Components

### Game

The `Game` class is your application's entry point. It:

- Creates and manages the HTML5 canvas
- Runs the game loop (updates and renders)
- Handles scene management and transitions
- Provides gesture recognition
- Manages the camera

There is typically one `Game` instance per application.

### Scene

A `Scene` is a container for entities. Use scenes to organize different screens or levels:

- **Menu scene** - Start screen with buttons
- **Game scene** - The actual gameplay
- **Results scene** - End screen showing scores

Scenes can be switched with smooth transitions.

### Entity

Entities are the building blocks of your game. They represent visual elements like:

- `Sprite` - Colored rectangles and image sprites
- `Text` - Rendered text with custom fonts
- `Button` - Interactive UI buttons
- `AnimatedSprite` - Frame-by-frame animations
- `NinePatch` - Scalable UI panels

All entities share common properties like position, rotation, scale, and opacity.

## Systems

Zap includes several systems that work together:

### Gesture Manager

Handles touch and mouse input, recognizing:
- Tap
- Swipe (up, down, left, right)
- Drag
- Long press

### Tween Manager

Manages all animations created with `.tween()`. Automatically updates and removes completed tweens.

### Audio Manager

Handles sound effects and music playback with volume control and sprite sheet support.

### Asset Loader

Pre-loads images, sounds, and fonts before your game starts.

### Camera

Controls the viewport, allowing you to pan, zoom, and follow entities.

## Event System

Zap uses an event-driven architecture. Entities can emit and listen for events:

```javascript
// Listen for events
sprite.on('tap', () => console.log('Tapped!'));
sprite.on('drag', (e) => console.log(e.x, e.y));

// Emit custom events
sprite.emit('custom-event', { data: 'hello' });
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

Change render order with `z-index`:

```javascript
player.zIndex = 100;
background.zIndex = 0;
```

## Memory Management

Zap automatically manages most resources, but you should:

- Call `game.destroy()` when completely done
- Remove event listeners when entities are removed
- Clear references to large objects

```javascript
sprite.off('tap', handler);  // Remove specific listener
sprite.offAll();             // Remove all listeners
scene.remove(sprite);        // Remove from scene
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
