---
id: architecture
title: Architecture
category: core
description: Understanding how Zap is structured
imports: []
---

# Architecture

Zap is built around a simple, intuitive architecture that makes it easy to create 2D games and interactive experiences.

## Core Components

Zap is structured with these key components:

```
Game
 ├── Scene(s)
 │    ├── Entity (Sprite, Text, etc.)
 │    │    └── Child Entities
 │    └── ParticleEmitter
 ├── Camera
 └── Managers
      ├── GestureManager
      ├── TweenManager
      └── AudioManager
```

## Game

The `Game` class is your main entry point and manages the core game loop and rendering. It handles canvas rendering context, the update/render cycle, scene management, and global managers for gestures, tweens, and audio.

See the Game Configuration documentation for all available options including FPS control, rendering quality, and debug tools.

## Entities

Everything visual in your game is an Entity:

- `Sprite` - Basic shapes, colors, and images
- `Text` - Text rendering with custom fonts
- `ParticleEmitter` - Particle effects

Entities support parent-child hierarchies, allowing you to build complex game objects.

## Managers

Managers are internal singleton systems that work behind the scenes. You don't interact with them directly - instead, you use convenient methods on entities:

- **GestureManager:** Detects touch/mouse input when you use `entity.on('tap', ...)`
- **TweenManager:** Updates animations when you call `entity.tween(...)`
- **AudioManager:** Plays sounds when you call `audioManager.play(...)`

The managers handle the complex logic, while entities provide a simple API.

## Performance

Zap uses a single requestAnimationFrame loop and batches all rendering operations for optimal performance, even with hundreds of entities.
