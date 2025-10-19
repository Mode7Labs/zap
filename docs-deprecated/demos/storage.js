export default {
  title: 'Storage',
  description: 'Persist game data with localStorage wrapper',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Persistent Data Storage</h3>
      <p>The Storage utility provides a simple wrapper around localStorage for persisting game data across sessions:</p>

      <div class="code-section">
        <h3>Code Example</h3>
        <pre><span class="keyword">import</span> { Storage } <span class="keyword">from</span> <span class="string">'@mode-7/zap'</span>;

<span class="comment">// Save data</span>
Storage.<span class="function">set</span>(<span class="string">'highScore'</span>, <span class="number">1000</span>);
Storage.<span class="function">set</span>(<span class="string">'playerData'</span>, { name: <span class="string">'Player1'</span>, level: <span class="number">5</span> });

<span class="comment">// Load data</span>
<span class="keyword">const</span> highScore = Storage.<span class="function">get</span>(<span class="string">'highScore'</span>);
<span class="keyword">const</span> playerData = Storage.<span class="function">get</span>(<span class="string">'playerData'</span>);

<span class="comment">// Check if exists</span>
<span class="keyword">if</span> (Storage.<span class="function">has</span>(<span class="string">'highScore'</span>)) {
  <span class="function">console.log</span>(<span class="string">'High score exists!'</span>);
}

<span class="comment">// Remove data</span>
Storage.<span class="function">remove</span>(<span class="string">'playerData'</span>);

<span class="comment">// Clear all</span>
Storage.<span class="function">clear</span>();</pre>
      </div>

      <h3>API Methods</h3>
      <ul>
        <li><code>set(key, value)</code> - Save data (automatically serializes objects)</li>
        <li><code>get(key, defaultValue?)</code> - Load data (automatically deserializes)</li>
        <li><code>has(key)</code> - Check if key exists</li>
        <li><code>remove(key)</code> - Delete specific key</li>
        <li><code>clear()</code> - Remove all stored data</li>
      </ul>

      <div class="info-box">
        <p><strong>💡 Note:</strong> Storage automatically handles JSON serialization, so you can save and load objects, arrays, and primitives seamlessly.</p>
      </div>
    </div>
  `
};
