export default {
  title: 'Sprites & Shapes',
  description: 'Different sprite shapes with colors and rounded corners',
  code: `import { Sprite } from '@mode-7/zap';

// Circle
const circle = new Sprite({
  x: 100, y: 150,
  width: 60, height: 60,
  color: '#e94560',
  radius: 30 // Half of width = circle
});

// Rectangle
const rect = new Sprite({
  x: 200, y: 150,
  width: 80, height: 60,
  color: '#16a085',
  radius: 0
});

// Rounded rectangle
const rounded = new Sprite({
  x: 320, y: 150,
  width: 80, height: 60,
  color: '#f39c12',
  radius: 15
});`,
  init: async (container) => {
    const { Game, Scene, Sprite } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    scene.add(new Sprite({ x: 100, y: 150, width: 60, height: 60, color: '#e94560', radius: 30 }));
    scene.add(new Sprite({ x: 200, y: 150, width: 80, height: 60, color: '#16a085', radius: 0 }));
    scene.add(new Sprite({ x: 320, y: 150, width: 80, height: 60, color: '#f39c12', radius: 15 }));

    game.setScene(scene);
    game.start();
    return game;
  }
};
