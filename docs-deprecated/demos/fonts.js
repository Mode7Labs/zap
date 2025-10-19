export default {
  title: 'Google Fonts',
  description: 'Load and use Google Fonts dynamically',
  code: `import { loadGoogleFont, Text } from '@mode-7/zap';

// Load Google Font
await loadGoogleFont('Poppins', [600]);

const text = new Text({
  text: 'Styled with Poppins',
  x: 200, y: 150,
  fontSize: 28,
  fontFamily: 'Poppins, sans-serif',
  color: '#f39c12',
  align: 'center'
});`,
  init: async (container) => {
    const { Game, Scene, Text, loadGoogleFont } = await import('/dist/index.mjs');

    await loadGoogleFont('Poppins', [600]);

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();
    scene.add(new Text({
      text: 'Styled with Poppins',
      x: 200, y: 150,
      fontSize: 28,
      fontFamily: 'Poppins, sans-serif',
      color: '#f39c12',
      align: 'center'
    }));

    game.setScene(scene);
    game.start();
    return game;
  }
};
