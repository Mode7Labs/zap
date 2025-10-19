---
id: scenes
title: Scenes
category: core
description: Managing game states with scenes
imports: [Scene, Sprite, Text]
---

# Scenes

A Scene is a container for entities. Think of it like a level, menu screen, or game state. Scenes make it easy to organize different parts of your game.

## Switching Between Scenes

```zap-demo {"gameOptions":{"backgroundColor":"#0b1024"}}
const menu = new Scene();
const level = new Scene();

// Menu screen
const title = new Text({
  text: 'Zap Runner',
  x: 200,
  y: 110,
  fontSize: 26,
  color: '#4fc3f7',
  align: 'center'
});

const startButton = new Sprite({
  x: 200,
  y: 170,
  width: 140,
  height: 50,
  radius: 12,
  color: '#e94560',
  interactive: true
});

const startLabel = new Text({
  text: 'Start Game',
  x: 200,
  y: 170,
  fontSize: 18,
  color: '#ffffff',
  align: 'center',
  baseline: 'middle'
});

const startHint = new Text({
  text: 'Tap to switch scenes',
  x: 200,
  y: 220,
  fontSize: 13,
  color: '#8892bf',
  align: 'center'
});

menu.add(title);
menu.add(startButton);
menu.add(startLabel);
menu.add(startHint);

// Gameplay scene
const sky = new Sprite({
  x: 200,
  y: 150,
  width: 400,
  height: 300,
  color: '#15204a'
});

const player = new Sprite({
  x: 120,
  y: 170,
  width: 54,
  height: 54,
  radius: 16,
  color: '#f7c948',
  interactive: true,
  tag: 'player'
});

const instruction = new Text({
  text: 'Drag to move • Tap title to return',
  x: 200,
  y: 40,
  fontSize: 14,
  color: '#d5deff',
  align: 'center'
});

const levelTitle = new Text({
  text: 'Level 1',
  x: 200,
  y: 80,
  fontSize: 20,
  color: '#4fc3f7',
  align: 'center'
});

player.on('drag', (event) => {
  player.x += event.delta.x;
  player.y += event.delta.y;
});

level.add(sky);
level.add(player);
level.add(instruction);
level.add(levelTitle);

// Switch scenes
startButton.on('tap', () => {
  game.transitionTo(level, { duration: 400 });
});

levelTitle.interactive = true;
levelTitle.on('tap', () => {
  game.transitionTo(menu, { duration: 400 });
});

game.setScene(menu);
```

When you switch scenes, the previous scene is automatically cleaned up, stopping all tweens and removing event listeners.

## Organizing Entities

Scenes help you manage groups of entities and query them by tags.

```zap-demo
// Background
scene.add(new Sprite({
  x: 200,
  y: 150,
  width: 400,
  height: 300,
  color: '#0f1a30'
}));

const info = new Text({
  text: 'Tap to remove enemies',
  x: 200,
  y: 32,
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

const counter = new Text({
  text: '',
  x: 200,
  y: 62,
  fontSize: 16,
  color: '#ffffff',
  align: 'center'
});

scene.add(info);
scene.add(counter);

// Create enemies and tag them
const enemyColors = ['#e94560', '#f39c12', '#9b59b6', '#2ecc71', '#4fc3f7'];
for (let i = 0; i < 5; i++) {
  const enemy = new Sprite({
    x: 80 + i * 60,
    y: 180,
    width: 40,
    height: 40,
    radius: 12,
    color: enemyColors[i],
    interactive: true,
    tag: 'enemy'
  });

  enemy.on('tap', () => {
    enemy.destroy();
    updateCounter();
  });

  scene.add(enemy);
}

function updateCounter() {
  const remaining = scene.getEntitiesByTag('enemy').length;
  counter.text = `Enemies remaining: ${remaining}`;
}

updateCounter();
```

### Useful Scene Methods

- `scene.add(entity)` — Add an entity to the scene
- `scene.remove(entity)` — Remove a specific entity
- `scene.clear()` — Remove all entities
- `scene.getEntitiesByTag(tag)` — Find entities by tag
