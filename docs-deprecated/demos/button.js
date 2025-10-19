export default {
  title: 'Button',
  description: 'Interactive UI button component',
  code: `import { Button } from '@mode-7/zap';

const startButton = new Button({
  x: 200, y: 150,
  width: 150, height: 50,
  text: 'Start Game',
  backgroundColor: '#e94560',
  hoverColor: '#ff547c',
  pressColor: '#d13650',
  fontSize: 18,
  onClick: () => {
    console.log('Button clicked!');
  }
});

// Update button text
startButton.setText('Loading...');
startButton.disable();`,
  init: async (container) => {
    const { Game, Scene, Button, Text, delay } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    const button = new Button({
      x: 200, y: 150,
      width: 150, height: 50,
      text: 'Click Me!',
      backgroundColor: '#e94560',
      hoverColor: '#ff547c',
      pressColor: '#d13650',
      fontSize: 18,
      onClick: () => {
        button.setText('Clicked!');
        delay(500, () => {
          button.setText('Click Me!');
        });
      }
    });

    const instruction = new Text({
      text: 'Click the button',
      x: 200, y: 240,
      fontSize: 14,
      color: '#888',
      align: 'center'
    });

    scene.add(button);
    scene.add(instruction);
    game.setScene(scene);
    game.start();
    return game;
  }
};
