---
title: Sound Effects
description: Playing sound effects and audio feedback
---

# Sound Effects

The AudioManager provides a simple system for loading and playing sound effects with volume control and playback options.

## Basic Sound Effects

Load and play sound effects using the global `audioManager`:

```javascript
import { audioManager } from '@mode-7/zap';

// Load a sound effect
audioManager.loadSound('jump', '/sounds/jump.mp3');

// Play the sound
audioManager.playSound('jump');
```

## Loading Multiple Sounds

Load all your sound effects at once:

```javascript
import { audioManager } from '@mode-7/zap';

audioManager.loadSounds({
  jump: '/sounds/jump.mp3',
  coin: '/sounds/coin.mp3',
  explosion: '/sounds/explosion.mp3',
  laser: '/sounds/laser.mp3'
});
```

## Sound Effects Demo

```codemirror
import { Game, Scene, Sprite, Text, audioManager } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Load the sound effect
audioManager.loadSound('sfx', '../assets/sfx.mp3');

// Title
const title = new Text({
  text: 'Sound Effects Demo',
  x: 200,
  y: 30,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
});

const info = new Text({
  text: 'Tap buttons to play sound at different speeds',
  x: 200,
  y: 60,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

// Create sound button with playback rate
const createButton = (x, y, label, color, rate) => {
  const btn = new Sprite({
    x, y,
    width: 80,
    height: 40,
    color,
    radius: 8,
    interactive: true
  });

  const text = new Text({
    text: label,
    fontSize: 13,
    color: '#fff',
    align: 'center',
    baseline: 'middle'
  });

  btn.addChild(text);

  btn.on('tap', () => {
    audioManager.playSound('sfx', { rate });
    btn.tween(
      { scaleX: 1.1, scaleY: 1.1 },
      { duration: 100 }
    ).then(() => {
      btn.tween(
        { scaleX: 1, scaleY: 1 },
        { duration: 100 }
      );
    });
  });

  return btn;
};

// Different playback rates
const normalBtn = createButton(100, 120, 'Normal', '#2a9d8f', 1.0);
const slowBtn = createButton(200, 120, 'Slow', '#4fc3f7', 0.7);
const fastBtn = createButton(300, 120, 'Fast', '#f4a261', 1.5);

const lowerBtn = createButton(100, 180, 'Lower', '#e76f51', 0.8);
const higherBtn = createButton(200, 180, 'Higher', '#9d4edd', 1.2);
const chipmunkBtn = createButton(300, 180, 'Chipmunk', '#e94560', 2.0);

// Volume control
const volumeLabel = new Text({
  text: 'Volume: 100%',
  x: 200,
  y: 230,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

let currentVolume = 1.0;

const quietBtn = createButton(120, 255, 'Quiet', '#16213e', 1.0);
quietBtn.on('tap', () => {
  currentVolume = 0.3;
  audioManager.playSound('sfx', { volume: currentVolume });
  volumeLabel.text = 'Volume: 30%';
  quietBtn.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 100 }).then(() => {
    quietBtn.tween({ scaleX: 1, scaleY: 1 }, { duration: 100 });
  });
});

const loudBtn = createButton(280, 255, 'Loud', '#16213e', 1.0);
loudBtn.on('tap', () => {
  currentVolume = 1.0;
  audioManager.playSound('sfx', { volume: currentVolume });
  volumeLabel.text = 'Volume: 100%';
  loudBtn.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 100 }).then(() => {
    loudBtn.tween({ scaleX: 1, scaleY: 1 }, { duration: 100 });
  });
});

scene.add(title);
scene.add(info);
scene.add(normalBtn);
scene.add(slowBtn);
scene.add(fastBtn);
scene.add(lowerBtn);
scene.add(higherBtn);
scene.add(chipmunkBtn);
scene.add(volumeLabel);
scene.add(quietBtn);
scene.add(loudBtn);

game.setScene(scene);
game.start();
```

## Playback Options

Control how sounds are played:

```javascript
// Play with custom volume (0-1)
audioManager.playSound('jump', { volume: 0.5 });

// Play at different playback rate (speed)
audioManager.playSound('laser', { rate: 1.5 }); // 1.5x speed

// Loop a sound
audioManager.playSound('engine', { loop: true });

// Combine options
audioManager.playSound('coin', {
  volume: 0.8,
  rate: 1.2,
  loop: false
});
```

## Random Sounds

Play a random sound from a group for variety:

```javascript
// Load impact variations
audioManager.loadSounds({
  'hit1': '/sounds/hit1.mp3',
  'hit2': '/sounds/hit2.mp3',
  'hit3': '/sounds/hit3.mp3'
});

// Play random hit sound on collision
entity.on('collision', () => {
  audioManager.playRandomSound(['hit1', 'hit2', 'hit3']);
});
```

## Volume Control

Set global sound effects volume:

```javascript
// Set SFX volume (0-1)
audioManager.setSFXVolume(0.7);

// Affects all playSound() calls
audioManager.playSound('jump'); // Plays at 70% volume
```

## Common Patterns

### UI Feedback

```javascript
button.on('tap', () => {
  audioManager.playSound('click', { volume: 0.3 });
  // ... button action
});
```

### Collision Sounds

```javascript
player.on('collision', (other) => {
  if (other.hasTag('enemy')) {
    audioManager.playSound('hurt');
  } else if (other.hasTag('coin')) {
    audioManager.playSound('coin', { rate: 1 + Math.random() * 0.2 });
  }
});
```

### Combo System

```javascript
let comboCount = 0;

enemy.on('destroy', () => {
  comboCount++;
  const pitch = 1 + (comboCount * 0.1); // Higher pitch for each combo
  audioManager.playSound('hit', { rate: pitch });
});
```

## Next Steps

- [Background Music](/audio/music) - Play and control background music
- [Volume & Mute](/audio/volume) - Global audio controls
