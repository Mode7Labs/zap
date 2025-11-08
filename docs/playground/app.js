// Main application entry point

import { examples } from './examples.js';
import { Editor } from './editor.js';
import { Settings } from './settings.js';
import { AIUnified } from './ai-unified.js';

// Initialize modules
const editor = new Editor();
const settings = new Settings();
const ai = new AIUnified(settings, editor);

// Listen for runtime errors from preview iframe
window.addEventListener('message', (event) => {
  if (event.data.type === 'runtime-error') {
    editor.showError(event.data.message, event.data.stack);
  }
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(tabBtn => {
  tabBtn.addEventListener('click', () => {
    const tabName = tabBtn.dataset.tab;

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    tabBtn.classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Global functions for HTML event handlers
window.openSettings = () => settings.open();
window.closeSettings = () => settings.close();
window.saveSettings = () => settings.save();
window.sendMessage = () => {
  const prompt = document.getElementById('ai-prompt').value.trim();
  if (prompt) {
    ai.sendMessage(prompt);
  }
};
window.clearChat = () => {
  if (confirm('Clear chat history? This will start a new conversation.')) {
    ai.clearHistory();
  }
};

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
