<div align="center">
  <img src="https://raw.githubusercontent.com/Mode7Labs/zap/main/assets/logo.png" alt="Zap Logo" width="180"/>

  # @mode-7/zap

  A **lightweight, gesture-first 2D game engine** for creating interactive demos and playable ads. Built with TypeScript, designed for simplicity and small bundle sizes.

  Perfect for: word games, match-3 games, card games, swipe mechanics, and interactive demos where touch/mouse interactions matter more than physics or AI.
</div>

## Features

- **Gesture-First Design** - Built-in tap, swipe, drag, and long-press recognition
- **Smooth Animations** - Powerful tweening system with 37 easing functions
- **Image Support** - Load remote images with automatic sizing and CORS support
- **Google Fonts Integration** - Dynamically load any Google Font
- **Collision Detection** - Automatic AABB collision system with events
- **Audio System** - Sound effects and music with volume control
- **Camera Controls** - Follow entities, zoom, and shake effects
- **Responsive Design** - Automatic canvas scaling for any screen size
- **Scene Management** - Scene transitions, backgrounds, and lifecycle hooks
- **Particle Effects** - Emitters and burst particles for visual polish
- **UI Components** - Button, NinePatch panels, touch trails
- **Layout Helpers** - Grid, circle, row/column positioning utilities
- **Timer Utilities** - Delay and interval with automatic cleanup
- **Storage API** - LocalStorage wrapper for saving game data
- **Math Utilities** - clamp, lerp, random, distance, angle calculations
- **Lightweight** - Zero dependencies, tree-shakeable, ~15KB minified + gzipped
- **TypeScript Native** - Full type safety and IntelliSense support

## Installation

```bash
npm install @mode-7/zap
```

## Quick Start

```typescript
import { Game, Scene, Sprite } from '@mode-7/zap';

// Create a game
const game = new Game({
  width: 800,
  height: 600,
  backgroundColor: '#0f3460'
});

// Create a scene
const scene = new Scene();

// Create an interactive card
const card = new Sprite({
  x: 400,
  y: 300,
  width: 100,
  height: 140,
  color: '#e94560',
  radius: 8,
  interactive: true,
});

// Add tap interaction
card.on('tap', () => {
  card.tween(
    { rotation: Math.PI, scaleX: 1.2, scaleY: 1.2 },
    { duration: 300, easing: 'easeOutBack' }
  );
});

// Add to scene and start
scene.add(card);
game.setScene(scene);
game.start();
```

## Core Concepts

### Game

The main game instance manages the canvas, game loop, and scenes.

```typescript
const game = new Game({
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  parent: '#game-container', // Optional: selector or element
  responsive: true, // Optional: auto-scale to fit screen
  pixelRatio: 2, // Optional: defaults to window.devicePixelRatio
  antialias: true, // Optional: defaults to true
  enableTouchTrail: true, // Optional: visual touch/mouse trail
});

game.start(); // Start the game loop
game.stop(); // Stop the game loop
game.setScene(scene); // Switch to a different scene
```

### Scene

Scenes contain and manage entities. Use scenes for different game states (menu, gameplay, game over).

```typescript
const scene = new Scene({
  backgroundColor: '#0f3460', // Optional: solid background color
  backgroundImage: 'assets/bg.png', // Optional: image background
});

scene.add(entity); // Add an entity
scene.remove(entity); // Remove an entity
scene.getEntities(); // Get all entities
scene.getEntitiesByTag('enemy'); // Get entities by tag

// Lifecycle hooks
scene.on('enter', () => console.log('Scene entered'));
scene.on('exit', () => console.log('Scene exited'));
```

### Entities

Base class for all game objects. Entities support transform hierarchy, tags, and events.

```typescript
import { Entity } from '@mode-7/zap';

const entity = new Entity({
  x: 100,
  y: 100,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  alpha: 1,
  width: 50,
  height: 50,
  anchorX: 0.5, // 0-1, default 0.5 (center)
  anchorY: 0.5,
  interactive: false,
  visible: true,
});

// Transform hierarchy
entity.addChild(childEntity);
entity.removeChild(childEntity);

// Tags for grouping
entity.addTag('enemy');
entity.hasTag('enemy');

// Position
entity.getWorldPosition(); // Get absolute position
entity.containsPoint(x, y); // Check if point is inside entity
```

