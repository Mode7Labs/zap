---
title: Volume & Mute
description: Global audio controls and volume management
---

# Volume & Mute

AudioManager provides comprehensive volume controls for master, music, and sound effects independently, plus mute functionality.

## Volume Hierarchy

Audio volume follows a hierarchy:

```
Final Volume = Master Volume × (Music/SFX Volume) × Individual Sound Volume
```

```javascript
import { audioManager } from '@mode-7/zap';

// Set master volume (affects everything)
audioManager.setMasterVolume(0.8); // 80%

// Set music volume (affects only music)
audioManager.setMusicVolume(0.6); // 60%

// Set SFX volume (affects only sound effects)
audioManager.setSFXVolume(1.0); // 100%

// Individual sound volume
audioManager.playSound('jump', { volume: 0.5 }); // 50%

// Final volume: 0.8 × 1.0 × 0.5 = 0.4 (40%)
```

## Volume Control Demo

```codemirror
import { Game, Scene, Sprite, Text, audioManager } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Load audio
audioManager.loadSound('sfx', '../assets/sfx.mp3');

// Title
const title = new Text({
  text: 'Volume Controls',
  x: 200,
  y: 20,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
});

// Create a slider
const createSlider = (y, label, value, onChange) => {
  const labelText = new Text({
    text: label,
    x: 200,
    y: y - 15,
    fontSize: 12,
    color: '#888',
    align: 'center'
  });

  const valueText = new Text({
    text: `${Math.round(value * 100)}%`,
    x: 320,
    y: y,
    fontSize: 11,
    color: '#4fc3f7',
    align: 'left',
    baseline: 'middle'
  });

  const sliderBg = new Sprite({
    x: 200,
    y: y,
    width: 200,
    height: 5,
    color: '#16213e',
    radius: 2.5
  });

  const sliderFill = new Sprite({
    x: 100,
    y: y,
    width: value * 200,
    height: 5,
    color: '#4fc3f7',
    radius: 2.5,
    anchorX: 0,
    anchorY: 0.5
  });

  const sliderHandle = new Sprite({
    x: 100 + value * 200,
    y: y,
    width: 16,
    height: 16,
    color: '#fff',
    radius: 8,
    interactive: true
  });

  sliderHandle.on('drag', (event) => {
    const minX = 100;
    const maxX = 300;
    sliderHandle.x = Math.max(minX, Math.min(maxX, sliderHandle.x + event.delta.x));

    const newValue = (sliderHandle.x - minX) / (maxX - minX);
    sliderFill.width = newValue * 200;
    valueText.text = `${Math.round(newValue * 100)}%`;

    onChange(newValue);
  });

  scene.add(labelText);
  scene.add(sliderBg);
  scene.add(sliderFill);
  scene.add(sliderHandle);
  scene.add(valueText);

  return { labelText, sliderBg, sliderFill, sliderHandle, valueText };
};

// Master volume slider
const masterSlider = createSlider(70, 'Master Volume', 1.0, (value) => {
  audioManager.setMasterVolume(value);
});

// Music volume slider
const musicSlider = createSlider(110, 'Music Volume', 0.6, (value) => {
  audioManager.setMusicVolume(value);
});

// SFX volume slider
const sfxSlider = createSlider(150, 'SFX Volume', 1.0, (value) => {
  audioManager.setSFXVolume(value);
});

// Test buttons
const testSfxBtn = new Sprite({
  x: 100,
  y: 195,
  width: 85,
  height: 35,
  color: '#2ecc71',
  radius: 8,
  interactive: true
});

const testSfxLabel = new Text({
  text: 'Test SFX',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

testSfxBtn.addChild(testSfxLabel);

testSfxBtn.on('tap', () => {
  audioManager.playSound('sfx');
  testSfxBtn.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 100 }).then(() => {
    testSfxBtn.tween({ scaleX: 1, scaleY: 1 }, { duration: 100 });
  });
});

let musicPlaying = false;

const testMusicBtn = new Sprite({
  x: 200,
  y: 195,
  width: 85,
  height: 35,
  color: '#4fc3f7',
  radius: 8,
  interactive: true
});

const testMusicLabel = new Text({
  text: 'Play Music',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

testMusicBtn.addChild(testMusicLabel);

testMusicBtn.on('tap', () => {
  if (!musicPlaying) {
    audioManager.playMusic('../assets/music.mp3', { loop: true });
    musicPlaying = true;
    testMusicLabel.text = 'Stop Music';
    testMusicBtn.color = '#e94560';
  } else {
    audioManager.stopMusic();
    musicPlaying = false;
    testMusicLabel.text = 'Play Music';
    testMusicBtn.color = '#4fc3f7';
  }
});

// Mute button
const muteBtn = new Sprite({
  x: 300,
  y: 195,
  width: 85,
  height: 35,
  color: '#16213e',
  radius: 8,
  interactive: true
});

const muteLabel = new Text({
  text: 'Mute: OFF',
  fontSize: 12,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});

muteBtn.addChild(muteLabel);

muteBtn.on('tap', () => {
  audioManager.toggleMute();
  const muted = audioManager.isMuted();
  muteLabel.text = muted ? 'Mute: ON' : 'Mute: OFF';
  muteBtn.color = muted ? '#e94560' : '#16213e';
});

const info = new Text({
  text: 'Adjust sliders and test with sound and music',
  x: 200,
  y: 250,
  fontSize: 11,
  color: '#666',
  align: 'center'
});

scene.add(title);
scene.add(testSfxBtn);
scene.add(testMusicBtn);
scene.add(muteBtn);
scene.add(info);

game.setScene(scene);
game.start();
```

