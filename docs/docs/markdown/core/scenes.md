---
title: Scenes
description: Organize your game with scenes and transitions
---

# Scenes

Scenes are containers for [entities](/core/entities). Use them to organize different parts of your application like menus, gameplay, and results screens. Each scene manages its own set of entities, timers, and lifecycle events.

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

## Scene Options

Scenes can be configured with background options:

### backgroundColor

Set a solid color background for the scene.

```javascript
const scene = new Scene({
  backgroundColor: '#1a1a2e'
});
```

The background automatically fills the entire game canvas at `zIndex: -1000`.

**Default:** `undefined` (no background)

### backgroundImage

Set an image background for the scene.

```javascript
const scene = new Scene({
  backgroundImage: '../assets/bg.jpg'
});

// Or use a loaded HTMLImageElement
const img = new Image();
img.src = '../assets/bg.jpg';
const scene = new Scene({
  backgroundImage: img
});
```

The background image will:
- Fill the entire game canvas
- Stretch/scale to fit the game dimensions
- Render behind all entities at `zIndex: -1000`

**Note:** Images stretch to fit the canvas. For best results, use images matching your game's aspect ratio.

**Default:** `undefined` (no background)

## Scene Methods

### add()

Add an [entity](/core/entities) to the scene. Returns `this` for chaining.

```javascript
scene.add(sprite);

// Chain multiple additions
scene
  .add(background)
  .add(player)
  .add(enemy);
```

Emits `'entityadded'` event.

### remove()

Remove an entity from the scene. Returns `this` for chaining.

```javascript
scene.remove(sprite);
```

Emits `'entityremoved'` event.

### getEntities()

Get all entities in the scene.

```javascript
const allEntities = scene.getEntities();
console.log(`Scene has ${allEntities.length} entities`);
```

Returns an array of `Entity` objects.

### getEntitiesByTag()

