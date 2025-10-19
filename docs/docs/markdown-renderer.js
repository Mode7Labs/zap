/**
 * Markdown renderer with interactive Zap demo support
 * Parses markdown files and renders codemirror code blocks as live demos
 */

import { marked } from 'https://esm.sh/marked@11.1.1';
import hljs from 'https://esm.sh/highlight.js@11.9.0';
import { config } from './config.js';

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

      // Remove quotes from strings
      if ((value.startsWith('"') && value.endsWith('"')) ||
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
  // Check if this is a codemirror block (will be handled separately)
  if (language === 'codemirror') {
    return `<div class="codemirror-placeholder" data-code="${encodeURIComponent(code)}"></div>`;
  }

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
 * Render a markdown document with interactive demos
 */
export async function renderMarkdownDoc(markdown, container) {
  const { frontmatter, content } = parseFrontmatter(markdown);

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

  // Convert markdown to HTML using marked
  const html = marked.parse(content, { renderer });

  // Insert into container
  container.innerHTML = `<div class="doc-content">${html}</div>`;

  // Render interactive demos
  const placeholders = container.querySelectorAll('.codemirror-placeholder');
  placeholders.forEach((placeholder) => {
    const code = decodeURIComponent(placeholder.dataset.code);
    renderInteractiveDemo(code, placeholder, container);
  });

  return { frontmatter };
}

/**
 * Render an interactive demo with CodeMirror toggle
 */
function renderInteractiveDemo(userCode, container, docContainer) {
  const demoId = 'demo-' + Math.random().toString(36).substr(2, 9);

  // Replace @VERSION placeholder with configured import URL
  const processedCode = userCode.replace(/@VERSION/g, config.ZAP_IMPORT_URL);

  // Create demo container with toggle between preview and code
  container.innerHTML = `
    <div class="demo-container">
      <div class="demo-controls">
        <button class="demo-toggle active" data-mode="preview">▶️ Preview</button>
        <button class="demo-toggle" data-mode="code">📝 Code</button>
        <button class="demo-restart" title="Restart Demo">🔄</button>
      </div>
      <div class="demo-preview" id="${demoId}">
        <div class="demo-canvas-wrapper"></div>
      </div>
      <div class="demo-code" style="display: none;">
        <pre><code class="hljs language-javascript">${hljs.highlight(processedCode, { language: 'javascript' }).value}</code></pre>
      </div>
    </div>
  `;

  // Setup toggle functionality
  const demoContainer = container.querySelector('.demo-container');
  const previewPane = demoContainer.querySelector('.demo-preview');
  const codePane = demoContainer.querySelector('.demo-code');
  const toggleButtons = demoContainer.querySelectorAll('.demo-toggle');
  const restartButton = demoContainer.querySelector('.demo-restart');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      toggleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (mode === 'preview') {
        previewPane.style.display = 'block';
        codePane.style.display = 'none';
      } else {
        previewPane.style.display = 'none';
        codePane.style.display = 'block';
      }
    });
  });

  // Execute demo code
  const executeDemo = async () => {
    try {
      const canvasWrapper = demoContainer.querySelector('.demo-canvas-wrapper');

      // Clear previous content
      canvasWrapper.innerHTML = '';

      // Register cleanup hook
      const cleanup = () => {
        const existingGame = canvasWrapper._zapGame;
        if (existingGame && typeof existingGame.destroy === 'function') {
          try {
            existingGame.destroy();
          } catch (err) {
            console.warn('Failed to destroy demo game:', err);
          }
        }
        canvasWrapper.innerHTML = '';
      };

      if (!docContainer._zapCleanups) {
        docContainer._zapCleanups = [];
      }
      docContainer._zapCleanups.push(cleanup);

      // Cleanup any previous instance
      cleanup();

      // Create unique container for this demo
      const uniqueId = 'canvas-' + Math.random().toString(36).substr(2, 9);
      canvasWrapper.innerHTML = `<div id="${uniqueId}"></div>`;

      // Extract import statement and code
      const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]\s*;?\s*/;
      const match = processedCode.match(importRegex);

      if (!match) {
        throw new Error('No import statement found in demo code');
      }

      const importUrl = match[2];
      let userCode = processedCode.replace(importRegex, '').trim();

      // Remove any existing parent property from Game constructor
      // This handles cases like: parent: document.body, parent: '#id', parent: element
      userCode = userCode.replace(
        /parent:\s*[^,}]+,?\s*/g,
        ''
      );

      // Inject the parent container into Game constructor calls
      // Find "new Game({" or "new Game()" and inject parent option
      userCode = userCode.replace(
        /new Game\(\s*{/g,
        `new Game({\n  parent: '#${uniqueId}',`
      );
      userCode = userCode.replace(
        /new Game\(\s*\)/g,
        `new Game({ parent: '#${uniqueId}' })`
      );

      // Dynamically import the module and execute user code
      let module;
      try {
        // Add cache-busting parameter for local builds
        const cacheBustedUrl = importUrl.includes('../dist/')
          ? `${importUrl}?t=${Date.now()}`
          : importUrl;
        module = await import(cacheBustedUrl);
      } catch (importError) {
        console.error('Import failed:', importUrl, importError);
        throw new Error(`Failed to import from ${importUrl}: ${importError.message}`);
      }

      // Create a function that executes the user code with module exports in scope
      const executeUserCode = new Function(
        ...Object.keys(module),
        userCode
      );

      // Execute with module exports as arguments
      executeUserCode(...Object.values(module));

      // Store reference for cleanup
      canvasWrapper._zapGame = true;
    } catch (error) {
      console.error('Demo execution error:', error);
      const canvasWrapper = demoContainer.querySelector('.demo-canvas-wrapper');
      canvasWrapper.innerHTML = `
        <div style="background: #ff6b6b; color: #fff; padding: 1rem; border-radius: 8px; max-width: 400px;">
          <p style="margin: 0 0 0.5rem 0; font-weight: bold;">❌ Error:</p>
          <pre style="margin: 0; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 4px; font-size: 0.85em; white-space: pre-wrap;">${error.message}</pre>
        </div>
      `;
    }
  };

  // Restart button functionality
  restartButton.addEventListener('click', () => {
    executeDemo();
  });

  // Execute demo initially
  executeDemo();
}

/**
 * Load and render a markdown file
 */
export async function loadMarkdownDoc(filename, container) {
  try {
    const response = await fetch(`${config.markdownBasePath}${filename}.md`);
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
    return { frontmatter: {} };
  }
}
