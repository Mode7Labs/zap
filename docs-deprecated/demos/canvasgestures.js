export default {
  title: 'Canvas Gestures',
  description: 'Tap, swipe, drag, and long press on the canvas',
  code: `// Canvas-level gesture events
// Works just like entity gestures!

game.on('tap', (event) => {
  console.log('Canvas tapped at:', event.position);
  // event.target is the entity if tapped on one, or null
});

game.on('swipe', (event) => {
  console.log('Swiped:', event.direction);
  console.log('Velocity:', event.velocity);
  console.log('Distance:', event.distance);
});

game.on('drag', (event) => {
  console.log('Dragging, delta:', event.delta);
});

game.on('dragstart', (event) => {
  console.log('Drag started at:', event.position);
});

game.on('dragend', (event) => {
  console.log('Drag ended at:', event.position);
});

game.on('longpress', (event) => {
  console.log('Long pressed at:', event.position);
});`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text, ParticleEmitter, delay } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    const title = new Text({
      text: 'Canvas Gesture Events',
      x: 200, y: 20,
      fontSize: 18,
      color: '#4fc3f7',
      align: 'center'
    });

    const gestureText = new Text({
      text: 'Try: tap, swipe, drag, long press',
      x: 200, y: 150,
      fontSize: 14,
      color: '#888',
      align: 'center'
    });

    const swipeIndicator = new Sprite({
      x: 200, y: 150,
      width: 60, height: 60,
      color: '#16a085',
      radius: 30,
      alpha: 0
    });

    // Canvas tap
    game.on('tap', (event) => {
      gestureText.text = `Tap at (${Math.round(event.position.x)}, ${Math.round(event.position.y)})`;
      gestureText.color = '#e94560';

      const circle = new Sprite({
        x: event.position.x,
        y: event.position.y,
        width: 10,
        height: 10,
        color: '#e94560',
        radius: 5
      });
      scene.add(circle);

      circle.tween(
        { scaleX: 3, scaleY: 3, alpha: 0 },
        { duration: 400, onComplete: () => scene.remove(circle) }
      );
    });

    // Canvas swipe
    game.on('swipe', (event) => {
      gestureText.text = `Swipe ${event.direction}!`;
      gestureText.color = '#4fc3f7';

      swipeIndicator.x = event.position.x;
      swipeIndicator.y = event.position.y;
      swipeIndicator.alpha = 1;
      swipeIndicator.scaleX = 1;
      swipeIndicator.scaleY = 1;

      swipeIndicator.tween(
        { alpha: 0, scaleX: 2, scaleY: 2 },
        { duration: 500 }
      );
    });

    // Canvas drag
    let dragTrail = [];
    game.on('dragstart', (event) => {
      gestureText.text = 'Dragging...';
      gestureText.color = '#9b59b6';
      dragTrail = [];
    });

    game.on('drag', (event) => {
      const dot = new Sprite({
        x: event.position.x,
        y: event.position.y,
        width: 5,
        height: 5,
        color: '#9b59b6',
        radius: 2.5,
        alpha: 0.8
      });
      scene.add(dot);
      dragTrail.push(dot);

      delay(500, () => {
        dot.tween({ alpha: 0 }, { duration: 200, onComplete: () => scene.remove(dot) });
      });
    });

    game.on('dragend', (event) => {
      gestureText.text = 'Drag ended';
      gestureText.color = '#888';
    });

    // Canvas long press
    game.on('longpress', (event) => {
      gestureText.text = 'Long press detected!';
      gestureText.color = '#f39c12';

      const burst = new ParticleEmitter({
        x: event.position.x,
        y: event.position.y,
        rate: 0,
        colors: ['#f39c12', '#e94560', '#4fc3f7'],
        sizeRange: { min: 3, max: 6 },
        lifetimeRange: { min: 0.5, max: 1 },
        velocityRange: {
          min: { x: -100, y: -100 },
          max: { x: 100, y: 100 }
        }
      });
      scene.add(burst);
      burst.burst(20);

      delay(1500, () => scene.remove(burst));
    });

    const instructions = new Text({
      text: 'Canvas events: no need to make entities interactive!',
      x: 200, y: 280,
      fontSize: 11,
      color: '#666',
      align: 'center'
    });

    scene.add(title);
    scene.add(gestureText);
    scene.add(swipeIndicator);
    scene.add(instructions);
    game.setScene(scene);
    game.start();
    return game;
  }
};
