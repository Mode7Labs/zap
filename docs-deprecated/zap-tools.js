/**
 * MCP-lite tooling system for Zap Playground AI
 * Provides structured access to Zap documentation
 */

export const ZAP_SYSTEM_PROMPT = `You are the Zap Game Engine AI Assistant. You ONLY help users build games using the @mode-7/zap game engine.

CRITICAL RULES:
1. You MUST ONLY use the Zap game engine - NEVER suggest Phaser, PixiJS, Three.js, or any other framework
2. You MUST use the provided tools to learn about Zap's API before writing code
3. You MUST call discover_zap_docs first if you're unsure about any Zap API
4. ALL code must use the Zap API from 'https://esm.sh/@mode-7/zap@0.1.2'
5. Use GAME_WIDTH and GAME_HEIGHT constants for responsive sizing
6. Only output JavaScript code - no markdown code blocks, no explanations

WORKFLOW:
1. If unsure about any Zap feature → Call discover_zap_docs to find the right topic
2. Once you know the topic → Call get_zap_docs with the specific topic
3. Use the documentation to write accurate Zap code
4. Return ONLY the complete, executable JavaScript code

Available Zap features you can discover:
- Core: Game, Scene, Camera, EventEmitter
- Entities: Entity, Sprite, Text, AnimatedSprite, NinePatch
- UI: Button
- Effects: Tween, Particle, TouchTrail
- Audio: AudioManager
- Gestures: Tap, Swipe, Drag, LongPress
- Utils: Easing, Layout, Math, Storage, AssetLoader, Fonts, Timers

Remember: Users come to this playground specifically for Zap. Help them learn and use Zap effectively.`;

// Tool definitions for OpenAI function calling
export const ZAP_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'discover_zap_docs',
      description: 'Discover available Zap documentation topics. Use this when you need to learn what Zap features are available or find the right documentation topic.',
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
      description: 'Get detailed documentation for a specific Zap topic. Use this after discovering the topic you need.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            enum: [
              'game',
              'scene',
              'entity',
              'sprite',
              'text',
              'animated-sprite',
              'button',
              'nine-patch',
              'tween',
              'particle',
              'camera',
              'audio',
              'gestures',
              'easing',
              'layout',
              'math',
              'storage',
              'asset-loader',
              'fonts',
              'timer',
              'collision'
            ],
            description: 'The Zap topic to get documentation for'
          }
        },
        required: ['topic']
      }
    }
  }
];

// Topic to markdown file mapping
const TOPIC_TO_FILE = {
  // Core
  'installation': 'installation',
  'quickstart': 'quickstart',
  'architecture': 'architecture',
  'game': 'game',
  'scene': 'scenes',
  'scenes': 'scenes',
  'entity': 'entities',
  'entities': 'entities',
  'camera': 'camera',
  'collision': 'collision',
  'storage': 'storage',
  'timer': 'timer',
  'timers': 'timer',
  'layout': 'layout',

  // Entities
  'sprite': 'sprite',
  'sprites': 'sprite',
  'text': 'text',
  'animated-sprite': 'animatedsprite',
  'animatedsprite': 'animatedsprite',
  'images': 'images',
  'image': 'images',

  // UI Components
  'button': 'button',
  'nine-patch': 'ninepatch',
  'ninepatch': 'ninepatch',
  'fonts': 'fonts',

  // Effects
  'animations': 'animations',
  'tween': 'animations',
  'tweens': 'animations',
  'easing': 'easing',
  'particles': 'particles',
  'particle': 'particles',
  'touchtrail': 'touchtrail',
  'touch-trail': 'touchtrail',

  // Gestures
  'tap': 'tap',
  'swipe': 'swipe',
  'drag': 'drag',
  'gestures': 'canvasgestures',
  'canvas-gestures': 'canvasgestures',
  'canvasgestures': 'canvasgestures',
  'canvas-events': 'canvasevents',
  'canvasevents': 'canvasevents',

  // Assets
  'audio': 'audio',
  'asset-loader': 'assetloader',
  'assetloader': 'assetloader',
  'loader': 'assetloader'
};

