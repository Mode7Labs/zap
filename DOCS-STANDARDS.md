# Standards for Documentation

## Key Considerations

1. Documentation files have a dual purpose: to document the Zap API for users, and to provide useful instructions and examples for LLM agents which will use the Markdown files as guidance.
2. Documentation should follow standard Markdown format, with regular Markdown formatting for headings, lists, etc.
3. There are two types of code blocks:
   - **Code Snippets**: Educational examples using standard fenced code blocks (```javascript, ```bash, ```html). These are non-interactive and are syntax-highlighted.
   - **Interactive Demos**: Runnable examples using ```codemirror blocks. These render as CodeMirror instances that allow users to toggle between preview (running code) and code view.
4. Interactive demos must be fully self-contained and load all dependencies from esm.sh, including Zap itself. The Zap version is configured centrally and should not be hardcoded in markdown files.
5. Code snippets should be informative and simple, only showing import directives when useful for clarity. When imports are shown, use the npm library `@mode-7/zap` rather than esm.sh. Only show imports from Zap, never show other imports.
6. Write with both human readers and LLM agents in mind. Be clear, concise, and demonstrate the simplest possible way to accomplish tasks.

## Block Types

### Code Snippets (Non-Interactive)

Use standard fenced code blocks for educational snippets:

\`\`\`javascript
// Simple example
const sprite = new Sprite({ x: 100, y: 100 });
\`\`\`

### Interactive Demos (Runnable)

Use ```codemirror for fully runnable examples:

\`\`\`codemirror
import { Game, Scene, Sprite } from '@VERSION';

const game = new Game({ width: 400, height: 300 });
const scene = new Scene();
const sprite = new Sprite({ x: 200, y: 150, width: 50, height: 50, color: '#667eea' });
scene.add(sprite);
game.setScene(scene);
game.start();
\`\`\`

**Note**: The `@VERSION` placeholder will be replaced automatically by the renderer. In development mode (when `USE_LOCAL_BUILD: true` in config.js), it uses the local build at `../dist/index.mjs`. In production mode, it uses the CDN URL `https://esm.sh/@mode-7/zap@{version}`.

## Development Workflow

When developing documentation with local changes to the Zap engine:

1. Make changes to `/src`
2. Run `npm run build:docs` to build and copy to `/web/dist`
3. Set `USE_LOCAL_BUILD: true` in `/web/docs/config.js`
4. Run `npm run docs` to serve the documentation
5. Interactive demos will use your local build

Before deploying or publishing, set `USE_LOCAL_BUILD: false` to use the CDN.

## How Documentation Is Rendered

The documentation page uses:
- **Marked** (from esm.sh) - Markdown parsing
- **CodeMirror** (from esm.sh) - Interactive code editor/preview
- **Highlight.js** (from esm.sh) - Syntax highlighting for code snippets

## Assets

If an interactive demo requires assets (images, sounds, etc.), they should be added to the `/web/assets/` folder and referenced using relative paths.
