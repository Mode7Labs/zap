<div align="center">
  <img src="https://files.reimage.dev/reimage/bbdc36e9ed1e/original.png" alt="Zap Logo" width="180"/>

  # @mode7/zap

  A **lightweight, gesture-first 2D game engine** for creating interactive demos and playable ads. Built with TypeScript, designed for simplicity and small bundle sizes.

  Perfect for: word games, match-3 games, card games, swipe mechanics, and interactive demos where touch/mouse interactions matter more than physics or AI.
</div>

## Features

- **Gesture-First Design** - Built-in tap, swipe, drag, and long-press recognition
- **Smooth Animations** - Powerful tweening system with 30+ easing functions
- **Image Support** - Load remote images, sprite sheets, with CORS support
- **Google Fonts Integration** - Dynamically load any Google Font
- **Collision Detection** - Built-in position and overlap detection for match-3 games
- **Lightweight** - Zero dependencies, tree-shakeable, minimal bundle size
- **TypeScript Native** - Full type safety and IntelliSense support
- **Scene Management** - Easy scene transitions and entity hierarchy
- **Particle Effects** - Simple particle system for visual polish
- **Layout Helpers** - Grid, circle, row/column positioning utilities
- **Asset Loading** - Simple image loading and caching

## Installation

```bash
npm install @mode7/zap
```

## Quick Start

```typescript
import { Game, Scene, Sprite } from '@mode7/zap';

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
  pixelRatio: 2, // Optional: defaults to window.devicePixelRatio
  antialias: true, // Optional: defaults to true
});

game.start(); // Start the game loop
game.stop(); // Stop the game loop
game.setScene(scene); // Switch to a different scene
```

### Scene

Scenes contain and manage entities. Use scenes for different game states (menu, gameplay, game over).

```typescript
const scene = new Scene();

scene.add(entity); // Add an entity
scene.remove(entity); // Remove an entity
scene.getEntities(); // Get all entities
scene.getEntitiesByTag('enemy'); // Get entities by tag

scene.onEnter(); // Called when scene becomes active
scene.onExit(); // Called when scene becomes inactive
```

### Entities

Base class for all game objects. Entities support transform hierarchy, tags, and events.

```typescript
import { Entity } from '@mode7/zap';

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
import { Sprite } from '@mode7/zap';

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
import { Text, loadGoogleFont } from '@mode7/zap';

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
import { loadGoogleFonts } from '@mode7/zap';

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
import { ParticleEmitter } from '@mode7/zap';

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
import { Layout } from '@mode7/zap';

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
import { Layout } from '@mode7/zap';

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

Built-in methods for entity position and collision detection - perfect for match-3 games!

```typescript
// Check if entities overlap
if (gem1.intersects(gem2)) {
  console.log('Match detected!');
  matchGems(gem1, gem2);
}

// Check relative positions
if (gem1.isAbove(gem2)) {
  console.log('Gem 1 is above gem 2');
}

// Get distance between entities
const distance = entity1.distanceTo(entity2);

// Get bounding box
const bounds = entity.getBounds();
// Returns: { left, right, top, bottom }

// Position checks
entity.isAbove(other);    // Lower Y position
entity.isBelow(other);    // Higher Y position
entity.isLeftOf(other);   // Lower X position
entity.isRightOf(other);  // Higher X position
entity.overlaps(other);   // Same as intersects
```

## Asset Loading

Simple asset loading and caching.

```typescript
import { assetLoader } from '@mode7/zap';

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

## Documentation & Examples

Check out the [**Interactive Documentation**](https://github.com/mode7/zap/tree/main/docs) with live, runnable examples:

- Complete API documentation
- 20+ interactive examples
- Code snippets for every feature
- Copy-paste ready demos

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
import type { GameOptions, Entity, GestureEvent } from '@mode7/zap';
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

---

Made with care for interactive demos and playable ads.
