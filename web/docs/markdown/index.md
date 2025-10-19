# Zap Game Engine Documentation Index

This index provides a complete overview of all Zap documentation. Each section includes a description and direct link to the documentation.

## Getting Started

- **[Installation](getting-started/installation.md)** - Install Zap via npm or CDN
- **[Quickstart](getting-started/quickstart.md)** - Build your first Zap game in 5 minutes

## Core Concepts

- **[Architecture](core/architecture.md)** - Understanding Zap's architecture and structure
- **[Game Configuration](core/game.md)** - Configure your Game instance with all available options (canvas size, responsive mode, background color, etc.)
- **[Scenes](core/scenes.md)** - Scene management, transitions, backgrounds, and lifecycle
- **[Entities](core/entities.md)** - Entity system, lifecycle, hierarchy, and properties
- **[Camera](core/camera.md)** - Camera controls: follow entities, zoom, shake effects

## Visual Elements

- **[Shapes](visual/shapes.md)** - Draw rectangles, circles, and rounded shapes with Sprite
- **[Sprites](visual/sprites.md)** - Image sprites, loading, and rendering
- **[Sprite Animation](visual/animation.md)** - Frame-by-frame sprite sheet animations
- **[Text](visual/text.md)** - Text rendering with custom fonts and alignment

## Animation & Effects

- **[Tweening](animation/tweening.md)** - Smooth property animations with easing functions
- **[Particles](animation/particles.md)** - Particle effects and emitters for visual feedback
- **[Touch Trail](animation/touch-trail.md)** - Visual touch/mouse trail effect

## Gestures & Input

- **[Tap/Click](gestures/tap.md)** - Tap and click gesture detection
- **[Drag](gestures/drag.md)** - Drag gesture for moving entities
- **[Swipe](gestures/swipe.md)** - Swipe gesture for directional input

## UI Components

- **[Button](ui/button.md)** - Interactive button component with states
- **[NinePatch](ui/ninepatch.md)** - Scalable UI panels with 9-slice scaling

## Audio

- **[Sound Effects](audio/sound-effects.md)** - Playing sound effects
- **[Music](audio/music.md)** - Background music playback and looping
- **[Volume Control](audio/volume.md)** - Volume control and muting

## Utilities

- **[Easing Functions](utilities/easing.md)** - 31 easing functions for animations (easeInOut, bounce, elastic, etc.)
- **[Asset Loader](utilities/asset-loader.md)** - Loading and caching images
- **[Fonts](utilities/fonts.md)** - Loading Google Fonts and custom fonts
- **[Layout Helpers](utilities/layout.md)** - Grid, circle, row, and column layout utilities
- **[Math Utilities](utilities/math.md)** - clamp, lerp, random, distance, and angle calculations
- **[Storage](utilities/storage.md)** - LocalStorage wrapper for saving game data
- **[Timers](utilities/timers.md)** - Delay and interval utilities with auto-cleanup

## Advanced Features

- **[Collision Detection](advanced/collision-detection.md)** - Automatic AABB collision detection system with events

---

## Quick Navigation by Use Case

### Building a Game
1. Start with [Quickstart](getting-started/quickstart.md)
2. Configure your [Game](core/game.md) and [Scenes](core/scenes.md)
3. Add [Sprites](visual/sprites.md) or [Shapes](visual/shapes.md)
4. Implement [Gestures](gestures/tap.md) for interaction
5. Add [Collision Detection](advanced/collision-detection.md) for gameplay

### Adding Visual Polish
- [Tweening](animation/tweening.md) for smooth animations
- [Particles](animation/particles.md) for effects
- [Easing Functions](utilities/easing.md) for animation curves
- [Camera](core/camera.md) for shake and zoom effects

### Creating UI
- [Text](visual/text.md) for labels and scores
- [Button](ui/button.md) for interactive elements
- [NinePatch](ui/ninepatch.md) for scalable panels
- [Layout Helpers](utilities/layout.md) for positioning

### Adding Interactivity
- [Tap](gestures/tap.md) for buttons and selections
- [Drag](gestures/drag.md) for moving objects
- [Swipe](gestures/swipe.md) for directional controls
- [Collision Detection](advanced/collision-detection.md) for gameplay mechanics

### Managing Game State
- [Scenes](core/scenes.md) for different game screens
- [Storage](utilities/storage.md) for saving progress
- [Timers](utilities/timers.md) for game logic timing

---

## API Quick Reference

### Core Classes
- `Game` - Main game instance and loop
- `Scene` - Container for entities with lifecycle
- `Entity` - Base class for all game objects
- `Sprite` - Visual entities (images, shapes)
- `Text` - Text rendering
- `Camera` - Viewport control

### Common Patterns

**Create a game:**
```javascript
import { Game, Scene } from '@mode-7/zap';
const game = new Game({ parent: '#app', responsive: true });
const scene = new Scene({ backgroundColor: '#1a1a2e' });
game.setScene(scene);
game.start();
```

**Add a sprite:**
```javascript
const sprite = new Sprite({ x: 100, y: 100, width: 50, height: 50, color: '#ff0000' });
scene.add(sprite);
```

**Handle tap:**
```javascript
sprite.interactive = true;
sprite.on('tap', () => console.log('Tapped!'));
```

**Animate:**
```javascript
sprite.tween({ x: 200, rotation: Math.PI }, { duration: 1000, easing: 'easeInOutQuad' });
```

**Detect collisions:**
```javascript
sprite.checkCollisions = true;
sprite.collisionTags = ['enemy'];
sprite.on('collisionenter', (event) => console.log('Hit:', event.other));
```

---

## Version
This documentation is for **Zap v0.1.3**

Last updated: 2025-10-19
