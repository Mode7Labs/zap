---
id: text
title: Text Rendering
category: ui
description: Display text with different alignments and styles
imports: [Text]
---

# Text Rendering

Display text with customizable fonts, sizes, colors, and alignment options.

## Basic Text

```zap-demo
const title = new Text({
  text: 'Hello Zap!',
  x: 200, y: 80,
  fontSize: 32,
  color: '#4fc3f7',
  align: 'center'
});

const subtitle = new Text({
  text: 'Lightweight 2D game engine',
  x: 200, y: 120,
  fontSize: 16,
  color: '#888',
  align: 'center'
});

scene.add(title);
scene.add(subtitle);
```

## Text Alignment

```zap-demo
const leftText = new Text({
  text: 'Left aligned',
  x: 50, y: 100,
  fontSize: 14,
  color: '#fff',
  align: 'left'
});

const centerText = new Text({
  text: 'Center aligned',
  x: 200, y: 150,
  fontSize: 14,
  color: '#fff',
  align: 'center'
});

const rightText = new Text({
  text: 'Right aligned',
  x: 350, y: 200,
  fontSize: 14,
  color: '#fff',
  align: 'right'
});

scene.add(leftText);
scene.add(centerText);
scene.add(rightText);
```
