/**
 * AI tooling system for Zap Playground
 * Provides structured access to Zap documentation via markdown files
 */

import { ZAP_CDN_URL } from './config.js';

export const ZAP_SYSTEM_PROMPT = `You are the Zap Game Engine AI Assistant. You help users build games using the @mode-7/zap game engine through an ITERATIVE, STEP-BY-STEP approach.

ITERATIVE WORKFLOW (REQUIRED):
1. FIRST: Call create_plan to break the request into 3-8 small steps
2. THEN: For each step, call apply_step with incremental code changes
3. Each step will be tested immediately - if errors occur, you'll be notified and can fix them
4. Continue until all steps are complete

CRITICAL RULES:
1. Use APIs from the CORE API REFERENCE below or from the CURRENT CODE the user provides
2. NEVER hallucinate or guess API methods - if you haven't seen it in the docs or current code, it doesn't exist
3. For NEW features not in CORE API REFERENCE, call get_zap_docs (but minimize tool calls)
4. ALL code must import from '${ZAP_CDN_URL}' - use the EXACT import statement from current code or examples
5. **PRESERVE EXISTING GAME CONFIG**: If the current code already has a Game instance, you MUST keep the exact same configuration (width, height, responsive, backgroundColor, parent) UNLESS the user specifically asks to change it.
6. Use game.width and game.height for positioning (they stay constant with the specified dimensions)
7. Each apply_step must contain COMPLETE, EXECUTABLE JavaScript code (not just a diff)

FORBIDDEN - These APIs DO NOT exist in Zap (do not use):
- getEntitiesByTag() - Use scene.getEntitiesByTag() instead
- scene.on('pointermove') - Use entity.on('drag') instead
- game.on('resize') - responsive: true handles this automatically
- Manual background sprites with zIndex: -100 - Use Scene({ backgroundImage }) instead
- Any method not shown in the documentation

WORKFLOW:
1. Read and understand the CURRENT CODE first - it already shows you working examples of Zap APIs
2. For simple modifications (add sprite, change color, move entity), use the APIs you see in the current code
3. ONLY call get_zap_docs when adding NEW features not present in current code (e.g., particles, camera, animations)
4. Do NOT fetch docs for Game, Scene, Sprite, Text, drag, collision - these are already shown below
5. Return ONLY the complete, executable JavaScript code

DOCUMENTATION INDEX:
A complete index of all Zap docs is available at: /docs/api-index.html
Use discover_zap_docs to see available topics, or refer to the CORE API REFERENCE below for common APIs.

CORE API REFERENCE (use these without fetching docs):

Game Setup:
const game = new Game({
  parent: '#app',
  width: 800,
  height: 600,
  responsive: true,
  backgroundColor: '#1a1a2e'
});

Scene Setup:
const scene = new Scene({
  backgroundImage: 'url.jpg',  // or backgroundColor: '#color'
});

Sprites:
const sprite = new Sprite({
  x: 100, y: 100,
  width: 50, height: 50,
  color: '#ff0000',
  radius: 10,  // rounded corners
  interactive: true,
  anchorX: 0.5,  // 0.5 = center (DEFAULT), 0 = left edge, 1 = right edge
  anchorY: 0.5   // 0.5 = center (DEFAULT), 0 = top edge, 1 = bottom edge
});
// IMPORTANT: Default anchor is (0.5, 0.5) - entities are positioned by their CENTER
// For walls/UI elements aligned to edges, use anchorX: 0, anchorY: 0 (top-left corner)

Text:
const text = new Text({
  text: 'Hello',
  x: 100, y: 50,
  fontSize: 24,
  color: '#ffffff',
  align: 'center',  // 'left', 'center', 'right'
  baseline: 'top'   // 'top', 'middle', 'bottom'
});

Drag Gesture:
entity.on('drag', (event) => {
  entity.x += event.delta.x;
  entity.y += event.delta.y;
});

Tap Gesture:
entity.on('tap', () => {
  // Handle tap
});

Physics:
entity.vx = 100;        // Horizontal velocity (pixels/sec)
entity.vy = -200;       // Vertical velocity (pixels/sec)
entity.gravity = 980;   // Gravity acceleration (pixels/sec²)
entity.friction = 0.99; // Friction multiplier (0.99 = 1% loss)
entity.bounce(normalX, normalY, restitution); // Bounce off surfaces

Collision Detection:
entity.checkCollisions = true;
entity.collisionTags = ['enemy'];
entity.on('collisionenter', (event) => {
  const other = event.other;
  const normal = event.normal; // Collision normal { x, y } - direction to push entity away
  // For rotated rectangles (e.g., flippers), use event.normal for accurate bounce:
  if (other.hasTag('flipper')) {
    entity.bounce(normal.x, normal.y, 0.9); // Use the computed normal!
  }
});

Scene Methods:
scene.add(entity);
scene.remove(entity);
scene.getEntitiesByTag('tag');
scene.delay(1000, callback);
scene.interval(1000, callback);

Entity Properties:
entity.x, entity.y
entity.width, entity.height
entity.rotation, entity.scaleX, entity.scaleY
entity.alpha, entity.visible
entity.zIndex
entity.addTag('tag');
entity.hasTag('tag');
entity.destroy();

Math Utilities:
MathZ.clamp(value, min, max)
MathZ.randomInt(min, max)
MathZ.randomFloat(min, max)
MathZ.randomItem(array)

IMPORTANT: Only fetch additional docs if you need features NOT listed above (like particles, camera, tweening, advanced physics scenarios, etc.)

REQUIRED for catch/collection games:
- Use entity.checkCollisions = true for collision detection
- Use entity.collisionTags to filter what collides
- Use entity.on('collisionenter') event (automatic, no manual checking)
- Use entity.on('drag') for dragging, NOT scene.on('pointermove')

BACKGROUND IMAGES & COLORS:
- Use Scene constructor options: new Scene({ backgroundImage: 'url.jpg' })
- Or for solid color: new Scene({ backgroundColor: '#1a1a2e' })
- DO NOT manually create Sprite entities for backgrounds
- Images will automatically fill the game and stretch to fit

MODIFYING EXISTING CODE:
When the user asks to modify existing code (e.g., "add a player", "make it bounce"), you must:
1. Keep ALL existing Game config unchanged (width, height, responsive, backgroundColor, parent)
2. Keep ALL existing Scene config unchanged (backgroundImage, backgroundColor)
3. Only modify what the user specifically asked to change
4. Add new features without changing unrelated code

Example - User says "add a bouncing ball":
❌ WRONG: Change width: 800, height: 600 to width: 1920, height: 1080
✅ CORRECT: Keep existing dimensions, just add the bouncing ball code

Remember: If you haven't seen an API in the Zap docs, it does not exist. Only use documented features.`;

