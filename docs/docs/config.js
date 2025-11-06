/**
 * Documentation Configuration
 *
 * This file contains configuration settings for the Zap documentation system.
 * Update the ZAP_VERSION when a new version is released to automatically update
 * all interactive demos.
 */

const resolveRuntimeFlags = () => {
  if (typeof window === 'undefined') {
    return {
      useLocal: true,
      params: new URLSearchParams()
    };
  }

  const params = new URLSearchParams(window.location.search);
  const hostname = window.location.hostname;

  const forceLocal = params.has('local');
  const forceCdn = params.has('cdn');
  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1';

  const useLocal = forceLocal ? true : forceCdn ? false : isLocalHost;

  return { useLocal, params };
};

const runtime = resolveRuntimeFlags();

export const config = {
  // Development mode - automatically use local bundle when running on localhost,
  // otherwise fall back to CDN on production hosts. Can be overridden via ?local=1 or ?cdn=1.
  USE_LOCAL_BUILD: runtime.useLocal,

  // Current Zap version for esm.sh imports in interactive demos
  ZAP_VERSION: '0.1.6',

  // Local build path (relative to /docs which is the server root on GitHub Pages)
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

  // Expose query params so docs tooling can detect overrides if needed
  params: runtime.params,

  // Documentation metadata
  title: '@mode-7/zap',
  subtitle: 'Documentation & Examples',

  // Markdown file base path
  markdownBasePath: 'markdown/'
};
