export default {
  title: 'Camera Control',
  description: 'Follow targets, zoom, and screen shake',
  code: `import { Camera } from '@mode-7/zap';

// Follow a target
game.camera.follow(player);

// Zoom in/out
game.camera.setZoom(1.5);

// Screen shake (intensity, duration)
game.camera.shake(3, 400);

// Pan to position
game.camera.panTo(500, 300, 1000);`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    const player = new Sprite({
      x: 200, y: 150,
      width: 40, height: 40,
      color: '#e94560',
      radius: 20,
      interactive: true
    });

    player.on('drag', (event) => {
      player.x += event.delta.x;
      player.y += event.delta.y;
    });

    const zoomButton = new Sprite({
      x: 150, y: 50,
      width: 100, height: 35,
      color: '#16213e',
      radius: 8,
      interactive: true
    });

    const zoomLabel = new Text({
      text: 'Zoom',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    zoomButton.addChild(zoomLabel);

    const shakeButton = new Sprite({
      x: 270, y: 50,
      width: 100, height: 35,
      color: '#16213e',
      radius: 8,
      interactive: true
    });

    const shakeLabel = new Text({
      text: 'Shake',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    shakeButton.addChild(shakeLabel);

    let zoomed = false;
    zoomButton.on('tap', () => {
      zoomed = !zoomed;
      game.camera.setZoom(zoomed ? 1.5 : 1);
    });

    shakeButton.on('tap', () => {
      game.camera.shake(3, 400);
    });

    const instruction = new Text({
      text: 'Drag player • Zoom • Shake',
      x: 200, y: 270,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    scene.add(player);
    scene.add(zoomButton);
    scene.add(shakeButton);
    scene.add(instruction);
    game.setScene(scene);
    game.start();
    return game;
  }
};
