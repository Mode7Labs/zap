export default {
  title: 'Swipe Gesture',
  description: 'Swipe the sprite to move it',
  code: `sprite.on('swipe', (event) => {
  console.log('Direction:', event.direction);

  if (event.direction === 'left') sprite.x -= 50;
  if (event.direction === 'right') sprite.x += 50;
  if (event.direction === 'up') sprite.y -= 50;
  if (event.direction === 'down') sprite.y += 50;
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
      width: 60, height: 60,
      color: '#16a085',
      radius: 10,
      interactive: true
    });

    sprite.on('swipe', (event) => {
      if (event.direction === 'left') sprite.x -= 50;
      if (event.direction === 'right') sprite.x += 50;
      if (event.direction === 'up') sprite.y -= 50;
      if (event.direction === 'down') sprite.y += 50;
    });

    const text = new Text({
      text: 'Swipe me!',
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
