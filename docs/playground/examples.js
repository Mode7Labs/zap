// Example code templates for the playground

import { ZAP_CDN_URL } from './config.js';

export const examples = {
  default: `import { Game, Scene } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

game.setScene(scene);
game.start();`,

  basic: `import { Game, Scene, Sprite } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

const sprite = new Sprite({
  x: game.width / 2,
  y: game.height / 2,
  width: 100,
  height: 100,
  color: '#667eea',
  radius: 12
});

scene.add(sprite);
game.setScene(scene);
game.start();`,

  circle: `import { Game, Scene, Sprite } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

const circle = new Sprite({
  x: game.width / 2,
  y: game.height / 2,
  width: 100,
  height: 100,
  radius: 50,
  color: '#ff6b6b'
});

scene.add(circle);
game.setScene(scene);
game.start();`,

  animation: `import { Game, Scene, Sprite } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

const sprite = new Sprite({
  x: 100,
  y: game.height / 2,
  width: 80,
  height: 80,
  color: '#51cf66',
  radius: 40
});

scene.add(sprite);

function animate() {
  sprite.tween(
    { x: game.width - 100 },
    {
      duration: 2000,
      easing: 'easeInOutCubic',
      onComplete: () => {
        sprite.tween(
          { x: 100 },
          { duration: 2000, easing: 'easeInOutCubic', onComplete: animate }
        );
      }
    }
  );
}

animate();
game.setScene(scene);
game.start();`,

  interactive: `import { Game, Scene, Sprite } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

const sprite = new Sprite({
  x: game.width / 2,
  y: game.height / 2,
  width: 100,
  height: 100,
  radius: 50,
  color: '#667eea',
  interactive: true
});

sprite.on('tap', () => {
  sprite.tween(
    { rotation: sprite.rotation + Math.PI * 2, scaleX: 1.5, scaleY: 1.5 },
    { duration: 300, easing: 'easeOutBack' }
  ).then(() => {
    sprite.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 200 }
    );
  });
});

sprite.on('drag', (e) => {
  sprite.x = e.position.x;
  sprite.y = e.position.y;
});

scene.add(sprite);
game.setScene(scene);
game.start();`,

  particles: `import { Game, Scene, ParticleEmitter } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

const emitter = new ParticleEmitter({
  x: game.width / 2,
  y: game.height / 2,
  rate: 50,
  colors: ['#ff6b6b', '#51cf66', '#667eea', '#ffd43b'],
  velocityRange: {
    min: { x: -100, y: -100 },
    max: { x: 100, y: 100 }
  },
  sizeRange: { min: 3, max: 8 },
  lifetimeRange: { min: 1, max: 2 }
});

scene.add(emitter);
game.setScene(scene);
game.start();`,

  game: `import { Game, Scene, Sprite, Text } from '${ZAP_CDN_URL}';

const game = new Game({
  parent: '#app',
  backgroundColor: '#1a1a2e',
  responsive: true
});

const scene = new Scene();

let score = 0;
const scoreText = new Text({
  text: 'Score: 0',
  x: game.width / 2,
  y: 50,
  fontSize: 24,
  color: '#fff',
  align: 'center'
});
scene.add(scoreText);

const player = new Sprite({
  x: game.width / 2,
  y: game.height - 100,
  width: 60,
  height: 60,
  radius: 30,
  color: '#667eea',
  interactive: true,
  checkCollisions: true,
  collisionTags: ['collectible']
});

player.on('drag', (e) => {
  player.x = Math.max(30, Math.min(game.width - 30, e.position.x));
});

player.on('collide', (event) => {
  const circle = event.other;
  score++;
  scoreText.text = 'Score: ' + score;
  scene.remove(circle);

  player.tween(
    { scaleX: 1.2, scaleY: 1.2 },
    { duration: 100 }
  ).then(() => {
    player.tween({ scaleX: 1, scaleY: 1 }, { duration: 100 });
  });
});

scene.add(player);

function spawnCircle() {
  const circle = new Sprite({
    x: Math.random() * (game.width - 40) + 20,
    y: -50,
    width: 40,
    height: 40,
    radius: 20,
    color: '#51cf66'
  });

  circle.addTag('collectible');
  scene.add(circle);

  circle.tween(
    { y: game.height + 50 },
    { duration: 3000, easing: 'linear' }
  ).then(() => {
    scene.remove(circle);
  });
}

setInterval(spawnCircle, 1000);

game.setScene(scene);
game.start();`
};
