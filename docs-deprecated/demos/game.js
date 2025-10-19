export default {
  title: 'Game Configuration',
  description: 'Configure your game with flexible options including responsive canvas',
  isDoc: true,
  content: `
    <div class="doc-content">
      <h3>Creating a Game</h3>
      <p>The <code>Game</code> class is highly configurable. All options are optional with sensible defaults:</p>

      <div class="code-section">
        <pre><span class="keyword">import</span> { Game } <span class="keyword">from</span> <span class="string">'@mode-7/zap'</span>;

<span class="comment">// Minimal setup with defaults</span>
<span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>();

<span class="comment">// Custom configuration</span>
<span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>({
  <span class="comment">// Display</span>
  width: <span class="number">800</span>,                <span class="comment">// Default: 800</span>
  height: <span class="number">600</span>,               <span class="comment">// Default: 600</span>
  backgroundColor: <span class="string">'#0f3460'</span>,  <span class="comment">// Default: '#000000'</span>
  responsive: <span class="keyword">true</span>,          <span class="comment">// Default: false (NEW!)</span>

  <span class="comment">// Rendering Quality</span>
  pixelRatio: <span class="number">2</span>,             <span class="comment">// Default: window.devicePixelRatio</span>
  antialias: <span class="keyword">true</span>,            <span class="comment">// Default: true</span>
  imageSmoothingQuality: <span class="string">'high'</span>, <span class="comment">// 'low' | 'medium' | 'high'</span>

  <span class="comment">// Performance</span>
  targetFPS: <span class="number">60</span>,             <span class="comment">// Default: null (unlimited)</span>
  maxDeltaTime: <span class="number">0.1</span>,         <span class="comment">// Default: 0.1 (prevent spiral of death)</span>

  <span class="comment">// Features</span>
  enableTouchTrail: <span class="keyword">false</span>,   <span class="comment">// Default: false</span>

  <span class="comment">// Debug</span>
  showFPS: <span class="keyword">true</span>,             <span class="comment">// Default: false</span>
  debug: <span class="keyword">false</span>                <span class="comment">// Default: false</span>
});</pre>
      </div>

      <h3>Display Options</h3>
      <ul>
        <li><code>width</code> - Canvas width in pixels (default: 800)</li>
        <li><code>height</code> - Canvas height in pixels (default: 600)</li>
        <li><code>canvas</code> - Existing canvas element to use (default: creates new)</li>
        <li><code>parent</code> - Parent element or selector (default: document.body)</li>
        <li><code>backgroundColor</code> - Background color (default: '#000000')</li>
        <li><code>responsive</code> - Auto-scale to parent container while maintaining aspect ratio (default: false)</li>
      </ul>

      <h3>Responsive Canvas</h3>
      <p>The responsive canvas feature allows your game to adapt to its container size while maintaining the design aspect ratio. Perfect for playable ads that need to work across different screen sizes and orientations.</p>

      <div class="code-section">
        <pre><span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>({
  width: <span class="number">720</span>,        <span class="comment">// Design width</span>
  height: <span class="number">1280</span>,      <span class="comment">// Design height</span>
  responsive: <span class="keyword">true</span>  <span class="comment">// Enable responsive canvas</span>
});

<span class="comment">// Listen to resize events</span>
game.<span class="function">on</span>(<span class="string">'resize'</span>, ({ displayWidth, displayHeight, designWidth, designHeight }) => {
  <span class="function">console.log</span>(<span class="string">\`Display: \${displayWidth}x\${displayHeight}\`</span>);
  <span class="function">console.log</span>(<span class="string">\`Design: \${designWidth}x\${designHeight}\`</span>);
});

<span class="comment">// Manually trigger resize</span>
game.<span class="function">resize</span>();</pre>
      </div>

      <p><strong>How it works:</strong></p>
      <ul>
        <li><strong>Design Resolution:</strong> Your game logic uses fixed coordinates (e.g., 720×1280)</li>
        <li><strong>Display Size:</strong> Canvas automatically scales to fit container</li>
        <li><strong>Aspect Ratio:</strong> Maintains design aspect ratio with letterboxing</li>
        <li><strong>Auto-Update:</strong> Uses ResizeObserver to detect container size changes</li>
      </ul>

      <div class="info-box">
        <p><strong>💡 Pro Tip:</strong> The canvas maintains your design resolution internally, so all game coordinates remain consistent regardless of display size. Perfect for playable ads!</p>
      </div>

      <h3>Rendering Quality</h3>
      <ul>
        <li><code>pixelRatio</code> - Device pixel ratio for sharp rendering (default: window.devicePixelRatio)</li>
        <li><code>antialias</code> - Enable image smoothing (default: true)</li>
        <li><code>imageSmoothingQuality</code> - Quality of image scaling: 'low', 'medium', or 'high' (default: 'high')</li>
        <li><code>alpha</code> - Enable canvas transparency (default: false)</li>
        <li><code>desynchronized</code> - Performance hint for canvas (default: true)</li>
      </ul>

      <h3>Performance Options</h3>
      <p>Control frame rate and performance characteristics:</p>

      <div class="code-section">
        <pre><span class="comment">// Limit to 30 FPS (battery saving)</span>
<span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>({
  targetFPS: <span class="number">30</span>
});

<span class="comment">// Prevent "spiral of death" in slow devices</span>
<span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>({
  maxDeltaTime: <span class="number">0.05</span>  <span class="comment">// Clamp to 50ms max</span>
});</pre>
      </div>

      <ul>
        <li><code>targetFPS</code> - Target frame rate (default: null for unlimited). Set to 30 or 60 to limit FPS and save battery</li>
        <li><code>maxDeltaTime</code> - Maximum time step in seconds (default: 0.1). Prevents physics breaking when tab is inactive</li>
      </ul>

      <h3>Debug Options</h3>
      <p>Built-in debugging tools to help during development:</p>

      <div class="code-section">
        <pre><span class="keyword">const</span> game = <span class="keyword">new</span> <span class="function">Game</span>({
  showFPS: <span class="keyword">true</span>,   <span class="comment">// Show FPS counter</span>
  debug: <span class="keyword">true</span>      <span class="comment">// Enable debug mode</span>
});</pre>
      </div>

      <ul>
        <li><code>showFPS</code> - Display FPS counter in top-left corner (default: false)</li>
        <li><code>debug</code> - Enable debug mode for additional logging and tools (default: false)</li>
      </ul>

      <h3>Canvas Context Options</h3>
      <p>Advanced options for the 2D rendering context:</p>
      <ul>
        <li><code>alpha</code> - Enable transparency (default: false). Set to true if you need a transparent background</li>
        <li><code>desynchronized</code> - Performance hint to reduce latency (default: true)</li>
      </ul>
    </div>
  `
};
