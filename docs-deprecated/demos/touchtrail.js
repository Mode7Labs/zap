export default {
  title: 'Touch Trail',
  description: 'Visual feedback for touch and mouse movements',
  code: `import { Game } from '@mode-7/zap';

// Enable built-in touch trail
const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460',
  enableTouchTrail: true  // Enable touch trail
});

// The trail automatically appears when you
// click and drag or touch the canvas!`,
  init: async (container) => {
    const { Game, Scene, Text } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460',
      enableTouchTrail: true
    });

    const scene = new Scene();

    const text = new Text({
      text: 'Click and drag to draw!',
      x: 200, y: 150,
      fontSize: 18,
      color: '#4fc3f7',
      align: 'center'
    });

    const instructions = new Text({
      text: 'The trail appears automatically when you drag',
      x: 200, y: 180,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    scene.add(text);
    scene.add(instructions);
    game.setScene(scene);
    game.start();
    return game;
  }
};
