export default {
  title: 'Layout Helpers',
  description: 'Position entities with layout utilities',
  code: `import { Layout, Math } from '@mode-7/zap';

// Grid layout
Layout.layoutGrid(sprites, {
  columns: 3,
  rows: 2,
  cellWidth: 60,
  cellHeight: 60,
  spacing: 20,
  startX: 50,
  startY: 80
});

// Circle layout
Layout.layoutCircle(sprites, {
  radius: 80,
  centerX: 200,
  centerY: 150,
  startAngle: 0
});

// Math utilities (clamp, lerp, map, randomInt, etc.)
// are available via Math.* or Layout.* (re-exported)
const value = Math.clamp(position, 0, 100);
const interpolated = Math.lerp(start, end, 0.5);`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text, Layout } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    // Grid layout sprites
    const gridSprites = [];
    const colors = ['#e94560', '#4fc3f7', '#f39c12', '#2ecc71', '#9b59b6', '#e67e22'];

    for (let i = 0; i < 6; i++) {
      gridSprites.push(new Sprite({
        width: 40,
        height: 40,
        color: colors[i],
        radius: 8
      }));
    }

    Layout.layoutGrid(gridSprites, {
      columns: 3,
      rows: 2,
      cellWidth: 40,
      cellHeight: 40,
      spacing: 10,
      startX: 30,
      startY: 80
    });

    gridSprites.forEach(s => scene.add(s));
    scene.add(new Text({ text: 'Grid', x: 90, y: 40, fontSize: 14, color: '#888', align: 'center' }));

    // Circle layout sprites
    const circleSprites = [];
    for (let i = 0; i < 8; i++) {
      circleSprites.push(new Sprite({
        width: 30,
        height: 30,
        color: colors[i % colors.length],
        radius: 15
      }));
    }

    Layout.layoutCircle(circleSprites, {
      radius: 70,
      centerX: 290,
      centerY: 150,
      startAngle: 0
    });

    circleSprites.forEach(s => scene.add(s));
    scene.add(new Text({ text: 'Circle', x: 290, y: 40, fontSize: 14, color: '#888', align: 'center' }));

    game.setScene(scene);
    game.start();
    return game;
  }
};
