export default {
  title: 'Installation',
  description: 'Get started with @mode-7/zap',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Install via npm</h3>
      <p>Install Zap using npm or your preferred package manager:</p>
      <div class="code-section">
        <pre><span class="comment"># Using npm</span>
npm install @mode-7/zap

<span class="comment"># Using yarn</span>
yarn add @mode-7/zap

<span class="comment"># Using pnpm</span>
pnpm add @mode-7/zap</pre>
      </div>

      <h3>CDN Usage</h3>
      <p>You can also use Zap directly from a CDN without installation:</p>
      <div class="code-section">
        <pre><span class="keyword">&lt;script</span> <span class="string">type</span>=<span class="string">"module"</span><span class="keyword">&gt;</span>
  <span class="keyword">import</span> { Game, Scene, Sprite } <span class="keyword">from</span> <span class="string">'https://esm.sh/@mode-7/zap'</span>;

  <span class="comment">// Your code here...</span>
<span class="keyword">&lt;/script&gt;</span></pre>
      </div>

      <h3>Requirements</h3>
      <ul>
        <li>Modern browser with ES6+ support</li>
        <li>HTML5 Canvas support</li>
        <li>No external dependencies required</li>
      </ul>

      <div class="info-box">
        <p><strong>💡 Note:</strong> Zap is designed to be lightweight and framework-agnostic. It works great with vanilla JavaScript, React, Vue, or any other framework.</p>
      </div>
    </div>
  `
};