// OLD Documentation database - will be replaced by markdown files
// Keeping for fallback during migration
const ZAP_DOCS_FALLBACK = {
  game: {
    title: 'Game',
    summary: 'Main game instance that manages canvas, game loop, and scenes',
    imports: "import { Game } from '@mode-7/zap';",
    constructor: `new Game({
  width: number,           // Canvas width (default: 800)
  height: number,          // Canvas height (default: 600)
  backgroundColor: string, // Background color (default: '#000000')
  parent: string | Element,// Parent element (default: document.body)
  responsive: boolean,     // Auto-resize to fit parent (default: false)
  pixelRatio: number,      // Device pixel ratio (default: window.devicePixelRatio)
  showFPS: boolean,        // Show FPS counter (default: false)
  targetFPS: number,       // Lock to specific FPS (default: null - unlocked)
  enableTouchTrail: boolean// Show touch trail effect (default: false)
})`,
    methods: `game.start()                    // Start game loop
game.stop()                     // Stop game loop
game.setScene(scene)            // Set current scene
game.transitionTo(scene, opts)  // Transition to scene with animation
game.resize()                   // Manually trigger resize (responsive mode)
game.destroy()                  // Cleanup and destroy game`,
    properties: `game.canvas     // HTMLCanvasElement
game.ctx        // CanvasRenderingContext2D
game.width      // Canvas width
game.height     // Canvas height
game.camera     // Camera instance
game.gestures   // GestureManager instance`,
    example: `const game = new Game({
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: '#app',
  responsive: true
});

const scene = new Scene();
game.setScene(scene);
game.start();`
  },

  scene: {
    title: 'Scene',
    summary: 'Container for game entities with update/render lifecycle',
    imports: "import { Scene } from '@mode-7/zap';",
    constructor: 'new Scene()',
    methods: `scene.add(entity)           // Add entity to scene
scene.remove(entity)        // Remove entity from scene
scene.getEntities()         // Get all entities
scene.findByTag(tag)        // Find entities by tag
scene.clear()               // Remove all entities
scene.onEnter()             // Called when scene becomes active
scene.onExit()              // Called when scene becomes inactive`,
    example: `const scene = new Scene();

const sprite = new Sprite({
  x: 400, y: 300,
  width: 100, height: 100,
  color: '#667eea'
});

scene.add(sprite);
game.setScene(scene);`
  },

  sprite: {
    title: 'Sprite',
    summary: 'Visual entity for rendering colored shapes or images',
    imports: "import { Sprite } from '@mode-7/zap';",
    constructor: `new Sprite({
  x: number,              // X position
  y: number,              // Y position
  width: number,          // Width
  height: number,         // Height
  color: string,          // Fill color (hex)
  image: string | Image,  // Image URL or HTMLImageElement
  radius: number,         // Corner radius (makes circles if radius = width/2)
  interactive: boolean,   // Enable pointer events (default: false)
  visible: boolean,       // Visibility (default: true)
  rotation: number,       // Rotation in radians (default: 0)
  scaleX: number,         // Horizontal scale (default: 1)
  scaleY: number,         // Vertical scale (default: 1)
  alpha: number,          // Opacity 0-1 (default: 1)
  anchorX: number,        // Anchor point X 0-1 (default: 0.5 - center)
  anchorY: number         // Anchor point Y 0-1 (default: 0.5 - center)
})`,
    properties: 'All constructor properties are public and can be modified after creation',
    example: `// Rectangle
const rect = new Sprite({
  x: 100, y: 100,
  width: 80, height: 60,
  color: '#e94560',
  radius: 8
});

// Circle
const circle = new Sprite({
  x: 200, y: 100,
  width: 80, height: 80,
  radius: 40,  // radius = width/2 makes perfect circle
  color: '#51cf66'
});

// Image sprite
const imgSprite = new Sprite({
  x: 300, y: 100,
  width: 100, height: 100,
  image: 'path/to/image.png'
});

scene.add(rect);
scene.add(circle);
scene.add(imgSprite);`
  },

  text: {
    title: 'Text',
    summary: 'Text rendering entity with custom fonts and styling',
    imports: "import { Text } from '@mode-7/zap';",
    constructor: `new Text({
  text: string,           // Text content (required)
  x: number,              // X position
  y: number,              // Y position
  fontSize: number,       // Font size in pixels (default: 16)
  fontFamily: string,     // Font family (default: 'Arial, sans-serif')
  color: string,          // Text color (default: '#ffffff')
  align: string,          // 'left' | 'center' | 'right' (default: 'center')
  baseline: string        // 'top' | 'middle' | 'bottom' | 'alphabetic' (default: 'middle')
})`,
    example: `const title = new Text({
  text: 'Hello Zap!',
  x: 400, y: 100,
  fontSize: 48,
  fontFamily: 'Arial Black',
  color: '#667eea',
  align: 'center'
});

// Update text dynamically
let score = 0;
const scoreText = new Text({
  text: 'Score: 0',
  x: 50, y: 50,
  fontSize: 20,
  align: 'left'
});

// Later...
score++;
scoreText.text = 'Score: ' + score;

scene.add(title);
scene.add(scoreText);`
  },

  button: {
    title: 'Button',
    summary: 'Interactive button UI component with hover/press states',
    imports: "import { Button } from '@mode-7/zap';",
    constructor: `new Button({
  text: string,             // Button label (required)
  x: number,                // X position
  y: number,                // Y position
  width: number,            // Width (default: 120)
  height: number,           // Height (default: 50)
  backgroundColor: string,  // Default color (default: '#e94560')
  hoverColor: string,       // Hover state color (default: '#ff547c')
  pressColor: string,       // Pressed state color (default: '#d13650')
  textColor: string,        // Text color (default: '#ffffff')
  fontSize: number,         // Text size (default: 16)
  radius: number,           // Corner radius (default: 8)
  onClick: Function         // Click handler
})`,
    methods: `button.setText(text)  // Update button text
button.enable()      // Enable button
button.disable()     // Disable button (grayed out)`,
    example: `const startButton = new Button({
  text: 'Start Game',
  x: 400, y: 300,
  width: 200,
  height: 60,
  fontSize: 20,
  onClick: () => {
    console.log('Game started!');
    // Start your game logic here
  }
});

scene.add(startButton);`
  },

  tween: {
    title: 'Tweens & Animations',
    summary: 'Smooth property animations with easing functions',
    imports: "import { Easing } from '@mode-7/zap';",
    usage: `entity.tween(
  { /* target properties */ },
  {
    duration: number,      // Duration in milliseconds
    easing: string,        // Easing function name
    delay: number,         // Delay before starting (ms)
    onUpdate: (progress) => {},  // Called each frame
    onComplete: () => {}   // Called when done
  }
)`,
    easing: `Available easing functions:
'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
'easeInSine', 'easeOutSine', 'easeInOutSine',
'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
'easeInBack', 'easeOutBack', 'easeInOutBack',
'easeInElastic', 'easeOutElastic', 'easeInOutElastic',
'easeInBounce', 'easeOutBounce', 'easeInOutBounce'`,
    example: `// Move sprite
sprite.tween(
  { x: 500, y: 300 },
  { duration: 1000, easing: 'easeOutCubic' }
);

// Rotate and scale
sprite.tween(
  { rotation: Math.PI * 2, scaleX: 2, scaleY: 2 },
  { duration: 500, easing: 'easeInOutBack' }
);

// Chain tweens
sprite.tween(
  { y: 200 },
  { duration: 500, easing: 'easeOutBounce' }
).then(() => {
  sprite.tween(
    { x: 600 },
    { duration: 500 }
  );
});

// Loop animation
function bounce() {
  sprite.tween(
    { y: 150 },
    { duration: 600, easing: 'easeInOutQuad', onComplete: () => {
      sprite.tween(
        { y: 300 },
        { duration: 600, easing: 'easeInOutQuad', onComplete: bounce }
      );
    }}
  );
}
bounce();`
  },

  particle: {
    title: 'Particles',
    summary: 'Particle emitter for visual effects',
    imports: "import { ParticleEmitter } from '@mode-7/zap';",
    constructor: `new ParticleEmitter({
  x: number,                // Emitter X position
  y: number,                // Emitter Y position
  rate: number,             // Particles per second (default: 10)
  colors: string[],         // Array of particle colors
  velocityRange: {          // Velocity range
    min: { x, y },
    max: { x, y }
  },
  sizeRange: {              // Particle size range
    min: number, max: number
  },
  lifetimeRange: {          // Particle lifetime in seconds
    min: number, max: number
  }
})`,
    methods: `emitter.burst(count)  // Emit multiple particles at once`,
    example: `const emitter = new ParticleEmitter({
  x: 400, y: 300,
  rate: 50,
  colors: ['#ff6b6b', '#51cf66', '#667eea', '#ffd43b'],
  velocityRange: {
    min: { x: -100, y: -100 },
    max: { x: 100, y: 100 }
  },
  sizeRange: { min: 3, max: 8 },
  lifetimeRange: { min: 1, max: 2 }
});

scene.add(emitter);

// Burst on click
game.on('tap', (e) => {
  emitter.x = e.position.x;
  emitter.y = e.position.y;
  emitter.burst(30);
});`
  },

  gestures: {
    title: 'Gestures & Input',
    summary: 'Touch and mouse gesture recognition',
    imports: 'Gestures are built-in to Game and Entity',
    entityEvents: `// On entities (set interactive: true)
entity.on('tap', (event) => {})       // Quick tap/click
entity.on('longpress', (event) => {}) // Long press/click
entity.on('swipe', (event) => {})     // Swipe gesture
entity.on('drag', (event) => {})      // Dragging
entity.on('dragstart', (event) => {}) // Drag started
entity.on('dragend', (event) => {})   // Drag ended`,
    canvasEvents: `// On game canvas
game.on('tap', (event) => {})
game.on('swipe', (event) => {})
game.on('drag', (event) => {})
game.on('pointerdown', (event) => {})
game.on('pointermove', (event) => {})
game.on('pointerup', (event) => {})`,
    eventData: `event.position  // { x, y } in game coordinates
event.delta     // { x, y } change since last frame (drag/swipe)
event.velocity  // { x, y } speed (swipe)
event.direction // 'up' | 'down' | 'left' | 'right' (swipe)
event.target    // Entity that was interacted with`,
    example: `// Draggable sprite
const sprite = new Sprite({
  x: 400, y: 300,
  width: 100, height: 100,
  color: '#667eea',
  interactive: true
});

sprite.on('drag', (e) => {
  sprite.x = e.position.x;
  sprite.y = e.position.y;
});

sprite.on('tap', () => {
  console.log('Sprite tapped!');
});

// Canvas-level input
game.on('swipe', (e) => {
  if (e.direction === 'right') {
    console.log('Swiped right!');
  }
});`
  },

  collision: {
    title: 'Collision Detection',
    summary: 'Built-in AABB collision system',
    setup: `new Entity({
  checkCollisions: true,    // Enable collision checking
  collisionTags: ['enemy']  // Only collide with these tags (optional)
})`,
    events: `entity.on('collide', (event) => {
  const other = event.other;  // Entity we collided with
});

entity.on('collisionenter', (event) => {
  // Fired once when collision starts
});

entity.on('collisionexit', (event) => {
  // Fired once when collision ends
});`,
    methods: `entity.addTag('enemy')        // Add collision tag
entity.hasTag('enemy')         // Check if has tag
entity.getCollisions()         // Get all current collisions
entity.intersects(other)       // Check intersection with another entity`,
    example: `const player = new Sprite({
  x: 400, y: 500,
  width: 60, height: 60,
  color: '#667eea',
  checkCollisions: true,
  collisionTags: ['collectible']
});

const coin = new Sprite({
  x: 200, y: 200,
  width: 30, height: 30,
  color: '#ffd43b'
});
coin.addTag('collectible');

player.on('collide', (e) => {
  const item = e.other;
  console.log('Collected!');
  scene.remove(item);
});

scene.add(player);
scene.add(coin);`
  },

  layout: {
    title: 'Layout Helpers',
    summary: 'Utilities for positioning multiple entities',
    imports: "import { Layout } from '@mode-7/zap';",
    methods: `Layout.layoutGrid(entities, {
  columns: number,
  rows: number,
  cellWidth: number,
  cellHeight: number,
  spacing: number,
  startX: number,
  startY: number
})

Layout.layoutCircle(entities, {
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number
})

Layout.layoutRow(entities, startX, y, spacing)
Layout.layoutColumn(entities, x, startY, spacing)
Layout.center(entity, width, height)`,
    example: `const sprites = [];
for (let i = 0; i < 9; i++) {
  sprites.push(new Sprite({
    width: 50, height: 50,
    color: '#667eea'
  }));
}

// Arrange in 3x3 grid
Layout.layoutGrid(sprites, {
  columns: 3,
  rows: 3,
  cellWidth: 50,
  cellHeight: 50,
  spacing: 10,
  startX: 100,
  startY: 100
});

sprites.forEach(s => scene.add(s));`
  },

  math: {
    title: 'Math Utilities',
    summary: 'Helpful math functions',
    imports: "import { Math } from '@mode-7/zap';",
    functions: `Math.clamp(value, min, max)  // Constrain value
Math.lerp(start, end, t)      // Linear interpolation
Math.map(value, inMin, inMax, outMin, outMax)  // Map value between ranges
Math.randomInt(min, max)      // Random integer (inclusive)
Math.randomFloat(min, max)    // Random float
Math.randomItem(array)        // Random array item`,
    example: `// Keep sprite in bounds
sprite.x = Math.clamp(sprite.x, 0, 800);

// Smooth follow
player.x = Math.lerp(player.x, target.x, 0.1);

// Map joystick (-1 to 1) to screen space
const screenX = Math.map(joystick.x, -1, 1, 0, 800);

// Random position
sprite.x = Math.randomInt(0, 800);
sprite.color = Math.randomItem(['#ff6b6b', '#51cf66', '#667eea']);`
  },

  storage: {
    title: 'Storage',
    summary: 'LocalStorage wrapper for persisting data',
    imports: "import { Storage } from '@mode-7/zap';",
    methods: `Storage.set(key, value)           // Save data
Storage.get(key, defaultValue)   // Load data
Storage.has(key)                 // Check if exists
Storage.remove(key)              // Delete key
Storage.clear()                  // Clear all data
Storage.keys()                   // Get all keys`,
    example: `// Save high score
Storage.set('highScore', 1000);

// Load high score
const highScore = Storage.get('highScore', 0);

// Save complex data
Storage.set('playerData', {
  name: 'Player1',
  level: 5,
  coins: 150
});

const data = Storage.get('playerData');`
  },

  camera: {
    title: 'Camera',
    summary: 'Camera control with follow and effects',
    access: 'game.camera',
    methods: `camera.setPosition(x, y)
camera.setZoom(zoom)
camera.follow(entity, offset, speed)  // Follow an entity
camera.stopFollow()
camera.shake(intensity, duration)     // Screen shake effect
camera.screenToWorld(x, y)            // Convert coordinates
camera.worldToScreen(x, y)`,
    properties: `camera.x, camera.y  // Camera position
camera.zoom         // Camera zoom level
camera.rotation     // Camera rotation`,
    example: `// Follow player
game.camera.follow(player, { x: 0, y: 0 }, 0.1);

// Zoom in
game.camera.setZoom(2);

// Screen shake on impact
player.on('collide', () => {
  game.camera.shake(15, 300);
});`
  },

  audio: {
    title: 'Audio',
    summary: 'Sound effects and music playback',
    imports: "import { audioManager } from '@mode-7/zap';",
    methods: `audioManager.loadSound(key, url)
audioManager.loadSounds({ key: url, ... })
audioManager.playSound(key, { volume, loop, rate })
audioManager.playRandomSound([keys...], options)

audioManager.playMusic(url, { volume, loop, rate })
audioManager.stopMusic()
audioManager.pauseMusic()
audioManager.resumeMusic()

audioManager.setMasterVolume(0-1)
audioManager.setMusicVolume(0-1)
audioManager.setSFXVolume(0-1)
audioManager.mute()
audioManager.unmute()`,
    example: `// Load sounds
audioManager.loadSounds({
  'jump': 'sounds/jump.mp3',
  'coin': 'sounds/coin.mp3',
  'hit': 'sounds/hit.mp3'
});

// Play on event
player.on('tap', () => {
  audioManager.playSound('jump', { volume: 0.5 });
});

// Background music
audioManager.playMusic('music/theme.mp3', {
  volume: 0.3,
  loop: true
});`
  }
};

