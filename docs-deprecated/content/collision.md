---
id: collision
title: Collision Detection
category: core
description: Automatic collision detection with events
imports: [Sprite, Text]
---

# Collision Detection

Zap provides automatic collision detection between entities with event-based handling and tag filtering for performance.

## Basic Collision Setup

```zap-demo
// Enable automatic collision detection
const player = new Sprite({
  x: 200, y: 150,
  width: 50, height: 50,
  color: '#e94560',
  checkCollisions: true,      // Enable collision checking
  collisionTags: ['coin']      // Only collide with 'coin' tagged entities
});

// Create collectible coin
const coin = new Sprite({
  x: 300, y: 150,
  width: 30, height: 30,
  color: '#f39c12',
  radius: 15
});
coin.addTag('coin');

const status = new Text({
  text: 'Collect the coin',
  x: 200, y: 260,
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

// Listen for collision events
player.on('collide', (event) => {
  scene.remove(event.other);  // Remove the coin
  status.text = 'Coin collected!';
  status.color = '#2ecc71';
});

scene.add(player);
scene.add(coin);
scene.add(status);
```

## Collision with Score Tracking

```zap-demo
let score = 0;

const player = new Sprite({
  x: 150, y: 150,
  width: 50, height: 50,
  color: '#e94560',
  radius: 10,
  interactive: true,
  checkCollisions: true,
  collisionTags: ['coin']
});

const scoreText = new Text({
  text: 'Score: 0',
  x: 200, y: 30,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

// Create multiple coins
const coins = [];
for (let i = 0; i < 5; i++) {
  const coin = new Sprite({
    x: 100 + i * 60,
    y: 80 + Math.random() * 140,
    width: 25,
    height: 25,
    color: '#f39c12',
    radius: 12.5
  });
  coin.addTag('coin');
  coins.push(coin);
  scene.add(coin);
}

// Handle collisions
player.on('collide', (event) => {
  const coin = event.other;
  scene.remove(coin);
  score++;
  scoreText.text = `Score: ${score}`;
});

player.on('drag', (event) => {
  player.x += event.delta.x;
  player.y += event.delta.y;
});

scene.add(player);
scene.add(scoreText);
```

## Manual Collision Check

```zap-demo
const sprite1 = new Sprite({
  x: 150, y: 150,
  width: 50, height: 50,
  color: '#e94560'
});

const sprite2 = new Sprite({
  x: 250, y: 150,
  width: 50, height: 50,
  color: '#4fc3f7'
});

// Manual collision checking
if (sprite1.intersects(sprite2)) {
  console.log('Manual collision check!');
}

scene.add(sprite1);
scene.add(sprite2);
```
