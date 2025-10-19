---
title: Button
description: Interactive button component with states
---

# Button

The Button component provides an easy-to-use interactive button with automatic state management, visual feedback, and click handling.

## Basic Button

Create a button with text and click handler:

```codemirror
import { Game, Scene, Button, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const button = new Button({
  x: 200,
  y: 150,
  text: 'Click Me!',
  onClick: () => {
    console.log('Button clicked!');
    label.text = 'Clicked!';
    label.color = '#51cf66';
  }
});

const label = new Text({
  text: 'Click the button',
  x: 200,
  y: 220,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

scene.add(button);
scene.add(label);

game.setScene(scene);
game.start();
```

## Button Options

Customize button appearance:

```javascript
const button = new Button({
  x: 200,
  y: 150,
  text: 'Submit',

  // Size
  width: 140,
  height: 50,

  // Colors
  backgroundColor: '#4fc3f7',    // Default state
  hoverColor: '#6dd5fa',         // Hover state (pointer hover)
  pressColor: '#38a3d1',         // Pressed state
  textColor: '#ffffff',          // Text color

  // Text
  fontSize: 16,

  // Shape
  radius: 8,                     // Corner radius

  // Click handler
  onClick: () => {
    console.log('Submit clicked');
  }
});
```

You can change the click handler later with `button.onClick = () => { ... }`.

## Button States

Buttons automatically handle three visual states:

### Default State

Normal appearance when not interacted with.

### Hover State

Visual indication when the pointer is over the button.

### Pressed State

Darker color while button is being pressed.

## Multiple Buttons

```codemirror
import { Game, Scene, Button, Text } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const status = new Text({
  text: 'Choose an option',
  x: 200,
  y: 50,
  fontSize: 16,
  color: '#4fc3f7',
  align: 'center'
});

const yesBtn = new Button({
  x: 130,
  y: 150,
  width: 100,
  height: 45,
  text: 'Yes',
  backgroundColor: '#51cf66',
  hoverColor: '#69db7c',
  pressColor: '#40c057',
  onClick: () => {
    status.text = 'You chose Yes';
    status.color = '#51cf66';
  }
});

const noBtn = new Button({
  x: 270,
  y: 150,
  width: 100,
  height: 45,
  text: 'No',
  backgroundColor: '#e94560',
  hoverColor: '#ff547c',
  pressColor: '#d13650',
  onClick: () => {
    status.text = 'You chose No';
    status.color = '#e94560';
  }
});

scene.add(status);
scene.add(yesBtn);
scene.add(noBtn);

game.setScene(scene);
game.start();
```

## Change Button Text

Update button text dynamically:

```javascript
const counter = new Button({
  x: 200,
  y: 150,
  text: 'Count: 0'
});

let count = 0;

counter.onClick = () => {
  count++;
  counter.setText(`Count: ${count}`);
};
```

## Enable/Disable

Control button interactivity:

```codemirror
import { Game, Scene, Button } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

const actionBtn = new Button({
  x: 200,
  y: 120,
  text: 'Action',
  backgroundColor: '#4fc3f7',
  onClick: () => {
    console.log('Action performed!');
    actionBtn.disable();

    // Re-enable after 2 seconds
    setTimeout(() => {
      actionBtn.enable();
    }, 2000);
  }
});

const toggleBtn = new Button({
  x: 200,
  y: 180,
  width: 140,
  height: 45,
  text: 'Toggle Action',
  backgroundColor: '#f39c12',
  onClick: () => {
    if (actionBtn.interactive) {
      actionBtn.disable();
      toggleBtn.setText('Enable Action');
    } else {
      actionBtn.enable();
      toggleBtn.setText('Disable Action');
    }
  }
});

scene.add(actionBtn);
scene.add(toggleBtn);

game.setScene(scene);
game.start();
```

## Common Patterns

### Menu Buttons

Create a vertical menu:

```javascript
const menuOptions = ['Play', 'Options', 'Quit'];
let selectedOption = null;

menuOptions.forEach((option, i) => {
  const button = new Button({
    x: 200,
    y: 100 + i * 60,
    width: 160,
    height: 50,
    text: option,
    backgroundColor: '#16213e',
    pressColor: '#0f1626',
    onClick: () => {
      selectedOption = option;
      console.log('Selected:', option);

      // Navigate to different scenes based on choice
      switch(option) {
        case 'Play': game.setScene(gameScene); break;
        case 'Options': game.setScene(optionsScene); break;
        case 'Quit': console.log('Quitting...'); break;
      }
    }
  });

  scene.add(button);
});
```

### Icon Buttons

Use single characters or symbols:

```javascript
const soundBtn = new Button({
  x: 50,
  y: 50,
  width: 45,
  height: 45,
  text: '🔊',
  fontSize: 20,
  backgroundColor: '#16213e',
  onClick: () => {
    // Toggle sound
    soundBtn.setText(soundOn ? '🔇' : '🔊');
    soundOn = !soundOn;
  }
});
```

### Confirmation Dialog

Two-button confirmation:

