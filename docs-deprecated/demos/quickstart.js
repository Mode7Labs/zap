export default {
  title: 'Quick Start',
  description: 'Create your first game in minutes',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Your First Game</h3>
      <p>Let's create a simple interactive game with just a few lines of code:</p>

      <div class="code-section">
        <pre><span class="keyword">import</span> { Game, Scene, Sprite } <span class="keyword">from</span> <span class="string">'@mode-7/zap'</span>;

<span class="comment">// 1. Create a game instance</span>
<span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>({
  width: <span class="number">400</span>,
  height: <span class="number">300</span>,
  backgroundColor: <span class="string">'#0f3460'</span>
});

<span class="comment">// 2. Create a scene</span>
<span class="keyword">const</span> scene = <span class="keyword">new</span> <span class="function">Scene</span>();

<span class="comment">// 3. Add a sprite</span>
<span class="keyword">const</span> player = <span class="keyword">new</span> <span class="function">Sprite</span>({
  x: <span class="number">200</span>,
  y: <span class="number">150</span>,
  width: <span class="number">50</span>,
  height: <span class="number">50</span>,
  color: <span class="string">'#e94560'</span>,
  interactive: <span class="keyword">true</span>
});

<span class="comment">// 4. Add interaction</span>
player.<span class="function">on</span>(<span class="string">'tap'</span>, () => {
  player.<span class="function">tween</span>(
    { rotation: player.rotation + Math.PI },
    { duration: <span class="number">300</span> }
  );
});

<span class="comment">// 5. Start the game</span>
scene.<span class="function">add</span>(player);
game.<span class="function">setScene</span>(scene);
game.<span class="function">start</span>();</pre>
      </div>

      <h3>What's Happening?</h3>
      <ol>
        <li><strong>Game Instance:</strong> Creates a 400x300 canvas with a dark blue background</li>
        <li><strong>Scene:</strong> A container for all your game objects</li>
        <li><strong>Sprite:</strong> A visual game object with position, size, and color</li>
        <li><strong>Interaction:</strong> Makes the sprite respond to tap/click events</li>
        <li><strong>Start:</strong> Begins the game loop and renders everything</li>
      </ol>

      <div class="info-box">
        <p><strong>🎯 Pro Tip:</strong> All Zap entities support gestures (tap, swipe, drag), animations, and parent-child hierarchies out of the box!</p>
      </div>

      <h3>Next Steps</h3>
      <p>Now that you've created your first game, explore:</p>
      <ul>
        <li><strong>Game Configuration</strong> - Learn about all available options including FPS control, debug mode, and rendering quality</li>
        <li><strong>Scenes</strong> - Manage multiple game states like menus, levels, and game over screens</li>
        <li><strong>Gestures</strong> - Add tap, swipe, drag, and pinch interactions</li>
        <li><strong>Animations</strong> - Tween properties with easing functions</li>
      </ul>
    </div>
  `
};