### Sprite

Visual entity for rendering images or colored shapes.

```typescript
import { Sprite } from '@mode-7/zap';

// Colored rectangle
const rect = new Sprite({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  color: '#ff0000',
  radius: 10, // Rounded corners
});

// Image sprite (supports remote URLs!)
const sprite = new Sprite({
  x: 200,
  y: 200,
  width: 64,
  height: 64,
  image: 'https://example.com/image.png', // Auto-loads
  radius: 32 // Optional: circular crop
});

// Listen for image load
sprite.on('imageload', (img) => {
  console.log('Image loaded:', img.width, img.height);
});

// Or load manually
await sprite.loadImage('path/to/image.png');
```

### Text

Text rendering entity with Google Fonts support.

```typescript
import { Text, loadGoogleFont } from '@mode-7/zap';

// Load a Google Font first
await loadGoogleFont('Poppins', [400, 700]);

const text = new Text({
  text: 'Hello World',
  x: 400,
  y: 300,
  fontSize: 32,
  fontFamily: 'Poppins, sans-serif', // Use loaded font
  color: '#ffffff',
  align: 'center', // 'left' | 'center' | 'right'
  baseline: 'middle', // 'top' | 'middle' | 'bottom' | 'alphabetic'
});

// Load multiple fonts at once
import { loadGoogleFonts } from '@mode-7/zap';

await loadGoogleFonts([
  { family: 'Roboto', weights: [400, 700] },
  { family: 'Montserrat', weights: [600] }
]);
```

## Gestures

Zap includes powerful gesture recognition out of the box.

### Available Gestures

- `tap` - Quick touch/click
- `longpress` - Press and hold
- `swipe` - Fast directional movement
- `drag` - Move while pressed
- `dragstart` - Drag begins
- `dragend` - Drag ends

### Using Gestures

```typescript
const card = new Sprite({
  // ... options
  interactive: true, // Must be true for gestures
});

// Tap
card.on('tap', (event) => {
  console.log('Tapped at', event.position);
});

// Swipe with direction
card.on('swipe', (event) => {
  console.log('Swiped', event.direction); // 'up' | 'down' | 'left' | 'right'
  console.log('Velocity', event.velocity);
  console.log('Distance', event.distance);
});

// Drag
card.on('dragstart', (event) => {
  console.log('Drag started');
});

card.on('drag', (event) => {
  // Move card with drag
  card.x += event.delta.x;
  card.y += event.delta.y;
});

card.on('dragend', (event) => {
  console.log('Drag ended');
});

// Long press
card.on('longpress', (event) => {
  console.log('Long press detected');
});
```

## Animations

Smooth, easy-to-use tweening system.

```typescript
// Simple tween
entity.tween(
  { x: 400, y: 300, rotation: Math.PI },
  { duration: 1000, easing: 'easeOutQuad' }
);

// With callbacks
entity.tween(
  { alpha: 0 },
  {
    duration: 500,
    delay: 200,
    easing: 'easeInOutQuad',
    onUpdate: (progress) => {
      console.log('Progress:', progress);
    },
    onComplete: () => {
      console.log('Animation complete!');
      entity.destroy();
    }
  }
);
```

### Easing Functions

Available easing functions:

- `linear`
- `easeIn`, `easeOut`, `easeInOut` (shortcuts for Quad)
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- `easeInQuint`, `easeOutQuint`, `easeInOutQuint`
- `easeInSine`, `easeOutSine`, `easeInOutSine`
- `easeInExpo`, `easeOutExpo`, `easeInOutExpo`
- `easeInCirc`, `easeOutCirc`, `easeInOutCirc`
- `easeInBack`, `easeOutBack`, `easeInOutBack`
- `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
- `easeInBounce`, `easeOutBounce`, `easeInOutBounce`

You can also pass custom easing functions:

```typescript
entity.tween(
  { x: 400 },
  {
    duration: 1000,
    easing: (t) => t * t * t // Custom cubic easing
  }
);
```

## Particles

Add visual polish with particles.

```typescript
import { ParticleEmitter } from '@mode-7/zap';

