// AI Chat Assistant - handles both questions and code generation

import { ZAP_TOOLS, handleToolCall } from './zap-tools.js';
import { ZAP_CDN_URL } from './config.js';

export class AIChatAssistant {
  constructor(settings, editor) {
    this.settings = settings;
    this.editor = editor;
    this.chatMessages = document.getElementById('chat-messages');
    this.inputElement = document.getElementById('ai-prompt');
    this.sendButton = document.getElementById('ai-send-btn');

    // Full conversation history for API
    this.conversationHistory = this.loadHistory();
  }

  loadHistory() {
    try {
      const stored = sessionStorage.getItem('zap_chat_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveHistory() {
    try {
      // Keep conversation history manageable
      const trimmed = this.conversationHistory.slice(-20);
      sessionStorage.setItem('zap_chat_history', JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to save history:', error);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
    sessionStorage.removeItem('zap_chat_history');

    // Clear UI except welcome message
    this.chatMessages.innerHTML = `
      <div class="chat-message assistant">
        <div class="message-content">
          Hi! I'm your Zap AI assistant. I can help you build games, answer questions about Zap, or modify your code. What would you like to create?
        </div>
      </div>
    `;
  }

  addMessage(role, content, loading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = `message-content ${loading ? 'loading' : ''}`;
    if (!loading) {
      contentDiv.textContent = content;
    }

    messageDiv.appendChild(contentDiv);
    this.chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    return contentDiv;
  }

  updateMessage(contentDiv, text, loading = false) {
    contentDiv.className = `message-content ${loading ? 'loading' : ''}`;
    if (!loading) {
      contentDiv.textContent = text;
    }
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  setLoading(isLoading) {
    this.sendButton.disabled = isLoading;
    this.inputElement.disabled = isLoading;
  }

  // Determine if the message is a question or a code generation request
  isQuestion(prompt) {
    const lowerPrompt = prompt.toLowerCase().trim();

    // Short affirmative responses should trigger code generation if in context
    const affirmativeWords = ['ok', 'okay', 'yes', 'yeah', 'sure', 'go', 'do it', 'please', 'yep', 'yup'];
    if (affirmativeWords.includes(lowerPrompt)) {
      return false; // Trigger code generation
    }

    // Check for code action words first - these are STRONG indicators
    const codeWords = ['add', 'create', 'make', 'build', 'generate', 'change', 'update', 'modify', 'remove', 'delete', 'draw', 'spawn', 'place'];
    for (const word of codeWords) {
      if (lowerPrompt.includes(word)) return false;
    }

    // Check if asking about feasibility ("can we", "can i", "could we", "could i")
    // These sound like questions but are actually code requests
    if (lowerPrompt.match(/^(can|could) (we|i|you) (create|make|build|add)/)) {
      return false; // It's a code request disguised as a question
    }

    // Check for question marks
    if (lowerPrompt.includes('?')) return true;

    // Check for question words at start (only for actual informational questions)
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'does', 'is', 'are', 'explain', 'tell', 'show', 'describe'];
    for (const word of questionWords) {
      if (lowerPrompt.startsWith(word + ' ')) return true;
    }

    // Default to question (conservative - better to answer a question than generate unwanted code)
    return true;
  }

  async sendMessage(prompt) {
    const apiKey = this.settings.getApiKey();
    const model = this.settings.getModel();

    if (!apiKey) {
      this.addMessage('assistant', 'Please configure your OpenAI API key in settings first.');
      return;
    }

    if (!prompt.trim()) {
      return;
    }

    // Add user message to UI
    this.addMessage('user', prompt);

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: prompt
    });

    this.setLoading(true);

    // Add loading message
    const loadingDiv = this.addMessage('assistant', 'Thinking...', true);

    try {
      const isQuestionType = this.isQuestion(prompt);

      if (isQuestionType) {
        // Handle as a question - simple conversational response
        await this.handleQuestion(prompt, loadingDiv);
      } else {
        // Handle as a code generation request
        await this.handleCodeGeneration(prompt, loadingDiv);
      }

      this.saveHistory();
      this.inputElement.value = '';

    } catch (error) {
      this.updateMessage(loadingDiv, `Error: ${error.message}`);
      console.error('AI Error:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async handleQuestion(prompt, loadingDiv) {
    const apiKey = this.settings.getApiKey();
    const model = this.settings.getModel();

    // Build a conversational system prompt
    const messages = [
      {
        role: 'system',
        content: `You are a helpful Zap Game Engine assistant. Answer questions about Zap clearly and concisely.

CRITICAL RULES:
- Keep responses SHORT (2-3 sentences max)
- NEVER output code blocks in chat responses
- For "how to build X" questions, give a brief conceptual overview only (e.g., "Use Sprite with physics, add collision detection, and handle tap events")
- Be friendly but concise
- Answer from your knowledge of Zap - you have access to: Game, Scene, Sprite, Text, physics (vx, vy, gravity, friction, bounce), collision detection, gestures (tap, drag, swipe), tweening, particles, audio

Example good responses:
Q: "How do I add physics?"
A: "Set velocity (vx, vy), gravity, and friction properties on any sprite. Call entity.bounce() to reflect off surfaces."

Q: "Can I build a pinball game?"
A: "Yes! Use circular sprites with physics, static walls, collision detection, and tap events for flippers. Want me to generate a starter?"

Q: "What's a Scene?"
A: "A Scene is a container for game entities. Create one with new Scene(), add entities with scene.add(), and set it with game.setScene()."`
      },
      ...this.conversationHistory
    ];

    // Call API without tools for faster response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        reasoning_effort: 'minimal'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    // Update UI with response
    this.updateMessage(loadingDiv, assistantMessage.content);

    // Add to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage.content
    });
  }

  async handleCodeGeneration(prompt, loadingDiv) {
    const apiKey = this.settings.getApiKey();
    const model = this.settings.getModel();
    const currentCode = this.editor.getValue();

    this.updateMessage(loadingDiv, 'Generating code...', true);

    // Get recent conversation context (last 3 messages for context)
    const recentContext = this.conversationHistory.slice(-6).map(msg =>
      `${msg.role}: ${msg.content}`
    ).join('\n');

    // Build messages for code generation
    const messages = [
      {
        role: 'system',
        content: `You are a Zap Game Engine code generator. Generate complete, working Zap code based on user requests.

CRITICAL RULES:
1. Return ONLY the complete JavaScript code, no explanations
2. Use APIs from the current code or core Zap API (Game, Scene, Sprite, Text, etc.)
3. Import from '${ZAP_CDN_URL}'
4. Preserve existing Game and Scene configuration unless specifically asked to change it
5. For simple changes, modify the current code directly
6. Only use get_zap_docs for NEW features not in current code (minimize tool use)

Recent conversation:
${recentContext}

Current code:
\`\`\`javascript
${currentCode}
\`\`\`

User request: ${prompt}

Generate the complete updated code now.`
      }
    ];

    let iterationCount = 0;
    const MAX_ITERATIONS = 3; // Reduced from 5 to fail faster
    let finalCode = null;

    while (iterationCount < MAX_ITERATIONS && !finalCode) {
      iterationCount++;

      if (iterationCount > 1) {
        this.updateMessage(loadingDiv, `Generating code (step ${iterationCount})...`, true);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          tools: ZAP_TOOLS.filter(t =>
            t.function.name === 'get_zap_docs' ||
            t.function.name === 'discover_zap_docs'
          ),
          tool_choice: 'auto',
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

      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        this.updateMessage(loadingDiv, `Looking up Zap docs (${assistantMessage.tool_calls.length} topics)...`, true);

        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          const toolResult = await handleToolCall(toolName, toolArgs);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }
      } else if (assistantMessage.content) {
        finalCode = assistantMessage.content;
      } else {
        throw new Error('Unexpected response from AI');
      }
    }

    if (!finalCode) {
      throw new Error('Code generation timed out. Try rephrasing your request or breaking it into smaller steps.');
    }

    // Clean up code
    let cleanCode = finalCode
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    cleanCode = cleanCode
      .replace(/from\s+['"]?\$\{ZAP_CDN_URL\}['"]?/g, `from '${ZAP_CDN_URL}'`)
      .replace(/from\s+['"]@VERSION['"]/g, `from '${ZAP_CDN_URL}'`)
      .replace(/from\s+['"]\$\{.*?\}['"]/g, `from '${ZAP_CDN_URL}'`);

    // Update editor
    this.editor.setValue(cleanCode);
    this.editor.updatePreview();

    // Update message
    this.updateMessage(loadingDiv, 'Code generated! Check the editor.');

    // Add to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: 'I\'ve updated the code in the editor. Let me know if you\'d like any changes!'
    });
  }
}
