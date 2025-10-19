/**
 * Audio Manager for sound effects and music
 */

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  rate?: number;
}

class Sound {
  private audio: HTMLAudioElement;
  private baseVolume: number = 1;

  constructor(src: string) {
    this.audio = new Audio(src);
  }

  play(options: SoundOptions = {}): void {
    const audio = this.audio.cloneNode() as HTMLAudioElement;
    audio.volume = (options.volume ?? 1) * this.baseVolume;
    audio.loop = options.loop ?? false;
    audio.playbackRate = options.rate ?? 1;
    audio.play().catch(err => console.warn('Audio play failed:', err));
  }

  setVolume(volume: number): void {
    this.baseVolume = volume;
  }
}

export class AudioManager {
  private sounds: Map<string, Sound> = new Map();
  private music: HTMLAudioElement | null = null;
  private masterVolume: number = 1;
  private musicVolume: number = 1;
  private sfxVolume: number = 1;
  private muted: boolean = false;

  /**
   * Load a sound effect
   */
  loadSound(key: string, src: string): void {
    this.sounds.set(key, new Sound(src));
  }

  /**
   * Load multiple sounds
   */
  loadSounds(sounds: Record<string, string>): void {
    Object.entries(sounds).forEach(([key, src]) => {
      this.loadSound(key, src);
    });
  }

  /**
   * Play a sound effect
   */
  playSound(key: string, options: SoundOptions = {}): void {
    if (this.muted) return;

    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound "${key}" not found`);
      return;
    }

    const volume = (options.volume ?? 1) * this.sfxVolume * this.masterVolume;
    sound.play({ ...options, volume });
  }

  /**
   * Play a random sound from an array
   */
  playRandomSound(keys: string[], options: SoundOptions = {}): void {
    const key = keys[Math.floor(Math.random() * keys.length)];
    this.playSound(key, options);
  }

  /**
   * Play background music
   */
  playMusic(src: string, options: SoundOptions = {}): void {
    if (this.muted) return;

    // Stop existing music
    this.stopMusic();

    this.music = new Audio(src);
    this.music.volume = (options.volume ?? 1) * this.musicVolume * this.masterVolume;
    this.music.loop = options.loop ?? true;
    this.music.playbackRate = options.rate ?? 1;
    this.music.play().catch(err => console.warn('Music play failed:', err));
  }

  /**
   * Stop music
   */
  stopMusic(): void {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.music = null;
    }
  }

  /**
   * Pause music
   */
  pauseMusic(): void {
    if (this.music) {
      this.music.pause();
    }
  }

  /**
   * Resume music
   */
  resumeMusic(): void {
    if (this.music) {
      this.music.play().catch(err => console.warn('Music resume failed:', err));
    }
  }

  /**
   * Set master volume (affects all audio)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * Get master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * Get music volume
   */
  getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * Set sound effects volume
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get sound effects volume
   */
  getSFXVolume(): number {
    return this.sfxVolume;
  }

  /**
   * Mute all audio
   */
  mute(): void {
    this.muted = true;
    if (this.music) {
      this.music.muted = true;
    }
  }

  /**
   * Unmute all audio
   */
  unmute(): void {
    this.muted = false;
    if (this.music) {
      this.music.muted = false;
    }
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.muted;
  }

  /**
   * Check if muted
   */
  isMuted(): boolean {
    return this.muted;
  }
}

// Global audio manager instance
export const audioManager = new AudioManager();
