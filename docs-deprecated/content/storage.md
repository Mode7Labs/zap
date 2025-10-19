---
id: storage
title: Storage
category: core
description: Persist game data with localStorage wrapper
imports: [Storage, Sprite, Text]
---

# Storage

The Storage utility provides a simple wrapper around localStorage for persisting game data across sessions.

## Basic Usage

```zap-demo
Storage.clear();

let highScore = Storage.get('highScore', 0);
let coins = Storage.get('coins', 0);

const title = new Text({
  text: 'Persistent Save Data',
  x: 200,
  y: 40,
  fontSize: 18,
  color: '#4fc3f7',
  align: 'center'
});

const highScoreText = new Text({
  text: `High Score: ${highScore}`,
  x: 200,
  y: 100,
  fontSize: 16,
  color: '#ffffff',
  align: 'center'
});

const coinsText = new Text({
  text: `Coins: ${coins}`,
  x: 200,
  y: 130,
  fontSize: 16,
  color: '#f39c12',
  align: 'center'
});

const playButton = new Sprite({
  x: 140,
  y: 200,
  width: 120,
  height: 46,
  radius: 10,
  color: '#2ecc71',
  interactive: true
});

const playLabel = new Text({
  text: 'Finish Run',
  x: 140,
  y: 200,
  fontSize: 15,
  color: '#ffffff',
  align: 'center',
  baseline: 'middle'
});

const collectButton = new Sprite({
  x: 260,
  y: 200,
  width: 120,
  height: 46,
  radius: 10,
  color: '#e94560',
  interactive: true
});

const collectLabel = new Text({
  text: 'Collect Coin',
  x: 260,
  y: 200,
  fontSize: 15,
  color: '#ffffff',
  align: 'center',
  baseline: 'middle'
});

const resetButton = new Sprite({
  x: 200,
  y: 250,
  width: 180,
  height: 40,
  radius: 10,
  color: '#1a1a2e',
  interactive: true
});

const resetLabel = new Text({
  text: 'Clear Save Data',
  x: 200,
  y: 250,
  fontSize: 14,
  color: '#adb5bd',
  align: 'center',
  baseline: 'middle'
});

scene.add(title);
scene.add(highScoreText);
scene.add(coinsText);
scene.add(playButton);
scene.add(playLabel);
scene.add(collectButton);
scene.add(collectLabel);
scene.add(resetButton);
scene.add(resetLabel);

function updateUI() {
  highScoreText.text = `High Score: ${highScore}`;
  coinsText.text = `Coins: ${coins}`;
}

playButton.on('tap', () => {
  const newScore = Math.floor(Math.random() * 2000);
  highScore = Math.max(highScore, newScore);
  Storage.set('highScore', highScore);
  updateUI();

  playButton.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 120 })
    .then(() => playButton.tween({ scaleX: 1, scaleY: 1 }, { duration: 120 }));
});

collectButton.on('tap', () => {
  coins += 1;
  Storage.set('coins', coins);
  updateUI();

  collectButton.tween({ scaleX: 1.1, scaleY: 1.1 }, { duration: 120 })
    .then(() => collectButton.tween({ scaleX: 1, scaleY: 1 }, { duration: 120 }));
});

resetButton.on('tap', () => {
  Storage.clear();
  highScore = 0;
  coins = 0;
  updateUI();
  resetLabel.color = '#4fc3f7';
});
```

## API Methods

- `set(key, value)` - Save data (automatically serializes objects)
- `get(key, defaultValue?)` - Load data (automatically deserializes)
- `has(key)` - Check if key exists
- `remove(key)` - Delete specific key
- `clear()` - Remove all stored data

Storage automatically handles JSON serialization, so you can save and load objects, arrays, and primitives seamlessly.
