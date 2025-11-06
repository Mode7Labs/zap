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

## Load Multiple Fonts

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

## API Reference

### `loadGoogleFont(fontFamily, weights)`

Load a single Google Font.

**Parameters**:
- `fontFamily` (string) - Font family name (e.g., 'Poppins', 'Roboto')
- `weights` (number[]) - Array of font weights (default: `[400]`)

**Returns**: `Promise<void>`

```javascript
await loadGoogleFont('Poppins', [400, 700]);
```

### `loadGoogleFonts(fonts)`

Load multiple Google Fonts in parallel.

**Parameters**:
- `fonts` (object[]) - Array of font configurations
  - `family` (string) - Font family name
  - `weights` (number[]) - Font weights (default: `[400]`)

**Returns**: `Promise<void>`

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
- `url` (string) - Path to font file (`.woff2`, `.woff`, `.ttf`)
- `weight` (number) - Font weight (default: `400`)

**Returns**: `Promise<void>`

```javascript
await loadCustomFont('MyFont', '/fonts/myfont.woff2', 400);
```

## Popular Font Examples

Common Google Fonts for games:

```javascript
// Modern UI
await loadGoogleFont('Poppins', [400, 600, 700]);
await loadGoogleFont('Inter', [400, 700]);

// Retro/Gaming
await loadGoogleFont('Press Start 2P', [400]);  // Pixel/arcade
await loadGoogleFont('VT323', [400]);           // Terminal
await loadGoogleFont('Orbitron', [400, 700]);   // Sci-fi

// Playful
await loadGoogleFont('Fredoka One', [400]);
await loadGoogleFont('Righteous', [400]);

// Monospace
await loadGoogleFont('Roboto Mono', [400, 700]);
await loadGoogleFont('Space Mono', [400, 700]);
```

Browse fonts at [fonts.google.com](https://fonts.google.com/)

## Font Caching

Fonts are automatically cached to prevent duplicate loads:

```javascript
// First call: loads from Google Fonts
await loadGoogleFont('Poppins', [400]);

// Second call: returns immediately (cached)
await loadGoogleFont('Poppins', [400]);

// Different weights: loads new weights only
await loadGoogleFont('Poppins', [700]);
```

## Best Practices

### Load Early

```javascript
// ✅ Good - load before creating text
await loadGoogleFont('Poppins', [400]);
const text = new Text({ text: 'Hello', fontFamily: 'Poppins' });

// ❌ Wrong - font not loaded yet
const text = new Text({ text: 'Hello', fontFamily: 'Poppins' });
await loadGoogleFont('Poppins', [400]);
```

### Batch Load

```javascript
// ❌ Wrong - sequential loading
await loadGoogleFont('Poppins', [400]);
await loadGoogleFont('Roboto', [400]);

// ✅ Good - parallel loading
await loadGoogleFonts([
  { family: 'Poppins', weights: [400] },
  { family: 'Roboto', weights: [400] }
]);
```

### Limit Weights

```javascript
// ❌ Wrong - too many weights
await loadGoogleFont('Roboto', [100, 200, 300, 400, 500, 600, 700, 800, 900]);

// ✅ Good - only needed weights
await loadGoogleFont('Roboto', [400, 700]);
```

## Tips

- **Load fonts early** - During initial loading screen
- **Use WOFF2 for custom fonts** - Best compression
- **Preview fonts first** - Use [fonts.google.com](https://fonts.google.com/)
- **Match font name exactly** - Use correct spacing: `'Press Start 2P'` not `'PressStart2P'`
- **Load all needed weights** - If using `fontWeight: 700`, load weight 700

## Next Steps

- [Text](/visual/text) - Creating text entities
- [Asset Loader](/utilities/asset-loader) - Loading other assets
- [Button](/ui/button) - Buttons with custom fonts
