// Main application entry point

import { examples } from './examples.js';
import { Editor } from './editor.js';
import { Settings } from './settings.js';
import { AIAssistant } from './ai.js';

// Initialize modules
const editor = new Editor();
const settings = new Settings();
const ai = new AIAssistant(settings, editor);

// Listen for runtime errors from preview iframe
window.addEventListener('message', (event) => {
  if (event.data.type === 'runtime-error') {
    editor.showError(event.data.message, event.data.stack);
  }
});

// Global functions for HTML event handlers
window.openSettings = () => settings.open();
window.closeSettings = () => settings.close();
window.saveSettings = () => settings.save();
window.generateCode = () => {
  const prompt = document.getElementById('ai-prompt').value.trim();
  ai.generateCode(prompt);
};
window.clearAIHistory = () => {
  if (confirm('Clear conversation history? The AI will lose context of previous requests.')) {
    ai.clearHistory();
    window.updateHistoryCount();
  }
};

// Update history count display
window.updateHistoryCount = function() {
  const count = ai.conversationHistory.length;
  document.getElementById('history-count').textContent = count;
  const btn = document.getElementById('clear-history-btn');
  btn.disabled = count === 0;
}

// Initial update
window.updateHistoryCount();

// Example selection
document.querySelectorAll('.example').forEach(exampleElement => {
  exampleElement.addEventListener('click', () => {
    // Update active state
    document.querySelectorAll('.example').forEach(el => el.classList.remove('active'));
    exampleElement.classList.add('active');

    // Load example code
    const exampleKey = exampleElement.dataset.example;
    if (examples[exampleKey]) {
      editor.setValue(examples[exampleKey]);
      editor.updatePreview();
    }
  });
});

// Load default example on startup
editor.setValue(examples.default);
editor.updatePreview();

// Mark first example as active
document.querySelector('[data-example="default"]')?.classList.add('active');