```javascript
const confirmDialog = new Scene();

const message = new Text({
  text: 'Delete this item?',
  x: 200, y: 120,
  fontSize: 16,
  align: 'center'
});

const confirmBtn = new Button({
  x: 150, y: 180,
  width: 80, height: 40,
  text: 'Delete',
  backgroundColor: '#e94560',
  onClick: () => {
    // Perform deletion
    deleteItem();
    game.setScene(mainScene);
  }
});

const cancelBtn = new Button({
  x: 250, y: 180,
  width: 80, height: 40,
  text: 'Cancel',
  backgroundColor: '#888',
  onClick: () => {
    game.setScene(mainScene);
  }
});

confirmDialog.add(message);
confirmDialog.add(confirmBtn);
confirmDialog.add(cancelBtn);
```

### Loading State

Disable during async operations:

```javascript
const submitBtn = new Button({
  x: 200, y: 200,
  text: 'Submit',
  onClick: async () => {
    // Disable during operation
    submitBtn.disable();
    submitBtn.setText('Loading...');

    try {
      await performAsyncOperation();
      submitBtn.setText('Success!');
      setTimeout(() => {
        submitBtn.enable();
        submitBtn.setText('Submit');
      }, 2000);
    } catch (error) {
      submitBtn.setText('Error!');
      submitBtn.enable();
    }
  }
});
```

### Button with Counter

Show a numeric value:

```javascript
let lives = 3;

const livesBtn = new Button({
  x: 350, y: 30,
  width: 80, height: 35,
  text: `Lives: ${lives}`,
  backgroundColor: '#e94560',
  onClick: () => {
    // Buttons don't have to just be clicked
    // This could update automatically from game logic
  }
});

// Update from game events
player.on('hit', () => {
  lives--;
  livesBtn.setText(`Lives: ${lives}`);

  if (lives <= 0) {
    livesBtn.setText('Game Over');
    livesBtn.disable();
  }
});
```

### Styled Button Groups

Create consistent button groups:

```javascript
function createButton(text, x, y, color) {
  return new Button({
    x, y,
    width: 90,
    height: 40,
    text,
    backgroundColor: color,
    pressColor: darken(color),  // Implement darken function
    fontSize: 14,
    radius: 6
  });
}

const redBtn = createButton('Red', 100, 150, '#e94560');
const greenBtn = createButton('Green', 200, 150, '#51cf66');
const blueBtn = createButton('Blue', 300, 150, '#4fc3f7');
```

## Button Events

Buttons emit standard tap events:

```javascript
const button = new Button({
  x: 200, y: 150,
  text: 'Click'
});

// Use onClick option (recommended)
button.onClick = () => {
  console.log('Clicked via onClick');
};

// Or listen to tap event
button.on('tap', () => {
  console.log('Clicked via tap event');
});

// Drag events also work
button.on('dragstart', () => {
  console.log('Press started');
});

button.on('dragend', () => {
  console.log('Press ended');
});
```

## Styling Tips

### Color Schemes

Good color combinations:

```javascript
// Primary action (blue)
{ backgroundColor: '#4fc3f7', pressColor: '#38a3d1' }

// Success (green)
{ backgroundColor: '#51cf66', pressColor: '#40c057' }

// Danger (red)
{ backgroundColor: '#e94560', pressColor: '#d13650' }

// Warning (orange)
{ backgroundColor: '#f39c12', pressColor: '#d68910' }

// Secondary (gray)
{ backgroundColor: '#888', pressColor: '#666' }
```

### Size Guidelines

Recommended button sizes:

```javascript
// Small button
{ width: 80, height: 35, fontSize: 12 }

// Medium button (default)
{ width: 120, height: 50, fontSize: 16 }

// Large button
{ width: 180, height: 60, fontSize: 18 }

// Icon button (square)
{ width: 45, height: 45, fontSize: 20 }
```

## Accessibility

Make buttons touch-friendly:

```javascript
// Minimum 44x44px for touch targets
const button = new Button({
  x: 200, y: 150,
  width: 100,  // At least 44px
  height: 44,   // At least 44px
  text: 'Tap Me'
});
```

## Tips

- **Use onClick** - Simplest way to handle clicks
- **Disable during operations** - Prevent double-clicks
- **Provide feedback** - Users expect immediate visual response
- **Clear labels** - Use action verbs: "Save", "Delete", "Continue"
- **Consistent sizing** - Use same dimensions for related buttons

## Common Mistakes

### Forgetting to add to scene

```javascript
// ❌ Wrong - button created but not visible
const button = new Button({ x: 200, y: 150, text: 'Click' });

// ✅ Right - add to scene
const button = new Button({ x: 200, y: 150, text: 'Click' });
scene.add(button);
```

### Not handling disabled state

```javascript
// ❌ Wrong - can click disabled button
button.disable();
button.on('tap', () => {
  // This still fires!
});

// ✅ Right - check interactive state
button.on('tap', () => {
  if (!button.interactive) return;
  // Handle click
});

// Or better: use onClick which respects disabled state
button.onClick = () => {
  // This won't fire when disabled
};
```

## Next Steps

- [NinePatch](/ui/ninepatch) - Scalable UI panels
- [Tap Gesture](/gestures/tap) - Understanding tap detection
- [Tweening](/animation/tweening) - Animate buttons
