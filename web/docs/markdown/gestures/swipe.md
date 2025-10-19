---
title: Swipe Gesture
description: Swipe detection for directional input
---

# Swipe Gesture

The swipe gesture detects quick directional swipes. Perfect for navigation, card dismissal, and directional game controls.

## Basic Swipe

Detect swipe direction:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  color: '#51cf66',
  radius: 12,
  interactive: true
});

const label = new Text({
  text: 'Swipe fast on the square',
  x: 200,
  y: 50,
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

const hint = new Text({
  text: '(Drag quickly in any direction)',
  x: 200,
  y: 250,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

scene.add(sprite);
scene.add(label);
scene.add(hint);

sprite.on('swipe', (event) => {
  label.text = `Swiped ${event.direction.toUpperCase()}!`;
  label.color = '#51cf66';

  // Move sprite in swipe direction
  const distance = 80;
  let targetX = sprite.x;
  let targetY = sprite.y;

  if (event.direction === 'left') targetX -= distance;
  if (event.direction === 'right') targetX += distance;
  if (event.direction === 'up') targetY -= distance;
  if (event.direction === 'down') targetY += distance;

  sprite.tween(
    { x: targetX, y: targetY },
    { duration: 300, easing: 'easeOutQuad' }
  );
});

game.setScene(scene);
game.start();
```

## Swipe Detection

A swipe is detected when:
- Movement is greater than **30 pixels**
- Direction is clearly horizontal or vertical
- Works on both mouse and touch

## Swipe Event

The swipe event provides detailed information:

```javascript
sprite.on('swipe', (event) => {
  console.log(event);
  // {
  //   type: 'swipe',
  //   position: { x: 250, y: 150 },
  //   direction: 'right',  // 'up', 'down', 'left', or 'right'
  //   distance: 85.4,
  //   velocity: { x: 0.28, y: 0.0 },
  //   delta: { x: 85, y: 0 },
  //   target: sprite
  // }
});
```

### Event Properties

- **type**: `'swipe'` - The gesture type
- **position**: `{ x, y }` - End position of swipe
- **direction**: `'up'` | `'down'` | `'left'` | `'right'` - Swipe direction
- **distance**: `number` - Total distance swiped in pixels
- **velocity**: `{ x, y }` - Swipe velocity in pixels/ms
- **delta**: `{ x, y }` - Total movement from start to end
- **target**: The entity that was swiped

## Directional Actions

Handle different swipe directions:

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const card = new Sprite({
  x: 200,
  y: 150,
  width: 120,
  height: 160,
  color: '#4fc3f7',
  radius: 12,
  interactive: true
});

const instruction = new Text({
  text: 'Swipe to navigate',
  x: 200,
  y: 30,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

const status = new Text({
  text: '',
  x: 200,
  y: 260,
  fontSize: 14,
  color: '#fff',
  align: 'center'
});

scene.add(card);
scene.add(instruction);
scene.add(status);

card.on('swipe', (event) => {
  const startX = card.x;
  const startY = card.y;

  switch (event.direction) {
    case 'up':
      status.text = 'Going up!';
      card.tween({ y: startY - 100, alpha: 0 }, { duration: 300, easing: 'easeOutQuad' })
        .then(() => {
          card.y = startY;
          card.tween({ alpha: 1 }, { duration: 200 });
        });
      break;

    case 'down':
      status.text = 'Going down!';
      card.tween({ y: startY + 100, alpha: 0 }, { duration: 300, easing: 'easeOutQuad' })
        .then(() => {
          card.y = startY;
          card.tween({ alpha: 1 }, { duration: 200 });
        });
      break;

    case 'left':
      status.text = 'Previous';
      card.tween({ x: startX - 150, rotation: -0.3 }, { duration: 300, easing: 'easeOutQuad' })
        .then(() => {
          card.x = startX;
          card.rotation = 0;
        });
      break;

    case 'right':
      status.text = 'Next';
      card.tween({ x: startX + 150, rotation: 0.3 }, { duration: 300, easing: 'easeOutQuad' })
        .then(() => {
          card.x = startX;
          card.rotation = 0;
        });
      break;
  }
});

game.setScene(scene);
game.start();
```

## Common Patterns

### Card Swipe Dismiss

Swipe to remove cards:

```javascript
const card = new Sprite({
  x: 200, y: 150,
  width: 140, height: 180,
  color: '#e94560',
  radius: 12,
  interactive: true
});

card.on('swipe', (event) => {
  if (event.direction === 'left' || event.direction === 'right') {
    // Dismiss card with animation
    const targetX = event.direction === 'left' ? -100 : 500;

    card.tween(
      { x: targetX, rotation: event.direction === 'left' ? -1 : 1, alpha: 0 },
      {
        duration: 400,
        easing: 'easeOutQuad',
        onComplete: () => {
          card.destroy();
        }
      }
    );
  }
});
```

### Swipe Navigation

Navigate between screens:

```javascript
let currentPage = 0;
const pages = ['Home', 'Profile', 'Settings'];

sprite.on('swipe', (event) => {
  if (event.direction === 'left' && currentPage < pages.length - 1) {
    currentPage++;
    console.log('Navigate to:', pages[currentPage]);
  } else if (event.direction === 'right' && currentPage > 0) {
    currentPage--;
    console.log('Navigate to:', pages[currentPage]);
  }
});
```

### Swipe to Refresh

Pull down to refresh:

```javascript
let isRefreshing = false;

canvas.on('swipe', (event) => {
  if (event.direction === 'down' && !isRefreshing) {
    isRefreshing = true;
    console.log('Refreshing...');

    // Animate refresh indicator
    setTimeout(() => {
      console.log('Refresh complete');
      isRefreshing = false;
    }, 2000);
  }
});
```

### Swipe Controls

Game character movement:

```javascript
const player = new Sprite({
  x: 200, y: 200,
  width: 50, height: 50,
  color: '#51cf66',
  radius: 8,
  interactive: true
});

const moveDistance = 60;

player.on('swipe', (event) => {
  let targetX = player.x;
  let targetY = player.y;

  switch (event.direction) {
    case 'up': targetY -= moveDistance; break;
    case 'down': targetY += moveDistance; break;
    case 'left': targetX -= moveDistance; break;
    case 'right': targetX += moveDistance; break;
  }

  player.tween(
    { x: targetX, y: targetY },
    { duration: 200, easing: 'easeOutQuad' }
  );
});
```

### Velocity-Based Animation

Use swipe velocity for physics-based motion:

```javascript
sprite.on('swipe', (event) => {
  // Faster swipes move further
  const multiplier = 200;  // Adjust for desired sensitivity

  const targetX = sprite.x + event.velocity.x * multiplier;
  const targetY = sprite.y + event.velocity.y * multiplier;

  sprite.tween(
    { x: targetX, y: targetY },
    { duration: 500, easing: 'easeOutQuad' }
  );
});
```

### Swipe Threshold

Only respond to fast swipes:

```javascript
sprite.on('swipe', (event) => {
  const speed = Math.sqrt(
    event.velocity.x ** 2 + event.velocity.y ** 2
  );

  if (speed > 0.5) {  // Minimum swipe speed
    console.log('Fast swipe detected!');
    // Perform action
  } else {
    console.log('Swipe too slow');
  }
});
```

### Horizontal Only

Only detect horizontal swipes:

```javascript
sprite.on('swipe', (event) => {
  if (event.direction === 'left' || event.direction === 'right') {
    console.log('Horizontal swipe:', event.direction);
    // Handle horizontal swipe
  }
  // Ignore vertical swipes
});
```

### Vertical Only

Only detect vertical swipes:

```javascript
sprite.on('swipe', (event) => {
  if (event.direction === 'up' || event.direction === 'down') {
    console.log('Vertical swipe:', event.direction);
    // Handle vertical swipe
  }
  // Ignore horizontal swipes
});
```

### Swipe Progress Indicator

Show swipe progress:

```javascript
let swipeStartX = 0;

sprite.on('dragstart', (event) => {
  swipeStartX = event.position.x;
});

sprite.on('drag', (event) => {
  const distance = event.position.x - swipeStartX;

  // Visual feedback during drag
  sprite.x = sprite.x + distance * 0.3;  // Partial movement
  sprite.rotation = distance * 0.001;    // Slight rotation
});

sprite.on('swipe', (event) => {
  // Complete the swipe animation
  if (event.direction === 'left' || event.direction === 'right') {
    const targetX = event.direction === 'left' ? -100 : 500;

    sprite.tween(
      { x: targetX, alpha: 0 },
      { duration: 300, easing: 'easeOutQuad' }
    );
  }
});

sprite.on('dragend', () => {
  // Reset if not swiped
  sprite.tween(
    { x: 200, rotation: 0 },
    { duration: 200, easing: 'easeOutQuad' }
  );
});
```

## Canvas-Level Swipes

Detect swipes anywhere on the canvas:

```javascript
game.on('swipe', (event) => {
  console.log('Swiped', event.direction, 'on canvas');

  // Navigate scenes, scroll content, etc.
  if (event.direction === 'left') {
    // Next scene
  } else if (event.direction === 'right') {
    // Previous scene
  }
});
```

## Tips

- **Swipes are quick** - They end immediately, unlike drag which is continuous
- **Check direction** - Handle each direction separately for clarity
- **Use velocity** - Faster swipes can trigger different actions
- **Combine with drag** - Use drag for preview, swipe for commit
- **Test swipe threshold** - The default 30px works well for most cases

## Common Mistakes

### Confusing swipe with drag

```javascript
// ❌ Wrong - drag fires continuously
sprite.on('drag', (event) => {
  console.log('Swiped!');  // This fires many times
});

// ✅ Right - swipe fires once at the end
sprite.on('swipe', (event) => {
  console.log('Swiped!', event.direction);
});
```

### Not checking direction

```javascript
// ❌ Wrong - same action for all directions
sprite.on('swipe', () => {
  console.log('Swiped');  // No direction handling
});

// ✅ Right - handle each direction
sprite.on('swipe', (event) => {
  switch (event.direction) {
    case 'up': /* up action */; break;
    case 'down': /* down action */; break;
    case 'left': /* left action */; break;
    case 'right': /* right action */; break;
  }
});
```

## Next Steps

- [Tap Gesture](/gestures/tap) - Tap/click detection
- [Drag Gesture](/gestures/drag) - Dragging entities
- [Tweening](/animation/tweening) - Animate swipe results
