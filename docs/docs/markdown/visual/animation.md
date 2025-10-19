---
title: Sprite Animation
description: Frame-based sprite sheet animations
---

# Sprite Animation

Sprite supports frame-based animations from sprite sheets. Define multiple named animations and play them on demand with configurable frame rates and looping.

## Basic Animation

Create an animated Sprite by specifying `frameWidth`, `frameHeight`, and `animations`:

```javascript
import { Sprite } from '@mode-7/zap';

const hero = new Sprite({
  x: 200,
  y: 150,
  width: 64,
  height: 64,
  image: '/assets/spritesheet.png',
  frameWidth: 64,
  frameHeight: 64,
  animations: {
    idle: { frames: [0, 1, 2, 3], fps: 6, loop: true },
    run: { frames: [4, 5, 6, 7], fps: 12, loop: true },
    jump: { frames: [8, 9], fps: 10, loop: false }
  }
});

// Play an animation
hero.play('idle');
```

## Animation Properties

Each animation has three properties:

- **frames**: Array of frame indices (0-based, left-to-right, top-to-bottom)
- **fps**: Frames per second (optional, default: 10)
- **loop**: Whether to loop (optional, default: true)

```javascript
animations: {
  walk: {
    frames: [0, 1, 2, 3],
    fps: 8,
    loop: true
  }
}
```

## Interactive Animation Demo

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const hero = new Sprite({
  x: 200,
  y: 140,
  width: 64,
  height: 64,
  image: '../assets/robot.png',
  frameWidth: 64,
  frameHeight: 64,
  animations: {
    idle: { frames: [0, 1, 2, 3], fps: 6, loop: true }
  },
  interactive: true
});

const status = new Text({
  x: 200,
  y: 220,
  text: 'Tap to toggle animation',
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(hero);
scene.add(status);

hero.play('idle');

let playing = true;
hero.on('tap', () => {
  if (playing) {
    hero.pause();
    status.text = 'Paused - Tap to resume';
  } else {
    hero.resume();
    status.text = 'Playing - Tap to pause';
  }
  playing = !playing;
});

game.setScene(scene);
game.start();
```

## Sprite Sheet Layout

Frames are read from the sprite sheet left-to-right, top-to-bottom:

```
Frame indices in a 4x2 sprite sheet:
┌───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │
├───┼───┼───┼───┤
│ 4 │ 5 │ 6 │ 7 │
└───┴───┴───┴───┘
```

The engine automatically calculates frame positions based on:
- `frameWidth` and `frameHeight`
- Total image dimensions
- Frame index

## Playing Animations

Use `play()` to start an animation:

```javascript
// Play with default settings
hero.play('walk');

// Override fps
hero.play('walk', { fps: 12 });

// Override loop
hero.play('jump', { loop: false });

// Override both
hero.play('attack', { fps: 15, loop: false });
```

## Animation Controls

Control playback with these methods:

```javascript
hero.play('run');      // Start playing
hero.pause();          // Pause (keeps current frame)
hero.resume();         // Resume from paused state
hero.stop();           // Stop (also pauses)
```

## Animation Events

Listen for when animations complete (non-looping only):

```javascript
hero.play('attack', { loop: false });

hero.on('animationcomplete', (animationName) => {
  console.log(`${animationName} finished!`);
  hero.play('idle');  // Return to idle
});
```

## Adding Animations Dynamically

Add animations after creation:

```javascript
const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 64,
  height: 64,
  image: '/assets/sheet.png',
  frameWidth: 64,
  frameHeight: 64
});

// Add animation later
sprite.addAnimation('dance', {
  frames: [12, 13, 14, 15],
  fps: 8,
  loop: true
});

sprite.play('dance');
```

## Character with Multiple States

```codemirror
import { Game, Scene, Sprite, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const character = new Sprite({
  x: 200,
  y: 180,
  width: 72,
  height: 72,
  image: '../assets/robot.png',
  frameWidth: 64,
  frameHeight: 64,
  animations: {
    idle: { frames: [0, 1, 2, 3], fps: 6, loop: true },
    jump: { frames: [4, 5, 6, 7], fps: 14, loop: false }
  },
  interactive: true
});

const status = new Text({
  x: 200,
  y: 260,
  text: 'Tap to jump',
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(character);
scene.add(status);

character.play('idle');

let jumping = false;

character.on('tap', () => {
  if (jumping) return;

  jumping = true;
  status.text = 'Jumping!';
  character.play('jump', { loop: false });

  // Animate upward
  const startY = character.y;
  character.tween({ y: startY - 50 }, {
    duration: 250,
    easing: 'easeOutQuad'
  }).then(() => {
    character.tween({ y: startY }, {
      duration: 250,
      easing: 'easeInQuad'
    });
  });
});

character.on('animationcomplete', (name) => {
  if (name === 'jump') {
    character.play('idle');
    status.text = 'Tap to jump';
    jumping = false;
  }
});

game.setScene(scene);
game.start();
```

## Performance Tips

- **Sprite atlases**: Pack multiple animations into one image
- **Power-of-2 frames**: Use frame sizes like 32, 64, 128 for best performance
- **Reasonable FPS**: 8-12 FPS is often enough for smooth animation
- **Stop unused animations**: Call `stop()` when animations aren't visible
- **Reuse sprite sheets**: Share images between multiple sprites

## Common Patterns

### State Machine

```javascript
const states = {
  IDLE: 'idle',
  WALK: 'walk',
  JUMP: 'jump',
  ATTACK: 'attack'
};

let currentState = states.IDLE;

function setState(newState) {
  if (currentState === newState) return;
  currentState = newState;
  hero.play(newState);
}

// Example: change state based on input
if (isMoving) {
  setState(states.WALK);
} else {
  setState(states.IDLE);
}
```

### Animation Chains

```javascript
// Play animations in sequence
hero.play('windup', { loop: false });

hero.on('animationcomplete', (name) => {
  if (name === 'windup') {
    hero.play('attack', { loop: false });
  } else if (name === 'attack') {
    hero.play('recover', { loop: false });
  } else if (name === 'recover') {
    hero.play('idle');
  }
});
```

### Direction-based Animation

```javascript
const hero = new Sprite({
  // ... setup
  animations: {
    'walk-right': { frames: [0, 1, 2, 3], fps: 8 },
    'walk-left': { frames: [4, 5, 6, 7], fps: 8 },
    'walk-up': { frames: [8, 9, 10, 11], fps: 8 },
    'walk-down': { frames: [12, 13, 14, 15], fps: 8 }
  }
});

function walk(direction) {
  hero.play(`walk-${direction}`);
}

walk('right');  // Play walk-right animation
```

## Next Steps

- [Shapes](/visual/shapes) - Create colored shapes
- [Sprites](/visual/sprites) - Load static images
- [Text](/visual/text) - Render text
- [Tweening](/animation/animations) - Smooth property animations
