/**
 * Utility for loading Google Fonts and custom web fonts
 */

const loadedFonts = new Set<string>();

/**
 * Load a Google Font
 * @param fontFamily - Font family name (e.g., 'Roboto', 'Poppins')
 * @param weights - Font weights to load (default: [400])
 * @returns Promise that resolves when font is loaded
 */
export async function loadGoogleFont(
  fontFamily: string,
  weights: number[] = [400]
): Promise<void> {
  const fontKey = `${fontFamily}-${weights.join(',')}`;

  if (loadedFonts.has(fontKey)) {
    return; // Already loaded
  }

  // Create Google Fonts URL
  const weightString = weights.join(';');
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
    / /g,
    '+'
  )}:wght@${weightString}&display=swap`;

  // Load font CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  document.head.appendChild(link);

  // Wait for font to load using Font Loading API
  try {
    // Use the Font Loading API if available
    if ('fonts' in document) {
      await Promise.all(
        weights.map((weight) =>
          (document as any).fonts.load(`${weight} 16px "${fontFamily}"`)
        )
      );
    } else {
      // Fallback: wait a bit for the font to load
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    loadedFonts.add(fontKey);
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily}:`, error);
    // Still mark as loaded to avoid repeated attempts
    loadedFonts.add(fontKey);
  }
}

/**
 * Load multiple Google Fonts at once
 */
export async function loadGoogleFonts(
  fonts: { family: string; weights?: number[] }[]
): Promise<void> {
  await Promise.all(
    fonts.map((font) => loadGoogleFont(font.family, font.weights))
  );
}

/**
 * Load a custom font from a URL
 */
export async function loadCustomFont(
  fontFamily: string,
  url: string,
  weight: number = 400
): Promise<void> {
  const fontKey = `${fontFamily}-${weight}`;

  if (loadedFonts.has(fontKey)) {
    return;
  }

  try {
    const fontFace = new FontFace(fontFamily, `url(${url})`, { weight: String(weight) });
    await fontFace.load();
    (document as any).fonts.add(fontFace);
    loadedFonts.add(fontKey);
  } catch (error) {
    console.error(`Failed to load custom font ${fontFamily}:`, error);
    throw error;
  }
}
