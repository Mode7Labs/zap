---
title: Background Music
description: Playing and controlling background music
---

# Background Music

AudioManager provides simple background music playback with loop control and volume management.

## Playing Music

Play background music that loops automatically:

```javascript
import { audioManager } from '@mode-7/zap';

// Play looping background music
audioManager.playMusic('/music/theme.mp3', {
  loop: true,
  volume: 0.7
});
```

## Music Controls

Control music playback:

```javascript
// Pause music (keeps position)
audioManager.pauseMusic();

// Resume from pause
audioManager.resumeMusic();

// Stop music (resets to beginning)
audioManager.stopMusic();
```

## Music Player Demo

```codemirror
import { Game, Scene, Sprite, Text, audioManager } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

let musicPlaying = false;
let musicPaused = false;

// Title
const title = new Text({
  text: 'Background Music Demo',
  x: 200,
  y: 40,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
});

const subtitle = new Text({
  text: 'Control background music playback',
  x: 200,
  y: 70,
  fontSize: 12,
  color: '#888',
  align: 'center'
});

// Status
const status = new Text({
  text: 'Status: Stopped',
  x: 200,
  y: 110,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

// Play button
const playBtn = new Sprite({
  x: 110,
  y: 160,
  width: 85,
  height: 45,
  color: '#2ecc71',
  radius: 8,
  interactive: true
});

const playLabel = new Text({
  text: 'Play',
  fontSize: 15,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

playBtn.addChild(playLabel);

playBtn.on('tap', () => {
  if (!musicPlaying) {
    audioManager.playMusic('../assets/music.mp3', {
      loop: true,
      volume: 0.6
    });
    musicPlaying = true;
    musicPaused = false;
    status.text = 'Status: Playing';
    status.color = '#2ecc71';
    playBtn.alpha = 0.5;
  }
});

// Pause button
const pauseBtn = new Sprite({
  x: 200,
  y: 160,
  width: 85,
  height: 45,
  color: '#f4a261',
  radius: 8,
  interactive: true
});

const pauseLabel = new Text({
  text: 'Pause',
  fontSize: 15,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

pauseBtn.addChild(pauseLabel);

pauseBtn.on('tap', () => {
  if (musicPlaying && !musicPaused) {
    audioManager.pauseMusic();
    musicPaused = true;
    status.text = 'Status: Paused';
    status.color = '#f4a261';
    pauseLabel.text = 'Resume';
  } else if (musicPlaying && musicPaused) {
    audioManager.resumeMusic();
    musicPaused = false;
    status.text = 'Status: Playing';
    status.color = '#2ecc71';
    pauseLabel.text = 'Pause';
  }
});

// Stop button
const stopBtn = new Sprite({
  x: 290,
  y: 160,
  width: 85,
  height: 45,
  color: '#e94560',
  radius: 8,
  interactive: true
});

const stopLabel = new Text({
  text: 'Stop',
  fontSize: 15,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

stopBtn.addChild(stopLabel);

stopBtn.on('tap', () => {
  if (musicPlaying) {
    audioManager.stopMusic();
    musicPlaying = false;
    musicPaused = false;
    status.text = 'Status: Stopped';
    status.color = '#888';
    pauseLabel.text = 'Pause';
    playBtn.alpha = 1;
  }
});

const info = new Text({
  text: 'Play, pause, and stop background music',
  x: 200,
  y: 230,
  fontSize: 11,
  color: '#666',
  align: 'center'
});

scene.add(title);
scene.add(subtitle);
scene.add(status);
scene.add(playBtn);
scene.add(pauseBtn);
scene.add(stopBtn);
scene.add(info);

game.setScene(scene);
game.start();
```

## Music Options

Customize music playback:

```javascript
audioManager.playMusic('/music/battle.mp3', {
  loop: true,      // Loop the music (default: true)
  volume: 0.6,     // Music volume 0-1 (default: 1)
  rate: 1.0        // Playback speed (default: 1)
});
```

## Music Volume

Control music volume independently from sound effects:

```javascript
// Set music volume to 50%
audioManager.setMusicVolume(0.5);

// Music volume is multiplied by master volume
audioManager.setMasterVolume(0.8); // Both music and SFX at 80%
```

## Scene-Based Music

Play different music for each scene:

```javascript
import { Scene, audioManager } from '@mode-7/zap';

class MenuScene extends Scene {
  onEnter() {
    audioManager.playMusic('/music/menu.mp3', {
      loop: true,
      volume: 0.6
    });
  }

  onExit() {
    audioManager.stopMusic();
  }
}

class GameScene extends Scene {
  onEnter() {
    audioManager.playMusic('/music/gameplay.mp3', {
      loop: true,
      volume: 0.7
    });
  }

  onExit() {
    audioManager.stopMusic();
  }
}
```

## Crossfading Music

Smoothly transition between tracks:

```javascript
// Fade out current music
const fadeOut = () => {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const currentVolume = audioManager.getMusicVolume();
      if (currentVolume > 0.1) {
        audioManager.setMusicVolume(currentVolume - 0.1);
      } else {
        clearInterval(interval);
        audioManager.stopMusic();
        resolve();
      }
    }, 100);
  });
};

// Crossfade to new track
await fadeOut();
audioManager.setMusicVolume(0);
audioManager.playMusic('/music/new-track.mp3');

// Fade in new track
const fadeIn = setInterval(() => {
  const currentVolume = audioManager.getMusicVolume();
  if (currentVolume < 0.7) {
    audioManager.setMusicVolume(currentVolume + 0.1);
  } else {
    clearInterval(fadeIn);
  }
}, 100);
```

## Dynamic Music

Change music based on game state:

```javascript
let enemyCount = 0;

function updateMusic() {
  if (enemyCount > 10) {
    // Intense music
    audioManager.playMusic('/music/intense.mp3', {
      loop: true,
      volume: 0.8
    });
  } else if (enemyCount > 0) {
    // Action music
    audioManager.playMusic('/music/action.mp3', {
      loop: true,
      volume: 0.7
    });
  } else {
    // Calm music
    audioManager.playMusic('/music/calm.mp3', {
      loop: true,
      volume: 0.5
    });
  }
}
```

## Common Patterns

### Boss Battle Music

```javascript
boss.on('spawn', () => {
  // Stop normal music
  audioManager.stopMusic();

  // Play boss music
  audioManager.playMusic('/music/boss.mp3', {
    loop: true,
    volume: 0.8
  });
});

boss.on('defeat', () => {
  audioManager.stopMusic();
  audioManager.playMusic('/music/victory.mp3', {
    loop: false,
    volume: 0.7
  });
});
```

### Menu Music

```javascript
const menuScene = new Scene();

menuScene.onEnter = () => {
  audioManager.playMusic('/music/menu.mp3', {
    loop: true,
    volume: 0.5
  });
};

playButton.on('tap', () => {
  audioManager.pauseMusic(); // Keep music ready
  game.setScene(gameScene);
});
```

## Next Steps

- [Sound Effects](/audio/sound-effects) - Play sound effects
- [Volume & Mute](/audio/volume) - Global audio controls
