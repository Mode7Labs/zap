export default {
  title: 'Tap Gesture',
  description: 'Tap the sprite to trigger animations',
  code: `const sprite = new Sprite({
  x: 200, y: 150,
  width: 80, height: 80,
  color: '#e94560',
  interactive: true // Enable gestures
});

sprite.on('tap', () => {
  sprite.tween(
    { rotation: sprite.rotation + Math.PI },
    { duration: 300, easing: 'easeOutBack' }
  );
});`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text, Easing } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();
    const sprite = new Sprite({
      x: 200, y: 150,
      width: 80, height: 80,
      color: '#e94560',
      radius: 10,
      interactive: true
    });

    sprite.on('tap', () => {
      sprite.tween(
        { rotation: sprite.rotation + Math.PI },
        { duration: 300, easing: Easing.easeOutBack }
      );
    });

    const text = new Text({
      text: 'Tap me!',
      x: 200, y: 240,
      fontSize: 16,
      color: '#888',
      align: 'center'
    });

    scene.add(sprite);
    scene.add(text);
    game.setScene(scene);
    game.start();
    return game;
  }
};