Get all entities with a specific tag. See [entity tagging](/core/entities#tags) for details.

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

Returns an array of entities with the specified tag.

### delay()

Execute a callback after a delay. The timer is automatically cleaned up when the scene exits.

```javascript
scene.delay(1000, () => {
  console.log('1 second elapsed');
});

// Store handle to cancel early
const handle = scene.delay(2000, () => {
  console.log('This might not run');
});
handle.cancel(); // Cancel the timer
```

**Parameters:**
- `ms` - Delay in milliseconds
- `callback` - Function to execute

Returns a `TimerHandle` with a `cancel()` method.

See [Timer utilities](/utilities/timers) for more details.

### interval()

Execute a callback repeatedly at an interval. The timer is automatically cleaned up when the scene exits.

```javascript
const handle = scene.interval(100, () => {
  console.log('Every 100ms');
});

// Stop the interval
handle.cancel();
```

**Parameters:**
- `ms` - Interval in milliseconds
- `callback` - Function to execute repeatedly

Returns a `TimerHandle` with a `cancel()` method.

See [Timer utilities](/utilities/timers) for more details.

### clear()

Remove all entities from the scene.

```javascript
scene.clear();
```

This calls `remove()` on each entity but does not destroy them.

### getGame()

Get the [Game](/core/game) instance this scene is attached to.

```javascript
const game = scene.getGame();
if (game) {
  console.log(`Game is ${game.width}x${game.height}`);
}
```

Returns `Game | null` (null if scene not yet added to a game).

### destroy()

Clean up the scene. Cancels all timers, removes all entities, and clears event listeners.

```javascript
scene.destroy();
```

## Lifecycle Methods

Extend `Scene` to override lifecycle methods:

### onEnter()

Called when the scene becomes active.

```javascript
class MenuScene extends Scene {
  onEnter() {
    console.log('Menu scene entered');
    // Setup menu, start animations, play music
  }
}
```

### onExit()

Called when the scene becomes inactive.

```javascript
class MenuScene extends Scene {
  onExit() {
    console.log('Menu scene exited');
    // Cleanup, stop sounds, pause animations
  }
}
```

## Scene Events

The `Scene` class extends [`EventEmitter`](/core/architecture#event-system). Listen for events with `scene.on()`:

### Lifecycle Events

```javascript
scene.on('enter', () => {
  console.log('Scene entered!');
});

scene.on('exit', () => {
  console.log('Scene exited!');
});
```

### Entity Events

```javascript
scene.on('entityadded', (entity) => {
  console.log('Entity added:', entity);
});

scene.on('entityremoved', (entity) => {
  console.log('Entity removed:', entity);
});
```

### Frame Events

```javascript
scene.on('update', (deltaTime) => {
  // Called every frame
  // deltaTime is in seconds (e.g., 0.016 for 60 FPS)
});

scene.on('render', (ctx) => {
  // Called after rendering
  // ctx is the CanvasRenderingContext2D
});
```

## Scene Transitions

Switch between scenes using [`game.setScene()`](/core/game#setscene). Optionally specify a transition effect.

```javascript
const menuScene = new Scene();
const gameScene = new Scene();

// Instant switch
game.setScene(gameScene);

// With fade transition
await game.setScene(gameScene, {
  transition: 'fade',
  duration: 500
});

// With slide transition
await game.setScene(gameScene, {
  transition: 'slide-left',
  duration: 300
});
```

**Available transitions:**
- `'fade'` - Fade to black then fade in
- `'slide-left'` - Slide left
- `'slide-right'` - Slide right
- `'slide-up'` - Slide up
- `'slide-down'` - Slide down

`setScene()` returns a `Promise` that resolves when the transition completes. See [Game Configuration](/core/game#setscene) for details.

## Scene Timers

Scene timers are a convenient way to schedule delayed or repeated actions that automatically clean up when the scene exits.

```javascript
class GameScene extends Scene {
  onEnter() {
    // Spawn enemy every 2 seconds
    this.interval(2000, () => {
      this.spawnEnemy();
    });

    // Show warning after 10 seconds
    this.delay(10000, () => {
      this.showWarning();
    });
  }

  spawnEnemy() {
    // ...
  }

  showWarning() {
    // ...
  }
}
```

All timers are automatically cancelled when:
- The scene exits via `onExit()`
- The scene is destroyed via `destroy()`

**See also:** [Timer utilities](/utilities/timers) for standalone timer functions.

## Best Practices

1. **One purpose per scene** - Each scene should represent one screen or state (menu, gameplay, settings, etc.)
2. **Clean up resources** - Use `onExit()` to stop [sounds](/audio/music), clear timers, and pause [animations](/animation/tweening)
3. **Reuse scenes** - Scenes can be switched back to without recreating them
4. **Entity pooling** - Reuse entities instead of creating/destroying constantly for better performance
5. **Tag entities** - Use [entity tags](/core/entities#tags) for easy lookup (e.g., `'enemy'`, `'bullet'`, `'powerup'`)
6. **Background images** - Match your game's aspect ratio to avoid stretching

## Common Patterns

### Multi-Level Game

```javascript
class Level1 extends Scene {
  onEnter() {
    // Setup level 1 entities, enemies, platforms
    this.setupLevel1();
  }

  onExit() {
    // Clean up level-specific timers
  }

  setupLevel1() {
    // Add entities for level 1
  }
}

class Level2 extends Scene {
  onEnter() {
    this.setupLevel2();
  }

  setupLevel2() {
    // Add entities for level 2
  }
}

const level1 = new Level1();
const level2 = new Level2();

// Start with level 1
game.setScene(level1);

// Later, transition to level 2
await game.setScene(level2, {
  transition: 'fade',
  duration: 500
});
```

### Menu System

```javascript
const mainMenu = new Scene({ backgroundColor: '#0f3460' });
const settingsMenu = new Scene({ backgroundColor: '#16213e' });
const creditsMenu = new Scene({ backgroundColor: '#1a1a2e' });

// Setup menu buttons and navigation between scenes
```

### Pause Screen

```javascript
const gameScene = new Scene();
const pauseScene = new Scene({ backgroundColor: 'rgba(0, 0, 0, 0.7)' });

// Pause game
game.setScene(pauseScene);

// Resume game
game.setScene(gameScene);
```

### Entity Tagging

```javascript
// Tag entities for easy retrieval
const player = new Sprite({ x: 100, y: 100 });
player.addTag('player');

const enemy1 = new Sprite({ x: 200, y: 100 });
enemy1.addTag('enemy');
enemy1.addTag('ground');

const enemy2 = new Sprite({ x: 300, y: 100 });
enemy2.addTag('enemy');
enemy2.addTag('flying');

scene.add(player).add(enemy1).add(enemy2);

// Later, find all enemies
const allEnemies = scene.getEntitiesByTag('enemy');
allEnemies.forEach(enemy => {
  // AI logic for all enemies
});

// Find only ground enemies
const groundEnemies = scene.getEntitiesByTag('ground');

// Find the player
const players = scene.getEntitiesByTag('player');
const player = players[0];
```

## Complete Example

Here's a simple two-scene game with a menu and gameplay:

```javascript
import { Game, Scene, Sprite, Text } from '@mode-7/zap';

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
  align: 'center'
});

menuTitle.interactive = true;
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

// Menu interaction - switch to game scene
menuTitle.on('tap', async () => {
  await game.setScene(gameScene, {
    transition: 'fade',
    duration: 300
  });
});

// Start with menu
game.setScene(menuScene);
game.start();
```

## Next Steps

- [Entities](/core/entities) - Learn about the entity system
- [Game Configuration](/core/game) - Configure your game instance
- [Sprites](/visual/sprites) - Create visual elements
- [Text](/visual/text) - Add text to scenes
- [Timers](/utilities/timers) - Advanced timer utilities