const emitter = new ParticleEmitter({
  x: 400,
  y: 300,
  rate: 20, // Particles per second
  colors: ['#ff0000', '#00ff00', '#0000ff'],
  sizeRange: { min: 2, max: 6 },
  lifetimeRange: { min: 0.5, max: 1.5 },
  velocityRange: {
    min: { x: -100, y: -100 },
    max: { x: 100, y: 100 },
  },
});

scene.add(emitter);

// Or burst particles all at once
emitter.burst(50);
```

## Layout Helpers

Utilities for positioning entities.

```typescript
import { Layout } from '@mode-7/zap';

// Grid layout
Layout.layoutGrid(entities, {
  columns: 3,
  rows: 3,
  cellWidth: 100,
  cellHeight: 100,
  spacing: 10,
  startX: 50,
  startY: 50,
});

// Circle layout
Layout.layoutCircle(entities, centerX, centerY, radius, startAngle);

// Row layout
Layout.layoutRow(entities, startX, y, spacing);

// Column layout
Layout.layoutColumn(entities, x, startY, spacing);

// Center on screen
Layout.center(entity, game.width, game.height);
```

### Utility Functions

```typescript
import { Layout } from '@mode-7/zap';

// Math utilities
Layout.clamp(value, min, max);
Layout.lerp(start, end, t);
Layout.map(value, inMin, inMax, outMin, outMax);

// Random utilities
Layout.randomInt(min, max);
Layout.randomFloat(min, max);
Layout.randomItem(array);
```

## Collision Detection

Advanced collision system with automatic event-driven detection and physics response.

**Features:**
- **Continuous Collision Detection (CCD)** - Prevents tunneling at high speeds
- **SAT for rotated rectangles** - Accurate collision for rotated objects
- **Symmetric detection** - Both entities receive events regardless of order
- **Circle and rectangle collision** - Automatic shape detection
- **Physics integration** - Automatic separation and bounce response

```typescript
// Enable collision detection on an entity
const player = new Sprite({
  x: 100, y: 100,
  width: 50, height: 50,
  checkCollisions: true, // Enable automatic collision checking
  collisionTags: ['enemy', 'coin'], // Only collide with these tags
  bounciness: 0.8, // Optional: bounce energy retention
  static: false, // Dynamic object (can move)
});

const wall = new Sprite({
  x: 400, y: 300,
  width: 20, height: 600,
  checkCollisions: true,
  static: true, // Static object (immovable)
});

// Listen for collision events
player.on('collisionenter', (event) => {
  console.log('Hit:', event.other);
  if (event.other.hasTag('coin')) {
    score += 10;
    event.other.destroy();
  }
});

player.on('collide', (event) => {
  // Fires every frame while colliding
  console.log('Still colliding with:', event.other);
});

player.on('collisionexit', (event) => {
  console.log('Stopped colliding with:', event.other);
});

// Manual collision checks
if (entity1.intersects(entity2)) {
  console.log('Entities overlap');
}

// Utility methods
entity.distanceTo(other);     // Distance between entities
entity.getBounds();           // { left, right, top, bottom }
entity.containsPoint(x, y);   // Check if point is inside
```

## Physics

Realistic physics simulation with velocity, gravity, friction, and force application.

```typescript
const ball = new Sprite({
  x: 200, y: 100,
  width: 30, height: 30,
  radius: 15,
  vx: 100,        // Horizontal velocity (pixels/sec)
  vy: 0,          // Vertical velocity (pixels/sec)
  gravity: 980,   // Gravity acceleration (pixels/sec²)
  friction: 0.99, // Velocity decay (0-1)
  bounciness: 0.8,// Bounce energy retention
  mass: 1,        // Mass for force calculations
  checkCollisions: true,
});

