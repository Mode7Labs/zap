// Settings management

export class Settings {
  constructor() {
    this.modal = document.getElementById('settings-modal');
    this.apiKeyInput = document.getElementById('api-key-input');
    this.modelSelect = document.getElementById('model-select');
    this.indicator = document.getElementById('ai-indicator');

    this.setupEventListeners();
    this.updateIndicator();
  }

  setupEventListeners() {
    // Click outside modal to close
    this.modal.onclick = (e) => {
      if (e.target.id === 'settings-modal') {
        this.close();
      }
    };
  }

  open() {
    this.modal.classList.add('open');
    this.apiKeyInput.value = localStorage.getItem('openai_api_key') || '';
    this.modelSelect.value = localStorage.getItem('openai_model') || 'gpt-5-mini';
  }

  close() {
    this.modal.classList.remove('open');
  }

  save() {
    const apiKey = this.apiKeyInput.value.trim();
    const model = this.modelSelect.value;

    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
      localStorage.setItem('openai_model', model);
      this.updateIndicator();
      this.close();
    }
  }

  updateIndicator() {
    const hasKey = !!localStorage.getItem('openai_api_key');
    const model = localStorage.getItem('openai_model') || 'gpt-5-mini';
    const modelDisplay = model.replace('gpt-5-', 'GPT-5 ').replace('gpt-5', 'GPT-5');

    this.indicator.textContent = hasKey ? `AI: ${modelDisplay} ✓` : 'AI: Not configured';
    this.indicator.style.color = hasKey ? '#51cf66' : '#9a9a9a';
  }

  getApiKey() {
    return localStorage.getItem('openai_api_key');
  }

  getModel() {
    return localStorage.getItem('openai_model') || 'gpt-5-mini';
  }
}
