---
title: Asset Loader
description: Load and cache images efficiently
---

# Asset Loader

The AssetLoader efficiently loads and caches images, preventing duplicate requests and managing loading states. It provides both single and batch loading capabilities.

## Global Asset Loader

Zap provides a global asset loader instance:

```javascript
import { assetLoader } from '@mode-7/zap';

// Load an image
await assetLoader.loadImage('player', '/images/player.png');

// Get the loaded image
const playerImage = assetLoader.getImage('player');
```

## Load Single Image

Load one image at a time:

```codemirror
import { Game, Scene, Sprite, assetLoader } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Load image before using it
assetLoader.loadImage('robot', '../assets/robot.png').then(() => {
  const sprite = new Sprite({
    x: 200,
    y: 150,
    width: 64,
    height: 64,
    image: assetLoader.getImage('robot')
  });

  scene.add(sprite);
});

game.setScene(scene);
game.start();
```

## Load Multiple Images

Batch load several images at once:

```javascript
import { assetLoader } from '@mode-7/zap';

await assetLoader.loadImages({
  player: '/images/player.png',
  enemy: '/images/enemy.png',
  background: '/images/background.png',
  coin: '/images/coin.png'
});

// All images are now loaded and cached
const playerImg = assetLoader.getImage('player');
const enemyImg = assetLoader.getImage('enemy');
```

## Loading Screen

Create a loading screen before starting your game:

```codemirror
import { Game, Scene, Sprite, Text, assetLoader } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

// Loading scene
const loadingScene = new Scene();

const loadingText = new Text({
  text: 'Loading...',
  x: 200,
  y: 150,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
});

loadingScene.add(loadingText);
game.setScene(loadingScene);
game.start();

// Load all assets
assetLoader.loadImages({
  player: '../assets/player.png',
  enemy: '../assets/enemy.png',
  background: '../assets/background.png'
}).then(() => {
  // Switch to game scene
  const gameScene = new Scene();

  const player = new Sprite({
    x: 200,
    y: 150,
    width: 64,
    height: 64,
    image: assetLoader.getImage('player')
  });

  gameScene.add(player);
  game.setScene(gameScene);
});
```

## Progress Tracking

Track loading progress:

```javascript
const assets = {
  player: '/images/player.png',
  enemy1: '/images/enemy1.png',
  enemy2: '/images/enemy2.png',
  background: '/images/background.png'
};

const total = Object.keys(assets).length;
let loaded = 0;

// Load with progress tracking
const promises = Object.entries(assets).map(async ([key, url]) => {
  const image = await assetLoader.loadImage(key, url);
  loaded++;

  // Update progress
  const progress = (loaded / total) * 100;
  console.log(`Loading: ${progress}%`);
  loadingText.text = `Loading: ${Math.floor(progress)}%`;

  return image;
});

await Promise.all(promises);
```

## Check if Loaded

Check whether an asset is already loaded:

```javascript
if (assetLoader.hasImage('player')) {
  // Image is loaded, safe to use
  const playerImg = assetLoader.getImage('player');
  sprite.image = playerImg;
} else {
  // Need to load first
  await assetLoader.loadImage('player', '/images/player.png');
  sprite.image = assetLoader.getImage('player');
}
```

## Preload Assets

Load all assets before game starts:

```javascript
async function preloadAssets() {
  await assetLoader.loadImages({
    // Characters
    player: '/images/player.png',
    enemy: '/images/enemy.png',
    boss: '/images/boss.png',

    // Environment
    background: '/images/background.png',
    ground: '/images/ground.png',
    platform: '/images/platform.png',

    // Items
    coin: '/images/coin.png',
    powerup: '/images/powerup.png',
    heart: '/images/heart.png',

    // UI
    button: '/images/button.png',
    panel: '/images/panel.png'
  });
}

// Preload before starting
await preloadAssets();
game.start();
```

## Custom Asset Loader

Create your own AssetLoader instance for specific purposes:

