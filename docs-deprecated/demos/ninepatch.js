export default {
  title: 'Nine-Patch',
  description: 'Scalable UI panels without distortion',
  code: `import { NinePatch, Text } from '@mode-7/zap';

// Create nine-patch panel with decorative corners
const panel = new NinePatch({
  x: 200, y: 150,
  width: 200, height: 150,
  image: 'panel.png',
  corners: 16  // Corner size stays fixed
});

// Add UI elements inside
const title = new Text({
  text: 'Dialog Title',
  x: 200, y: 100
});

panel.add(title);

// Resize panel - corners stay sharp!
panel.tween(
  { width: 300, height: 200 },
  { duration: 1000 }
);`,
  init: async (container) => {
    const { Game, Scene, NinePatch, Text, Sprite } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    // Create a nine-patch image programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 64, 64);

    // Border
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 62, 62);

    // Decorative corners (16x16 patches)
    ctx.fillStyle = '#4fc3f7';
    // Top-left corner decoration
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Top-right corner decoration
    ctx.beginPath();
    ctx.arc(56, 8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-left corner decoration
    ctx.beginPath();
    ctx.arc(8, 56, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bottom-right corner decoration
    ctx.beginPath();
    ctx.arc(56, 56, 6, 0, Math.PI * 2);
    ctx.fill();

    // Inner border accent
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, 56, 56);

    const img = new Image();
    img.src = canvas.toDataURL();

    await new Promise(resolve => {
      img.onload = resolve;
    });

    // Create nine-patch panel
    const panel = new NinePatch({
      x: 200,
      y: 150,
      width: 180,
      height: 140,
      image: img,
      corners: 16  // 16px corners stay fixed
    });

    // Add title inside panel
    const title = new Text({
      text: 'Dialog Panel',
      x: 200,
      y: 110,
      fontSize: 18,
      color: '#4fc3f7',
      align: 'center',
      baseline: 'middle'
    });

    // Add description
    const description = new Text({
      text: 'Corners stay sharp',
      x: 200,
      y: 140,
      fontSize: 13,
      color: '#aaa',
      align: 'center',
      baseline: 'middle'
    });

    // Add button inside panel
    const button = new Sprite({
      x: 200,
      y: 175,
      width: 100,
      height: 30,
      color: '#2ecc71',
      radius: 6
    });

    const buttonText = new Text({
      text: 'OK',
      x: 200,
      y: 175,
      fontSize: 14,
      color: '#ffffff',
      align: 'center',
      baseline: 'middle'
    });

    const subtitle = new Text({
      text: 'Watch the decorative corners stay fixed',
      x: 200,
      y: 260,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    // Animate size - corners won't distort!
    let growing = true;
    function animate() {
      const targetWidth = growing ? 280 : 180;
      const targetHeight = growing ? 200 : 140;

      panel.tween(
        { width: targetWidth, height: targetHeight },
        {
          duration: 2000,
          easing: 'easeInOutQuad',
          onComplete: () => {
            growing = !growing;
            animate();
          }
        }
      );

      // Move button to stay at bottom of panel
      button.tween(
        { y: growing ? 205 : 175 },
        { duration: 2000, easing: 'easeInOutQuad' }
      );

      buttonText.tween(
        { y: growing ? 205 : 175 },
        { duration: 2000, easing: 'easeInOutQuad' }
      );

      // Move description
      description.tween(
        { y: growing ? 155 : 140 },
        { duration: 2000, easing: 'easeInOutQuad' }
      );
    }

    animate();

    scene.add(panel);
    scene.add(title);
    scene.add(description);
    scene.add(button);
    scene.add(buttonText);
    scene.add(subtitle);

    game.setScene(scene);
    game.start();
    return game;
  }
};
