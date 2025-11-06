import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioManager } from '../../src/audio/AudioManager';

describe('AudioManager', () => {
  let audioManager: AudioManager;
  let createdAudioElements: any[];
  let clonedAudioElements: any[];

  beforeEach(() => {
    audioManager = new AudioManager();
    createdAudioElements = [];
    clonedAudioElements = [];

    // Mock Audio constructor as a class
    class MockAudio {
      src: string;
      volume: number = 1;
      loop: boolean = false;
      playbackRate: number = 1;
      currentTime: number = 0;
      muted: boolean = false;
      paused: boolean = true;
      play: any;
      pause: any;
      cloneNode: any;

      constructor(src?: string) {
        this.src = src || '';
        this.play = vi.fn().mockResolvedValue(undefined);
        this.pause = vi.fn();
        this.cloneNode = vi.fn().mockImplementation(() => {
          const clone: any = {
            src: this.src,
            volume: 1,
            loop: false,
            playbackRate: 1,
            currentTime: 0,
            muted: false,
            paused: false,
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn()
          };
          clonedAudioElements.push(clone);
          return clone;
        });
        createdAudioElements.push(this);
      }
    }

    (global as any).Audio = MockAudio;

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Sound Loading', () => {
    it('should load a sound', () => {
      audioManager.loadSound('jump', '/sfx/jump.mp3');

      expect(createdAudioElements.length).toBe(1);
      expect(createdAudioElements[0].src).toBe('/sfx/jump.mp3');
    });

    it('should load multiple sounds with loadSounds', () => {
      audioManager.loadSounds({
        jump: '/sfx/jump.mp3',
        coin: '/sfx/coin.mp3',
        hit: '/sfx/hit.mp3'
      });

      expect(createdAudioElements.length).toBe(3);
      expect(createdAudioElements[0].src).toBe('/sfx/jump.mp3');
      expect(createdAudioElements[1].src).toBe('/sfx/coin.mp3');
      expect(createdAudioElements[2].src).toBe('/sfx/hit.mp3');
    });

    it('should handle loading same sound twice', () => {
      audioManager.loadSound('jump', '/sfx/jump.mp3');
      audioManager.loadSound('jump', '/sfx/jump2.mp3');

      // Second load should replace first
      expect(createdAudioElements.length).toBe(2);
    });
  });

  describe('Sound Playback', () => {
    beforeEach(() => {
      audioManager.loadSound('test', '/sfx/test.mp3');
    });

    it('should play a loaded sound', () => {
      audioManager.playSound('test');

      expect(clonedAudioElements.length).toBe(1);
      expect(clonedAudioElements[0].play).toHaveBeenCalled();
    });

    it('should apply SFX volume multiplier', () => {
      audioManager.setSFXVolume(0.5);
      audioManager.setMasterVolume(0.8);
      audioManager.playSound('test');

      const clone = clonedAudioElements[0];
      expect(clone.volume).toBeCloseTo(0.5 * 0.8, 5); // 0.4
    });

    it('should apply individual sound volume', () => {
      audioManager.playSound('test', { volume: 0.6 });

      const clone = clonedAudioElements[0];
      expect(clone.volume).toBeCloseTo(0.6, 5);
    });

    it('should apply all three volume multipliers for sounds', () => {
      audioManager.setMasterVolume(0.8);
      audioManager.setSFXVolume(0.5);
      audioManager.playSound('test', { volume: 0.5 });

      const clone = clonedAudioElements[0];
      // Final: 0.8 (master) × 0.5 (sfx) × 0.5 (individual) = 0.2
      expect(clone.volume).toBeCloseTo(0.2, 5);
    });

    it('should set loop option', () => {
      audioManager.playSound('test', { loop: true });

      expect(clonedAudioElements[0].loop).toBe(true);
    });

    it('should set playback rate', () => {
      audioManager.playSound('test', { rate: 1.5 });

      expect(clonedAudioElements[0].playbackRate).toBe(1.5);
    });

    it('should warn when playing non-existent sound', () => {
      audioManager.playSound('nonexistent');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('not found')
      );
    });

    it('should not play when muted', () => {
      audioManager.mute();
      audioManager.playSound('test');

      expect(clonedAudioElements.length).toBe(0);
    });
  });

  describe('Random Sound Playback', () => {
    beforeEach(() => {
      audioManager.loadSounds({
        hit1: '/sfx/hit1.mp3',
        hit2: '/sfx/hit2.mp3',
        hit3: '/sfx/hit3.mp3'
      });
    });

    it('should play a random sound from array', () => {
      audioManager.playRandomSound(['hit1', 'hit2', 'hit3']);

      expect(clonedAudioElements.length).toBe(1);
      expect(clonedAudioElements[0].play).toHaveBeenCalled();
    });

    it('should handle single sound in array', () => {
      audioManager.playRandomSound(['hit1']);

      expect(clonedAudioElements.length).toBe(1);
    });

    it('should pass options to random sound', () => {
      audioManager.playRandomSound(['hit1', 'hit2'], { volume: 0.5 });

      expect(clonedAudioElements[0].volume).toBeCloseTo(0.5, 5);
    });
  });

  describe('Music Playback', () => {
    it('should play music', () => {
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements.length).toBe(1);
      expect(createdAudioElements[0].play).toHaveBeenCalled();
    });

    it('should loop music by default', () => {
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements[0].loop).toBe(true);
    });

    it('should allow disabling loop', () => {
      audioManager.playMusic('/music/theme.mp3', { loop: false });

      expect(createdAudioElements[0].loop).toBe(false);
    });

    it('should apply music volume multiplier', () => {
      audioManager.setMusicVolume(0.6);
      audioManager.setMasterVolume(0.8);
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements[0].volume).toBeCloseTo(0.6 * 0.8, 5);
    });

    it('should apply individual music track volume', () => {
      audioManager.playMusic('/music/theme.mp3', { volume: 0.7 });

      expect(createdAudioElements[0].volume).toBeCloseTo(0.7, 5);
    });

    it('should apply all three volume multipliers for music', () => {
      audioManager.setMasterVolume(0.8);
      audioManager.setMusicVolume(0.5);
      audioManager.playMusic('/music/theme.mp3', { volume: 0.5 });

      // Final: 0.8 (master) × 0.5 (music) × 0.5 (individual) = 0.2
      expect(createdAudioElements[0].volume).toBeCloseTo(0.2, 5);
    });

    it('should set playback rate for music', () => {
      audioManager.playMusic('/music/theme.mp3', { rate: 1.2 });

      expect(createdAudioElements[0].playbackRate).toBe(1.2);
    });

    it('should stop existing music when playing new music', () => {
      audioManager.playMusic('/music/theme1.mp3');
      const firstMusic = createdAudioElements[0];

      audioManager.playMusic('/music/theme2.mp3');

      expect(firstMusic.pause).toHaveBeenCalled();
      expect(firstMusic.currentTime).toBe(0);
      expect(createdAudioElements.length).toBe(2);
    });

    it('should not play music when muted', () => {
      audioManager.mute();
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements.length).toBe(0);
    });
  });

  describe('Volume Bug - Per-Track Volume Lost', () => {
    it('should preserve per-track music volume when setMasterVolume is called', () => {
      // Play music with 0.6 per-track volume
      audioManager.playMusic('/music/theme.mp3', { volume: 0.6 });

      // Initial volume should be 0.6 × 1.0 (music) × 1.0 (master) = 0.6
      expect(createdAudioElements[0].volume).toBeCloseTo(0.6, 5);

      // Change master volume to 0.5
      audioManager.setMasterVolume(0.5);

      // BUG: Currently becomes 0.5 (music) × 1.0 (master) = 0.5
      // SHOULD BE: 0.6 (track) × 1.0 (music) × 0.5 (master) = 0.3
      expect(createdAudioElements[0].volume).toBeCloseTo(0.3, 5);
    });

    it('should preserve per-track music volume when setMusicVolume is called', () => {
      // Play music with 0.6 per-track volume
      audioManager.playMusic('/music/theme.mp3', { volume: 0.6 });

      // Initial volume should be 0.6 × 1.0 (music) × 1.0 (master) = 0.6
      expect(createdAudioElements[0].volume).toBeCloseTo(0.6, 5);

      // Change music volume to 0.5
      audioManager.setMusicVolume(0.5);

      // BUG: Currently becomes 0.5 (music) × 1.0 (master) = 0.5
      // SHOULD BE: 0.6 (track) × 0.5 (music) × 1.0 (master) = 0.3
      expect(createdAudioElements[0].volume).toBeCloseTo(0.3, 5);
    });

    it('should preserve per-track volume with all multipliers', () => {
      audioManager.setMasterVolume(0.8);
      audioManager.setMusicVolume(0.5);

      // Play music with 0.6 per-track volume
      audioManager.playMusic('/music/theme.mp3', { volume: 0.6 });

      // Initial: 0.6 × 0.5 × 0.8 = 0.24
      expect(createdAudioElements[0].volume).toBeCloseTo(0.24, 5);

      // Change master volume
      audioManager.setMasterVolume(1.0);

      // Should be: 0.6 × 0.5 × 1.0 = 0.3
      expect(createdAudioElements[0].volume).toBeCloseTo(0.3, 5);

      // Change music volume
      audioManager.setMusicVolume(1.0);

      // Should be: 0.6 × 1.0 × 1.0 = 0.6
      expect(createdAudioElements[0].volume).toBeCloseTo(0.6, 5);
    });

    it('should handle default per-track volume (1.0) correctly', () => {
      // Play music with default volume (1.0)
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements[0].volume).toBeCloseTo(1.0, 5);

      audioManager.setMasterVolume(0.5);

      // Should be: 1.0 × 1.0 × 0.5 = 0.5
      expect(createdAudioElements[0].volume).toBeCloseTo(0.5, 5);
    });
  });

  describe('Music Controls', () => {
    beforeEach(() => {
      audioManager.playMusic('/music/theme.mp3');
    });

    it('should stop music', () => {
      const musicElement = createdAudioElements[0];

      audioManager.stopMusic();

      expect(musicElement.pause).toHaveBeenCalled();
      expect(musicElement.currentTime).toBe(0);
    });

    it('should handle stopMusic when no music playing', () => {
      audioManager.stopMusic();
      expect(() => audioManager.stopMusic()).not.toThrow();
    });

    it('should pause music', () => {
      const musicElement = createdAudioElements[0];

      audioManager.pauseMusic();

      expect(musicElement.pause).toHaveBeenCalled();
    });

    it('should resume music', () => {
      const musicElement = createdAudioElements[0];

      audioManager.pauseMusic();
      audioManager.resumeMusic();

      expect(musicElement.play).toHaveBeenCalledTimes(2); // Initial + resume
    });

    it('should handle resumeMusic when no music playing', () => {
      audioManager.stopMusic();
      expect(() => audioManager.resumeMusic()).not.toThrow();
    });

    it('should handle pauseMusic when no music playing', () => {
      audioManager.stopMusic();
      expect(() => audioManager.pauseMusic()).not.toThrow();
    });
  });

  describe('Volume Getters and Setters', () => {
    it('should get and set master volume', () => {
      audioManager.setMasterVolume(0.7);
      expect(audioManager.getMasterVolume()).toBe(0.7);
    });

    it('should get and set music volume', () => {
      audioManager.setMusicVolume(0.6);
      expect(audioManager.getMusicVolume()).toBe(0.6);
    });

    it('should get and set SFX volume', () => {
      audioManager.setSFXVolume(0.8);
      expect(audioManager.getSFXVolume()).toBe(0.8);
    });

    it('should clamp master volume to 0-1 range', () => {
      audioManager.setMasterVolume(-0.5);
      expect(audioManager.getMasterVolume()).toBe(0);

      audioManager.setMasterVolume(1.5);
      expect(audioManager.getMasterVolume()).toBe(1);
    });

    it('should clamp music volume to 0-1 range', () => {
      audioManager.setMusicVolume(-0.5);
      expect(audioManager.getMusicVolume()).toBe(0);

      audioManager.setMusicVolume(1.5);
      expect(audioManager.getMusicVolume()).toBe(1);
    });

    it('should clamp SFX volume to 0-1 range', () => {
      audioManager.setSFXVolume(-0.5);
      expect(audioManager.getSFXVolume()).toBe(0);

      audioManager.setSFXVolume(1.5);
      expect(audioManager.getSFXVolume()).toBe(1);
    });

    it('should have default volumes of 1.0', () => {
      expect(audioManager.getMasterVolume()).toBe(1);
      expect(audioManager.getMusicVolume()).toBe(1);
      expect(audioManager.getSFXVolume()).toBe(1);
    });
  });

  describe('Mute Controls', () => {
    it('should start unmuted', () => {
      expect(audioManager.isMuted()).toBe(false);
    });

    it('should mute audio', () => {
      audioManager.mute();
      expect(audioManager.isMuted()).toBe(true);
    });

    it('should unmute audio', () => {
      audioManager.mute();
      audioManager.unmute();
      expect(audioManager.isMuted()).toBe(false);
    });

    it('should toggle mute on', () => {
      const isMuted = audioManager.toggleMute();

      expect(isMuted).toBe(true);
      expect(audioManager.isMuted()).toBe(true);
    });

    it('should toggle mute off', () => {
      audioManager.mute();
      const isMuted = audioManager.toggleMute();

      expect(isMuted).toBe(false);
      expect(audioManager.isMuted()).toBe(false);
    });

    it('should mute existing music', () => {
      audioManager.playMusic('/music/theme.mp3');
      const musicElement = createdAudioElements[0];

      audioManager.mute();

      expect(musicElement.muted).toBe(true);
    });

    it('should unmute existing music', () => {
      audioManager.playMusic('/music/theme.mp3');
      const musicElement = createdAudioElements[0];

      audioManager.mute();
      audioManager.unmute();

      expect(musicElement.muted).toBe(false);
    });

    it('should prevent new sounds when muted', () => {
      audioManager.loadSound('test', '/sfx/test.mp3');
      audioManager.mute();
      audioManager.playSound('test');

      expect(clonedAudioElements.length).toBe(0);
    });

    it('should prevent new music when muted', () => {
      audioManager.mute();
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle play promise rejection for sounds', async () => {
      audioManager.loadSound('test', '/sfx/test.mp3');

      // Mock play to reject
      class FailingAudio {
        src: string;
        constructor(src?: string) {
          this.src = src || '';
        }
        cloneNode() {
          return {
            volume: 1,
            loop: false,
            playbackRate: 1,
            play: vi.fn().mockRejectedValue(new Error('Play failed'))
          };
        }
      }

      (global as any).Audio = FailingAudio;

      audioManager.loadSound('test2', '/sfx/test2.mp3');

      await expect(async () => {
        audioManager.playSound('test2');
        // Wait for promise to settle
        await new Promise(resolve => setTimeout(resolve, 0));
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Audio play failed'),
        expect.any(Error)
      );
    });

    it('should handle play promise rejection for music', async () => {
      // Mock play to reject
      class FailingMusicAudio {
        src: string;
        volume: number = 1;
        loop: boolean = false;
        playbackRate: number = 1;
        currentTime: number = 0;
        muted: boolean = false;
        play: any;
        pause: any;

        constructor(src?: string) {
          this.src = src || '';
          this.play = vi.fn().mockRejectedValue(new Error('Music play failed'));
          this.pause = vi.fn();
        }
      }

      (global as any).Audio = FailingMusicAudio;

      await expect(async () => {
        audioManager.playMusic('/music/theme.mp3');
        // Wait for promise to settle
        await new Promise(resolve => setTimeout(resolve, 0));
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Music play failed'),
        expect.any(Error)
      );
    });

    it('should handle resume promise rejection', async () => {
      class ResumeFailingAudio {
        src: string;
        volume: number = 1;
        loop: boolean = false;
        playbackRate: number = 1;
        currentTime: number = 0;
        muted: boolean = false;
        play: any;
        pause: any;

        constructor(src?: string) {
          this.src = src || '';
          this.play = vi.fn()
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error('Resume failed'));
          this.pause = vi.fn();
        }
      }

      (global as any).Audio = ResumeFailingAudio;

      audioManager.playMusic('/music/theme.mp3');

      await expect(async () => {
        audioManager.resumeMusic();
        // Wait for promise to settle
        await new Promise(resolve => setTimeout(resolve, 0));
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Music resume failed'),
        expect.any(Error)
      );
    });
  });

  describe('Integration', () => {
    it('should handle complete game audio scenario', () => {
      // Load game sounds
      audioManager.loadSounds({
        jump: '/sfx/jump.mp3',
        coin: '/sfx/coin.mp3',
        hit: '/sfx/hit.mp3'
      });

      // Set volumes
      audioManager.setMasterVolume(0.8);
      audioManager.setMusicVolume(0.6);
      audioManager.setSFXVolume(0.7);

      // Play music
      audioManager.playMusic('/music/level1.mp3');
      expect(createdAudioElements[3].volume).toBeCloseTo(0.8 * 0.6, 5);

      // Play sound
      audioManager.playSound('jump');
      expect(clonedAudioElements[0].volume).toBeCloseTo(0.8 * 0.7, 5);

      // Pause on menu
      audioManager.pauseMusic();
      audioManager.setMasterVolume(0.3);

      // Resume
      audioManager.setMasterVolume(0.8);
      audioManager.resumeMusic();

      // Stop music on level end
      audioManager.stopMusic();
    });

    it('should handle volume adjustments during gameplay', () => {
      audioManager.playMusic('/music/theme.mp3', { volume: 0.7 });

      // Player opens settings and adjusts volumes
      audioManager.setMasterVolume(0.9);
      audioManager.setMusicVolume(0.8);

      // Music should be: 0.7 × 0.8 × 0.9 = 0.504
      expect(createdAudioElements[0].volume).toBeCloseTo(0.504, 5);
    });

    it('should handle mute toggle during active music', () => {
      audioManager.playMusic('/music/theme.mp3');
      const musicElement = createdAudioElements[0];

      // Player presses mute
      audioManager.toggleMute();
      expect(musicElement.muted).toBe(true);
      expect(audioManager.isMuted()).toBe(true);

      // Player unmutes
      audioManager.toggleMute();
      expect(musicElement.muted).toBe(false);
      expect(audioManager.isMuted()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero volume', () => {
      audioManager.setMasterVolume(0);
      audioManager.playMusic('/music/theme.mp3');

      expect(createdAudioElements[0].volume).toBe(0);
    });

    it('should handle very small volume values', () => {
      audioManager.setMasterVolume(0.001);
      audioManager.setMusicVolume(0.001);
      audioManager.playMusic('/music/theme.mp3', { volume: 0.001 });

      expect(createdAudioElements[0].volume).toBeCloseTo(0.000000001, 12);
    });

    it('should handle maximum volume chain', () => {
      audioManager.setMasterVolume(1);
      audioManager.setMusicVolume(1);
      audioManager.playMusic('/music/theme.mp3', { volume: 1 });

      expect(createdAudioElements[0].volume).toBe(1);
    });

    it('should handle rapid music changes', () => {
      audioManager.playMusic('/music/theme1.mp3');
      audioManager.playMusic('/music/theme2.mp3');
      audioManager.playMusic('/music/theme3.mp3');

      expect(createdAudioElements.length).toBe(3);
      expect(createdAudioElements[0].pause).toHaveBeenCalled();
      expect(createdAudioElements[1].pause).toHaveBeenCalled();
    });

    it('should handle rapid volume changes', () => {
      audioManager.playMusic('/music/theme.mp3', { volume: 0.5 });

      audioManager.setMasterVolume(0.1);
      audioManager.setMasterVolume(0.5);
      audioManager.setMasterVolume(1.0);

      // Final should be 0.5 × 1.0 × 1.0 = 0.5
      expect(createdAudioElements[0].volume).toBeCloseTo(0.5, 5);
    });

    it('should handle empty sound key', () => {
      audioManager.loadSound('', '/sfx/test.mp3');
      audioManager.playSound('');

      expect(clonedAudioElements.length).toBe(1);
    });

    it('should handle playing same sound multiple times', () => {
      audioManager.loadSound('test', '/sfx/test.mp3');

      audioManager.playSound('test');
      audioManager.playSound('test');
      audioManager.playSound('test');

      expect(clonedAudioElements.length).toBe(3);
    });

    it('should handle volume changes when no music is playing', () => {
      expect(() => {
        audioManager.setMasterVolume(0.5);
        audioManager.setMusicVolume(0.5);
      }).not.toThrow();
    });

    it('should handle playback rate edge values', () => {
      audioManager.playMusic('/music/theme.mp3', { rate: 0.5 });
      expect(createdAudioElements[0].playbackRate).toBe(0.5);

      audioManager.loadSound('test', '/sfx/test.mp3');
      audioManager.playSound('test', { rate: 2.0 });
      expect(clonedAudioElements[0].playbackRate).toBe(2.0);
    });
  });
});
