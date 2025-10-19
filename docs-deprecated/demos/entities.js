export default {
  title: 'Entities',
  description: 'Visual objects in your game',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>What is an Entity?</h3>
      <p>Entities are the building blocks of your game. Every visual element (sprites, text, particles) extends the <code>Entity</code> base class.</p>

      <h3>Common Properties</h3>
      <p>All entities share these properties:</p>

      <div class="code-section">
        <pre><span class="keyword">const</span> sprite = <span class="keyword">new</span> <span class="function">Sprite</span>({
  <span class="comment">// Position</span>
  x: <span class="number">100</span>,
  y: <span class="number">100</span>,

  <span class="comment">// Size</span>
  width: <span class="number">50</span>,
  height: <span class="number">50</span>,

  <span class="comment">// Transform</span>
  rotation: <span class="number">0</span>,
  scaleX: <span class="number">1</span>,
  scaleY: <span class="number">1</span>,

  <span class="comment">// Appearance</span>
  alpha: <span class="number">1</span>,
  visible: <span class="keyword">true</span>,

  <span class="comment">// Interaction</span>
  interactive: <span class="keyword">true</span>,

  <span class="comment">// Organization</span>
  tag: <span class="string">'player'</span>
});</pre>
      </div>

      <h3>Parent-Child Hierarchy</h3>
      <p>Entities can have children, creating a transform hierarchy:</p>

      <div class="code-section">
        <pre><span class="keyword">const</span> parent = <span class="keyword">new</span> <span class="function">Sprite</span>({ x: <span class="number">200</span>, y: <span class="number">150</span> });
<span class="keyword">const</span> child = <span class="keyword">new</span> <span class="function">Sprite</span>({ x: <span class="number">20</span>, y: <span class="number">0</span> });

parent.<span class="function">addChild</span>(child);

<span class="comment">// Child's world position is (220, 150)</span>
<span class="comment">// Rotating parent also rotates child</span>
parent.rotation = Math.PI / <span class="number">4</span>;</pre>
      </div>

      <h3>Entity Methods</h3>
      <ul>
        <li><code>entity.tween(props, options)</code> - Animate properties</li>
        <li><code>entity.on(event, handler)</code> - Listen to events</li>
        <li><code>entity.addChild(child)</code> - Add a child entity</li>
        <li><code>entity.removeChild(child)</code> - Remove a child entity</li>
        <li><code>entity.destroy()</code> - Clean up and remove</li>
      </ul>

      <h3>Common Entity Types</h3>
      <ul>
        <li><strong>Sprite:</strong> Rectangles, circles, rounded shapes, images</li>
        <li><strong>Text:</strong> Rendered text with custom fonts and alignment</li>
        <li><strong>ParticleEmitter:</strong> Visual effects and particles</li>
      </ul>

      <div class="info-box">
        <p><strong>🎨 Design Tip:</strong> Use parent-child relationships to create complex objects. For example, a button can be a sprite with a text child.</p>
      </div>
    </div>
  `
};
