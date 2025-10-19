export default {
  title: 'Drag Gesture',
  description: 'Drag sprites around the canvas',
  code: `sprite.on('drag', (event) => {
  sprite.x += event.delta.x;
  sprite.y += event.delta.y;
});`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();
    const sprite = new Sprite({
      x: 200, y: 150,
      width: 70, height: 70,
      color: '#9b59b6',
      radius: 10,
      interactive: true
    });

    sprite.on('drag', (event) => {
      sprite.x += event.delta.x;
      sprite.y += event.delta.y;
    });

    const text = new Text({
      text: 'Drag me around!',
      x: 200, y: 30,
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