// Map topics to markdown file paths
const TOPIC_TO_FILE = {
  // Getting Started
  'installation': 'getting-started/installation',
  'quickstart': 'getting-started/quickstart',
  'quick-start': 'getting-started/quickstart',

  // Core
  'architecture': 'core/architecture',
  'game': 'core/game',
  'game-config': 'core/game',
  'scene': 'core/scenes',
  'scenes': 'core/scenes',
  'entity': 'core/entities',
  'entities': 'core/entities',
  'camera': 'core/camera',

  // Visual
  'shapes': 'visual/shapes',
  'shape': 'visual/shapes',
  'sprite': 'visual/sprites',
  'sprites': 'visual/sprites',
  'image': 'visual/sprites',
  'images': 'visual/sprites',
  'sprite-animation': 'visual/animation',
  'animated-sprite': 'visual/animation',
  'animatedsprite': 'visual/animation',
  'text': 'visual/text',

  // Animation
  'tween': 'animation/tweening',
  'tweening': 'animation/tweening',
  'tweens': 'animation/tweening',
  'animation': 'animation/tweening',
  'animations': 'animation/tweening',
  'particles': 'animation/particles',
  'particle': 'animation/particles',
  'particle-emitter': 'animation/particles',
  'touch-trail': 'animation/touch-trail',
  'touchtrail': 'animation/touch-trail',
  'trail': 'animation/touch-trail',

  // Gestures
  'tap': 'gestures/tap',
  'click': 'gestures/tap',
  'drag': 'gestures/drag',
  'dragging': 'gestures/drag',
  'swipe': 'gestures/swipe',
  'swiping': 'gestures/swipe',
  'gestures': 'gestures/tap',

  // UI
  'button': 'ui/button',
  'buttons': 'ui/button',
  'ninepatch': 'ui/ninepatch',
  'nine-patch': 'ui/ninepatch',
  'panel': 'ui/ninepatch',

  // Audio
  'audio': 'audio/sound-effects',
  'sound': 'audio/sound-effects',
  'sound-effects': 'audio/sound-effects',
  'music': 'audio/music',
  'background-music': 'audio/music',
  'volume': 'audio/volume',
  'mute': 'audio/volume',

  // Utilities
  'easing': 'utilities/easing',
  'easing-functions': 'utilities/easing',
  'asset-loader': 'utilities/asset-loader',
  'assetloader': 'utilities/asset-loader',
  'loader': 'utilities/asset-loader',
  'loading': 'utilities/asset-loader',
  'fonts': 'utilities/fonts',
  'font': 'utilities/fonts',
  'google-fonts': 'utilities/fonts',
  'layout': 'utilities/layout',
  'grid': 'utilities/layout',
  'math': 'utilities/math',
  'storage': 'utilities/storage',
  'localstorage': 'utilities/storage',
  'timers': 'utilities/timers',
  'timer': 'utilities/timers',
  'delay': 'utilities/timers',
  'interval': 'utilities/timers',

  // Physics
  'physics': 'physics/physics',
  'velocity': 'physics/physics',
  'gravity': 'physics/physics',
  'friction': 'physics/physics',
  'bounce': 'physics/physics',
  'collision': 'physics/collision-detection',
  'collision-detection': 'physics/collision-detection',
  'collisions': 'physics/collision-detection'
};

