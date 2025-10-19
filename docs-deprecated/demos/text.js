export default {
  title: 'Text Rendering',
  description: 'Display text with different alignments and styles',
  code: `import { Text } from '@mode-7/zap';

const title = new Text({
  text: 'Hello Zap!',
  x: 200, y: 80,
  fontSize: 32,
  color: '#4fc3f7',
  align: 'center'
});

const subtitle = new Text({
  text: 'Lightweight 2D game engine',
  x: 200, y: 120,
  fontSize: 16,
  color: '#888',
  align: 'center'
});`,
  init: async (container) => {
    const { Game, Scene, Text } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();
    scene.add(new Text({ text: 'Hello Zap!', x: 200, y: 80, fontSize: 32, color: '#4fc3f7', align: 'center' }));
    scene.add(new Text({ text: 'Lightweight 2D game engine', x: 200, y: 120, fontSize: 16, color: '#888', align: 'center' }));
    scene.add(new Text({ text: 'Perfect for playable ads', x: 200, y: 220, fontSize: 14, color: '#ccc', align: 'center' }));

    game.setScene(scene);
    game.start();
    return game;
  }
};
