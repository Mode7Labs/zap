---
id: layout
title: Layout Helpers
category: core
description: Position entities with layout utilities
imports: [Layout, Math, Sprite]
---

# Layout Helpers

Use layout utilities to easily position multiple entities in grids, circles, and other patterns.

## Grid Layout

```zap-demo
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
```

## Circle Layout

```zap-demo
const circleSprites = [];
const colors = ['#e94560', '#4fc3f7', '#f39c12', '#2ecc71', '#9b59b6', '#e67e22'];

for (let i = 0; i < 8; i++) {
  circleSprites.push(new Sprite({
    width: 30,
    height: 30,
    color: colors[i % colors.length],
    radius: 15
  }));
}

Layout.layoutCircle(circleSprites, {
  radius: 80,
  centerX: 200,
  centerY: 150,
  startAngle: 0
});

circleSprites.forEach(s => scene.add(s));
```

## Math Utilities

The Layout module also re-exports useful Math utilities:

- `Math.clamp(value, min, max)` - Clamp value between min and max
- `Math.lerp(start, end, t)` - Linear interpolation
- `Math.map(value, inMin, inMax, outMin, outMax)` - Map value from one range to another
- `Math.randomInt(min, max)` - Random integer between min and max
