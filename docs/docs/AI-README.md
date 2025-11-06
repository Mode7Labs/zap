# AI Assistant Documentation Access Guide

This guide explains how AI assistants should access Zap documentation.

## The Problem

GitHub Pages doesn't serve raw `.md` files directly. Attempting to fetch markdown files via GitHub Pages URLs will result in 401 authentication errors.

## The Solution

We provide **two methods** for AI assistants to access documentation:

### Method 1: Documentation Index JSON (Recommended)

Fetch a lightweight index that tells you where to find each doc:

```
https://mode7labs.github.io/zap/docs/api-docs.json
```

This JSON file contains:
- Index of all 31 markdown documentation files
- Metadata (title, description)
- Direct URLs to fetch each doc
- Organized by category
- Only 9.5KB - fast to fetch

**Advantages:**
- Lightweight index (9.5KB)
- No authentication issues
- Browse available docs before fetching
- Fetch only the docs you need

**Structure:**
```json
{
  "version": "0.1.6",
  "generated": "2025-10-19T07:28:39.699Z",
  "categories": {
    "getting-started": [
      {
        "slug": "getting-started/installation",
        "title": "Installation",
        "description": "Install Zap via npm or CDN",
        "path": "getting-started/installation.md",
        "url": "https://raw.githubusercontent.com/Mode7Labs/zap/main/docs/docs/markdown/getting-started/installation.md"
      }
    ],
    "core": [...],
    "gestures": [...],
    ...
  }
}
```

### Method 2: Individual Files via GitHub Raw URLs

For individual markdown files, use GitHub's raw content URLs:

```
https://raw.githubusercontent.com/Mode7Labs/zap/main/docs/docs/markdown/{category}/{file}.md
```

Examples:
- `https://raw.githubusercontent.com/Mode7Labs/zap/main/docs/docs/markdown/getting-started/quickstart.md`
- `https://raw.githubusercontent.com/Mode7Labs/zap/main/docs/docs/markdown/gestures/drag.md`
- `https://raw.githubusercontent.com/Mode7Labs/zap/main/docs/docs/markdown/core/game.md`

**Advantages:**
- Direct access to specific files
- No authentication required
- Latest version from main branch

**Disadvantages:**
- Multiple HTTP requests
- Need to know exact file paths

## Documentation Index

Human-readable index page for browsing:
```
https://mode7labs.github.io/zap/docs/api-index.html
```

This page lists all 31 documentation files organized by category with descriptions and direct links.

## Building the JSON

The JSON file is automatically generated from markdown sources.

**Manual generation:**
```bash
npm run build:docs-json
```

**Automatic generation:**
The JSON is regenerated whenever you run:
```bash
npm run build:docs
```

## Categories

Documentation is organized into 10 categories:

1. **getting-started** (2 docs) - Installation, Quickstart
2. **core** (5 docs) - Architecture, Game, Scenes, Entities, Camera
3. **visual** (4 docs) - Shapes, Sprites, Animation, Text
4. **animation** (3 docs) - Tweening, Particles, Touch Trail
5. **gestures** (3 docs) - Tap, Drag, Swipe
6. **ui** (2 docs) - Button, NinePatch
7. **audio** (3 docs) - Sound Effects, Music, Volume
8. **utilities** (7 docs) - Easing, Asset Loader, Fonts, Layout, Math, Storage, Timers
9. **advanced** (1 doc) - Collision Detection
10. **general** (1 doc) - Index

## Example AI Usage

```javascript
// Step 1: Fetch the index
const indexResponse = await fetch('https://mode7labs.github.io/zap/docs/api-docs.json');
const index = await indexResponse.json();

// Step 2: Browse available docs
console.log(index.categories); // All categories
console.log(index.categories.gestures); // All gesture docs

// Step 3: Find the doc you need
const dragDoc = index.categories.gestures.find(doc => doc.slug === 'gestures/drag');
console.log(dragDoc.title);        // "Drag Gesture"
console.log(dragDoc.description);  // "Dragging and moving interactive entities"
console.log(dragDoc.url);          // URL to fetch full content

// Step 4: Fetch the full markdown content
const contentResponse = await fetch(dragDoc.url);
const fullMarkdown = await contentResponse.text();

// Now you have the complete documentation
console.log(fullMarkdown);
```

## Important Notes

1. **Do NOT use GitHub Pages URLs for .md files** - They will fail with 401 errors
2. **Use the JSON endpoint first** - It's the most efficient method
3. **GitHub raw URLs bypass Pages** - Use these for individual files if needed
4. **JSON is regenerated on build** - Always contains latest documentation

## Version

Current documentation version: **0.1.6**

Last updated: 2025-10-19