```javascript
import { AssetLoader } from '@mode-7/zap';

// Separate loader for level 1 assets
const level1Loader = new AssetLoader();

await level1Loader.loadImages({
  enemy1: '/levels/1/enemy1.png',
  enemy2: '/levels/1/enemy2.png',
  background: '/levels/1/background.png'
});

// Later, clear level 1 assets
level1Loader.clear();

// Load level 2 assets
await level1Loader.loadImages({
  enemy1: '/levels/2/enemy1.png',
  enemy2: '/levels/2/enemy2.png',
  background: '/levels/2/background.png'
});
```

## Common Patterns

### Lazy Loading

Load assets only when needed:

```javascript
async function showLevel(levelNumber) {
  // Show loading
  loadingText.visible = true;

  // Load level-specific assets
  await assetLoader.loadImages({
    background: `/levels/${levelNumber}/bg.png`,
    enemies: `/levels/${levelNumber}/enemies.png`,
    tileset: `/levels/${levelNumber}/tiles.png`
  });

  // Hide loading
  loadingText.visible = false;

  // Start level
  startLevel(levelNumber);
}
```

### Asset Management by Scene

Load and unload assets per scene:

```javascript
class MenuScene extends Scene {
  async load() {
    await assetLoader.loadImages({
      logo: '/menu/logo.png',
      button: '/menu/button.png',
      background: '/menu/background.png'
    });
  }
}

class GameScene extends Scene {
  async load() {
    await assetLoader.loadImages({
      player: '/game/player.png',
      enemies: '/game/enemies.png',
      tileset: '/game/tileset.png'
    });
  }
}

// Load menu assets
await menuScene.load();
game.setScene(menuScene);

// Later, switch to game
await gameScene.load();
game.setScene(gameScene);
```

### Retry Failed Loads

Handle and retry failed image loads:

```javascript
async function loadWithRetry(key, url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await assetLoader.loadImage(key, url);
      return;
    } catch (error) {
      console.log(`Failed to load ${key}, retry ${i + 1}/${maxRetries}`);

      if (i === maxRetries - 1) {
        throw error;  // Final retry failed
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Usage
try {
  await loadWithRetry('player', '/images/player.png');
} catch (error) {
  console.error('Failed to load player image after retries');
}
```

### Loading Screen with Animation

Animated loading indicator:

```javascript
const loadingScene = new Scene();

const loadingText = new Text({
  text: 'Loading',
  x: 200,
  y: 140,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
});

const progressBar = new Sprite({
  x: 200,
  y: 180,
  width: 0,  // Start at 0
  height: 10,
  color: '#51cf66'
});

loadingScene.add(loadingText);
loadingScene.add(progressBar);

game.setScene(loadingScene);
game.start();

// Load with progress
const assets = { /* ... */ };
const total = Object.keys(assets).length;
let loaded = 0;

const promises = Object.entries(assets).map(async ([key, url]) => {
  await assetLoader.loadImage(key, url);
  loaded++;

  const progress = loaded / total;
  loadingText.text = `Loading ${loaded}/${total}`;
  progressBar.width = 300 * progress;
});

await Promise.all(promises);

// Fade out loading screen
await loadingText.tween({ alpha: 0 }, { duration: 300 });
await progressBar.tween({ alpha: 0 }, { duration: 300 });

// Show game
game.setScene(gameScene);
```

### Asset Groups

Organize assets into logical groups:

```javascript
const assetGroups = {
  characters: {
    player: '/images/player.png',
    enemy1: '/images/enemy1.png',
    enemy2: '/images/enemy2.png'
  },

  environment: {
    background: '/images/background.png',
    ground: '/images/ground.png',
    trees: '/images/trees.png'
  },

  ui: {
    button: '/ui/button.png',
    panel: '/ui/panel.png',
    heart: '/ui/heart.png'
  }
};

// Load specific group
async function loadGroup(groupName) {
  const group = assetGroups[groupName];
  if (group) {
    await assetLoader.loadImages(group);
    console.log(`${groupName} loaded`);
  }
}

// Load multiple groups
await loadGroup('characters');
await loadGroup('environment');
await loadGroup('ui');
```

## Error Handling

Handle loading errors gracefully:

```javascript
try {
  await assetLoader.loadImage('player', '/images/player.png');
} catch (error) {
  console.error('Failed to load player image:', error);

  // Use placeholder or default
  const fallbackSprite = new Sprite({
    x: 200, y: 150,
    width: 64, height: 64,
    color: '#e94560'  // Red placeholder
  });

  scene.add(fallbackSprite);
}
```

