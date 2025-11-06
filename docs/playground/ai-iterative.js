// Iterative AI code generation (new implementation)

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

    // Conversation history
    this.conversationHistory = this.loadHistory();
    this.maxHistoryItems = 5;

    // Iterative execution state
    this.currentPlan = null;
    this.currentStepIndex = 0;
    this.isExecuting = false;
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
    if (this.isExecuting) {
      this.showStatus('⚠️ AI is already working...', 'error');
      return;
    }

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

    this.isExecuting = true;
    this.setLoading(true);

    try {
      const currentCode = this.editor.getValue();

      // Phase 1: Create implementation plan
      this.showStatus('🤔 Planning implementation...', '');
      const plan = await this.createPlan(apiKey, model, currentCode, prompt);

      if (!plan || !plan.steps || plan.steps.length === 0) {
        throw new Error('Failed to create implementation plan');
      }

      this.currentPlan = plan;
      this.currentStepIndex = 0;

      console.log(`📋 Plan created with ${plan.steps.length} steps:`, plan.steps.map(s => s.description));

      // Phase 2: Execute steps iteratively
      for (let i = 0; i < plan.steps.length; i++) {
        this.currentStepIndex = i;
        const step = plan.steps[i];

        this.showStatus(`⚡ Step ${i + 1}/${plan.steps.length}: ${step.description}...`, '');

        // Execute this step (with retry on errors)
        await this.executeStep(apiKey, model, step, i + 1, plan.steps.length);
      }

      // Success!
      this.showStatus('✓ All steps completed successfully!', 'success');

      // Add to history
      this.conversationHistory.push({
        prompt: prompt,
        timestamp: Date.now(),
        success: true,
        steps: plan.steps.length
      });
      this.saveHistory();

      // Clear the prompt
      this.inputElement.value = '';

    } catch (error) {
      this.showStatus(`❌ Error: ${error.message}`, 'error');
      console.error('AI Error:', error);

      // Add failed attempt to history
      this.conversationHistory.push({
        prompt: prompt,
        timestamp: Date.now(),
        success: false,
        error: error.message
      });
      this.saveHistory();
    } finally {
      this.isExecuting = false;
      this.setLoading(false);
      this.currentPlan = null;
      this.currentStepIndex = 0;

      if (window.updateHistoryCount) {
        window.updateHistoryCount();
      }
    }
  }

  async createPlan(apiKey, model, currentCode, prompt) {
    const messages = [
      {
        role: 'system',
        content: ZAP_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nCreate a step-by-step plan using create_plan. Break this into 3-8 small, incremental steps.`
      }
    ];

    const MAX_ITERATIONS = 10;
    let iterations = 0;

    while (iterations < MAX_ITERATIONS) {
      iterations++;

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
          tool_choice: 'auto',
          verbosity: 'low',
          reasoning_effort: 'minimal'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      messages.push(assistantMessage);

      // Check for tool calls
      if (assistantMessage.tool_calls) {
        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          console.log(`📞 Planning: ${toolName}`, toolArgs);

          const toolResult = await handleToolCall(toolName, toolArgs);

          // If it's the create_plan tool, we have our plan!
          if (toolName === 'create_plan' && toolResult.plan) {
            return { steps: toolResult.plan };
          }

          // Add tool response
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }
      }
    }

    throw new Error('Failed to create plan after ' + MAX_ITERATIONS + ' iterations');
  }

  async executeStep(apiKey, model, step, stepNum, totalSteps) {
    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      const currentCode = this.editor.getValue();

      // Clear any previous error
      this.editor.clearRuntimeError();

      // Build messages for this step
      const messages = [
        {
          role: 'system',
          content: ZAP_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Current code:\n\`\`\`javascript\n${currentCode}\n\`\`\`\n\nStep ${stepNum}/${totalSteps}: ${step.description}\nReasoning: ${step.reasoning}\n\nUse apply_step to implement this change. Return the COMPLETE updated code.`
        }
      ];

      // If this is a retry, add error context
      if (retries > 0) {
        const lastError = this.editor.getLastError();
        if (lastError) {
          messages.push({
            role: 'user',
            content: `⚠️ The previous code had a runtime error:\nError: ${lastError.message}\nStack: ${lastError.stack}\n\nPlease fix this error and try again.`
          });
        }
      }

      // Call AI to apply the step
      const MAX_ITERATIONS = 5;
      let iterations = 0;
      let stepApplied = false;
      let hadRuntimeError = false;

      while (iterations < MAX_ITERATIONS && !stepApplied && !hadRuntimeError) {
        iterations++;

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
            tool_choice: 'auto',
            verbosity: 'low',
            reasoning_effort: 'minimal'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message;
        messages.push(assistantMessage);

        // Check for tool calls
        if (assistantMessage.tool_calls) {
          for (const toolCall of assistantMessage.tool_calls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments);

            console.log(`🔧 Step ${stepNum}: ${toolName}`, toolArgs);

            const toolResult = await handleToolCall(toolName, toolArgs);

            // If it's apply_step, we have our code!
            if (toolName === 'apply_step' && toolResult.code) {
              // Clean and apply the code
              let cleanCode = toolResult.code
                .replace(/```javascript\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

              // Fix CDN URL
              cleanCode = cleanCode
                .replace(/from\s+['"]?\$\{ZAP_CDN_URL\}['"]?/g, `from '${ZAP_CDN_URL}'`)
                .replace(/from\s+['"]@VERSION['"]/g, `from '${ZAP_CDN_URL}'`)
                .replace(/from\s+['"]\$\{.*?\}['"]/g, `from '${ZAP_CDN_URL}'`);

              // Apply to editor
              this.editor.setValue(cleanCode);

              // Force preview update
              this.editor.updatePreview();

              stepApplied = true;

              // Wait for preview to load and check for errors
              await this.waitForPreviewTest();

              const error = this.editor.getLastError();
              if (error && Date.now() - error.timestamp < 2000) {
                // Error detected within last 2 seconds - retry
                console.warn(`⚠️ Step ${stepNum} failed with error:`, error.message);
                hadRuntimeError = true; // Flag to exit inner loop and retry
                break; // Break out of for loop
              }

              // Success - step applied without errors!
              console.log(`✓ Step ${stepNum} completed successfully`);
              return;
            }

            // Add tool response
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult)
            });
          }
        }
      }

      if (!stepApplied) {
        // Check if this was due to a runtime error that we should retry
        if (hadRuntimeError) {
          retries++;
          if (retries < MAX_RETRIES) {
            console.log(`🔄 Retrying step ${stepNum} (attempt ${retries + 1}/${MAX_RETRIES})...`);
            continue; // Retry with error context
          }
          throw new Error(`Step ${stepNum} failed after ${MAX_RETRIES} retries due to runtime errors`);
        }
        throw new Error(`Failed to apply step ${stepNum} after ${MAX_ITERATIONS} iterations`);
      }
    }

    // Max retries exceeded
    throw new Error(`Step ${stepNum} failed after ${MAX_RETRIES} retries`);
  }

  // Wait for preview to load and potentially throw errors
  async waitForPreviewTest() {
    return new Promise(resolve => {
      setTimeout(resolve, 1500); // Wait 1.5 seconds for code to execute
    });
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

    if (type === 'error') {
      this.disclaimerElement.classList.add('hidden');
    } else if (type === 'success' || type === '') {
      this.disclaimerElement.classList.remove('hidden');
    }

    if (type !== '') {
      setTimeout(() => {
        if (type !== 'success') {
          this.statusElement.textContent = '';
        }
      }, 5000);
    }
  }
}