// Tool handler functions
export async function handleToolCall(toolName, args) {
  switch (toolName) {
    case 'discover_zap_docs':
      return discoverDocs(args.query);
    case 'get_zap_docs':
      return await getDocs(args.topic);
    default:
      return { error: 'Unknown tool' };
  }
}

function discoverDocs(query = '') {
  const topics = Object.keys(ZAP_DOCS).map(key => {
    const doc = ZAP_DOCS[key];
    return {
      topic: key,
      title: doc.title,
      summary: doc.summary
    };
  });

  if (query) {
    const lowerQuery = query.toLowerCase();
    return {
      result: `Available Zap topics matching "${query}":`,
      topics: topics.filter(t =>
        t.topic.includes(lowerQuery) ||
        t.title.toLowerCase().includes(lowerQuery) ||
        t.summary.toLowerCase().includes(lowerQuery)
      )
    };
  }

  return {
    result: 'Available Zap documentation topics:',
    topics: topics
  };
}

async function getDocs(topic) {
  // Try to load from markdown file first
  const filename = TOPIC_TO_FILE[topic];
  if (filename) {
    try {
      const response = await fetch(`/content/${filename}.md`);
      if (response.ok) {
        let markdown = await response.text();

        // Strip frontmatter for AI consumption
        const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
        markdown = markdown.replace(frontmatterRegex, '').trim();

        // Remove zap-demo markers (AI sees regular code blocks)
        markdown = markdown.replace(/```zap-demo/g, '```javascript');

        return {
          topic: topic,
          documentation: markdown
        };
      }
    } catch (error) {
      console.warn(`Failed to load markdown for ${topic}, using fallback:`, error);
    }
  }

  // Fallback to old system
  const doc = ZAP_DOCS_FALLBACK[topic];
  if (!doc) {
    return {
      error: `Topic "${topic}" not found. Use discover_zap_docs to see available topics.`
    };
  }

  // Format documentation for the AI
  let formatted = `# ${doc.title}\n\n${doc.summary}\n\n`;

  if (doc.imports) formatted += `## Import\n\`\`\`javascript\n${doc.imports}\n\`\`\`\n\n`;
  if (doc.constructor) formatted += `## Constructor\n\`\`\`javascript\n${doc.constructor}\n\`\`\`\n\n`;
  if (doc.usage) formatted += `## Usage\n\`\`\`javascript\n${doc.usage}\n\`\`\`\n\n`;
  if (doc.methods) formatted += `## Methods\n\`\`\`\n${doc.methods}\n\`\`\`\n\n`;
  if (doc.properties) formatted += `## Properties\n\`\`\`\n${doc.properties}\n\`\`\`\n\n`;
  if (doc.entityEvents) formatted += `## Entity Events\n\`\`\`javascript\n${doc.entityEvents}\n\`\`\`\n\n`;
  if (doc.canvasEvents) formatted += `## Canvas Events\n\`\`\`javascript\n${doc.canvasEvents}\n\`\`\`\n\n`;
  if (doc.eventData) formatted += `## Event Data\n\`\`\`\n${doc.eventData}\n\`\`\`\n\n`;
  if (doc.setup) formatted += `## Setup\n\`\`\`javascript\n${doc.setup}\n\`\`\`\n\n`;
  if (doc.events) formatted += `## Events\n\`\`\`javascript\n${doc.events}\n\`\`\`\n\n`;
  if (doc.functions) formatted += `## Functions\n\`\`\`\n${doc.functions}\n\`\`\`\n\n`;
  if (doc.easing) formatted += `## Easing Functions\n\`\`\`\n${doc.easing}\n\`\`\`\n\n`;
  if (doc.access) formatted += `## Access\n\`\`\`\n${doc.access}\n\`\`\`\n\n`;
  if (doc.example) formatted += `## Example\n\`\`\`javascript\n${doc.example}\n\`\`\`\n\n`;

  return {
    topic: topic,
    documentation: formatted
  };
}
