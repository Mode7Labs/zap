---
title: Scenes
description: Organize your game with scenes and transitions
---

# Scenes

Scenes are containers for entities. Use them to organize different parts of your application like menus, gameplay, and results screens.

## Creating a Scene

Create a scene and add entities to it:

```javascript
import { Scene, Sprite } from '@mode-7/zap';

const scene = new Scene();

const sprite = new Sprite({
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  color: '#667eea'
});

scene.add(sprite);
```

## Adding Entities

Add entities with the `add()` method:

```javascript
scene.add(sprite);
scene.add(text);
scene.add(button);
```

Chain additions:

```javascript
scene
  .add(background)
  .add(player)
  .add(enemy)
  .add(ui);
```

## Background Images and Colors

The Scene constructor accepts `backgroundColor` and `backgroundImage` options for easy background setup:

### Solid Color Background

```javascript
const scene = new Scene({
  backgroundColor: '#1a1a2e'
});
```

### Image Background

```codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({
  parent: '#app',
  width: 1920,
  height: 1080,
  responsive: true
});

// Background image automatically fills the scene
const scene = new Scene({
  backgroundImage: 'background.jpg'
});

// Add entities on top
const player = new Sprite({
  x: game.width / 2,
  y: game.height / 2,
  width: 50,
  height: 50,
  color: '#e94560'
});

scene.add(player);
game.setScene(scene);
game.start();
```

The background image will automatically:
- Fill the entire game canvas (width × height)
- Stretch/scale to fit the game dimensions
- Render behind all entities (at `zIndex: -1000`)

**Note**: The image will stretch to fit your game's aspect ratio. For best results, use images that match your game's aspect ratio (e.g., 16:9 images for a 1920×1080 game).

## Removing Entities

Remove entities when no longer needed:

```javascript
scene.remove(sprite);
```

## Finding Entities

### Get All Entities

```javascript
const allEntities = scene.getEntities();
```

### Get by Tag

Tag your entities for easy retrieval:

```javascript
const player = new Sprite({ x: 100, y: 100 });
player.addTag('player');

const enemy1 = new Sprite({ x: 200, y: 100 });
enemy1.addTag('enemy');

const enemy2 = new Sprite({ x: 300, y: 100 });
enemy2.addTag('enemy');

scene.add(player).add(enemy1).add(enemy2);

// Find all enemies
const enemies = scene.getEntitiesByTag('enemy');
console.log(enemies.length); // 2
```

## Scene Lifecycle

Scenes have lifecycle methods you can override:

```javascript
class MenuScene extends Scene {
  onEnter() {
    console.log('Menu scene entered');
    // Setup menu, start animations
  }

  onExit() {
    console.log('Menu scene exited');
    // Cleanup, stop sounds
  }
}
```

Or use events:

```javascript
scene.on('enter', () => {
  console.log('Scene entered!');
});

scene.on('exit', () => {
  console.log('Scene exited!');
});
```

## Scene Transitions

Switch between scenes with smooth transitions:

```javascript
const menuScene = new Scene();
const gameScene = new Scene();

// Simple switch
game.setScene(gameScene);

// With fade transition
game.setScene(gameScene, {
  transition: 'fade',
  duration: 500
});

// With slide transition
game.setScene(gameScene, {
  transition: 'slide-left',
  duration: 300
});
```

Available transitions:
- `'fade'` - Fade to black then fade in
- `'slide-left'` - Slide left
- `'slide-right'` - Slide right
- `'slide-up'` - Slide up
- `'slide-down'` - Slide down

## Complete Example

Here's a simple multi-scene game:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

// Menu Scene
const menuScene = new Scene();

const menuTitle = new Text({
  x: 200,
  y: 100,
  text: 'TAP TO START',
  fontSize: 24,
  color: '#fff',
  align: 'center',
  anchorX: 0.5
});

menuScene.add(menuTitle);

// Game Scene
const gameScene = new Scene();

const player = new Sprite({
  x: 200,
  y: 150,
  width: 40,
  height: 40,
  color: '#e94560',
  interactive: true
});

player.on('tap', () => {
  player.tween(
    { rotation: player.rotation + Math.PI * 2 },
    { duration: 500 }
  );
});

gameScene.add(player);

// Setup menu interaction
menuTitle.interactive = true;
menuTitle.on('tap', () => {
  game.setScene(gameScene, {
    transition: 'fade',
    duration: 300
  });
});

// Start with menu
game.setScene(menuScene);
game.start();
```

## Scene Timers

Scenes provide timer methods that auto-cleanup on scene exit:

```javascript
// Delay execution
scene.delay(1000, () => {
  console.log('After 1 second');
});

// Repeat every interval
const handle = scene.interval(100, () => {
  console.log('Every 100ms');
});

// Clear interval
scene.clearTimer(handle);
```

Timers are automatically cleared when the scene exits.

## Best Practices

1. **One purpose per scene** - Each scene should represent one screen or state
2. **Clean up resources** - Use `onExit()` to stop sounds, clear timers
3. **Reuse scenes** - Scenes can be switched back to
4. **Entity pooling** - Reuse entities instead of creating/destroying constantly
5. **Tag entities** - Use tags for easy entity lookup

## Common Patterns

### Multi-Level Game

```javascript
class Level1 extends Scene {
  onEnter() {
    // Setup level 1
  }
}

class Level2 extends Scene {
  onEnter() {
    // Setup level 2
  }
}

const level1 = new Level1();
const level2 = new Level2();
```

### Menu System

```javascript
const mainMenu = new Scene();
const settingsMenu = new Scene();
const creditsMenu = new Scene();
```

### Pause Screen

```javascript
const gameScene = new Scene();
const pauseScene = new Scene();

// Switch to pause
game.setScene(pauseScene);

// Resume game
game.setScene(gameScene);
```

## Next Steps

- [Entities](/core/entities) - Learn about the entity system
- [Sprites](/visual/sprite) - Create visual elements
- [Text](/visual/text) - Add text to your scenes
