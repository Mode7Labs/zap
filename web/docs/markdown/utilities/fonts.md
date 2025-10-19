---
title: Fonts
description: Load Google Fonts and custom web fonts
---

# Fonts

Zap provides utilities for loading Google Fonts and custom web fonts, ensuring fonts are ready before rendering text.

## Load Google Font

Load a single Google Font:

```codemirror
import { Game, Scene, Text, loadGoogleFont } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const scene = new Scene();

// Load font before creating text
loadGoogleFont('Poppins', [400, 700]).then(() => {
  const title = new Text({
    text: 'Hello Poppins!',
    x: 200,
    y: 150,
    fontSize: 32,
    fontFamily: 'Poppins',
    fontWeight: 700,
    color: '#4fc3f7',
    align: 'center'
  });

  scene.add(title);
});

game.setScene(scene);
game.start();
```

## Load Multiple Google Fonts

Load several fonts at once:

```javascript
import { loadGoogleFonts } from '@mode-7/zap';

await loadGoogleFonts([
  { family: 'Poppins', weights: [400, 700] },
  { family: 'Roboto Mono', weights: [400] },
  { family: 'Press Start 2P', weights: [400] }
]);

// All fonts are now ready to use
```

## Load Custom Font

Load fonts from your own files:

```javascript
import { loadCustomFont } from '@mode-7/zap';

await loadCustomFont('MyFont', '/fonts/myfont.woff2', 400);

// Use custom font
const text = new Text({
  text: 'Custom Font Text',
  fontFamily: 'MyFont',
  fontSize: 24
});
```

## Font Weights

Specify which weights to load:

```javascript
// Single weight
await loadGoogleFont('Roboto', [400]);

// Multiple weights
await loadGoogleFont('Roboto', [300, 400, 700, 900]);

// Common combinations
await loadGoogleFont('Open Sans', [400, 600, 700]);  // Regular, SemiBold, Bold
await loadGoogleFont('Montserrat', [300, 400, 500, 700]);  // Light to Bold
```

## Popular Google Fonts

### Modern & Clean

```javascript
// Poppins - geometric sans-serif
await loadGoogleFont('Poppins', [400, 600, 700]);

// Inter - UI-focused sans-serif
await loadGoogleFont('Inter', [400, 500, 700]);

// Montserrat - urban sans-serif
await loadGoogleFont('Montserrat', [400, 700]);
```

### Retro & Gaming

```javascript
// Press Start 2P - pixel/arcade style
await loadGoogleFont('Press Start 2P', [400]);

// VT323 - terminal/monospace
await loadGoogleFont('VT323', [400]);

// Orbitron - sci-fi/futuristic
await loadGoogleFont('Orbitron', [400, 700, 900]);
```

### Playful & Fun

```javascript
// Fredoka One - rounded, bold
await loadGoogleFont('Fredoka One', [400]);

// Righteous - chunky, fun
await loadGoogleFont('Righteous', [400]);

// Bungee - urban display
await loadGoogleFont('Bungee', [400]);
```

### Monospace

```javascript
// Roboto Mono - clean monospace
await loadGoogleFont('Roboto Mono', [400, 700]);

// Courier Prime - typewriter style
await loadGoogleFont('Courier Prime', [400, 700]);

// Space Mono - geometric monospace
await loadGoogleFont('Space Mono', [400, 700]);
```

## Loading with Progress

Show loading progress for fonts:

```codemirror
import { Game, Scene, Text, loadGoogleFonts } from '@VERSION';

const game = new Game({
  width: 400,
  height: 300,
  backgroundColor: '#0f3460'
});

const loadingScene = new Scene();

const loadingText = new Text({
  text: 'Loading fonts...',
  x: 200,
  y: 150,
  fontSize: 16,
  color: '#888',
  align: 'center'
});

loadingScene.add(loadingText);
game.setScene(loadingScene);
game.start();

// Load fonts
loadGoogleFonts([
  { family: 'Poppins', weights: [400, 700] },
  { family: 'Press Start 2P', weights: [400] }
]).then(() => {
  // Fonts loaded, show game
  const gameScene = new Scene();

  const title = new Text({
    text: 'Game Title',
    x: 200,
    y: 100,
    fontSize: 32,
    fontFamily: 'Poppins',
    fontWeight: 700,
    color: '#4fc3f7',
    align: 'center'
  });

  gameScene.add(title);
  game.setScene(gameScene);
});
```