// Apply forces (F=ma physics)
ball.applyForce(500, -1000); // Push right and up

scene.on('update', () => {
  // Continuous force application
  if (keys['arrowleft']) ball.applyForce(-800, 0);
  if (keys['arrowright']) ball.applyForce(800, 0);
});

// Bounce off surfaces
ball.bounce(normalX, normalY, restitution);
```

## Asset Loading

Simple asset loading and caching.

```typescript
import { assetLoader } from '@mode-7/zap';

// Load single image (supports remote URLs)
await assetLoader.loadImage('player', 'https://example.com/player.png');

// Load multiple images
await assetLoader.loadImages({
  player: 'assets/player.png',
  enemy: 'assets/enemy.png',
  background: 'https://cdn.example.com/bg.png', // Remote URLs work!
});

// Get loaded image
const playerImg = assetLoader.getImage('player');

// Use with sprite
const sprite = new Sprite({
  image: assetLoader.getImage('player'),
  width: 64,
  height: 64,
});
```

## Audio

Play sound effects and music with the built-in audio system.

```typescript
import { audioManager } from '@mode-7/zap';

// Play a sound effect
audioManager.playSound('coin', 'assets/coin.mp3');

// Play background music (loops automatically)
audioManager.playMusic('assets/music.mp3');

// Control volume (0-1)
audioManager.setMusicVolume(0.5);
audioManager.setSoundVolume(0.8);

// Mute/unmute
audioManager.muteMusic();
audioManager.unmuteMusic();
audioManager.muteSound();
audioManager.unmuteSound();

// Stop music
audioManager.stopMusic();
```

## Camera

Camera controls for following entities, zooming, and screen shake effects.

```typescript
import { Camera } from '@mode-7/zap';

const camera = new Camera(game.width, game.height);

// Follow an entity
camera.follow(player);

// Zoom
camera.zoom = 2.0; // 2x zoom
camera.zoom = 0.5; // Zoom out

// Screen shake
camera.shake(300, 10); // duration 300ms, intensity 10

// Manual positioning
camera.x = 100;
camera.y = 100;
```

## Timers

Delay and interval utilities with automatic cleanup.

```typescript
import { delay, interval, wait } from '@mode-7/zap';

// Delay execution
delay(1000, () => {
  console.log('1 second later');
});

// Repeat every interval
const timer = interval(100, () => {
  console.log('Every 100ms');
});

// Stop interval
timer.cancel();

// Wait (returns promise)
await wait(2000);
console.log('2 seconds later');
```

## Storage

LocalStorage wrapper for saving game data.

```typescript
import { Storage } from '@mode-7/zap';

const storage = new Storage('my-game'); // Prefix for keys

// Save data
storage.set('highScore', 1000);
storage.set('playerName', 'Alice');
storage.set('settings', { music: true, sound: false });

// Load data
const highScore = storage.get('highScore', 0); // Default value: 0
const settings = storage.get('settings', {});

// Check if key exists
if (storage.has('playerName')) {
  console.log('Player name saved');
}

// Remove data
storage.remove('highScore');

// Clear all
storage.clear();
```

## Documentation & Examples

Visit the [**Interactive Documentation**](https://mode7labs.github.io/zap/) with runnable examples:

- 📚 Complete API documentation
- ⚡ 31 interactive guides with code examples
- 🎮 Live playground with AI-powered code generation
- 📖 Searchable documentation index
- 💡 Copy-paste ready code snippets

**For AI Assistants:** Documentation index at `https://mode7labs.github.io/zap/docs/api-docs.json`

Run locally:
```bash
npm run docs
```

## Bundle Size

Zap is designed to be lightweight:

- Core library: ~15KB minified + gzipped
- Zero dependencies
- Tree-shakeable - only import what you use

## Browser Support

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## TypeScript

Zap is written in TypeScript and includes full type definitions. No need for `@types` packages!

```typescript
import type { GameOptions, Entity, GestureEvent } from '@mode-7/zap';
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

---

Made with care for interactive demos and playable ads.
