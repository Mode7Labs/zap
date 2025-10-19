---
title: Text
description: Render text with custom fonts, colors, and alignment
---

# Text

The Text entity renders text with customizable fonts, sizes, colors, and alignment. It supports system fonts, web fonts, and Google Fonts.

## Basic Text

Create text by specifying the `text` property and position:

```javascript
import { Text } from '@mode-7/zap';

const hello = new Text({
  text: 'Hello Zap!',
  x: 200,
  y: 150,
  fontSize: 24,
  color: '#ffffff'
});
```

## Simple Text Demo

```codemirror
import { Game, Scene, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const title = new Text({
  text: 'Hello Zap!',
  x: 200,
  y: 120,
  fontSize: 32,
  color: '#4fc3f7',
  align: 'center'
});

const subtitle = new Text({
  text: 'Lightweight 2D game engine',
  x: 200,
  y: 160,
  fontSize: 16,
  color: '#888',
  align: 'center'
});

scene.add(title);
scene.add(subtitle);

game.setScene(scene);
game.start();
```

## Text Properties

### Font Size

Control text size with `fontSize` (in pixels):

```javascript
const small = new Text({
  text: 'Small',
  fontSize: 12
});

const large = new Text({
  text: 'Large',
  fontSize: 48
});
```

### Color

Set text color with hex codes:

```javascript
const text = new Text({
  text: 'Colored Text',
  color: '#e94560'  // Red
});

// Change color after creation
text.color = '#2ecc71';  // Green
```

### Font Family

Use system fonts or web fonts:

```javascript
const text = new Text({
  text: 'Custom Font',
  fontFamily: 'Georgia, serif'
});

// Or after creation
text.fontFamily = 'Courier New, monospace';
```

## Text Alignment

Control horizontal alignment with the `align` property:

```codemirror
import { Game, Scene, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const leftText = new Text({
  text: 'Left aligned',
  x: 50,
  y: 100,
  fontSize: 16,
  color: '#fff',
  align: 'left'
});

const centerText = new Text({
  text: 'Center aligned',
  x: 200,
  y: 150,
  fontSize: 16,
  color: '#fff',
  align: 'center'
});

const rightText = new Text({
  text: 'Right aligned',
  x: 350,
  y: 200,
  fontSize: 16,
  color: '#fff',
  align: 'right'
});

scene.add(leftText);
scene.add(centerText);
scene.add(rightText);

game.setScene(scene);
game.start();
```

Available alignments:
- `'left'` - Align to left of x position
- `'center'` - Center on x position (default)
- `'right'` - Align to right of x position

## Baseline Alignment

Control vertical alignment with `baseline`:

```javascript
const text = new Text({
  text: 'Baseline',
  baseline: 'middle'  // 'top', 'middle', 'bottom', 'alphabetic'
});
```

- `'top'` - Top of text at y position
- `'middle'` - Center of text at y position (default)
- `'bottom'` - Bottom of text at y position
- `'alphabetic'` - Alphabetic baseline at y position

## Loading Custom Fonts

For detailed information on loading Google Fonts and custom web fonts, see the **[Fonts](/utilities/fonts)** documentation.

Quick example:

```javascript
import { loadGoogleFont, Text } from '@mode-7/zap';

// Load a Google Font before using it
await loadGoogleFont('Poppins', [400, 600]);

const text = new Text({
  text: 'Styled with Poppins',
  x: 200,
  y: 150,
  fontSize: 28,
  fontFamily: 'Poppins, sans-serif',
  color: '#f39c12'
});
```

## Interactive Text

Text can respond to gestures just like sprites:

```codemirror
import { Game, Scene, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const button = new Text({
  text: 'CLICK ME',
  x: 200,
  y: 150,
  fontSize: 24,
  color: '#4fc3f7',
  align: 'center',
  interactive: true  // Enable gestures
});

scene.add(button);

button.on('tap', () => {
  button.color = button.color === '#4fc3f7' ? '#e94560' : '#4fc3f7';
  button.tween(
    { scaleX: 1.2, scaleY: 1.2 },
    { duration: 100 }
  ).then(() => {
    button.tween(
      { scaleX: 1, scaleY: 1 },
      { duration: 100 }
    );
  });
});

game.setScene(scene);
game.start();
```

## Dynamic Text

Update text content dynamically:

```javascript
const score = new Text({
  text: 'Score: 0',
  x: 200,
  y: 50
});

let points = 0;

function addPoints(amount) {
  points += amount;
  score.text = `Score: ${points}`;
}
```

## Transforms

Text supports all entity transforms:

```javascript
text.rotation = Math.PI / 4;  // Rotate 45 degrees
text.scaleX = 2;              // Scale width 2x
text.scaleY = 2;              // Scale height 2x
text.alpha = 0.5;             // 50% opacity
```

## Animated Text

Combine text with tweening for effects:

```codemirror
import { Game, Scene, Text, delay } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const text = new Text({
  text: 'GAME OVER',
  x: 200,
  y: 150,
  fontSize: 48,
  color: '#e94560',
  align: 'center',
  alpha: 0,
  scaleX: 0.5,
  scaleY: 0.5
});

scene.add(text);

// Fade in and scale up
text.tween(
  { alpha: 1, scaleX: 1, scaleY: 1 },
  { duration: 800, easing: 'easeOutBack' }
);

// Pulse animation
delay(1000, () => {
  text.tween(
    { scaleX: 1.1, scaleY: 1.1 },
    { duration: 500, loop: true, easing: 'easeInOutQuad' }
  );
});

game.setScene(scene);
game.start();
```

## Performance Tips

- **Limit text changes**: Updating text frequently can impact performance
- **Reuse text entities**: Change `text` property instead of creating new ones
- **Avoid many fonts**: Stick to 2-3 font families per game
- **Preload fonts**: Load custom fonts before creating text (see [Fonts](/utilities/fonts))
- **Use appropriate sizes**: Smaller text renders faster

## Common Patterns

### Score Display

```javascript
const scoreText = new Text({
  text: 'Score: 0',
  x: 20,
  y: 20,
  fontSize: 18,
  color: '#fff',
  align: 'left'
});

let score = 0;

function updateScore(points) {
  score += points;
  scoreText.text = `Score: ${score}`;
}
```

### Countdown Timer

```javascript
const timerText = new Text({
  text: '3:00',
  x: 200,
  y: 30,
  fontSize: 20,
  color: '#4fc3f7',
  align: 'center'
});

let timeLeft = 180; // seconds

scene.interval(1000, () => {
  timeLeft--;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.text = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (timeLeft <= 10) {
    timerText.color = '#e94560';  // Red warning
  }
});
```

### Dialogue Box

```javascript
const dialogue = new Text({
  text: '',
  x: 200,
  y: 250,
  fontSize: 14,
  color: '#fff',
  align: 'center'
});

function showDialogue(message) {
  dialogue.text = message;
  dialogue.alpha = 0;
  dialogue.tween(
    { alpha: 1 },
    { duration: 300 }
  );
}

function hideDialogue() {
  dialogue.tween(
    { alpha: 0 },
    { duration: 300 }
  );
}
```

### Multiline Text

```javascript
const instructions = new Text({
  text: 'Line 1\nLine 2\nLine 3',  // Use \n for line breaks
  x: 200,
  y: 150,
  fontSize: 14,
  color: '#fff',
  align: 'center'
});
```

## Next Steps

- [Shapes](/visual/shapes) - Create colored shapes
- [Sprites](/visual/sprites) - Display images
- [Animations](/animation/animations) - Tween text properties
- [Layout](/utilities/layout) - Position text with layout helpers