## Master Volume

Controls all audio (music and SFX):

```javascript
// Set master volume to 80%
audioManager.setMasterVolume(0.8);

// All sounds play at 80% of their set volume
audioManager.playSound('jump'); // 80% volume
audioManager.playMusic('/music/theme.mp3'); // 80% volume
```

## Music Volume

Controls only background music:

```javascript
// Set music to 60%
audioManager.setMusicVolume(0.6);

// Music plays at 60%, SFX unaffected
audioManager.playMusic('/music/theme.mp3'); // 60% volume
audioManager.playSound('jump'); // 100% volume (if master is 1.0)
```

## SFX Volume

Controls only sound effects:

```javascript
// Set SFX to 70%
audioManager.setSFXVolume(0.7);

// SFX plays at 70%, music unaffected
audioManager.playSound('jump'); // 70% volume
audioManager.playMusic('/music/theme.mp3'); // 100% volume (if master is 1.0)
```

## Mute Controls

Instantly silence all audio:

```javascript
// Mute all audio
audioManager.mute();

// Unmute all audio
audioManager.unmute();

// Toggle mute state
const isMuted = audioManager.toggleMute();

// Check if muted
if (audioManager.isMuted()) {
  console.log('Audio is muted');
}
```

## Settings Menu

Create a settings menu with volume controls:

```javascript
import { Scene, Sprite, Text, audioManager } from '@mode-7/zap';

class SettingsScene extends Scene {
  constructor() {
    super();

    // Master volume slider
    this.createSlider(100, 'Master', (value) => {
      audioManager.setMasterVolume(value);
      localStorage.setItem('masterVolume', value);
    });

    // Music volume slider
    this.createSlider(150, 'Music', (value) => {
      audioManager.setMusicVolume(value);
      localStorage.setItem('musicVolume', value);
    });

    // SFX volume slider
    this.createSlider(200, 'SFX', (value) => {
      audioManager.setSFXVolume(value);
      localStorage.setItem('sfxVolume', value);
    });
  }

  createSlider(y, label, onChange) {
    // Implementation from demo above
  }
}
```

## Save/Load Volume Settings

Persist volume settings:

```javascript
// Save settings
function saveAudioSettings() {
  localStorage.setItem('masterVolume', audioManager.getMasterVolume());
  localStorage.setItem('musicVolume', audioManager.getMusicVolume());
  localStorage.setItem('sfxVolume', audioManager.getSFXVolume());
  localStorage.setItem('muted', audioManager.isMuted());
}

// Load settings on startup
function loadAudioSettings() {
  const master = parseFloat(localStorage.getItem('masterVolume') ?? '1');
  const music = parseFloat(localStorage.getItem('musicVolume') ?? '1');
  const sfx = parseFloat(localStorage.getItem('sfxVolume') ?? '1');
  const muted = localStorage.getItem('muted') === 'true';

  audioManager.setMasterVolume(master);
  audioManager.setMusicVolume(music);
  audioManager.setSFXVolume(sfx);

  if (muted) {
    audioManager.mute();
  }
}

// Load on game start
loadAudioSettings();
```

## Accessibility

Add visual feedback for muted state:

```javascript
// Update UI when mute state changes
function updateMuteUI() {
  const muteIcon = document.getElementById('mute-icon');
  if (audioManager.isMuted()) {
    muteIcon.textContent = '🔇';
    muteIcon.classList.add('muted');
  } else {
    muteIcon.textContent = '🔊';
    muteIcon.classList.remove('muted');
  }
}

// Mute button
muteButton.on('tap', () => {
  audioManager.toggleMute();
  updateMuteUI();
});
```

## Volume Curves

Create smooth volume transitions:

```javascript
// Linear volume change
function fadeVolume(target, duration) {
  const start = audioManager.getMasterVolume();
  const diff = target - start;
  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    audioManager.setMasterVolume(start + diff * progress);

    if (progress >= 1) {
      clearInterval(interval);
    }
  }, 16); // ~60 FPS
}

// Usage
fadeVolume(0, 1000); // Fade out over 1 second
```

## Common Patterns

### Pause Menu Volume

```javascript
game.on('pause', () => {
  audioManager.setMasterVolume(0.3); // Duck volume
  audioManager.pauseMusic();
});

game.on('resume', () => {
  audioManager.setMasterVolume(1.0); // Restore volume
  audioManager.resumeMusic();
});
```

### Options Menu

```javascript
const optionsScene = new Scene();

// Volume sliders with localStorage persistence
['master', 'music', 'sfx'].forEach((type, i) => {
  const slider = createSlider(100 + i * 50, type, (value) => {
    switch(type) {
      case 'master': audioManager.setMasterVolume(value); break;
      case 'music': audioManager.setMusicVolume(value); break;
      case 'sfx': audioManager.setSFXVolume(value); break;
    }
    localStorage.setItem(`${type}Volume`, value);
  });
});
```

### Dynamic Volume

```javascript
// Lower music during dialogue
dialogueSystem.on('start', () => {
  audioManager.setMusicVolume(0.3);
});

dialogueSystem.on('end', () => {
  audioManager.setMusicVolume(0.7);
});
```

## Next Steps

- [Sound Effects](/audio/sound-effects) - Play sound effects
- [Background Music](/audio/music) - Control background music
