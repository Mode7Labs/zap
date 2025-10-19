# AI Tool System Documentation

The Zap Playground uses OpenAI's function calling feature to give the AI access to Zap documentation. This allows the AI to look up accurate, up-to-date information when generating code.

## How It Works

### 1. System Prompt

The AI receives a system prompt (`ZAP_SYSTEM_PROMPT`) that:
- Defines its role as a Zap-only assistant
- Explains the workflow for using tools
- Lists all available Zap features
- Enforces code-only output (no explanations)

### 2. Available Tools

The AI has access to two tools:

#### `discover_zap_docs(query?)`

Discovers available documentation topics.

**Purpose**: Help the AI find the right documentation topic
**Parameters**:
- `query` (optional): Filter topics by keyword

**Returns**:
```javascript
{
  total: 30,
  topics: {
    "Core": [
      { topic: 'game', category: 'Core', description: 'Game configuration...' },
      { topic: 'scenes', category: 'Core', description: 'Scene management...' },
      ...
    ],
    "Visual": [...],
    "Animation": [...],
    ...
  }
}
```

**Example**:
```javascript
// AI calls: discover_zap_docs({ query: "sprite" })
// Returns: Topics matching "sprite" (sprites, sprite-animation, etc.)
```

#### `get_zap_docs(topic)`

Retrieves detailed documentation for a specific topic.

**Purpose**: Get full documentation to write accurate code
**Parameters**:
- `topic` (required): Topic name from discover_zap_docs

**Returns**:
```javascript
{
  title: "Sprites",
  description: "Image sprites and rendering",
  summary: "# Sprites\n\nSprites are visual entities...", // First 3000 chars
  examples: [
    "const sprite = new Sprite({ x: 100, y: 100 });",
    "sprite.tween({ x: 200 }, { duration: 1000 });",
    ...
  ],
  fullContent: "..." // Complete markdown
}
```

**Example**:
```javascript
// AI calls: get_zap_docs({ topic: "sprites" })
// Returns: Full sprite documentation with examples
```

### 3. Documentation Mapping

Topics are mapped to markdown files in `/web/docs/markdown/`:

```javascript
const TOPIC_TO_FILE = {
  'sprite': 'visual/sprites',
  'sprites': 'visual/sprites',      // Alias
  'tweening': 'animation/tweening',
  'tween': 'animation/tweening',    // Alias
  ...
};
```

**Categories**:
- `getting-started/` - Installation, Quick Start
- `core/` - Architecture, Game, Scenes, Entities, Camera
- `visual/` - Shapes, Sprites, Animation, Text
- `animation/` - Tweening, Particles, Touch Trail
- `gestures/` - Tap, Drag, Swipe
- `ui/` - Button, NinePatch
- `audio/` - Sound Effects, Music, Volume
- `utilities/` - Easing, Asset Loader, Fonts, Layout, Math, Storage, Timers
- `advanced/` - Collision Detection

### 4. Workflow Example

**User Input**: "add a red circle that bounces"

**AI Workflow**:

1. **Discovery Phase**
   ```
   AI → discover_zap_docs({ query: "circle" })
   System → Returns topics: shapes, sprites, tweening
   ```

2. **Documentation Phase**
   ```
   AI → get_zap_docs({ topic: "shapes" })
   System → Returns sprite documentation with circle examples

   AI → get_zap_docs({ topic: "tweening" })
   System → Returns tween documentation for bouncing
   ```

3. **Code Generation**
   ```javascript
   // AI generates code using documentation:
   const circle = new Sprite({
     x: GAME_WIDTH / 2,
     y: 100,
     width: 60,
     height: 60,
     radius: 30,
     color: '#ff0000'
   });

   function bounce() {
     circle.tween(
       { y: GAME_HEIGHT - 100 },
       { duration: 1000, easing: 'easeInQuad', onComplete: () => {
         circle.tween(
           { y: 100 },
           { duration: 1000, easing: 'easeOutQuad', onComplete: bounce }
         );
       }}
     );
   }

   bounce();
   scene.add(circle);
   ```

## Implementation Details

### Fetching Documentation

```javascript
async function fetchMarkdown(filePath) {
  const response = await fetch(`/docs/markdown/${filePath}.md`);
  return await response.text();
}
```

Documentation is fetched directly from markdown files, ensuring the AI always has the latest docs.

### Parsing Markdown

```javascript
function parseFrontmatter(markdown) {
  // Extracts YAML frontmatter (title, description)
  // Returns: { frontmatter, content }
}

function extractCodeExamples(content) {
  // Finds all ```javascript and ```codemirror blocks
  // Returns: Array of code examples
}

function createDocSummary(markdown) {
  // Combines frontmatter, summary, and examples
  // Limits summary to 3000 chars to save tokens
}
```

### Error Handling

```javascript
if (!filePath) {
  return { error: "Unknown topic. Use discover_zap_docs..." };
}

if (!markdown) {
  return { error: "Failed to load documentation" };
}
```

## Benefits

### 1. **Always Up-to-Date**
- AI reads directly from markdown files
- No hardcoded documentation to maintain
- Documentation updates automatically available to AI

### 2. **Token Efficient**
- Only fetches relevant documentation
- Summarizes content (3000 char limit)
- Returns top 3 code examples only

### 3. **Accurate Code Generation**
- AI sees real code examples from docs
- Learns correct API usage patterns
- Matches documentation style and conventions

### 4. **Iterative Learning**
- AI can discover topics first
- Then dive deep into specific topics
- Multiple tool calls in one generation

## Debugging

### Enable Console Logging

Tool calls are logged to console:

```javascript
console.log('AI called tool:', toolName, toolArgs);
```

### Check Tool Results

Inspect the messages array to see what the AI received:

```javascript
{
  role: 'tool',
  tool_call_id: 'call_abc123',
  content: '{"title":"Sprites","description":"..."}'
}
```

### Monitor Status

The UI shows when AI is querying docs:

```
🔍 AI is exploring Zap docs (2 queries)...
```

## Extending

### Add New Topics

1. **Create markdown file**:
   ```
   /web/docs/markdown/new-category/new-topic.md
   ```

2. **Add to TOPIC_TO_FILE**:
   ```javascript
   'new-topic': 'new-category/new-topic',
   ```

3. **Add to discoverDocs**:
   ```javascript
   {
     topic: 'new-topic',
     category: 'New Category',
     description: 'What this topic covers'
   }
   ```

### Modify Summarization

Adjust summary length or example count:

```javascript
function createDocSummary(markdown) {
  // Change summary length:
  .substring(0, 5000); // Was 3000

  // Change example count:
  examples: examples.slice(0, 5), // Was 3
}
```

## Performance

- **First tool call**: ~100-200ms (fetch + parse markdown)
- **Subsequent calls**: Similar (no caching currently)
- **Token usage**: ~1000-2000 tokens per documentation lookup
- **Average generation**: 2-4 documentation lookups per code generation

## Limitations

1. **No cross-referencing**: Each tool call is independent
2. **Summary truncation**: Large docs are truncated to 3000 chars
3. **No semantic search**: Uses exact topic matching only
4. **No caching**: Fetches markdown on every request

## Future Improvements

- [ ] Add semantic search for better topic discovery
- [ ] Cache frequently accessed documentation
- [ ] Cross-reference related topics
- [ ] Suggest example combinations
- [ ] Track which docs are most useful
