---
title: Layout
description: Position entities with grid, circle, and alignment utilities
---

# Layout

Layout utilities help you position multiple entities quickly using grids, circles, rows, columns, and alignment functions.

## API Reference

### `layoutGrid(entities, options)`

Position entities in a grid layout.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `options` (GridOptions):
  - `columns` (number) - Number of columns (required)
  - `rows` (number) - Number of rows (required)
  - `cellWidth` (number) - Width of each cell (required)
  - `cellHeight` (number) - Height of each cell (required)
  - `spacing` (number) - Gap between cells (default: `0`)
  - `startX` (number) - Starting X position (default: `0`)
  - `startY` (number) - Starting Y position (default: `0`)

```javascript
// Create inventory grid (4x3)
Layout.layoutGrid(itemSlots, {
  columns: 4,
  rows: 3,
  cellWidth: 60,
  cellHeight: 60,
  spacing: 10,
  startX: 50,
  startY: 50
});
```

### `layoutCircle(entities, centerX, centerY, radius, startAngle?)`

Position entities in a circle.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `centerX` (number) - Circle center X
- `centerY` (number) - Circle center Y
- `radius` (number) - Circle radius
- `startAngle` (number) - Starting angle in radians (default: `0`)

```javascript
// Arrange 8 buttons in a circle
Layout.layoutCircle(menuButtons, 200, 150, 100);

// Start at top (Math.PI / 2)
Layout.layoutCircle(planets, 200, 150, 120, -Math.PI / 2);
```

### `layoutRow(entities, startX, y, spacing)`

Position entities horizontally in a row.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `startX` (number) - Starting X position
- `y` (number) - Y position for all entities
- `spacing` (number) - Space between entities

```javascript
// Menu buttons in a row
Layout.layoutRow(buttons, 50, 150, 80);

// Lives display
Layout.layoutRow(hearts, 20, 30, 35);
```

### `layoutColumn(entities, x, startY, spacing)`

Position entities vertically in a column.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `x` (number) - X position for all entities
- `startY` (number) - Starting Y position
- `spacing` (number) - Space between entities

```javascript
// Vertical menu
Layout.layoutColumn(menuItems, 200, 50, 60);

// Leaderboard
Layout.layoutColumn(playerNames, 100, 80, 40);
```

### `center(entity, width, height)`

Center an entity on the screen.

**Parameters**:
- `entity` (Entity) - Entity to center
- `width` (number) - Screen/canvas width
- `height` (number) - Screen/canvas height

```javascript
// Center title on screen
Layout.center(title, game.canvas.width, game.canvas.height);

// Center in a container
Layout.center(dialog, containerWidth, containerHeight);
```

## Common Patterns

### Inventory Grid

```javascript
const slots = [];
for (let i = 0; i < 20; i++) {
  const slot = new Sprite({ width: 50, height: 50, color: '#16213e' });
  slots.push(slot);
  scene.add(slot);
}

Layout.layoutGrid(slots, {
  columns: 5,
  rows: 4,
  cellWidth: 50,
  cellHeight: 50,
  spacing: 5,
  startX: 50,
  startY: 50
});
```

### Radial Menu

```javascript
const menuItems = ['Attack', 'Defend', 'Items', 'Magic'].map(text =>
  new Button({ text, width: 80, height: 40 })
);

menuItems.forEach(item => scene.add(item));

// Arrange in circle around player
Layout.layoutCircle(menuItems, player.x, player.y, 120);
```

### Button Row

```javascript
const buttons = ['Yes', 'No', 'Cancel'].map(text =>
  new Button({ text, width: 80, height: 40 })
);

buttons.forEach(btn => scene.add(btn));

Layout.layoutRow(buttons, 100, 200, 100);
```

### Vertical List

```javascript
const listItems = ['Option 1', 'Option 2', 'Option 3'].map(text =>
  new Text({ text, fontSize: 16 })
);

listItems.forEach(item => scene.add(item));

Layout.layoutColumn(listItems, 200, 80, 40);
```

### Center Title

```javascript
const title = new Text({
  text: 'Game Title',
  fontSize: 32,
  color: '#4fc3f7'
});

scene.add(title);
Layout.center(title, game.canvas.width, game.canvas.height);
```

### Lives Display

```javascript
const hearts = [];
for (let i = 0; i < lives; i++) {
  const heart = new Sprite({
    width: 30,
    height: 30,
    color: '#e94560',
    radius: 15
  });
  hearts.push(heart);
  scene.add(heart);
}

Layout.layoutRow(hearts, 20, 30, 35);
```

## Tips

- **Use grids for inventory/levels** - Clean, organized layouts
- **Use circles for radial menus** - Good for action wheels
- **Use rows/columns for lists** - Simple linear layouts
- **Calculate spacing dynamically** - Adapt to screen size
- **Combine layouts** - Mix different layout types in one scene

## Next Steps

- [Math](/utilities/math) - Math functions used by layouts
- [Button](/ui/button) - Create interactive buttons to layout
- [Sprites](/visual/sprites) - Create visual elements to position
