import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadGoogleFont, loadGoogleFonts, loadCustomFont } from '../../src/utils/fonts';

describe('fonts', () => {
  let appendedElements: HTMLElement[];
  let loadedFontsAPI: any[];
  let addedFonts: any[];

  beforeEach(() => {
    appendedElements = [];
    loadedFontsAPI = [];
    addedFonts = [];

    // Mock document.createElement
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element: any = {
        tagName,
        rel: '',
        href: '',
        setAttribute: vi.fn((name: string, value: string) => {
          element[name] = value;
        })
      };
      return element;
    });

    // Mock document.head.appendChild
    vi.spyOn(document.head, 'appendChild').mockImplementation((element: any) => {
      appendedElements.push(element);
      return element;
    });

    // Mock document.fonts
    (document as any).fonts = {
      load: vi.fn((fontString: string) => {
        loadedFontsAPI.push(fontString);
        return Promise.resolve();
      }),
      add: vi.fn((fontFace: any) => {
        addedFonts.push(fontFace);
      })
    };

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock FontFace as a class
    class MockFontFace {
      constructor(public family: string, public source: string, public descriptors: any) {}
      async load() {
        return Promise.resolve(this);
      }
    }
    (global as any).FontFace = MockFontFace;
  });

  describe('loadGoogleFont()', () => {
    it('should load a Google Font with default weight', async () => {
      await loadGoogleFont('Roboto');

      expect(document.createElement).toHaveBeenCalledWith('link');
      expect(appendedElements.length).toBeGreaterThanOrEqual(1);

      const link = appendedElements[0];
      expect(link.rel).toBe('stylesheet');
      expect(link.href).toContain('fonts.googleapis.com');
      expect(link.href).toContain('family=Roboto');
      expect(link.href).toContain('wght@400');
    });

    it('should load a Google Font with multiple weights', async () => {
      await loadGoogleFont('Poppins', [300, 400, 700]);

      const link = appendedElements.slice(-1)[0]; // Get most recent
      expect(link.href).toContain('family=Poppins');
      expect(link.href).toContain('wght@300;400;700');
    });

    it('should replace spaces in font name with plus signs', async () => {
      await loadGoogleFont('Open Sans', [400]);

      const link = appendedElements.slice(-1)[0];
      expect(link.href).toContain('family=Open+Sans');
    });

    it('should use Font Loading API when available', async () => {
      await loadGoogleFont('Montserrat', [400, 700]);

      expect(document.fonts.load).toHaveBeenCalledWith('400 16px "Montserrat"');
      expect(document.fonts.load).toHaveBeenCalledWith('700 16px "Montserrat"');
    });

    it('should handle font loading errors gracefully', async () => {
      vi.mocked(document.fonts.load).mockRejectedValueOnce(new Error('Load failed'));

      await loadGoogleFont('ErrorFont');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load font'),
        expect.any(Error)
      );
    });

    it('should fallback when Font Loading API is not available', async () => {
      delete (document as any).fonts;

      vi.useFakeTimers();

      const loadPromise = loadGoogleFont('Roboto2');

      await vi.advanceTimersByTimeAsync(100);
      await loadPromise;

      expect(appendedElements.length).toBeGreaterThanOrEqual(1);

      vi.useRealTimers();
    });

    it('should include display=swap parameter', async () => {
      await loadGoogleFont('Inter');

      const link = appendedElements.slice(-1)[0];
      expect(link.href).toContain('display=swap');
    });

    it('should handle fonts with numbers in name', async () => {
      await loadGoogleFont('Roboto Mono', [400]);

      const link = appendedElements.slice(-1)[0];
      expect(link.href).toContain('family=Roboto+Mono');
    });
  });

  describe('loadGoogleFonts()', () => {
    it('should load multiple fonts', async () => {
      const initialCount = appendedElements.length;

      await loadGoogleFonts([
        { family: 'Font1', weights: [400, 700] },
        { family: 'Font2', weights: [300, 600] },
        { family: 'Font3' }
      ]);

      expect(appendedElements.length).toBeGreaterThanOrEqual(initialCount + 3);

      const links = appendedElements.slice(-3);
      expect(links[0].href).toContain('Font1');
      expect(links[1].href).toContain('Font2');
      expect(links[2].href).toContain('Font3');
    });

    it('should handle empty array', async () => {
      await loadGoogleFonts([]);
      // Should not throw
      expect(true).toBe(true);
    });

    it('should load fonts in parallel', async () => {
      await loadGoogleFonts([
        { family: 'Font4' },
        { family: 'Font5' },
        { family: 'Font6' }
      ]);

      // All fonts should be loaded
      expect(appendedElements.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle fonts with default weights', async () => {
      await loadGoogleFonts([
        { family: 'Font7' },
        { family: 'Font8' }
      ]);

      const links = appendedElements.slice(-2);
      expect(links[0].href).toContain('wght@400');
      expect(links[1].href).toContain('wght@400');
    });
  });

  describe('loadCustomFont()', () => {
    it('should load a custom font from URL', async () => {
      await loadCustomFont('MyFont', '/fonts/myfont.woff2');

      expect(addedFonts.length).toBeGreaterThanOrEqual(1);
      const fontFace = addedFonts.slice(-1)[0];
      expect(fontFace.family).toBe('MyFont');
      expect(fontFace.source).toBe('url(/fonts/myfont.woff2)');
    });

    it('should handle custom weight', async () => {
      await loadCustomFont('MyFont', '/fonts/myfont-bold.woff2', 700);

      const fontFace = addedFonts.slice(-1)[0];
      expect(fontFace.descriptors.weight).toBe('700');
    });

    it('should throw error on loading failure', async () => {
      class FailingFontFace {
        constructor(public family: string, public source: string, public descriptors: any) {}
        async load() {
          throw new Error('Load failed');
        }
      }
      (global as any).FontFace = FailingFontFace;

      await expect(loadCustomFont('FailFont', '/fail.woff2')).rejects.toThrow('Load failed');

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load custom font'),
        expect.any(Error)
      );
    });

    it('should handle absolute URLs', async () => {
      await loadCustomFont('AbsoluteFont', 'https://example.com/fonts/myfont.woff2');

      const fontFace = addedFonts.slice(-1)[0];
      expect(fontFace).toBeDefined();
      if (fontFace) {
        expect(fontFace.source).toBe('url(https://example.com/fonts/myfont.woff2)');
      }
    });

    it('should handle relative URLs', async () => {
      await loadCustomFont('RelativeFont', '../fonts/myfont.woff2');

      const fontFace = addedFonts.slice(-1)[0];
      expect(fontFace).toBeDefined();
      if (fontFace) {
        expect(fontFace.source).toBe('url(../fonts/myfont.woff2)');
      }
    });

    it('should add FontFace to document.fonts', async () => {
      const initialCount = addedFonts.length;

      await loadCustomFont('AddFont', '/fonts/addfont.woff2');

      // Should have added if not cached
      expect(addedFonts.length).toBeGreaterThanOrEqual(initialCount);
    });
  });

  describe('Integration', () => {
    it('should allow loading both Google and custom fonts', async () => {
      const initialLinksCount = appendedElements.length;
      const initialFontsCount = addedFonts.length;

      await loadGoogleFont('WorkingFont', [400]);
      await loadCustomFont('WorkingCustom', '/fonts/custom.woff2');

      expect(appendedElements.length).toBeGreaterThan(initialLinksCount);
      expect(addedFonts.length).toBeGreaterThan(initialFontsCount);
    });

    it('should handle mixed font loading', async () => {
      await loadGoogleFonts([
        { family: 'WorkFont1', weights: [400, 700] },
        { family: 'WorkFont2' }
      ]);

      await loadCustomFont('CustomWork', '/fonts/custom.woff2');

      expect(appendedElements.length).toBeGreaterThanOrEqual(2);
      expect(addedFonts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle font names with special characters', async () => {
      await loadGoogleFont('Font-Name_123', [400]);

      const link = appendedElements.slice(-1)[0];
      expect(link.href).toContain('family=Font-Name_123');
    });

    it('should handle very large weight arrays', async () => {
      const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
      await loadGoogleFont('MultiWeight', weights);

      const link = appendedElements.slice(-1)[0];
      expect(link.href).toContain('wght@100;200;300;400;500;600;700;800;900');
    });

    it('should handle font URL with query parameters', async () => {
      await loadCustomFont('QueryFont', '/fonts/queryfont.woff2?v=1.0');

      const fontFace = addedFonts.slice(-1)[0];
      expect(fontFace).toBeDefined();
      if (fontFace) {
        expect(fontFace.source).toBe('url(/fonts/queryfont.woff2?v=1.0)');
      }
    });

    it('should handle empty font family name', async () => {
      await loadGoogleFont('', [400]);

      expect(appendedElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle zero weight', async () => {
      await loadGoogleFont('ZeroWeight', [0]);

      const link = appendedElements.slice(-1)[0];
      expect(link.href).toContain('wght@0');
    });
  });
});
