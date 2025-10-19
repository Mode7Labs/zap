export default {
  title: 'Animations',
  description: 'Tween sprite properties with chaining',
  code: `// Simple tween
sprite.tween(
  { x: 350, rotation: Math.PI * 2 },
  { duration: 1000, easing: 'easeInOutQuad' }
);

// Chain tweens with .then()
sprite.tween(
  { x: 350 },
  { duration: 500 }
).then(() => {
  // This runs when first tween completes
  sprite.tween(
    { y: 250 },
    { duration: 500 }
  ).then(() => {
    console.log('All animations complete!');
  });
});`,
  init: async (container) => {
    const { Game, Scene, Sprite, Easing } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();
    const sprite = new Sprite({
      x: 50, y: 150,
      width: 50, height: 50,
      color: '#e74c3c',
      radius: 8
    });

    function animate() {
      sprite.tween(
        { x: 350, rotation: Math.PI * 2 },
        {
          duration: 1500,
          easing: Easing.easeInOutQuad,
          onComplete: () => {
            sprite.rotation = 0;
            sprite.tween(
              { x: 50 },
              { duration: 1500, easing: Easing.easeInOutQuad, onComplete: animate }
            );
          }
        }
      );
    }
    animate();

    scene.add(sprite);
    game.setScene(scene);
    game.start();
    return game;
  }
};
