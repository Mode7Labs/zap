export default {
  title: 'Image Sprites',
  description: 'Load and display images from remote URLs',
  code: `import { Sprite } from '@mode-7/zap';

const sprite = new Sprite({
  x: 200,
  y: 150,
  width: 100,
  height: 100,
  image: 'https://files.reimage.dev/playspark/aa03381654cb/original.webp',
  radius: 50 // Circular crop
});

sprite.on('imageload', () => {
  console.log('Image loaded!');
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
    const sprite = new Sprite({
      x: 200, y: 150,
      width: 100, height: 100,
      image: 'https://files.reimage.dev/playspark/aa03381654cb/original.webp',
      radius: 50
    });

    scene.add(sprite);
    game.setScene(scene);
    game.start();
    return game;
  }
};
