// AI code generation

import { ZAP_SYSTEM_PROMPT, ZAP_TOOLS, handleToolCall } from './zap-tools.js';
import { ZAP_CDN_URL } from './config.js';

export class AIAssistant {
  constructor(settings, editor) {
    this.settings = settings;
    this.editor = editor;
    this.statusElement = document.getElementById('ai-status');
    this.buttonElement = document.getElementById('ai-generate-btn');
    this.inputElement = document.getElementById('ai-prompt');
    this.disclaimerElement = document.getElementById('ai-disclaimer');

    // Conversation history for context
    this.conversationHistory = this.loadHistory();
    this.maxHistoryItems = 5; // Keep last 5 exchanges
  }

  loadHistory() {
    try {
      const stored = sessionStorage.getItem('zap_ai_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveHistory() {
    try {
      // Keep only last N items
      const trimmed = this.conversationHistory.slice(-this.maxHistoryItems);
      sessionStorage.setItem('zap_ai_history', JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to save history:', error);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
    sessionStorage.removeItem('zap_ai_history');
  }

  async generateCode(prompt) {
    const apiKey = this.settings.getApiKey();
    const model = this.settings.getModel();

    if (!apiKey) {
      this.showStatus('Please configure your OpenAI API key in settings', 'error');
      return;
    }

    if (!prompt.trim()) {
      this.showStatus('Please enter a description', 'error');
      return;
    }

    this.setLoading(true);
    this.showStatus('🤖 AI is thinking...', '');

    try {
      const currentCode = this.editor.getValue();

      // Build messages with conversation history
      const messages = [
        {
          role: 'system',
          content: ZAP_SYSTEM_PROMPT
        }
      ];

      // Add conversation history for context
      if (this.conversationHistory.length > 0) {
        messages.push({
          role: 'system',
          content: `Previous conversation context:\n${this.conversationHistory.map((h, i) =>
            `${i + 1}. User asked: "${h.prompt}"\n   Result: ${h.success ? 'Success' : 'Failed'}`
          ).join('\n')}\n\nUse this context to understand what features have already been added and what the user is building.`
        });
      }

      // Add current request
      messages.push({
        role: 'user',
        content: `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nIMPORTANT:
1. Use the CURRENT CODE as your primary reference - it already shows working Zap API usage
2. Preserve ALL existing Game configuration (width, height, responsive, backgroundColor, parent) and Scene configuration
3. For simple changes, just modify the current code - DO NOT fetch documentation
4. Only call get_zap_docs if you need NEW features not present in current code or CORE API REFERENCE
5. Generate the updated code immediately if you have everything you need`
      });

      let iterationCount = 0;
      const MAX_ITERATIONS = 10;
      let finalCode = null;

      // Tool calling loop using Chat Completions API
      while (iterationCount < MAX_ITERATIONS && !finalCode) {
        iterationCount++;
        console.log(`\n=== Iteration ${iterationCount}/${MAX_ITERATIONS} ===`);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            tools: ZAP_TOOLS,
            tool_choice: 'auto'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message;
        messages.push(assistantMessage);

        // Check if AI wants to call tools
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
          this.showStatus(`🔍 AI is exploring Zap docs (${assistantMessage.tool_calls.length} queries)...`, '');

          // Process each tool call
          for (const toolCall of assistantMessage.tool_calls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments);

            console.log(`📞 AI called: ${toolName}`, toolArgs);

            // Execute the tool
            const toolResult = await handleToolCall(toolName, toolArgs);

            // Log the result
            if (toolResult.error) {
              console.warn(`⚠️ Tool error:`, toolResult.error);
            } else if (toolResult.title) {
              console.log(`✅ Got docs: ${toolResult.title}`);
            } else if (toolResult.total !== undefined) {
              console.log(`✅ Found ${toolResult.total} topics`);
            }

            // Add tool response to conversation
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult)
            });
          }
        } else if (assistantMessage.content) {
          // AI returned final code
          finalCode = assistantMessage.content;
        } else {
          throw new Error('Unexpected response - no content or tool calls');
        }
      }

      if (!finalCode) {
        throw new Error('AI took too long to generate code. Please try a simpler request.');
      }

      // Clean up code and fix common issues
      let cleanCode = finalCode
        .replace(/```javascript\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Ensure the import uses the actual CDN URL, not a template variable
      // Handle case where AI might output ${ZAP_CDN_URL}, @VERSION, or similar placeholders
      cleanCode = cleanCode
        .replace(/from\s+['"]?\$\{ZAP_CDN_URL\}['"]?/g, `from '${ZAP_CDN_URL}'`)
        .replace(/from\s+['"]@VERSION['"]/g, `from '${ZAP_CDN_URL}'`)
        .replace(/from\s+['"]\$\{.*?\}['"]/g, `from '${ZAP_CDN_URL}'`); // Catch any other template vars

      this.editor.setValue(cleanCode);
      this.editor.updatePreview();
      this.showStatus('✓ Code generated successfully!', 'success');

      // Add to conversation history
      this.conversationHistory.push({
        prompt: prompt,
        timestamp: Date.now(),
        success: true
      });
      this.saveHistory();

      // Update history count UI
      if (window.updateHistoryCount) {
        window.updateHistoryCount();
      }

      // Clear the prompt
      this.inputElement.value = '';

    } catch (error) {
      this.showStatus(`Error: ${error.message}`, 'error');
      console.error('AI Error:', error);

      // Add failed attempt to history
      this.conversationHistory.push({
        prompt: prompt,
        timestamp: Date.now(),
        success: false,
        error: error.message
      });
      this.saveHistory();

      // Update history count UI
      if (window.updateHistoryCount) {
        window.updateHistoryCount();
      }
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(isLoading) {
    this.buttonElement.disabled = isLoading;
    this.inputElement.disabled = isLoading;

    if (isLoading) {
      this.buttonElement.classList.add('loading');
    } else {
      this.buttonElement.classList.remove('loading');
    }
  }

  showStatus(message, type) {
    this.statusElement.className = `ai-status ${type}`;
    this.statusElement.textContent = message;

    // Hide disclaimer when showing error
    if (type === 'error') {
      this.disclaimerElement.classList.add('hidden');
    } else if (type === 'success' || type === '') {
      this.disclaimerElement.classList.remove('hidden');
    }

    if (type !== '') {
      setTimeout(() => {
        this.statusElement.textContent = '';
      }, 5000);
    }
  }
}
