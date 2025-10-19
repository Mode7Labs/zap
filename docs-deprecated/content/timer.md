---
id: timer
title: Timers
category: core
description: Delay and interval utilities
imports: [delay, interval, wait, Sprite, Text]
---

# Timers

Zap provides timer utilities for delaying execution and creating repeating intervals.

## Interactive Demo

```zap-demo
let counter = 0;

const counterText = new Text({
  text: 'Counter: 0',
  x: 200, y: 100,
  fontSize: 24,
  color: '#4fc3f7',
  align: 'center'
});

const statusText = new Text({
  text: 'Incrementing every second...',
  x: 200, y: 140,
  fontSize: 14,
  color: '#888',
  align: 'center'
});

// Use interval to count
interval(1000, () => {
  counter++;
  counterText.text = `Counter: ${counter}`;
});

const button = new Sprite({
  x: 200, y: 200,
  width: 140, height: 45,
  color: '#e94560',
  radius: 8,
  interactive: true
});

const buttonLabel = new Text({
  text: 'Delay Test',
  fontSize: 16,
  color: '#fff',
  align: 'center',
  baseline: 'middle'
});
button.addChild(buttonLabel);

button.on('tap', () => {
  buttonLabel.text = 'Wait 2s...';
  button.color = '#666';
  button.interactive = false;

  delay(2000, () => {
    buttonLabel.text = 'Done!';
    button.color = '#2ecc71';

    delay(1000, () => {
      buttonLabel.text = 'Delay Test';
      button.color = '#e94560';
      button.interactive = true;
    });
  });
});

scene.add(counterText);
scene.add(statusText);
scene.add(button);
```

## API Reference

### Delay Execution

```javascript
// Delay execution
delay(1000, () => {
  console.log('Executed after 1 second');
});
```

### Repeat with Interval

```javascript
// Repeat with interval
const intervalId = interval(500, () => {
  console.log('Every 500ms');
});

// Stop interval
clearInterval(intervalId);
```

### Async Wait

```javascript
// Promise-based wait
async function example() {
  await wait(2000);
  console.log('After 2 seconds');
}

example();
```
