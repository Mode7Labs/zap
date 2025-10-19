export default {
  title: 'Collision Detection',
  description: 'Automatic collision detection with events',
  code: `// Enable automatic collision detection
const player = new Sprite({
  x: 200, y: 150,
  width: 50, height: 50,
  color: '#e94560',
  checkCollisions: true,      // Enable collision checking
  collisionTags: ['coin']      // Only collide with 'coin' tagged entities
});

// Create collectible coin
const coin = new Sprite({
  x: 300, y: 150,
  width: 30, height: 30,
  color: '#f39c12',
  radius: 15
});
coin.addTag('coin');

// Listen for collision events
player.on('collide', (event) => {
  scene.remove(event.other);  // Remove the coin
  console.log('Collected!');
});

// Also available for manual checking:
if (sprite1.intersects(sprite2)) {
  console.log('Manual collision check!');
}`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    let score = 0;

    const player = new Sprite({
      x: 150, y: 150,
      width: 50, height: 50,
      color: '#e94560',
      radius: 10,
      interactive: true,
      checkCollisions: true,
      collisionTags: ['coin']
    });

    const scoreText = new Text({
      text: 'Score: 0',
      x: 200, y: 30,
      fontSize: 16,
      color: '#4fc3f7',
      align: 'center'
    });

    const instructions = new Text({
      text: 'Drag player to collect coins',
      x: 200, y: 270,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    // Create coins
    const coins = [];
    for (let i = 0; i < 5; i++) {
      const coin = new Sprite({
        x: 100 + i * 60,
        y: 80 + Math.random() * 140,
        width: 25,
        height: 25,
        color: '#f39c12',
        radius: 12.5
      });
      coin.addTag('coin');
      coins.push(coin);
      scene.add(coin);
    }

    // Listen for collisions
    player.on('collide', (event) => {
      const coin = event.other;
      scene.remove(coin);
      score++;
      scoreText.text = `Score: ${score}`;

      if (score === 5) {
        scoreText.text = 'All collected!';
        setTimeout(() => {
          score = 0;
          scoreText.text = 'Score: 0';
          coins.forEach(coin => {
            coin.x = 100 + Math.random() * 200;
            coin.y = 80 + Math.random() * 140;
            scene.add(coin);
          });
        }, 2000);
      }
    });

    player.on('drag', (event) => {
      player.x += event.delta.x;
      player.y += event.delta.y;
    });

    scene.add(player);
    scene.add(scoreText);
    scene.add(instructions);
    game.setScene(scene);
    game.start();
    return game;
  }
};