## Caching Behavior

The AssetLoader automatically caches loaded images:

```javascript
// First call: loads from network
await assetLoader.loadImage('player', '/images/player.png');

// Second call: returns cached image instantly
await assetLoader.loadImage('player', '/images/player.png');

// Multiple simultaneous calls: only one network request
const promise1 = assetLoader.loadImage('enemy', '/images/enemy.png');
const promise2 = assetLoader.loadImage('enemy', '/images/enemy.png');
const promise3 = assetLoader.loadImage('enemy', '/images/enemy.png');

// All three promises resolve to the same image
await Promise.all([promise1, promise2, promise3]);
```

## Clear Cache

Clear cached assets to free memory:

```javascript
// Clear all assets
assetLoader.clear();

// Or use a custom loader per level
const level1Loader = new AssetLoader();
await level1Loader.loadImages({ /* level 1 assets */ });

// When level ends, clear
level1Loader.clear();
```

## API Reference

### `loadImage(key, url)`

Load a single image.

**Parameters**:
- `key` (string) - Unique identifier for the image
- `url` (string) - Path to the image file

**Returns**: Promise<HTMLImageElement>

```javascript
await assetLoader.loadImage('player', '/images/player.png');
```

### `loadImages(assets)`

Load multiple images at once.

**Parameters**:
- `assets` (object) - Key-value pairs of identifiers and URLs

**Returns**: Promise<void>

```javascript
await assetLoader.loadImages({
  player: '/images/player.png',
  enemy: '/images/enemy.png'
});
```

### `getImage(key)`

Get a loaded image by key.

**Parameters**:
- `key` (string) - Image identifier

**Returns**: HTMLImageElement | null

```javascript
const image = assetLoader.getImage('player');
```

### `hasImage(key)`

Check if an image is loaded.

**Parameters**:
- `key` (string) - Image identifier

**Returns**: boolean

```javascript
if (assetLoader.hasImage('player')) {
  // Image is loaded
}
```

### `clear()`

Clear all loaded assets.

**Returns**: void

```javascript
assetLoader.clear();
```

## Performance Tips

- **Preload critical assets**: Load essential images before game starts
- **Lazy load level assets**: Load level-specific assets only when needed
- **Use asset groups**: Organize assets logically for easier management
- **Clear unused assets**: Free memory by clearing assets from completed levels
- **Batch load**: Use `loadImages()` for better parallelization
- **Cache appropriately**: Let AssetLoader cache, don't load same image twice

## Common Mistakes

### Not awaiting load

```javascript
// ❌ Wrong - image not loaded yet
assetLoader.loadImage('player', '/images/player.png');
const sprite = new Sprite({ image: assetLoader.getImage('player') });

// ✅ Right - wait for load to complete
await assetLoader.loadImage('player', '/images/player.png');
const sprite = new Sprite({ image: assetLoader.getImage('player') });
```

### Using URL instead of loaded image

```javascript
// ❌ Wrong - passing URL string
const sprite = new Sprite({ image: '/images/player.png' });

// ✅ Right - pass loaded HTMLImageElement
await assetLoader.loadImage('player', '/images/player.png');
const sprite = new Sprite({ image: assetLoader.getImage('player') });
```

### Forgetting to handle errors

```javascript
// ❌ Wrong - unhandled errors crash game
await assetLoader.loadImage('player', '/images/player.png');

// ✅ Right - graceful error handling
try {
  await assetLoader.loadImage('player', '/images/player.png');
} catch (error) {
  console.error('Failed to load player:', error);
  // Use fallback
}
```

## Tips

- **Load before use** - Always await loading before creating sprites
- **Show loading feedback** - Users expect visual feedback during loads
- **Handle errors** - Network can fail, always catch errors
- **Organize by key** - Use descriptive, consistent naming for keys
- **Clear when done** - Free memory by clearing unused assets
- **Preload smartly** - Balance between preloading and lazy loading

## Next Steps

- [Sprites](/visual/sprites) - Using loaded images with sprites
- [Sprite Animation](/visual/sprite-animation) - Animating sprite sheets
- [Scenes](/core/scenes) - Managing asset loading per scene