## Font Caching

Fonts are automatically cached to prevent duplicate loads:

```javascript
// First call: loads from Google Fonts
await loadGoogleFont('Poppins', [400]);

// Second call: returns immediately (cached)
await loadGoogleFont('Poppins', [400]);

// Different weights: loads new weights
await loadGoogleFont('Poppins', [700]);
```

## Custom Font Formats

Support for multiple font formats:

```javascript
// WOFF2 (best compression, modern browsers)
await loadCustomFont('MyFont', '/fonts/myfont.woff2');

// WOFF (wider browser support)
await loadCustomFont('MyFont', '/fonts/myfont.woff');

// TTF (universal compatibility)
await loadCustomFont('MyFont', '/fonts/myfont.ttf');
```

## Common Patterns

### Pixel Art Game

```javascript
await loadGoogleFont('Press Start 2P', [400]);

const title = new Text({
  text: 'PIXEL QUEST',
  fontSize: 20,
  fontFamily: 'Press Start 2P',
  color: '#fff'
});
```

### Sci-Fi Game

```javascript
await loadGoogleFont('Orbitron', [400, 700, 900]);

const hud = new Text({
  text: 'SHIELDS: 100%',
  fontSize: 18,
  fontFamily: 'Orbitron',
  fontWeight: 700,
  color: '#4fc3f7'
});
```

### Casual Mobile Game

```javascript
await loadGoogleFont('Fredoka One', [400]);

const score = new Text({
  text: 'Score: 1250',
  fontSize: 24,
  fontFamily: 'Fredoka One',
  color: '#f39c12'
});
```

### RPG / Fantasy

```javascript
await loadGoogleFont('MedievalSharp', [400]);

const dialogue = new Text({
  text: 'Greetings, traveler!',
  fontSize: 16,
  fontFamily: 'MedievalSharp',
  color: '#fff'
});
```

### Terminal / Hacker Theme

```javascript
await loadGoogleFont('VT323', [400]);

const terminal = new Text({
  text: '> System booting...',
  fontSize: 18,
  fontFamily: 'VT323',
  color: '#51cf66'
});
```

### Modern UI

```javascript
await loadGoogleFonts([
  { family: 'Inter', weights: [400, 600] },
  { family: 'Roboto Mono', weights: [400] }
]);

const heading = new Text({
  text: 'Settings',
  fontSize: 24,
  fontFamily: 'Inter',
  fontWeight: 600,
  color: '#fff'
});

const code = new Text({
  text: 'Version 1.0.0',
  fontSize: 12,
  fontFamily: 'Roboto Mono',
  color: '#888'
});
```

## Error Handling

Handle font loading errors:

```javascript
try {
  await loadGoogleFont('NonExistentFont', [400]);
} catch (error) {
  console.error('Font load failed:', error);
  // Fall back to default font
  text.fontFamily = 'Arial';
}
```

## Preload All Fonts

Load fonts before game initialization:

```javascript
async function preloadFonts() {
  await loadGoogleFonts([
    { family: 'Poppins', weights: [400, 600, 700] },
    { family: 'Roboto Mono', weights: [400] },
    { family: 'Press Start 2P', weights: [400] }
  ]);
}

// Preload fonts
await preloadFonts();

// Then start game
const game = new Game({ width: 400, height: 300 });
game.start();
```

## Font Combinations

Pair fonts effectively:

```javascript
// Heading + Body
await loadGoogleFonts([
  { family: 'Poppins', weights: [700] },      // Headings
  { family: 'Open Sans', weights: [400] }     // Body text
]);

// Display + UI
await loadGoogleFonts([
  { family: 'Righteous', weights: [400] },    // Game title
  { family: 'Roboto', weights: [400, 700] }   // UI elements
]);

// Retro + Modern
await loadGoogleFonts([
  { family: 'Press Start 2P', weights: [400] }, // Pixel text
  { family: 'Inter', weights: [400, 600] }      // Modern UI
]);
```

## Font Loading Best Practices

### Load Early

