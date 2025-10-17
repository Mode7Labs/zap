/**
 * Simple asset loader for images and other resources
 */
export class AssetLoader {
  private images: Map<string, HTMLImageElement> = new Map();
  private loading: Map<string, Promise<HTMLImageElement>> = new Map();

  /**
   * Load an image
   */
  async loadImage(key: string, url: string): Promise<HTMLImageElement> {
    // Return cached image if already loaded
    if (this.images.has(key)) {
      return this.images.get(key)!;
    }

    // Return existing promise if currently loading
    if (this.loading.has(key)) {
      return this.loading.get(key)!;
    }

    // Start loading
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        this.loading.delete(key);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(key);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loading.set(key, promise);
    return promise;
  }

  /**
   * Load multiple images
   */
  async loadImages(assets: Record<string, string>): Promise<void> {
    const promises = Object.entries(assets).map(([key, url]) => this.loadImage(key, url));
    await Promise.all(promises);
  }

  /**
   * Get a loaded image
   */
  getImage(key: string): HTMLImageElement | null {
    return this.images.get(key) ?? null;
  }

  /**
   * Check if an image is loaded
   */
  hasImage(key: string): boolean {
    return this.images.has(key);
  }

  /**
   * Clear all loaded assets
   */
  clear(): void {
    this.images.clear();
    this.loading.clear();
  }
}

// Global asset loader instance
export const assetLoader = new AssetLoader();
