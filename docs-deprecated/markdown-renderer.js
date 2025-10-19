/**
 * Markdown renderer with interactive Zap demo support
 * Parses markdown files and renders zap-demo code blocks as live demos
 */

import { marked } from 'https://esm.sh/marked@11.1.1';
import hljs from 'https://esm.sh/highlight.js@11.9.0';

/**
 * Parse YAML frontmatter from markdown
 */
export function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const frontmatterText = match[1];
  const content = markdown.slice(match[0].length);

  // Simple YAML parser (handles key: value pairs)
  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v =>
          v.trim().replace(/^["']|["']$/g, '')
        );
      }
      // Remove quotes from strings
      else if ((value.startsWith('"') && value.endsWith('"')) ||
               (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, content };
}

/**
 * Configure marked with custom renderer
 */
marked.setOptions({
  breaks: false,
  gfm: true
});

// Custom renderer for code sections
const renderer = new marked.Renderer();
renderer.code = function(code, language) {
  // Unescape HTML entities that marked may have already escaped
  const unescaped = code
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Use highlight.js for syntax highlighting
  let highlighted;
  if (language && hljs.getLanguage(language)) {
    highlighted = hljs.highlight(unescaped, { language }).value;
  } else {
    // Auto-detect if no language specified
    highlighted = hljs.highlightAuto(unescaped).value;
  }

  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

/**
 * Extract zap-demo blocks from markdown
 */
export function extractDemoBlocks(markdown) {
  const demoRegex = /```zap-demo(?:\s+({[^}]*}))?\n([\s\S]*?)```/g;
  const demos = [];
  let match;

  while ((match = demoRegex.exec(markdown)) !== null) {
    let options = {};
    const rawOptions = match[1];

    if (rawOptions) {
      try {
        options = JSON.parse(rawOptions);
      } catch (error) {
        console.warn('Failed to parse zap-demo options:', error);
      }
    }

    demos.push({
      code: match[2].trim(),
      options,
      fullMatch: match[0]
    });
  }

  return demos;
}

/**
 * Render a markdown document with interactive demos
 */
export async function renderMarkdownDoc(markdown, container) {
  const { frontmatter, content } = parseFrontmatter(markdown);
  const demos = extractDemoBlocks(content);

  // Cleanup any previous demos before re-rendering
  if (container._zapCleanups) {
    container._zapCleanups.forEach(cleanup => {
      try {
        cleanup();
      } catch (err) {
        console.warn('Error during demo cleanup:', err);
      }
    });
  }
  container._zapCleanups = [];

  // Replace demo blocks with placeholders
  let processedContent = content;
  demos.forEach((demo, index) => {
    processedContent = processedContent.replace(
      demo.fullMatch,
      `<div class="demo-placeholder" data-demo-id="${index}"></div>`
    );
  });

  // Convert markdown to HTML using marked
  const html = marked.parse(processedContent, { renderer });

  // Insert into container
  container.innerHTML = `<div class="doc-content">${html}</div>`;

  // Render interactive demos
  const placeholders = container.querySelectorAll('.demo-placeholder');
  placeholders.forEach((placeholder, index) => {
    const demo = demos[index];
    if (demo) {
      renderDemo(demo.code, placeholder, container, demo.options);
    }
  });

  return { frontmatter, demos };
}

/**
 * Render an interactive demo
 */
function renderDemo(userCode, container, docContainer, demoOptions = {}) {
  const demoId = 'demo-' + Math.random().toString(36).substr(2, 9);

  // Create demo container with code + canvas
  const highlighted = hljs.highlight(userCode, { language: 'javascript' }).value;

  container.innerHTML = `
    <div class="demo-container">
      <div class="demo-canvas-wrapper">
        <div id="${demoId}"></div>
      </div>
      <div class="code-section">
        <pre><code class="hljs">${highlighted}</code></pre>
      </div>
    </div>
  `;

  // Execute demo code
  try {
    const canvasContainer = document.getElementById(demoId);

    // Register cleanup hook for this placeholder
    const cleanup = () => {
      const existingGame = canvasContainer && canvasContainer._zapGame;
      if (existingGame && typeof existingGame.destroy === 'function') {
        try {
          existingGame.destroy();
        } catch (err) {
          console.warn('Failed to destroy demo game:', err);
        }
      }
    };

    if (!docContainer._zapCleanups) {
      docContainer._zapCleanups = [];
    }
    docContainer._zapCleanups.push(cleanup);

    // Cleanup any previous instance attached to this placeholder
    cleanup();

    // Wrap user code in Game boilerplate
    const fullCode = `
      (async () => {
        const module = await import('/dist/index.mjs');
        const {
          Game,
          Scene,
          Camera,
          Sprite,
          Text,
          Button,
          ParticleEmitter,
          NinePatch,
          AnimatedSprite,
          Layout,
          Math: ZapMath,
          AssetLoader,
          Storage: ZapStorage,
          audioManager,
          delay,
          interval,
          wait,
          Easing,
          loadGoogleFont,
          loadGoogleFonts,
          loadCustomFont
        } = module;

        const gameOptions = Object.assign(
          {
            parent: '#${demoId}',
            width: 400,
            height: 300,
            backgroundColor: '#0f3460'
          },
          ${JSON.stringify(demoOptions.gameOptions || {})}
        );

        const Math = Object.assign({}, globalThis.Math, ZapMath);
        const Storage = ZapStorage ?? module.Storage;
        const game = new Game(gameOptions);

        const scene = new Scene();

        ${userCode}

        game.setScene(scene);
        game.start();

        // Store game instance for cleanup
        canvasContainer._zapGame = game;
      })();
    `;

    // Execute in isolated scope
    eval(fullCode);
  } catch (error) {
    console.error('Demo execution error:', error);
    container.innerHTML = `
      <div class="demo-container">
        <div style="background: #ff6b6b; color: #fff; padding: 1rem; border-radius: 8px;">
          <p style="margin: 0 0 0.5rem 0; font-weight: bold;">❌ Error rendering demo:</p>
          <pre style="margin: 0; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 4px; font-size: 0.9em;">${error.message}\n\n${error.stack || ''}</pre>
        </div>
      </div>
    `;
  }
}


/**
 * Load and render a markdown file
 */
export async function loadMarkdownDoc(filename, container) {
  try {
    const response = await fetch(`/content/${filename}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}.md`);
    }

    const markdown = await response.text();
    return await renderMarkdownDoc(markdown, container);
  } catch (error) {
    console.error('Error loading markdown:', error);
    container.innerHTML = `
      <div class="doc-content">
        <h2>Error Loading Documentation</h2>
        <p>Failed to load <code>${filename}.md</code></p>
        <p>${error.message}</p>
      </div>
    `;
    return { frontmatter: {}, demos: [] };
  }
}
