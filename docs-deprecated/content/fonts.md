---
id: fonts
title: Google Fonts
category: ui
description: Load and use Google Fonts dynamically
imports: [loadGoogleFont, Text]
---

# Google Fonts

Load and use Google Fonts dynamically in your game for custom typography and branded text styling.

## Basic Usage

```zap-demo
// Load Google Font
await loadGoogleFont('Poppins', [600]);

const text = new Text({
  text: 'Styled with Poppins',
  x: 200, y: 150,
  fontSize: 28,
  fontFamily: 'Poppins, sans-serif',
  color: '#f39c12',
  align: 'center'
});

scene.add(text);
```
