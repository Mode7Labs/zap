---
id: button
title: Button
category: ui
description: Interactive button UI component with hover and press states
imports: ["Button"]
---

# Button

The Button component provides an interactive UI element with automatic hover and press state handling.

## Constructor

```javascript
new Button({
  text: string,             // Button label (required)
  x: number,                // X position
  y: number,                // Y position
  width: number,            // Width (default: 120)
  height: number,           // Height (default: 50)
  backgroundColor: string,  // Default state color
  hoverColor: string,       // Hover state color
  pressColor: string,       // Pressed state color
  textColor: string,        // Text color (default: '#ffffff')
  fontSize: number,         // Text size (default: 16)
  radius: number,           // Corner radius (default: 8)
  onClick: Function         // Click handler
})
```

## Basic Example

```zap-demo
const button = new Button({
  x: 200, y: 150,
  width: 150, height: 50,
  text: 'Click Me!',
  backgroundColor: '#e94560',
  hoverColor: '#ff547c',
  pressColor: '#d13650',
  fontSize: 18,
  onClick: () => {
    console.log('Button clicked!');
  }
});

scene.add(button);
```

## Dynamic Text

Update button text dynamically:

```zap-demo
let clicks = 0;

const button = new Button({
  x: 200, y: 150,
  width: 160, height: 50,
  text: 'Clicks: 0',
  backgroundColor: '#667eea',
  fontSize: 18,
  onClick: () => {
    clicks++;
    button.setText(`Clicks: ${clicks}`);
  }
});

scene.add(button);
```

## Methods

### setText(text)

Update the button's label:

```javascript
button.setText('New Label');
```

### enable()

Enable an disabled button:

```javascript
button.enable();
```

### disable()

Disable the button (grays out, no interaction):

```javascript
button.disable();
```

## Styling

Customize colors for different states:

```javascript
const button = new Button({
  text: 'Styled Button',
  x: 200, y: 150,
  backgroundColor: '#2ecc71',  // Normal
  hoverColor: '#27ae60',       // On hover
  pressColor: '#229954',       // When pressed
  textColor: '#ffffff',
  fontSize: 20,
  radius: 12  // Rounded corners
});
```

## Events

Buttons automatically handle:
- **Hover** - Changes to `hoverColor` when pointer is over
- **Press** - Changes to `pressColor` when held down
- **Click** - Fires `onClick` callback when tapped/clicked

## Tips

💡 **Accessibility**: Use sufficient color contrast between text and background

💡 **Touch Targets**: Minimum 44×44px for mobile touch targets

💡 **Feedback**: Visual feedback (color changes) helps users understand interaction
