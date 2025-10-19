export default {
  title: 'Particle Effects',
  description: 'Create particle explosions and effects',
  code: `import { ParticleEmitter } from '@mode-7/zap';

const emitter = new ParticleEmitter({
  x: 200, y: 150,
  rate: 0,
  colors: ['#e94560', '#4fc3f7', '#f39c12'],
  sizeRange: { min: 3, max: 8 },
  lifetimeRange: { min: 0.5, max: 1.2 }
});

canvas.addEventListener('click', () => {
  emitter.burst(30);
});`,
  init: async (container) => {
    const { Game, Scene, ParticleEmitter, Text } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();
    const emitter = new ParticleEmitter({
      x: 200, y: 150,
      rate: 0,
      colors: ['#e94560', '#4fc3f7', '#f39c12'],
      sizeRange: { min: 3, max: 8 },
      lifetimeRange: { min: 0.5, max: 1.2 },
      velocityRange: {
        min: { x: -150, y: -150 },
        max: { x: 150, y: 150 }
      }
    });

    const text = new Text({
      text: 'Click anywhere!',
      x: 200, y: 30,
      fontSize: 16,
      color: '#888',
      align: 'center'
    });

    game.canvas.addEventListener('click', () => {
      emitter.burst(30);
    });

    scene.add(emitter);
    scene.add(text);
    game.setScene(scene);
    game.start();
    return game;
  }
};
