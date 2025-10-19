---
id: images
title: Image Sprites
category: entities
description: Load and display images from remote URLs
imports: [Sprite, Text]
---

# Image Sprites

Load and display images from local assets or remote URLs with automatic loading and optional circular cropping.

## Basic Image Loading

```zap-demo
// Showcase sprite pulled from /assets/pixel-girl.png
const pixelHero = new Sprite({
  x: 140,
  y: 160,
  width: 160,
  height: 160,
  image: '/assets/pixel-girl.png'
});

const heroLabel = new Text({
  text: 'Full sprite',
  x: 140,
  y: 250,
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

// Circular avatar cropped from the same image
const avatar = new Sprite({
  x: 300,
  y: 160,
  width: 110,
  height: 110,
  radius: 55,
  color: '#0b1224',
  interactive: true
});

const avatarLabel = new Text({
  text: 'Circle crop + imageload event',
  x: 300,
  y: 250,
  fontSize: 14,
  color: '#4fc3f7',
  align: 'center'
});

avatar.on('imageload', () => {
  avatar.tween(
    { scaleX: 1.1, scaleY: 1.1 },
    { duration: 140, easing: 'easeOutBack' }
  ).then(() => {
    avatar.tween({ scaleX: 1, scaleY: 1 }, { duration: 120 });
  });
});

scene.add(pixelHero);
scene.add(heroLabel);
scene.add(avatar);
scene.add(avatarLabel);

await avatar.loadImage('/assets/pixel-girl.png');
```
