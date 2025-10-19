/**
 * Core type definitions for Zap
 */

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  alpha: number;
}

export interface GameOptions {
  // Display
  width?: number;
  height?: number;
  canvas?: HTMLCanvasElement;
  parent?: HTMLElement | string;
  backgroundColor?: string;
  responsive?: boolean;

  // Rendering Quality
  pixelRatio?: number;
  antialias?: boolean;
  imageSmoothingQuality?: ImageSmoothingQuality;

  // Performance
  targetFPS?: number;
  maxDeltaTime?: number;

  // Canvas Context Options
  alpha?: boolean;
  desynchronized?: boolean;

  // Features
  enableTouchTrail?: boolean;

  // Debug
  showFPS?: boolean;
  debug?: boolean;
}

export interface SceneOptions {
  backgroundColor?: string;
  backgroundImage?: string | HTMLImageElement;
}

export interface EntityOptions extends Partial<Transform> {
  width?: number;
  height?: number;
  anchorX?: number;
  anchorY?: number;
  zIndex?: number;
  interactive?: boolean;
  visible?: boolean;
  checkCollisions?: boolean;
  collisionTags?: string[];
}

export interface Animation {
  frames: number[];
  fps?: number;
  loop?: boolean;
}

export interface SpriteOptions extends EntityOptions {
  color?: string;
  image?: HTMLImageElement | string;
  radius?: number;
  // Animation support (optional)
  frameWidth?: number;
  frameHeight?: number;
  animations?: Record<string, Animation>;
}

export interface TextOptions extends EntityOptions {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  baseline?: 'top' | 'middle' | 'bottom' | 'alphabetic';
}

export type EasingFunction = (t: number) => number;

export interface TweenOptions {
  duration: number;
  easing?: EasingFunction | keyof typeof import('./utils/easing').Easing;
  delay?: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export type GestureType =
  | 'tap'
  | 'longpress'
  | 'swipe'
  | 'drag'
  | 'pinch'
  | 'dragstart'
  | 'dragend'
  | 'pointerover'
  | 'pointerout';

export interface GestureEvent {
  type: GestureType;
  position: Point;
  delta?: Point;
  velocity?: Point;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: number;
  target?: any;
}

export type EventCallback<T = any> = (data: T) => void;

export interface CollisionEvent {
  other: any; // Entity type - using any to avoid circular dependency
}
