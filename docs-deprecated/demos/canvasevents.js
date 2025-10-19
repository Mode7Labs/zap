export default {
  title: 'Canvas Events',
  description: 'Listen to pointer events on the canvas',
  code: `// Canvas-level pointer events
// Position is automatically converted to game coordinates!

game.on('pointerdown', (event) => {
  console.log('Pointer down at:', event.position);
  // event.originalEvent contains the raw browser event
});

game.on('pointermove', (event) => {
  console.log('Moving at:', event.position);
});

game.on('pointerup', (event) => {
  console.log('Pointer up at:', event.position);
});

game.on('click', (event) => {
  console.log('Clicked at:', event.position);
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

    const title = new Text({
      text: 'Canvas Pointer Events',
      x: 200, y: 30,
      fontSize: 18,
      color: '#4fc3f7',
      align: 'center'
    });

    const posText = new Text({
      text: 'Click anywhere on the canvas',
      x: 200, y: 150,
      fontSize: 14,
      color: '#888',
      align: 'center'
    });

    const marker = new Sprite({
      x: -100, y: -100,
      width: 20, height: 20,
      color: '#e94560',
      radius: 10,
      alpha: 0
    });

    // Listen to canvas events
    game.on('pointerdown', (event) => {
      marker.x = event.position.x;
      marker.y = event.position.y;
      marker.alpha = 1;
      posText.text = `Click at (${Math.round(event.position.x)}, ${Math.round(event.position.y)})`;
      posText.color = '#4fc3f7';

      marker.tween(
        { alpha: 0, scaleX: 2, scaleY: 2 },
        { duration: 500, easing: Easing.easeOutQuad, onComplete: () => {
          marker.scaleX = 1;
          marker.scaleY = 1;
        }}
      );
    });

    game.on('pointermove', (event) => {
      if (event.originalEvent.buttons > 0) {
        // Dragging
        posText.text = `Drag at (${Math.round(event.position.x)}, ${Math.round(event.position.y)})`;
        posText.color = '#f39c12';
      }
    });

    const instructions = new Text({
      text: 'Events work with both mouse and touch',
      x: 200, y: 270,
      fontSize: 12,
      color: '#666',
      align: 'center'
    });

    scene.add(title);
    scene.add(posText);
    scene.add(marker);
    scene.add(instructions);
    game.setScene(scene);
    game.start();
    return game;
  }
};