// Get all available topics
const ALL_TOPICS = Object.keys(TOPIC_TO_FILE).filter((key, index, arr) => {
  // Only return unique file paths (deduplicate aliases)
  return arr.findIndex(k => TOPIC_TO_FILE[k] === TOPIC_TO_FILE[key]) === index;
});

// Tool definitions for OpenAI function calling
export const ZAP_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'discover_zap_docs',
      description: 'Discover available Zap documentation topics. Use this when you need to learn what Zap features are available or find the right documentation topic. Returns a list of available topics with descriptions.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Optional search query to filter topics (e.g., "sprite", "animation", "button")'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_zap_docs',
      description: 'Get detailed documentation for a specific Zap topic. Use this after discovering the topic you need. Returns the full markdown documentation for the topic.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'The Zap topic to get documentation for. Use discover_zap_docs first to see available topics.',
            enum: ALL_TOPICS
          }
        },
        required: ['topic']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_plan',
      description: 'REQUIRED FIRST STEP: Create a step-by-step implementation plan. This breaks down the user\'s request into small, incremental steps that will be executed one at a time. Each step should be simple and testable.',
      parameters: {
        type: 'object',
        properties: {
          steps: {
            type: 'array',
            description: 'Array of implementation steps in order. Each step should be small and focused (e.g., "Add game setup", "Add player sprite", "Add collision detection"). Aim for 3-8 steps.',
            items: {
              type: 'object',
              properties: {
                description: {
                  type: 'string',
                  description: 'Brief description of what this step does (shown to user)'
                },
                reasoning: {
                  type: 'string',
                  description: 'Internal note about why this step is needed and what it accomplishes'
                }
              },
              required: ['description', 'reasoning']
            }
          }
        },
        required: ['steps']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'apply_step',
      description: 'Apply a single implementation step to the code. This modifies the current code incrementally. The code will be tested immediately after applying.',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The complete updated JavaScript code after applying this step. Must be valid, executable code that imports from the CDN.'
          },
          step_summary: {
            type: 'string',
            description: 'Brief summary of what changed in this step (e.g., "Added ball sprite with physics")'
          }
        },
        required: ['code', 'step_summary']
      }
    }
  }
];

/**
 * Fetch markdown documentation from file
 */
async function fetchMarkdown(filePath) {
  try {
    const response = await fetch(`/docs/markdown/${filePath}.md`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return null;
  }
}

/**
 * Parse frontmatter from markdown
 */
function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const frontmatterText = match[1];
  const content = match[2];

  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content };
}

/**
 * Extract code examples from markdown
 */
function extractCodeExamples(content) {
  const codeBlockRegex = /```(?:javascript|codemirror)\n([\s\S]*?)```/g;
  const examples = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    examples.push(match[1].trim());
  }

  return examples;
}

/**
 * Create a condensed summary of documentation for AI
 */
function createDocSummary(markdown) {
  const { frontmatter, content } = parseFrontmatter(markdown);
  const examples = extractCodeExamples(content);

  // Remove code blocks and excessive whitespace for summary
  const summary = content
    .replace(/```[\s\S]*?```/g, '[CODE EXAMPLE]')
    .replace(/\n{3,}/g, '\n\n')
    .substring(0, 3000); // Limit to first 3000 chars

  return {
    title: frontmatter.title || 'Unknown',
    description: frontmatter.description || '',
    summary: summary,
    examples: examples.slice(0, 3), // First 3 code examples
    fullContent: content
  };
}

/**
 * Discover available documentation topics
 */
