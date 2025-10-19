---
title: Layout
description: Position entities with grid, circle, and alignment utilities
---

# Layout

Layout utilities help you position multiple entities quickly using grids, circles, rows, columns, and alignment functions.

## Grid Layout

Position entities in a grid:

```codemirror
import { Game, Scene, Sprite, Layout } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create 12 boxes
const boxes = [];
for (let i = 0; i < 12; i++) {
  const box = new Sprite({
    width: 50,
    height: 50,
    color: '#4fc3f7',
    radius: 8
  });
  boxes.push(box);
  scene.add(box);
}

// Arrange in 4x3 grid
Layout.layoutGrid(boxes, {
  columns: 4,
  rows: 3,
  cellWidth: 50,
  cellHeight: 50,
  spacing: 10,
  startX: 50,
  startY: 50
});

game.setScene(scene);
game.start();
```

## Circle Layout

Arrange entities in a circle:

```codemirror
import { Game, Scene, Sprite, Layout } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create 8 dots
const dots = [];
for (let i = 0; i < 8; i++) {
  const dot = new Sprite({
    width: 30,
    height: 30,
    color: '#e94560',
    radius: 15
  });
  dots.push(dot);
  scene.add(dot);
}

// Arrange in circle
Layout.layoutCircle(dots, 200, 150, 100);

game.setScene(scene);
game.start();
```

## Row Layout

Position entities horizontally:

```codemirror
import { Game, Scene, Sprite, Layout } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create 5 boxes
const boxes = [];
for (let i = 0; i < 5; i++) {
  const box = new Sprite({
    width: 50,
    height: 50,
    color: '#51cf66',
    radius: 8
  });
  boxes.push(box);
  scene.add(box);
}

// Arrange in horizontal row
Layout.layoutRow(boxes, 50, 150, 70);

game.setScene(scene);
game.start();
```

## Column Layout

Position entities vertically:

```codemirror
import { Game, Scene, Sprite, Layout } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Create 4 boxes
const boxes = [];
for (let i = 0; i < 4; i++) {
  const box = new Sprite({
    width: 60,
    height: 40,
    color: '#f39c12',
    radius: 6
  });
  boxes.push(box);
  scene.add(box);
}

// Arrange in vertical column
Layout.layoutColumn(boxes, 200, 50, 60);

game.setScene(scene);
game.start();
```

## Center Entity

Center a single entity on screen:

```javascript
import { Layout } from '@mode-7/zap';

const sprite = new Sprite({
  width: 100,
  height: 100,
  color: '#4fc3f7'
});

// Center on 400x300 canvas
Layout.center(sprite, 400, 300);

scene.add(sprite);
```

## Common Patterns

### Inventory Grid

Create an inventory system:

```javascript
import { Layout } from '@mode-7/zap';

const inventorySlots = [];

// Create 20 inventory slots (4x5 grid)
for (let i = 0; i < 20; i++) {
  const slot = new NinePatch({
    width: 60,
    height: 60,
    image: '/ui/slot.png',
    corners: 12,
    interactive: true
  });

  slot.on('tap', () => {
    console.log(`Slot ${i} clicked`);
  });

  inventorySlots.push(slot);
  scene.add(slot);
}

// Arrange in grid
Layout.layoutGrid(inventorySlots, {
  columns: 4,
  rows: 5,
  cellWidth: 60,
  cellHeight: 60,
  spacing: 5,
  startX: 50,
  startY: 50
});
```

### Menu Buttons

Vertical menu with buttons:

```javascript
import { Layout } from '@mode-7/zap';

const menuButtons = [
  new Button({ text: 'Play', width: 160, height: 50 }),
  new Button({ text: 'Options', width: 160, height: 50 }),
  new Button({ text: 'Credits', width: 160, height: 50 }),
  new Button({ text: 'Quit', width: 160, height: 50 })
];

menuButtons.forEach(btn => scene.add(btn));

// Arrange in vertical column
Layout.layoutColumn(menuButtons,200, 80, 70);
```

### Radial Menu

Circular menu around cursor:

```javascript
import { Layout } from '@mode-7/zap';

function showRadialMenu(x, y) {
  const options = ['⚔️', '🛡️', '🏹', '🪄', '💊', '📜'];

  const menuItems = options.map(icon => {
    const item = new Sprite({
      width: 50,
      height: 50,
      color: '#16213e',
      radius: 25,
      interactive: true
    });

    const label = new Text({
      text: icon,
      fontSize: 24,
      align: 'center',
      baseline: 'middle'
    });

    item.addChild(label);
    scene.add(item);

    return item;
  });

  // Arrange in circle around cursor
  Layout.layoutCircle(menuItems, x, y, 80);
}

// Show on right-click
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showRadialMenu(e.clientX, e.clientY);
});
```

