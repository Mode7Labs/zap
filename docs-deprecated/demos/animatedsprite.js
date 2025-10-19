export default {
  title: 'Animated Sprites',
  description: 'Frame-based sprite sheet animations',
  code: `import { AnimatedSprite } from '@mode-7/zap';

const character = new AnimatedSprite({
  x: 200, y: 150,
  width: 64, height: 64,
  image: 'spritesheet.png',
  frameWidth: 64,
  frameHeight: 64,
  animations: {
    walk: { frames: [0, 1, 2, 3], fps: 10, loop: true },
    jump: { frames: [4, 5, 6], fps: 15, loop: false }
  }
});

// Play animation
character.play('walk');

// Listen for completion
character.on('animationcomplete', (name) => {
  console.log(\`\${name} finished!\`);
});`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text, interval } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    // Create animated sprite with color blocks as frames
    const sprite = new Sprite({
      x: 200, y: 150,
      width: 60, height: 60,
      color: '#e94560',
      radius: 10
    });

    // Simulate frame animation with color changes
    let frame = 0;
    const colors = ['#e94560', '#4fc3f7', '#f39c12', '#2ecc71'];

    interval(200, () => {
      frame = (frame + 1) % colors.length;
      sprite.color = colors[frame];
    });

    const text = new Text({
      text: 'Simulated Animation',
      x: 200, y: 240,
      fontSize: 14,
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
