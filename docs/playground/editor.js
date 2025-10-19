// Editor and preview management

import { ZAP_CDN_URL } from './config.js';

export class Editor {
  constructor() {
    this.editor = null;
    this.updateTimer = null;
    this.init();
  }

  init() {
    // Initialize CodeMirror
    this.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      autofocus: true,
      lineWrapping: false,
      tabSize: 2
    });

    // Auto-update preview on code changes
    this.editor.on('change', () => {
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => this.updatePreview(), 1000);
    });
  }

  setValue(code) {
    this.editor.setValue(code);
  }

  getValue() {
    return this.editor.getValue();
  }

  updatePreview() {
    const code = this.getValue();

    // Clear any existing errors
    this.clearError();

    // Just use the code as-is (CDN version)
    // Fix any template literal placeholders that might have been generated
    const finalCode = code
      .replace(/from\s+['"]?\$\{.*?\}['"]?/g, `from '${ZAP_CDN_URL}'`)
      .replace(/from\s+['"]@VERSION['"]/g, `from '${ZAP_CDN_URL}'`);

    // Debug: log what we're sending to preview
    console.log('Preview code (first 200 chars):', finalCode.substring(0, 200));

    // Create preview HTML - simple with error overlay
    const html = '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '  <style>\n' +
      '    body { margin: 0; padding: 0; overflow: hidden; background: #0f1419; }\n' +
      '    #app { width: 100vw; height: 100vh; }\n' +
      '    #error { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,107,107,0.95); color: white; padding: 1rem; font-family: monospace; font-size: 12px; max-height: 40vh; overflow-y: auto; display: none; z-index: 10000; }\n' +
      '    #error.show { display: block; }\n' +
      '  </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <div id="app"></div>\n' +
      '  <div id="error"></div>\n' +
      '  <script type="module">\n' +
      '    window.onerror = function(msg, src, line, col, err) {\n' +
      '      const el = document.getElementById("error");\n' +
      '      el.innerHTML = "<strong>Error:</strong><pre>" + (err?.stack || msg) + "</pre>";\n' +
      '      el.className = "show";\n' +
      '      window.parent.postMessage({type: "runtime-error", message: msg, stack: err?.stack}, "*");\n' +
      '      return true;\n' +
      '    };\n' +
      finalCode + '\n' +
      '  </script>\n' +
      '</body>\n' +
      '</html>';

    document.getElementById('preview').srcdoc = html;
  }

  clearError() {
    const errorDisplay = document.getElementById('preview-error');
    if (errorDisplay) {
      errorDisplay.style.display = 'none';
    }
  }

  showError(message, stack) {
    let errorDisplay = document.getElementById('preview-error');
    if (!errorDisplay) {
      // Create error display if it doesn't exist
      errorDisplay = document.createElement('div');
      errorDisplay.id = 'preview-error';
      errorDisplay.className = 'preview-error';
      const previewPanel = document.querySelector('.editor-panel:last-child');
      previewPanel.appendChild(errorDisplay);
    }

    errorDisplay.innerHTML = `
      <strong>⚠️ Runtime Error:</strong>
      <pre>${stack || message}</pre>
    `;
    errorDisplay.style.display = 'block';
  }
}
