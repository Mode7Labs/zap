/**
 * @mode7/zap - Lightweight gesture-first 2D game engine
 * Perfect for interactive demos and playable ads
 */

// Core
export { Game } from './core/Game';
export { Scene } from './core/Scene';
export { EventEmitter } from './core/EventEmitter';
export { Camera } from './core/Camera';

// Entities
export { Entity } from './entities/Entity';
export { Sprite } from './entities/Sprite';
export { Text } from './entities/Text';
export { AnimatedSprite } from './entities/AnimatedSprite';
export { NinePatch } from './entities/NinePatch';

// UI
export { Button } from './ui/Button';

// Effects
export { Tween } from './effects/Tween';
export { TweenManager, tweenManager } from './effects/TweenManager';
export { Particle, ParticleEmitter } from './effects/Particle';
export { TouchTrail } from './effects/TouchTrail';

// Audio
export { AudioManager, audioManager } from './audio/AudioManager';

// Gestures
export { GestureManager } from './gestures/GestureManager';

// Utils
export { Easing } from './utils/easing';
export { AssetLoader, assetLoader } from './utils/AssetLoader';
export * as Layout from './utils/layout';
export { loadGoogleFont, loadGoogleFonts, loadCustomFont } from './utils/fonts';
export { delay, interval, wait } from './utils/timer';
export { Storage } from './utils/storage';

// Types
export type {
  Point,
  Size,
  Transform,
  GameOptions,
  EntityOptions,
  SpriteOptions,
  TextOptions,
  TweenOptions,
  GestureType,
  GestureEvent,
  EasingFunction,
} from './types';

export type { EasingName } from './utils/easing';
export type { ParticleOptions, ParticleEmitterOptions } from './effects/Particle';
export type { TransitionType } from './core/Game';
export type { ButtonOptions } from './ui/Button';
export type { NinePatchOptions } from './entities/NinePatch';
export type { TouchTrailOptions } from './effects/TouchTrail';
export type { TimerHandle, TimerCallback } from './utils/timer';
export type { Animation, AnimatedSpriteOptions } from './entities/AnimatedSprite';
export type { SoundOptions } from './audio/AudioManager';