```javascript
// ✅ Good - load before creating text
await loadGoogleFont('Poppins', [400]);

const text = new Text({
  text: 'Hello',
  fontFamily: 'Poppins'
});
```

### Limit Weights

```javascript
// ❌ Bad - too many weights
await loadGoogleFont('Roboto', [100, 200, 300, 400, 500, 600, 700, 800, 900]);

// ✅ Good - only needed weights
await loadGoogleFont('Roboto', [400, 700]);
```

### Batch Load

```javascript
// ❌ Bad - sequential loading
await loadGoogleFont('Poppins', [400]);
await loadGoogleFont('Roboto', [400]);
await loadGoogleFont('Orbitron', [400]);

// ✅ Good - parallel loading
await loadGoogleFonts([
  { family: 'Poppins', weights: [400] },
  { family: 'Roboto', weights: [400] },
  { family: 'Orbitron', weights: [400] }
]);
```

## API Reference

### `loadGoogleFont(fontFamily, weights)`

Load a single Google Font.

**Parameters**:
- `fontFamily` (string) - Font family name (e.g., 'Poppins', 'Roboto')
- `weights` (number[]) - Array of font weights (default: [400])

**Returns**: Promise<void>

```javascript
await loadGoogleFont('Poppins', [400, 700]);
```

### `loadGoogleFonts(fonts)`

Load multiple Google Fonts at once.

**Parameters**:
- `fonts` (object[]) - Array of font configurations
  - `family` (string) - Font family name
  - `weights` (number[]) - Font weights (optional, default: [400])

**Returns**: Promise<void>

```javascript
await loadGoogleFonts([
  { family: 'Poppins', weights: [400, 700] },
  { family: 'Roboto Mono', weights: [400] }
]);
```

### `loadCustomFont(fontFamily, url, weight)`

Load a custom font from a URL.

**Parameters**:
- `fontFamily` (string) - Font family name to use in CSS
- `url` (string) - Path to font file (.woff2, .woff, .ttf)
- `weight` (number) - Font weight (default: 400)

**Returns**: Promise<void>

```javascript
await loadCustomFont('MyFont', '/fonts/myfont.woff2', 400);
```

## Performance Tips

- **Load fonts early**: Load during initial loading screen
- **Limit weights**: Only load weights you'll actually use
- **Use WOFF2**: Best compression for custom fonts
- **Batch load**: Load multiple fonts in parallel
- **Cache effectively**: Let Zap handle caching automatically
- **Preload critical fonts**: Load display fonts before game starts

## Common Mistakes

### Using font before loading

```javascript
// ❌ Wrong - font not loaded yet
const text = new Text({
  text: 'Hello',
  fontFamily: 'Poppins'
});
await loadGoogleFont('Poppins', [400]);

// ✅ Right - load font first
await loadGoogleFont('Poppins', [400]);
const text = new Text({
  text: 'Hello',
  fontFamily: 'Poppins'
});
```

### Wrong font family name

```javascript
// ❌ Wrong - incorrect spacing
await loadGoogleFont('PressStart2P', [400]);

// ✅ Right - correct spacing
await loadGoogleFont('Press Start 2P', [400]);
```

### Loading wrong weight

```javascript
// ❌ Wrong - weight 800 not loaded
await loadGoogleFont('Roboto', [400]);
const text = new Text({
  fontFamily: 'Roboto',
  fontWeight: 800  // Not loaded!
});

// ✅ Right - load all needed weights
await loadGoogleFont('Roboto', [400, 800]);
const text = new Text({
  fontFamily: 'Roboto',
  fontWeight: 800
});
```

## Tips

- **Test font rendering** - Ensure fonts display correctly before release
- **Use fallbacks** - Specify fallback fonts: `fontFamily: 'Poppins, Arial, sans-serif'`
- **Match game theme** - Choose fonts that fit your visual style
- **Readable sizes** - Minimum 12px for body text, 16px+ for important UI
- **Consider licensing** - Google Fonts are free, check licenses for custom fonts
- **Preview fonts** - Use [Google Fonts](https://fonts.google.com/) to preview

## Next Steps

- [Text](/visual/text) - Creating text entities
- [Asset Loader](/utilities/asset-loader) - Loading other assets
- [Button](/ui/button) - Buttons with custom fonts
