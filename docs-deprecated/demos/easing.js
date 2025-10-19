export default {
  title: 'Easing Functions',
  description: 'Different easing effects for animations',
  code: `// Linear
sprite1.tween({ y: 250 }, { duration: 1000, easing: 'linear' });

// Bounce
sprite2.tween({ y: 250 }, { duration: 1000, easing: 'easeOutBounce' });

// Elastic
sprite3.tween({ y: 250 }, { duration: 1000, easing: 'easeOutElastic' });`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text, Easing } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    const s1 = new Sprite({ x: 80, y: 50, width: 40, height: 40, color: '#e94560', radius: 20 });
    const s2 = new Sprite({ x: 200, y: 50, width: 40, height: 40, color: '#4fc3f7', radius: 20 });
    const s3 = new Sprite({ x: 320, y: 50, width: 40, height: 40, color: '#f39c12', radius: 20 });

    scene.add(new Text({ text: 'Linear', x: 80, y: 20, fontSize: 12, color: '#888', align: 'center' }));
    scene.add(new Text({ text: 'Bounce', x: 200, y: 20, fontSize: 12, color: '#888', align: 'center' }));
    scene.add(new Text({ text: 'Elastic', x: 320, y: 20, fontSize: 12, color: '#888', align: 'center' }));

    function animate() {
      s1.y = 50;
      s2.y = 50;
      s3.y = 50;

      s1.tween({ y: 230 }, { duration: 1500, easing: Easing.linear });
      s2.tween({ y: 230 }, { duration: 1500, easing: Easing.easeOutBounce });
      s3.tween({ y: 230 }, { duration: 1500, easing: Easing.easeOutElastic, onComplete: () => {
        setTimeout(animate, 500);
      }});
    }
    animate();

    scene.add(s1);
    scene.add(s2);
    scene.add(s3);
    game.setScene(scene);
    game.start();
    return game;
  }
};
