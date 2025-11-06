import { beforeEach, vi } from 'vitest';

// Mock HTMLCanvasElement and CanvasRenderingContext2D for tests
class MockCanvasRenderingContext2D {
  canvas: any;
  fillStyle: string | CanvasGradient | CanvasPattern = '#000';
  strokeStyle: string | CanvasGradient | CanvasPattern = '#000';
  lineWidth: number = 1;
  font: string = '10px sans-serif';
  textAlign: CanvasTextAlign = 'left';
  textBaseline: CanvasTextBaseline = 'alphabetic';
  globalAlpha: number = 1;
  imageSmoothingEnabled: boolean = true;
  imageSmoothingQuality: ImageSmoothingQuality = 'low';

  save = vi.fn();
  restore = vi.fn();
  scale = vi.fn();
  rotate = vi.fn();
  translate = vi.fn();
  transform = vi.fn();
  setTransform = vi.fn();
  resetTransform = vi.fn();
  clearRect = vi.fn();
  fillRect = vi.fn();
  strokeRect = vi.fn();
  beginPath = vi.fn();
  closePath = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  arc = vi.fn();
  arcTo = vi.fn();
  ellipse = vi.fn();
  rect = vi.fn();
  fill = vi.fn();
  stroke = vi.fn();
  clip = vi.fn();
  isPointInPath = vi.fn(() => false);
  isPointInStroke = vi.fn(() => false);
  drawImage = vi.fn();
  fillText = vi.fn();
  strokeText = vi.fn();
  measureText = vi.fn((text: string) => ({
    width: text.length * 10,
    actualBoundingBoxLeft: 0,
    actualBoundingBoxRight: text.length * 10,
    actualBoundingBoxAscent: 10,
    actualBoundingBoxDescent: 2,
    fontBoundingBoxAscent: 12,
    fontBoundingBoxDescent: 3,
    alphabeticBaseline: 0,
    emHeightAscent: 10,
    emHeightDescent: 2,
    hangingBaseline: 8,
    ideographicBaseline: -2,
  }));
  createLinearGradient = vi.fn();
  createRadialGradient = vi.fn();
  createPattern = vi.fn();
  getImageData = vi.fn();
  putImageData = vi.fn();
}

class MockHTMLCanvasElement {
  width: number = 800;
  height: number = 600;
  style: any = {};

  getContext(contextId: string): any {
    if (contextId === '2d') {
      const ctx = new MockCanvasRenderingContext2D();
      ctx.canvas = this;
      return ctx;
    }
    return null;
  }

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      right: this.width,
      bottom: this.height,
      width: this.width,
      height: this.height,
      x: 0,
      y: 0,
    };
  }

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn();
  toDataURL = vi.fn(() => 'data:image/png;base64,mock');
  toBlob = vi.fn();
}

// Setup global mocks
beforeEach(() => {
  // Mock document.createElement for canvas
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = vi.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return new MockHTMLCanvasElement() as any;
    }
    return originalCreateElement(tagName);
  }) as any;

  // Mock Image
  global.Image = class MockImage {
    src: string = '';
    width: number = 100;
    height: number = 100;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor() {
      // Simulate async image loading
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  } as any;

  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 16) as any;
  });

  global.cancelAnimationFrame = vi.fn((id: number) => {
    clearTimeout(id);
  });

  // Mock performance.now
  if (!global.performance) {
    global.performance = {} as any;
  }
  global.performance.now = vi.fn(() => Date.now());
});

// Export mock classes for use in tests
export { MockCanvasRenderingContext2D, MockHTMLCanvasElement };
