---
id: quickstart
title: Quick Start
category: core
description: Create your first game in minutes
imports: [Game, Scene, Sprite, Text]
---

# Quick Start

Create a simple interactive game with just a few lines of code. This guide walks you through the essential steps to get started with Zap.

## Your First Game

```zap-demo
// Create a background
const background = new Sprite({
  x: 200,
  y: 150,
  width: 400,
  height: 300,
  color: '#101830'
});

// Create a player sprite
const player = new Sprite({
  x: 200,
  y: 150,
  width: 60,
  height: 60,
  radius: 16,
  color: '#e94560',
  interactive: true,
  tag: 'player'
});

// Display score
let score = 0;
const scoreLabel = new Text({
  text: 'Score: 0',
  x: 200,
  y: 32,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

// Tap to jump and earn points
player.on('tap', () => {
  score += 1;
  scoreLabel.text = `Score: ${score}`;

  player.tween(
    { y: player.y - 60 },
    { duration: 200, easing: 'easeOutQuad' }
  ).then(() => {
    player.tween(
      { y: 150 },
      { duration: 250, easing: 'easeInQuad' }
    );
  });
});

scene.add(background);
scene.add(player);
scene.add(scoreLabel);
```

## What's Happening?

1. **Sprite:** A visual game object with position, size, and color
2. **Interaction:** Makes the sprite respond to tap/click events (`interactive: true`)
3. **Animation:** Uses tweening helpers to animate the sprite smoothly
4. **Scene:** The game scene is already created for you in every Zap demo

All Zap entities support gestures (tap, swipe, drag), animations, and parent-child hierarchies out of the box.

## Next Steps

Now that you've created your first game, explore:

- **Game Configuration** - Learn about all available options including FPS control, debug mode, and rendering quality
- **Scenes** - Manage multiple game states like menus, levels, and game over screens
- **Gestures** - Add tap, swipe, drag, and pinch interactions
- **Animations** - Tween properties with easing functions