### Tile Grid

Create a tile-based game board:

```javascript
import { Layout } from '@mode-7/zap';

const tiles = [];
const tileTypes = ['grass', 'water', 'stone', 'sand'];

// Create 10x10 grid of tiles
for (let i = 0; i < 100; i++) {
  const type = randomItem(tileTypes);

  const tile = new Sprite({
    width: 32,
    height: 32,
    image: assetLoader.getImage(type)
  });

  tiles.push(tile);
  scene.add(tile);
}

// Arrange in 10x10 grid
Layout.layoutGrid(tiles, {
  columns: 10,
  rows: 10,
  cellWidth: 32,
  cellHeight: 32,
  spacing: 0,
  startX: 20,
  startY: 20
});
```

### Planet Orbit

Position planets in orbit:

```javascript
import { Layout } from '@mode-7/zap';

const planets = [
  new Sprite({ width: 20, height: 20, color: '#888', radius: 10 }),  // Mercury
  new Sprite({ width: 30, height: 30, color: '#f39c12', radius: 15 }), // Venus
  new Sprite({ width: 32, height: 32, color: '#4fc3f7', radius: 16 }), // Earth
  new Sprite({ width: 26, height: 26, color: '#e94560', radius: 13 })  // Mars
];

planets.forEach(planet => scene.add(planet));

// Position around sun
const sun = new Sprite({
  x: 200, y: 150,
  width: 50, height: 50,
  color: '#f1c40f',
  radius: 25
});

scene.add(sun);
Layout.layoutCircle(planets,200, 150, 120);
```

### Card Hand

Arrange cards in an arc (like a hand of cards):

```javascript
import { Layout } from '@mode-7/zap';

const cards = [];
for (let i = 0; i < 5; i++) {
  const card = new Sprite({
    width: 60,
    height: 90,
    color: '#fff',
    radius: 6,
    interactive: true
  });

  cards.push(card);
  scene.add(card);
}

// Position in semi-circle at bottom
Layout.layoutCircle(cards,200, 250, 180, Math.PI * 0.7);  // Start at ~135°
```

### Responsive Grid

Adjust grid based on screen size:

```javascript
import { Layout } from '@mode-7/zap';

function createResponsiveGrid(items, canvasWidth, canvasHeight) {
  const itemsPerRow = canvasWidth < 400 ? 3 : 5;
  const cellSize = canvasWidth / (itemsPerRow + 1);

  Layout.layoutGrid(items, {
    columns: itemsPerRow,
    rows: Math.ceil(items.length / itemsPerRow),
    cellWidth: cellSize,
    cellHeight: cellSize,
    spacing: cellSize * 0.1,
    startX: 20,
    startY: 20
  });
}
```

### Toolbar

Horizontal toolbar with icons:

```javascript
import { Layout } from '@mode-7/zap';

const tools = ['✏️', '🖌️', '🧹', '🎨', '💾'];

const toolbar = tools.map(icon => {
  const button = new Sprite({
    width: 50,
    height: 50,
    color: '#16213e',
    radius: 8,
    interactive: true
  });

  const label = new Text({
    text: icon,
    fontSize: 24,
    align: 'center',
    baseline: 'middle'
  });

  button.addChild(label);
  scene.add(button);

  return button;
});

// Arrange horizontally
Layout.layoutRow(toolbar,50, 30, 60);
```

### Level Select Grid

Grid of level buttons:

```javascript
import { Layout } from '@mode-7/zap';

const levelButtons = [];
const unlockedLevels = Storage.get('unlockedLevels', [1]);

for (let i = 1; i <= 20; i++) {
  const isUnlocked = unlockedLevels.includes(i);

  const button = new Sprite({
    width: 60,
    height: 60,
    color: isUnlocked ? '#4fc3f7' : '#333',
    radius: 10,
    interactive: isUnlocked
  });

  const label = new Text({
    text: String(i),
    fontSize: 20,
    color: isUnlocked ? '#fff' : '#666',
    align: 'center',
    baseline: 'middle'
  });

  button.addChild(label);

  if (isUnlocked) {
    button.on('tap', () => startLevel(i));
  }

  levelButtons.push(button);
  scene.add(button);
}

// 5x4 grid
Layout.layoutGrid(levelButtons, {
  columns: 5,
  rows: 4,
  cellWidth: 60,
  cellHeight: 60,
  spacing: 10,
  startX: 40,
  startY: 40
});
```