async function discoverDocs(query = '') {
  const topics = [
    // Getting Started
    { topic: 'installation', category: 'Getting Started', description: 'Install Zap via npm or CDN' },
    { topic: 'quickstart', category: 'Getting Started', description: 'Quick start guide to build your first Zap game' },

    // Core
    { topic: 'architecture', category: 'Core', description: 'Understanding Zap\'s architecture and structure' },
    { topic: 'game', category: 'Core', description: 'Game configuration and lifecycle management' },
    { topic: 'scenes', category: 'Core', description: 'Scene management and transitions' },
    { topic: 'entities', category: 'Core', description: 'Entity system and lifecycle' },
    { topic: 'camera', category: 'Core', description: 'Camera controls: follow, zoom, shake' },

    // Visual
    { topic: 'shapes', category: 'Visual', description: 'Drawing shapes with Sprite' },
    { topic: 'sprites', category: 'Visual', description: 'Image sprites and rendering' },
    { topic: 'sprite-animation', category: 'Visual', description: 'Frame-by-frame sprite animation' },
    { topic: 'text', category: 'Visual', description: 'Text rendering with custom fonts' },

    // Animation
    { topic: 'tweening', category: 'Animation', description: 'Tweening and animation system' },
    { topic: 'particles', category: 'Animation', description: 'Particle effects and emitters' },
    { topic: 'touch-trail', category: 'Animation', description: 'Touch trail effect' },

    // Gestures
    { topic: 'tap', category: 'Gestures', description: 'Tap/click gesture detection' },
    { topic: 'drag', category: 'Gestures', description: 'Drag gesture for moving entities' },
    { topic: 'swipe', category: 'Gestures', description: 'Swipe gesture for directional input' },

    // UI
    { topic: 'button', category: 'UI', description: 'Interactive button component' },
    { topic: 'ninepatch', category: 'UI', description: 'Scalable UI panels with NinePatch' },

    // Audio
    { topic: 'sound-effects', category: 'Audio', description: 'Playing sound effects' },
    { topic: 'music', category: 'Audio', description: 'Background music playback' },
    { topic: 'volume', category: 'Audio', description: 'Volume control and muting' },

    // Utilities
    { topic: 'easing', category: 'Utilities', description: '31 easing functions for animations' },
    { topic: 'asset-loader', category: 'Utilities', description: 'Loading and caching images' },
    { topic: 'fonts', category: 'Utilities', description: 'Loading Google Fonts and custom fonts' },
    { topic: 'layout', category: 'Utilities', description: 'Grid, circle, row, column layouts' },
    { topic: 'math', category: 'Utilities', description: 'Math utilities: clamp, lerp, random' },
    { topic: 'storage', category: 'Utilities', description: 'LocalStorage wrapper' },
    { topic: 'timers', category: 'Utilities', description: 'Delay and interval utilities' },

    // Physics
    { topic: 'physics', category: 'Physics', description: 'Built-in velocity, gravity, friction, and bounce' },
    { topic: 'collision-detection', category: 'Physics', description: 'Shape-aware collision detection with events' }
  ];

  // Filter by query if provided
  const filtered = query
    ? topics.filter(t =>
        t.topic.includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : topics;

  // Group by category
  const grouped = filtered.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return {
    total: filtered.length,
    topics: grouped
  };
}

/**
 * Get documentation for a specific topic
 */
async function getTopicDocs(topic) {
  const normalizedTopic = topic.toLowerCase().trim();
  const filePath = TOPIC_TO_FILE[normalizedTopic];

  if (!filePath) {
    // Find similar topics to suggest
    const availableTopics = Object.keys(TOPIC_TO_FILE);
    const suggestions = availableTopics.filter(t =>
      t.includes(normalizedTopic) || normalizedTopic.includes(t)
    ).slice(0, 5);

    const suggestionText = suggestions.length > 0
      ? `Did you mean: ${suggestions.join(', ')}?`
      : 'Available topics include: entities, sprites, text, drag, collision-detection, tap, tweening, timers, scenes, game';

    return {
      error: `Unknown topic: "${topic}". ${suggestionText}`
    };
  }

  const markdown = await fetchMarkdown(filePath);

  if (!markdown) {
    return {
      error: `Failed to load documentation for ${topic}`
    };
  }

  return createDocSummary(markdown);
}

/**
 * Handle tool calls from AI
 */
export function handleToolCall(toolName, args) {
  if (toolName === 'discover_zap_docs') {
    return discoverDocs(args.query || '');
  } else if (toolName === 'get_zap_docs') {
    return getTopicDocs(args.topic);
  } else if (toolName === 'create_plan') {
    // Plan creation is handled in ai.js - just acknowledge receipt
    return { success: true, plan: args.steps };
  } else if (toolName === 'apply_step') {
    // Step application is handled in ai.js - just acknowledge receipt
    return { success: true, code: args.code, summary: args.step_summary };
  }

  return { error: 'Unknown tool' };
}
