---
id: animatedsprite
title: Animated Sprites
category: entities
description: Frame-based sprite sheet animations
imports: [AnimatedSprite, Text]
---

# Animated Sprites

Create frame-based sprite sheet animations with configurable frame rates and looping. AnimatedSprite allows you to define multiple named animations and play them on demand.

## Animation States

```zap-demo
function createSpriteSheet() {
  const frameSize = 64;
  const columns = 4;
  const rows = 2;
  const canvas = document.createElement('canvas');
  canvas.width = frameSize * columns;
  canvas.height = frameSize * rows;
  const ctx = canvas.getContext('2d');

  const colors = ['#e94560', '#f39c12', '#2ecc71', '#4fc3f7'];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const x = col * frameSize;
      const y = row * frameSize;

      // Body
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x + 16, y + 8, 32, 40);

      // Head
      ctx.beginPath();
      ctx.arc(x + 32, y + 18, 12, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#111';
      ctx.fillRect(x + 26, y + 14, 4, 4);
      ctx.fillRect(x + 34, y + 14, 4, 4);

      // Arms
      ctx.fillStyle = colors[(index + 1) % colors.length];
      ctx.fillRect(x + 10, y + 24, 12, 10 + row * 6);
      ctx.fillRect(x + 42, y + 24, 12, 10 + row * 6);

      // Legs
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 20, y + 48, 8, 16 + row * 4);
      ctx.fillRect(x + 36, y + 48, 8, 16 + row * 4);
    }
  }

  return canvas.toDataURL();
}

const spriteSheet = createSpriteSheet();

const ground = new Sprite({
  x: 200,
  y: 220,
  width: 320,
  height: 14,
  radius: 7,
  color: '#14213d'
});

const hero = new AnimatedSprite({
  x: 200,
  y: 180,
  width: 72,
  height: 72,
  image: spriteSheet,
  frameWidth: 64,
  frameHeight: 64,
  animations: {
    idle: { frames: [0, 1, 2, 3], fps: 6, loop: true },
    jump: { frames: [4, 5, 6, 7], fps: 14, loop: false }
  },
  interactive: true
});

const status = new Text({
  text: 'Tap hero to jump',
  x: 200,
  y: 260,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

const shadow = new Sprite({
  x: hero.x,
  y: ground.y + 6,
  width: 90,
  height: 18,
  radius: 9,
  color: '#0b1024',
  alpha: 0.35
});

scene.add(ground);
scene.add(shadow);
scene.add(hero);
scene.add(status);

hero.play('idle');

const startY = hero.y;
let jumping = false;

hero.on('tap', () => {
  if (jumping) return;
  jumping = true;
  status.text = 'Jump!';
  hero.play('jump', { loop: false });

  shadow.tween({ scaleX: 0.6, alpha: 0.2 }, { duration: 160, easing: 'easeOutQuad' });

  hero.tween({ y: startY - 70 }, {
    duration: 180,
    easing: 'easeOutQuad'
  }).then(() => {
    hero.tween({ y: startY }, {
      duration: 220,
      easing: 'easeInQuad'
    }).then(() => {
      shadow.tween({ scaleX: 1, alpha: 0.35 }, { duration: 160, easing: 'easeOutQuad' });
      hero.play('idle');
      status.text = 'Tap hero to jump';
      jumping = false;
    });
  });
});

hero.on('animationcomplete', (name) => {
  if (name === 'jump' && jumping) {
    // Ensure we return to idle even if tween finishes slightly later
    hero.play('idle');
  }
});
```

## Creating Animated Sprites

```javascript
const character = new AnimatedSprite({
  x: 200,
  y: 150,
  width: 64,
  height: 64,
  image: 'spritesheet.png',
  frameWidth: 64,
  frameHeight: 64,
  animations: {
    walk: { frames: [0, 1, 2, 3], fps: 8, loop: true },
    jump: { frames: [4, 5, 6, 7], fps: 12, loop: false }
  }
});

character.play('walk');

character.on('animationcomplete', (name) => {
  console.log(`${name} animation finished`);
});
```
