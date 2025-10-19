export default {
  title: 'Asset Loader',
  description: 'Preload images before starting the game',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Preloading Assets</h3>
      <p>The AssetLoader helps you preload images before your game starts, ensuring smooth gameplay without loading delays:</p>

      <div class="code-section">
        <h3>Code Example</h3>
        <pre><span class="keyword">import</span> { AssetLoader } <span class="keyword">from</span> <span class="string">'@mode-7/zap'</span>;

<span class="keyword">const</span> loader = <span class="keyword">new</span> <span class="function">AssetLoader</span>();

<span class="comment">// Add images to load</span>
loader.<span class="function">add</span>(<span class="string">'player'</span>, <span class="string">'assets/player.png'</span>);
loader.<span class="function">add</span>(<span class="string">'enemy'</span>, <span class="string">'assets/enemy.png'</span>);
loader.<span class="function">add</span>(<span class="string">'bg'</span>, <span class="string">'assets/background.png'</span>);

<span class="comment">// Track progress</span>
loader.<span class="function">on</span>(<span class="string">'progress'</span>, (loaded, total) => {
  <span class="function">console.log</span>(\`\${loaded}/\${total} loaded\`);
});

<span class="comment">// Start loading</span>
<span class="keyword">await</span> loader.<span class="function">load</span>();

<span class="comment">// Use loaded images</span>
<span class="keyword">const</span> sprite = <span class="keyword">new</span> <span class="function">Sprite</span>({
  image: loader.<span class="function">get</span>(<span class="string">'player'</span>)
});</pre>
      </div>

      <h3>API Methods</h3>
      <ul>
        <li><code>add(key, url)</code> - Add an image to the load queue</li>
        <li><code>load()</code> - Start loading all assets (returns Promise)</li>
        <li><code>get(key)</code> - Get a loaded image by key</li>
        <li><code>on('progress', callback)</code> - Track loading progress</li>
      </ul>
    </div>
  `
};