## Dynamic Layouts

Re-layout on changes:

```javascript
import { Layout } from '@mode-7/zap';

let items = [];

function addItem() {
  const item = new Sprite({
    width: 50,
    height: 50,
    color: '#51cf66',
    radius: 8
  });

  items.push(item);
  scene.add(item);

  // Re-layout all items
  updateLayout();
}

function removeItem(item) {
  const index = items.indexOf(item);
  if (index !== -1) {
    items.splice(index, 1);
    scene.remove(item);
    updateLayout();
  }
}

function updateLayout() {
  Layout.layoutGrid(items, {
    columns: 4,
    rows: Math.ceil(items.length / 4),
    cellWidth: 50,
    cellHeight: 50,
    spacing: 10,
    startX: 50,
    startY: 50
  });
}
```

## API Reference

### `layoutGrid(entities, options)`

Position entities in a grid.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `options` (GridOptions):
  - `columns` (number) - Number of columns
  - `rows` (number) - Number of rows
  - `cellWidth` (number) - Width of each cell
  - `cellHeight` (number) - Height of each cell
  - `spacing` (number) - Space between cells (default: 0)
  - `startX` (number) - Starting X position (default: 0)
  - `startY` (number) - Starting Y position (default: 0)

**Returns**: void

```javascript
Layout.layoutGrid(sprites, {
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
- `centerX` (number) - Circle center X coordinate
- `centerY` (number) - Circle center Y coordinate
- `radius` (number) - Circle radius
- `startAngle` (number) - Starting angle in radians (default: 0)

**Returns**: void

```javascript
Layout.layoutCircle(sprites,200, 150, 100);

// Start at 90 degrees (top of circle)
Layout.layoutCircle(sprites,200, 150, 100, Math.PI / 2);
```

### `layoutRow(entities, startX, y, spacing)`

Position entities in a horizontal row.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `startX` (number) - Starting X position
- `y` (number) - Y position for all entities
- `spacing` (number) - Space between entities

**Returns**: void

```javascript
Layout.layoutRow(buttons,50, 150, 80);
```

### `layoutColumn(entities, x, startY, spacing)`

Position entities in a vertical column.

**Parameters**:
- `entities` (Entity[]) - Array of entities to position
- `x` (number) - X position for all entities
- `startY` (number) - Starting Y position
- `spacing` (number) - Space between entities

**Returns**: void

```javascript
Layout.layoutColumn(menuItems,200, 50, 60);
```

### `center(entity, width, height)`

Center an entity within given dimensions.

**Parameters**:
- `entity` (Entity) - Entity to center
- `width` (number) - Container width
- `height` (number) - Container height

**Returns**: void

```javascript
Layout.center(sprite, game.canvas.width, game.canvas.height);
```

## Layout Tips

- **Use spacing for breathing room** - Add spacing between grid cells
- **Consider anchors** - Entities are positioned at their anchor point
- **Responsive layouts** - Adjust grid columns based on canvas size
- **Re-layout on changes** - Call layout functions when adding/removing items
- **Combine layouts** - Use multiple layout types in the same scene

## Common Mistakes

### Wrong cell size

```javascript
// ❌ Wrong - cell size doesn't match sprite size
Layout.layoutGrid(sprites, {
  columns: 4,
  rows: 3,
  cellWidth: 50,   // But sprites are 80px wide!
  cellHeight: 50
});

// ✅ Right - match sprite dimensions
Layout.layoutGrid(sprites, {
  columns: 4,
  rows: 3,
  cellWidth: 80,   // Matches sprite width
  cellHeight: 80,
  spacing: 10      // Add spacing for separation
});
```

### Forgetting to add to scene

```javascript
// ❌ Wrong - layout before adding to scene
Layout.layoutGrid(sprites, { /* ... */ });
sprites.forEach(s => scene.add(s));

// ✅ Right - add to scene first, then layout
sprites.forEach(s => scene.add(s));
Layout.layoutGrid(sprites, { /* ... */ });
```

### Not enough rows

```javascript
// ❌ Wrong - 12 items won't fit in 4x2 grid
Layout.layoutGrid(sprites, {  // 12 sprites
  columns: 4,
  rows: 2  // Only 8 positions!
});

// ✅ Right - ensure enough cells
Layout.layoutGrid(sprites, {  // 12 sprites
  columns: 4,
  rows: 3  // 12 positions
});
```

## Next Steps

- [Math](/utilities/math) - Math utilities for custom layouts
- [Sprites](/visual/sprites) - Creating sprites to layout
- [Scenes](/core/scenes) - Organizing layouts in scenes
