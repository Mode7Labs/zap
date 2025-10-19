# Zap Playground

An interactive code playground for the Zap game engine with live preview and AI code generation.

## Structure

The playground is modularized into separate files for maintainability:

### Core Files

- **`index.html`** - Main HTML structure
  - Header with navigation
  - Settings modal
  - Sidebar with examples
  - Split view (editor + preview)
  - AI input panel

- **`styles.css`** - All styling
  - Responsive layout
  - Dark theme
  - CodeMirror customization
  - Modal styles

### JavaScript Modules

- **`app.js`** - Main entry point
  - Initializes all modules
  - Handles example selection
  - Exposes global functions for HTML event handlers

- **`editor.js`** - Editor and preview management
  - CodeMirror initialization
  - Live preview updates
  - Code import transformation (CDN to local)

- **`examples.js`** - Code templates
  - Basic sprite
  - Circle
  - Animation
  - Interactive elements
  - Particles
  - Mini game

- **`settings.js`** - Settings modal
  - API key management
  - LocalStorage persistence
  - AI indicator updates

- **`ai.js`** - AI code generation
  - OpenAI integration
  - Tool calling support
  - Status messaging

- **`zap-tools.js`** - AI tools and documentation
  - System prompt for AI
  - Tool definitions
  - Documentation access

## Features

### Live Code Editor

- **CodeMirror** with JavaScript syntax highlighting
- **Auto-preview** updates after 1 second of inactivity
- **Responsive** split-pane layout

### Example Templates

Quick-start templates for common use cases:
- Basic shapes and sprites
- Animations with tweening
- Interactive gestures (tap, drag)
- Particle effects
- Complete mini-game

### AI Code Generation

- **OpenAI GPT-4o-mini** integration
- **Tool calling** for documentation access
- **Context-aware** code generation based on current code
- **Iterative** refinement with documentation lookup

### Local Development

The playground automatically replaces CDN imports with local `/dist/index.mjs` for development:

```javascript
// Written in editor:
import { Game } from 'https://esm.sh/@mode-7/zap@0.1.2';

// Executed in preview:
import { Game } from '/dist/index.mjs';
```

## Usage

### Running Locally

1. Ensure you have the Zap engine built in `/dist`
2. Serve the web directory with a local server
3. Navigate to `/playground/`

### Using AI Features

1. Click **Settings** button
2. Enter your OpenAI API key
3. Type a description in the AI input
4. Click **Generate** or press Enter

The AI will:
1. Analyze your current code
2. Look up relevant Zap documentation
3. Generate updated code
4. Update the editor and preview

## File Organization

```
playground/
├── index.html          # Main structure
├── styles.css          # Styles
├── app.js             # Main entry point
├── editor.js          # Editor management
├── examples.js        # Code templates
├── settings.js        # Settings modal
├── ai.js              # AI generation
├── zap-tools.js       # AI tools
└── README.md          # This file
```

## Benefits of Modular Structure

- **Maintainability**: Each module has a single responsibility
- **Readability**: Easy to find and update specific features
- **Collaboration**: Multiple developers can work on different modules
- **Testing**: Easier to test individual components
- **Performance**: Modules can be lazy-loaded if needed

## Adding New Examples

Edit `examples.js` and add a new entry:

```javascript
export const examples = {
  // ... existing examples
  myExample: `import { Game, Scene, Sprite } from 'https://esm.sh/@mode-7/zap@0.1.2';

const game = new Game({ ... });
// Your example code
`
};
```

Then add a corresponding button in `index.html`:

```html
<div class="example" data-example="myExample">My Example</div>
```

## Dependencies

- **CodeMirror 5.65.2** - Code editor
- **OpenAI API** - AI code generation (optional, requires API key)
