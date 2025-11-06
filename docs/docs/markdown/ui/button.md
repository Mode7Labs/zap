---
title: Button
description: Interactive button component with states
---

# Button

The Button component provides an interactive button with automatic state management, visual feedback, and click handling.

## Basic Button

Create a button with text and click handler:

```javascript
import { Button } from '@mode-7/zap';

const button = new Button({
  x: 200,
  y: 150,
  text: 'Click Me!',
  onClick: () => {
    console.log('Button clicked!');
  }
});

scene.add(button);
```

> **Note**: Examples assume basic setup with `Game` and `Scene`. See [Getting Started](/getting-started/quickstart) if you're new to Zap.

## Button Options

All button options with defaults:

```javascript
const button = new Button({
  x: 200,
  y: 150,
  text: 'Submit',

  // Size (defaults)
  width: 120,              // Default: 120
  height: 50,              // Default: 50

  // Colors (defaults)
  backgroundColor: '#e94560',  // Default: '#e94560' (red)
  hoverColor: '#ff547c',       // Default: '#ff547c' (lighter)
  pressColor: '#d13650',       // Default: '#d13650' (darker)
  textColor: '#ffffff',        // Default: '#ffffff' (white)

  // Text (default)
  fontSize: 16,            // Default: 16

  // Shape (default)
  radius: 8,               // Default: 8 (corner radius)

  // Click handler
  onClick: () => {
    console.log('Clicked');
  }
});
```

## Interactive Demo

```codemirror
import { Game, Scene, Button, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

let count = 0;

const status = new Text({
  text: 'Click counter: 0',
  x: 200,
  y: 50,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

const incrementBtn = new Button({
  x: 120,
  y: 150,
  width: 100,
  height: 50,
  text: '+1',
  backgroundColor: '#51cf66',
  hoverColor: '#69db7c',
  pressColor: '#40c057',
  onClick: () => {
    count++;
    status.text = `Click counter: ${count}`;
    status.color = '#51cf66';
  }
});

const resetBtn = new Button({
  x: 280,
  y: 150,
  width: 100,
  height: 50,
  text: 'Reset',
  backgroundColor: '#e94560',
  hoverColor: '#ff547c',
  pressColor: '#d13650',
  onClick: () => {
    count = 0;
    status.text = `Click counter: ${count}`;
    status.color = '#4fc3f7';
  }
});

scene.add(status);
scene.add(incrementBtn);
scene.add(resetBtn);

game.setScene(scene);
game.start();
```

## Button Methods

### setText()

Update button text:

```javascript
const button = new Button({ x: 200, y: 150, text: 'Click' });

button.setText('New Text');
```

### enable() / disable()

Control button interactivity:

```javascript
// Disable button (alpha = 0.5, not interactive)
button.disable();

// Enable button (alpha = 1, interactive)
button.enable();
```

### onClick Property

Change click handler:

```javascript
button.onClick = () => {
  console.log('New handler');
};
```

## Button States

Buttons automatically handle three visual states:

- **Default** - Normal appearance (`backgroundColor`)
- **Hover** - When pointer is over button (`hoverColor`) - mouse only
- **Pressed** - While button is being pressed (`pressColor`)
- **Disabled** - When `disable()` is called (alpha = 0.5, color = `backgroundColor`)

## Common Patterns

### Menu Buttons

```javascript
const options = ['Play', 'Settings', 'Quit'];

options.forEach((option, i) => {
  const button = new Button({
    x: 200,
    y: 100 + i * 60,
    width: 160,
    height: 50,
    text: option,
    onClick: () => {
      console.log('Selected:', option);
    }
  });

  scene.add(button);
});
```

### Loading State

Disable during async operations:

```javascript
const submitBtn = new Button({
  x: 200,
  y: 200,
  text: 'Submit',
  onClick: async () => {
    submitBtn.disable();
    submitBtn.setText('Loading...');

    await performOperation();

    submitBtn.setText('Success!');
    setTimeout(() => {
      submitBtn.enable();
      submitBtn.setText('Submit');
    }, 1000);
  }
});
```

### Counter Button

```javascript
let score = 0;

const scoreBtn = new Button({
  x: 350,
  y: 30,
  text: `Score: ${score}`,
  onClick: () => {
    score += 10;
    scoreBtn.setText(`Score: ${score}`);
  }
});
```

## Styling Tips

### Color Schemes

Recommended color combinations:

```javascript
// Primary action (blue)
{ backgroundColor: '#4fc3f7', hoverColor: '#6dd5fa', pressColor: '#38a3d1' }

// Success (green)
{ backgroundColor: '#51cf66', hoverColor: '#69db7c', pressColor: '#40c057' }

// Danger (red)
{ backgroundColor: '#e94560', hoverColor: '#ff547c', pressColor: '#d13650' }

// Warning (orange)
{ backgroundColor: '#f39c12', hoverColor: '#fbb13c', pressColor: '#d68910' }
```

### Size Guidelines

```javascript
// Small
{ width: 80, height: 35, fontSize: 12 }

// Medium (default)
{ width: 120, height: 50, fontSize: 16 }

// Large
{ width: 180, height: 60, fontSize: 18 }
```

## Tips

- **Use onClick** - Simplest way to handle clicks
- **Disable during operations** - Prevent double-clicks with `disable()`
- **Touch-friendly sizes** - Minimum 44x44px for touch targets
- **Clear labels** - Use action verbs: "Save", "Delete", "Continue"
- **Consistent sizing** - Same dimensions for related buttons

## Next Steps

- [NinePatch](/ui/ninepatch) - Scalable UI panels
- [Tap Gesture](/gestures/tap) - Understanding tap detection
- [Text](/visual/text) - Text rendering options
