export default {
  title: 'Architecture',
  description: 'Understanding how Zap is structured',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Core Components</h3>
      <p>Zap is built around a simple, intuitive architecture:</p>

      <div class="code-section">
        <pre>Game
 ├── Scene(s)
 │    ├── Entity (Sprite, Text, etc.)
 │    │    └── Child Entities
 │    └── ParticleEmitter
 ├── Camera
 └── Managers
      ├── GestureManager
      ├── TweenManager
      └── AudioManager</pre>
      </div>

      <h3>Game</h3>
      <p>The <code>Game</code> class is your main entry point. It manages:</p>
      <ul>
        <li>Canvas rendering context</li>
        <li>Game loop (update/render cycle)</li>
        <li>Scene management</li>
        <li>Global managers (gestures, tweens, audio)</li>
      </ul>
      <p>See <strong>Game Configuration</strong> for all available options including FPS control, rendering quality, and debug tools.</p>

      <h3>Entities</h3>
      <p>Everything visual in your game is an <strong>Entity</strong>:</p>
      <ul>
        <li><code>Sprite</code> - Basic shapes, colors, and images</li>
        <li><code>Text</code> - Text rendering with custom fonts</li>
        <li><code>ParticleEmitter</code> - Particle effects</li>
      </ul>

      <h3>Managers</h3>
      <p>Managers are internal singleton systems that work behind the scenes. You don't interact with them directly - instead, you use convenient methods on entities:</p>
      <ul>
        <li><strong>GestureManager:</strong> Detects touch/mouse input when you use <code>entity.on('tap', ...)</code></li>
        <li><strong>TweenManager:</strong> Updates animations when you call <code>entity.tween(...)</code></li>
        <li><strong>AudioManager:</strong> Plays sounds when you call <code>AudioManager.play(...)</code></li>
      </ul>

      <p>The managers handle the complex logic, while entities provide a simple API.</p>

      <div class="info-box">
        <p><strong>⚡ Performance:</strong> Zap uses a single requestAnimationFrame loop and batches all rendering operations for optimal performance, even with hundreds of entities.</p>
      </div>
    </div>
  `
};
