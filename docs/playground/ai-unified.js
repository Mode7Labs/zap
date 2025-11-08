// Unified AI Agent - Natural conversation flow with tool-based actions

import { handleToolCall as handleZapDocTool } from './zap-tools.js';
import { ZAP_CDN_URL } from './config.js';

export class AIUnified {
  constructor(settings, editor) {
    this.settings = settings;
    this.editor = editor;
    this.chatMessages = document.getElementById('chat-messages');
    this.inputElement = document.getElementById('ai-prompt');
    this.sendButton = document.getElementById('ai-send-btn');

    // Conversation history for context
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
      // Keep last 10 exchanges
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
        <div class="message-content">⚡ Let's build some Zap games! Type what you want in the box below and I'll help you create it.</div>
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

    return { messageDiv, contentDiv };
  }

  addThinkingIndicator() {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'thinking-indicator';
    thinkingDiv.innerHTML = '<div class="thinking-spinner"></div><span>Thinking...</span>';
    this.chatMessages.appendChild(thinkingDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    return thinkingDiv;
  }

  removeThinkingIndicator(thinkingDiv) {
    if (thinkingDiv && thinkingDiv.parentElement) {
      thinkingDiv.remove();
    }
  }

  addToolExecution(toolName, args, status = 'running') {
    // Skip tool card for send_message - the message itself is the feedback
    if (toolName === 'send_message') {
      return { messageDiv: null, toolCard: null };
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message assistant';

    const toolCard = document.createElement('div');
    toolCard.className = `tool-execution ${status}`;

    // Tool icon and name
    const toolHeader = document.createElement('div');
    toolHeader.className = 'tool-header';

    const icon = this.getToolIcon(toolName);
    const label = this.getToolLabel(toolName, args);

    toolHeader.innerHTML = `<span class="tool-icon">${icon}</span><span class="tool-label">${label}</span>`;

    // Status indicator
    const statusDot = document.createElement('span');
    statusDot.className = `tool-status ${status}`;
    toolHeader.appendChild(statusDot);

    toolCard.appendChild(toolHeader);

    // Tool details (args preview)
    if (status === 'running') {
      const details = document.createElement('div');
      details.className = 'tool-details';
      details.textContent = this.getToolDetails(toolName, args);
      toolCard.appendChild(details);
    }

    messageDiv.appendChild(toolCard);
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    return { messageDiv, toolCard };
  }

  updateToolExecution(toolCard, status, result = null) {
    toolCard.className = `tool-execution ${status}`;

    const statusDot = toolCard.querySelector('.tool-status');
    if (statusDot) {
      statusDot.className = `tool-status ${status}`;
    }

    // Add result if provided
    if (result && status === 'success') {
      const existingResult = toolCard.querySelector('.tool-result');
      if (existingResult) {
        existingResult.remove();
      }

      const resultDiv = document.createElement('div');
      resultDiv.className = 'tool-result';
      resultDiv.textContent = result;
      toolCard.appendChild(resultDiv);
    }

    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  getToolIcon(toolName) {
    const icons = {
      'send_message': '💬',
      'update_editor': '⚡',
      'discover_zap_docs': '🔍',
      'get_zap_docs': '📚'
    };
    return icons[toolName] || '🔧';
  }

  getToolLabel(toolName, args) {
    const labels = {
      'send_message': 'Responding',
      'update_editor': 'Updating editor',
      'discover_zap_docs': args.query ? `Searching docs for "${args.query}"` : 'Discovering available docs',
      'get_zap_docs': `Looking up ${args.topic}`
    };
    return labels[toolName] || toolName;
  }

  getToolDetails(toolName, args) {
    if (toolName === 'send_message') {
      return args.message.substring(0, 60) + (args.message.length > 60 ? '...' : '');
    } else if (toolName === 'update_editor') {
      return args.description;
    } else if (toolName === 'discover_zap_docs') {
      return args.query ? `Query: ${args.query}` : 'Browsing all topics';
    } else if (toolName === 'get_zap_docs') {
      return `Topic: ${args.topic}`;
    }
    return '';
  }

  updateLastMessage(contentDiv, text, loading = false) {
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

  // Define agent tools
  getTools() {
    return [
      {
        type: 'function',
        function: {
          name: 'send_message',
          description: 'Send a text message to the user in the chat. Use this to answer questions, provide explanations, or give feedback.',
          parameters: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The message to send to the user. Keep it concise (1-3 sentences).'
              }
            },
            required: ['message']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'update_editor',
          description: 'Update the code in the editor. Use this when you need to generate or modify game code.',
          parameters: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The complete JavaScript code to put in the editor. Must be valid, executable Zap code with proper imports.'
              },
              description: {
                type: 'string',
                description: 'Brief description of what you changed (e.g., "Added bouncing ball with physics")'
              }
            },
            required: ['code', 'description']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'discover_zap_docs',
          description: 'Discover available Zap documentation topics. Use this to find what documentation is available before fetching specific docs.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Optional search query to filter topics (e.g., "animation", "button")'
              }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_zap_docs',
          description: 'Look up detailed Zap documentation for a specific topic. Use this when you need API details about features not in the CORE API list.',
          parameters: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'The topic to look up (e.g., "particles", "tweening", "ninepatch", "camera")'
              }
            },
            required: ['topic']
          }
        }
      }
    ];
  }

  // System prompt for the unified agent
  getSystemPrompt(currentCode) {
    return `You are a Zap Game Engine assistant. You help users build games through natural conversation.

YOU HAVE FOUR TOOLS:
1. **send_message(message)** - Send text to the user
2. **update_editor(code, description)** - Update the code in the editor
3. **discover_zap_docs(query)** - Discover available documentation topics
4. **get_zap_docs(topic)** - Look up detailed Zap API documentation

CONVERSATION STYLE:
- Be concise and friendly (1-2 sentences max)
- **CRITICAL: ALWAYS use send_message FIRST to tell the user what you're about to do**
- When building something:
  1. FIRST: send_message("I'll create a pinball game with...")
  2. THEN: (if needed) get_zap_docs(topic) for features not in CORE API
  3. THEN: update_editor(code, "Created pinball game")
- For simple questions: just send_message with the answer
- Tool call order matters! Always communicate before acting.

WHEN TO USE DOCS (DEFAULT TO DOCS!):
- **CRITICAL**: If the user request involves ANY feature beyond the MINIMAL CORE API below → ALWAYS get_zap_docs FIRST
- **NEVER manually implement physics, collision, or input** - Zap has built-in systems for these
- If you're unsure about ANY API details → get_zap_docs
- **WHEN IN DOUBT → ALWAYS GET DOCS**

MINIMAL CORE API (ONLY use these without docs):
- **Game**: new Game({ width, height, responsive, backgroundColor })
  - game.setScene(scene)
  - game.start()
  - game.width, game.height (read-only dimensions)
- **Scene**: new Scene()
  - scene.add(entity)
- **Sprite**: new Sprite({ x, y, width, height, color })
  - entity.x, entity.y (position)
  - CRITICAL: For interactive sprites, MUST have width AND height set!
- **Text**: new Text({ text, x, y, fontSize, color })
  - text.text (can update)
- **Import**: import { Game, Scene, Sprite, Text } from '${ZAP_CDN_URL}'

FORBIDDEN - DO NOT IMPLEMENT THESE MANUALLY:
- ❌ NEVER use manual velocity variables (let vx = ..., let vy = ...)
- ❌ NEVER implement manual collision detection with AABB/bounds checking
- ❌ NEVER use DOM event listeners (addEventListener, mousemove, click, etc.)
- ❌ NEVER create custom update loops with manual dt calculations
- ❌ NEVER use scene.onUpdate - use scene.on('update') instead
- ✅ ALWAYS use get_zap_docs to learn Zap's built-in systems

REQUIRED FOR COMMON GAME TYPES:
- **Pong/Physics games** → get_zap_docs('physics') AND get_zap_docs('collision-detection')
- **Interactive/Input** → get_zap_docs('tap') or get_zap_docs('drag')
- **Movement/Animation** → get_zap_docs('tweening')
- **Particles/Effects** → get_zap_docs('particles')

GESTURES - ALWAYS CHECK DOCS:
- **DO NOT use DOM events** - use Zap's gesture system
- For tap/drag/swipe → get_zap_docs('tap'), get_zap_docs('drag'), etc.
- **CRITICAL**: There are important gesture rules you MUST look up in docs (conflicts, event names, patterns)
- NEVER use non-existent events like 'tapend', 'mouseup', 'pointerup'

PHYSICS/COLLISION - ALWAYS CHECK DOCS:
- **NEVER implement manual physics** - Zap has built-in vx, vy, gravity, friction, bounce
- For ANY physics → get_zap_docs('physics') FIRST
- For ANY collision → get_zap_docs('collision-detection') FIRST
- DO NOT WING IT - use the built-in systems

Everything else beyond MINIMAL CORE API → MANDATORY get_zap_docs

CRITICAL CODE RULES:
1. Always include proper imports from '${ZAP_CDN_URL}'
2. Preserve existing Game/Scene config unless specifically asked to change it
3. Generate complete, executable code
4. Default entity anchor is (0.5, 0.5) - center positioning
5. Use game.width and game.height for positioning (they stay constant)

CURRENT CODE IN EDITOR:
\`\`\`javascript
${currentCode}
\`\`\`

Remember: Be natural, concise, and helpful. Use tools to take action.`;
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

    // Add user message to UI and history
    this.addMessage('user', prompt);
    this.conversationHistory.push({
      role: 'user',
      content: prompt
    });

    this.setLoading(true);

    // Add thinking indicator
    const thinkingIndicator = this.addThinkingIndicator();

    try {
      const currentCode = this.editor.getValue();

      // Build messages with system prompt and history
      const messages = [
        {
          role: 'system',
          content: this.getSystemPrompt(currentCode)
        },
        ...this.conversationHistory
      ];

      // Make API call with tools
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          tools: this.getTools(),
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

      // Handle tool calls - show each tool execution as it happens
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Remove thinking indicator
        this.removeThinkingIndicator(thinkingIndicator);

        // Process all tool calls with visual feedback
        await this.handleToolCalls(assistantMessage.tool_calls, messages, assistantMessage);
      } else if (assistantMessage.content) {
        // Remove thinking indicator
        this.removeThinkingIndicator(thinkingIndicator);

        // Direct text response (shouldn't happen with our tools, but handle it)
        this.addMessage('assistant', assistantMessage.content);
        this.conversationHistory.push({
          role: 'assistant',
          content: assistantMessage.content
        });
      }

      this.saveHistory();
      this.inputElement.value = '';

    } catch (error) {
      this.removeThinkingIndicator(thinkingIndicator);
      this.addMessage('assistant', `Error: ${error.message}`);
      console.error('AI Error:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async handleToolCalls(toolCalls, messages, assistantMessage, depth = 0) {
    const apiKey = this.settings.getApiKey();
    const model = this.settings.getModel();
    const MAX_DEPTH = 15; // Maximum recursive calls to prevent infinite loops

    // Safety check to prevent infinite recursion
    if (depth >= MAX_DEPTH) {
      this.addMessage('assistant', `Reached maximum tool call depth (${MAX_DEPTH}). The task may be too complex - try breaking it into smaller requests.`);
      return;
    }

    // Add assistant message with tool calls to history
    messages.push(assistantMessage);

    // Process ONLY the first tool call, then let AI continue
    const toolCall = toolCalls[0]; // Only process first tool
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments);

    console.log(`🔧 Tool called: ${toolName}`, toolArgs);

    // Show tool execution card IMMEDIATELY
    const { toolCard } = this.addToolExecution(toolName, toolArgs, 'running');

    let toolResult;

    try {
      // Execute the tool
      if (toolName === 'send_message') {
        // Display the message
        this.addMessage('assistant', toolArgs.message);
        toolResult = { success: true };

        // No tool card for send_message - message itself is the feedback

      } else if (toolName === 'update_editor') {
        // Update the code editor
        this.updateEditor(toolArgs.code, toolArgs.description);
        toolResult = { success: true, message: 'Code updated in editor' };

        // Update tool card to success
        if (toolCard) {
          this.updateToolExecution(toolCard, 'success', '✓ Code updated');
        }

      } else if (toolName === 'discover_zap_docs') {
        // Discover available docs
        toolResult = await handleZapDocTool('discover_zap_docs', toolArgs);

        // Update tool card to success
        if (toolCard) {
          if (toolResult.total) {
            this.updateToolExecution(toolCard, 'success', `Found ${toolResult.total} topics`);
          } else {
            this.updateToolExecution(toolCard, 'success');
          }
        }

      } else if (toolName === 'get_zap_docs') {
        // Fetch documentation
        toolResult = await handleZapDocTool('get_zap_docs', toolArgs);

        // Update tool card to success
        if (toolCard) {
          if (toolResult.title) {
            this.updateToolExecution(toolCard, 'success', `Found: ${toolResult.title}`);
          } else {
            this.updateToolExecution(toolCard, 'success');
          }
        }

      } else {
        toolResult = { error: 'Unknown tool' };
        if (toolCard) {
          this.updateToolExecution(toolCard, 'error', 'Unknown tool');
        }
      }
    } catch (error) {
      toolResult = { error: error.message };
      if (toolCard) {
        this.updateToolExecution(toolCard, 'error', error.message);
      }
    }

    // Add tool result to messages
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(toolResult)
    });

    // If there are more tools in this batch, process them
    if (toolCalls.length > 1) {
      // Process remaining tools from this call
      for (let i = 1; i < toolCalls.length; i++) {
        const nextToolCall = toolCalls[i];
        const nextToolName = nextToolCall.function.name;
        const nextToolArgs = JSON.parse(nextToolCall.function.arguments);

        console.log(`🔧 Tool called: ${nextToolName}`, nextToolArgs);

        const { toolCard: nextToolCard } = this.addToolExecution(nextToolName, nextToolArgs, 'running');

        let nextToolResult;

        try {
          if (nextToolName === 'send_message') {
            this.addMessage('assistant', nextToolArgs.message);
            nextToolResult = { success: true };
            // No tool card for send_message
          } else if (nextToolName === 'update_editor') {
            this.updateEditor(nextToolArgs.code, nextToolArgs.description);
            nextToolResult = { success: true };
            if (nextToolCard) {
              this.updateToolExecution(nextToolCard, 'success', '✓ Code updated');
            }
          } else if (nextToolName === 'discover_zap_docs') {
            nextToolResult = await handleZapDocTool('discover_zap_docs', nextToolArgs);
            if (nextToolCard) {
              this.updateToolExecution(nextToolCard, 'success', `Found ${nextToolResult.total || 0} topics`);
            }
          } else if (nextToolName === 'get_zap_docs') {
            nextToolResult = await handleZapDocTool('get_zap_docs', nextToolArgs);
            if (nextToolCard) {
              this.updateToolExecution(nextToolCard, 'success', nextToolResult.title ? `Found: ${nextToolResult.title}` : '');
            }
          }
        } catch (error) {
          nextToolResult = { error: error.message };
          if (nextToolCard) {
            this.updateToolExecution(nextToolCard, 'error', error.message);
          }
        }

        messages.push({
          role: 'tool',
          tool_call_id: nextToolCall.id,
          content: JSON.stringify(nextToolResult)
        });
      }
    }

    // Show thinking indicator before follow-up call
    const followUpThinking = this.addThinkingIndicator();

    // Ask AI to continue (it may want to do more)
    const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        tools: this.getTools(),
        tool_choice: 'auto',
        reasoning_effort: 'minimal'
      })
    });

    // Remove thinking indicator when response arrives
    this.removeThinkingIndicator(followUpThinking);

    if (!followUpResponse.ok) {
      throw new Error('Follow-up request failed');
    }

    const followUpData = await followUpResponse.json();
    const followUpMessage = followUpData.choices[0].message;

    // Recursively handle any additional tool calls
    if (followUpMessage.tool_calls && followUpMessage.tool_calls.length > 0) {
      await this.handleToolCalls(followUpMessage.tool_calls, messages, followUpMessage, depth + 1);
    } else if (followUpMessage.content) {
      // AI sent a final message (shouldn't happen with tools, but handle it)
      this.addMessage('assistant', followUpMessage.content);
    }

    // Save final conversation state (just the user-facing messages)
    this.syncConversationHistory(messages);
  }

  syncConversationHistory(messages) {
    // Extract only user and assistant text messages (not tool calls)
    this.conversationHistory = messages
      .filter(msg => msg.role === 'user' || (msg.role === 'assistant' && msg.content))
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  }

  updateEditor(code, description) {
    // Clean up code
    let cleanCode = code
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Ensure proper CDN import
    cleanCode = cleanCode
      .replace(/from\s+['"]?\$\{ZAP_CDN_URL\}['"]?/g, `from '${ZAP_CDN_URL}'`)
      .replace(/from\s+['"]@VERSION['"]/g, `from '${ZAP_CDN_URL}'`)
      .replace(/from\s+['"]\$\{.*?\}['"]/g, `from '${ZAP_CDN_URL}'`);

    // Update editor
    this.editor.setValue(cleanCode);
    this.editor.updatePreview();
  }
}
