---
id: assetloader
title: Asset Loader
category: assets
description: Preload images before starting the game
imports: [AssetLoader, Sprite, Text]
---

# Asset Loader

The AssetLoader helps you preload images before your game starts, ensuring smooth gameplay without loading delays during play.

## Basic Usage

```zap-demo
const loader = new AssetLoader();

function buildBadge(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0b1224';
  ctx.fillRect(0, 0, 96, 96);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(48, 36, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Z', 48, 36);

  ctx.fillStyle = color;
  ctx.fillRect(22, 56, 52, 32);

  return canvas.toDataURL('image/png');
}

const assets = {
  hero: buildBadge('#e94560'),
  ally: buildBadge('#4fc3f7'),
  reward: buildBadge('#f39c12')
};

const status = new Text({
  text: 'Loading assets...',
  x: 200,
  y: 40,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

scene.add(status);

await loader.loadImages(assets);

const hero = new Sprite({
  x: 120,
  y: 160,
  width: 96,
  height: 96,
  radius: 20,
  image: loader.getImage('hero')
});

const ally = new Sprite({
  x: 200,
  y: 160,
  width: 96,
  height: 96,
  radius: 20,
  image: loader.getImage('ally')
});

const reward = new Sprite({
  x: 280,
  y: 160,
  width: 96,
  height: 96,
  radius: 20,
  image: loader.getImage('reward')
});

scene.add(hero);
scene.add(ally);
scene.add(reward);

status.text = loader.hasImage('hero')
  ? 'Assets loaded! Tap a badge to duplicate it.'
  : 'Something went wrong loading assets.';

[hero, ally, reward].forEach((sprite) => {
  sprite.interactive = true;
  sprite.on('tap', () => {
    const dup = new Sprite({
      x: sprite.x + (Math.random() * 80 - 40),
      y: sprite.y + (Math.random() * 80 - 40),
      width: sprite.width,
      height: sprite.height,
      radius: sprite.radius,
      image: sprite.image
    });

    scene.add(dup);
    dup.alpha = 0;
    dup.tween({ alpha: 1, scaleX: 1.1, scaleY: 1.1 }, { duration: 200 })
      .then(() => dup.tween({ scaleX: 1, scaleY: 1 }, { duration: 150 }));
  });
});
```

## API Methods

- `loadImage(key, url)` - Load a single image and cache it
- `loadImages(record)` - Load multiple images at once
- `getImage(key)` - Retrieve a previously loaded image (or `null`)
- `hasImage(key)` - Check if an image is already loaded
- `clear()` - Remove all cached images
