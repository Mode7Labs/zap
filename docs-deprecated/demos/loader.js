/**
 * Demo loader - dynamically imports demo modules
 */

// Map of demo keys to their file paths (relative to this loader file)
const demoFiles = {
  // Getting Started
  'installation': './installation.js',
  'quickstart': './quickstart.js',

  // Core Concepts
  'architecture': './architecture.js',
  'game': './game.js',
  'scenes': './scenes.js',
  'entities': './entities.js',

  // Visual Elements
  'sprites': './sprites.js',
  'images': './images.js',
  'animatedsprite': './animatedsprite.js',
  'text': './text.js',
  'fonts': './fonts.js',

  // UI Components
  'button': './button.js',
  'ninepatch': './ninepatch.js',

  // Camera
  'camera': './camera.js',

  // Audio
  'audio': './audio.js',

  // Interactions
  'tap': './tap.js',
  'swipe': './swipe.js',
  'drag': './drag.js',
  'touchtrail': './touchtrail.js',
  'canvasevents': './canvasevents.js',
  'canvasgestures': './canvasgestures.js',

  // Animation & Effects
  'animations': './animations.js',
  'easing': './easing.js',
  'particles': './particles.js',

  // Utilities
  'collision': './collision.js',
  'layout': './layout.js',
  'assetloader': './assetloader.js',
  'storage': './storage.js',
  'timer': './timer.js'
};

/**
 * Load a demo module dynamically
 */
export async function loadDemo(demoKey) {
  const filePath = demoFiles[demoKey];

  if (!filePath) {
    console.error(`Demo not found: ${demoKey}`);
    return null;
  }

  try {
    const module = await import(filePath);
    return module.default;
  } catch (error) {
    console.error(`Failed to load demo ${demoKey}:`, error);
    return null;
  }
}

/**
 * Check if a demo exists
 */
export function hasDemo(demoKey) {
  return demoKey in demoFiles;
}
