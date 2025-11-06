---
title: Touch Trail
description: Visual trail following touch and mouse input
---

# Touch Trail

TouchTrail creates a visual trailing effect that follows touch and mouse movement, providing satisfying visual feedback for user interactions.

## Enable Touch Trail

Touch trail is enabled via game configuration:

```javascript
import { Game } from '@mode-7/zap';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460',
  enableTouchTrail: true  // Enable touch trail
});
```

## Configure Touch Trail

Customize the trail appearance:

```javascript
const game = new Game({
  width: 400,
  height: 300,
  enableTouchTrail: true
});

// Access and configure the trail (will be null if enableTouchTrail is false)
if (game.touchTrail) {
  game.touchTrail.setColor('#4fc3f7');
}
```

## Touch Trail Options

The TouchTrail can be configured after creation:

```javascript
// Change color
if (game.touchTrail) {
  game.touchTrail.setColor('#e94560');

  // Enable/disable
  game.touchTrail.enable();
  game.touchTrail.disable();

  // Clear trail
  game.touchTrail.clear();
}
```

## Creating Custom Touch Trails

For more control, create TouchTrail instances manually:

```javascript
import { TouchTrail } from '@mode-7/zap';

const trail = new TouchTrail({
  color: '#4fc3f7',    // Trail color (default: '#ffffff')
  width: 5,            // Trail width in pixels (default: 3)
  fadeTime: 800,       // Fade duration in ms (default: 500)
  maxPoints: 100       // Maximum trail points (default: 50)
});

// Add points manually
game.on('drag', (event) => {
  trail.addPoint(event.position.x, event.position.y);
});

// Update in game loop
game.on('update', (deltaTime) => {
  trail.update(deltaTime);
});

// Render
game.on('render', (ctx) => {
  trail.render(ctx);
});
```

## Trail Colors

Different colors for different interactions:

```javascript
if (game.touchTrail) {
  // Blue trail for normal interaction
  game.touchTrail.setColor('#4fc3f7');

  // Red trail for danger zones
  game.touchTrail.setColor('#e94560');

  // Green trail for success
  game.touchTrail.setColor('#51cf66');

  // Rainbow effect (change over time)
  const colors = ['#e94560', '#f39c12', '#51cf66', '#4fc3f7', '#9b59b6'];
  let colorIndex = 0;

  setInterval(() => {
    if (!game.touchTrail) return;
    game.touchTrail.setColor(colors[colorIndex]);
    colorIndex = (colorIndex + 1) % colors.length;
  }, 500);
}
```

## Common Patterns

### Temporary Trail

Enable trail only when needed:

```javascript
// Enable when dragging
game.on('dragstart', () => {
  if (game.touchTrail) {
    game.touchTrail.enable();
  }
});

game.on('dragend', () => {
  if (game.touchTrail) {
    game.touchTrail.disable();
    game.touchTrail.clear();
  }
});
```

### Entity-Specific Trail

Different trails for different entities:

```javascript
const playerTrail = new TouchTrail({
  color: '#4fc3f7',
  width: 6,
  fadeTime: 600
});

player.on('drag', (event) => {
  playerTrail.addPoint(event.position.x, event.position.y);
});
```

### Drawing Mode

Create a drawing application:

```javascript
let isDrawing = false;
const drawTrail = new TouchTrail({
  color: '#fff',
  width: 8,
  fadeTime: 10000,  // Long fade time = persistent
  maxPoints: 1000
});

game.on('dragstart', () => {
  isDrawing = true;
});

game.on('drag', (event) => {
  if (isDrawing) {
    drawTrail.addPoint(event.position.x, event.position.y);
  }
});

game.on('dragend', () => {
  isDrawing = false;
});
```

## Performance

- Default maxPoints (50) works for most cases
- Increase for longer trails (100-200)
- Decrease for better performance (20-30)
- Shorter fadeTime = better performance

## Tips

- **Use for feedback** - Helps users see their touch is registered
- **Match your theme** - Choose trail colors that fit your design
- **Don't overuse** - Can be distracting if always on
- **Clear when appropriate** - Clear trail between screens/modes

## Next Steps

- [Particles](/animation/particles) - Particle effects
- [Tweening](/animation/tweening) - Property animations
