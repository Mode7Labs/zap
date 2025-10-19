export default {
  title: 'Scenes',
  description: 'Managing game states with scenes',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>What is a Scene?</h3>
      <p>A <code>Scene</code> is a container for entities. Think of it like a level, menu screen, or game state:</p>

      <div class="code-section">
        <pre><span class="keyword">const</span> menuScene = <span class="keyword">new</span> <span class="function">Scene</span>();
<span class="keyword">const</span> gameScene = <span class="keyword">new</span> <span class="function">Scene</span>();
<span class="keyword">const</span> gameOverScene = <span class="keyword">new</span> <span class="function">Scene</span>();

<span class="comment">// Switch between scenes</span>
game.<span class="function">setScene</span>(menuScene);</pre>
      </div>

      <h3>Adding Entities</h3>
      <p>Add entities to your scene using the <code>add()</code> method:</p>

      <div class="code-section">
        <pre><span class="keyword">const</span> scene = <span class="keyword">new</span> <span class="function">Scene</span>();

<span class="keyword">const</span> background = <span class="keyword">new</span> <span class="function">Sprite</span>({ <span class="comment">/* ... */</span> });
<span class="keyword">const</span> player = <span class="keyword">new</span> <span class="function">Sprite</span>({ <span class="comment">/* ... */</span> });
<span class="keyword">const</span> score = <span class="keyword">new</span> <span class="function">Text</span>({ <span class="comment">/* ... */</span> });

scene.<span class="function">add</span>(background);
scene.<span class="function">add</span>(player);
scene.<span class="function">add</span>(score);</pre>
      </div>

      <h3>Scene Methods</h3>
      <ul>
        <li><code>scene.add(entity)</code> - Add an entity to the scene</li>
        <li><code>scene.remove(entity)</code> - Remove an entity from the scene</li>
        <li><code>scene.clear()</code> - Remove all entities</li>
        <li><code>scene.findByTag(tag)</code> - Find entities by tag</li>
      </ul>

      <h3>Scene Switching</h3>
      <p>Switch between scenes smoothly:</p>

      <div class="code-section">
        <pre><span class="comment">// Create multiple scenes</span>
<span class="keyword">const</span> menu = <span class="keyword">new</span> <span class="function">Scene</span>();
<span class="keyword">const</span> level1 = <span class="keyword">new</span> <span class="function">Scene</span>();

<span class="comment">// Switch to level 1 when start button is tapped</span>
startButton.<span class="function">on</span>(<span class="string">'tap'</span>, () => {
  game.<span class="function">setScene</span>(level1);
});</pre>
      </div>

      <div class="info-box">
        <p><strong>💡 Tip:</strong> When you switch scenes, the previous scene is automatically cleaned up, stopping all tweens and removing event listeners.</p>
      </div>
    </div>
  `
};
