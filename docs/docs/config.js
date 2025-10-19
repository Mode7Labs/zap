/**
 * Documentation Configuration
 *
 * This file contains configuration settings for the Zap documentation system.
 * Update the ZAP_VERSION when a new version is released to automatically update
 * all interactive demos.
 */

export const config = {
  // Development mode - set to true to use local build instead of CDN
  USE_LOCAL_BUILD: true,

  // Current Zap version for esm.sh imports in interactive demos
  ZAP_VERSION: '0.1.2',

  // Local build path (relative to /web/ which is the server root)
  LOCAL_BUILD_PATH: '../dist/index.mjs',

  // Get the import URL based on mode
  get ZAP_IMPORT_URL() {
    return this.USE_LOCAL_BUILD
      ? this.LOCAL_BUILD_PATH
      : `https://esm.sh/@mode-7/zap@${this.ZAP_VERSION}`;
  },

  // Base URL for esm.sh imports (for reference)
  get ZAP_CDN_URL() {
    return `https://esm.sh/@mode-7/zap@${this.ZAP_VERSION}`;
  },

  // Documentation metadata
  title: '@mode-7/zap',
  subtitle: 'Documentation & Examples',

  // Markdown file base path
  markdownBasePath: 'markdown/'
};
