export default {
  title: 'Sound & Music',
  description: 'Complete audio system with SFX and music',
  code: `import { audioManager } from '@mode-7/zap';

// === LOADING SOUNDS ===

// Load a single sound
audioManager.loadSound('jump', 'sounds/jump.mp3');
audioManager.loadSound('coin', 'sounds/coin.mp3');

// Load multiple sounds at once
audioManager.loadSounds({
  'explosion': 'sounds/explosion.mp3',
  'laser': 'sounds/laser.mp3',
  'hit': 'sounds/hit.mp3'
});

// === PLAYING SOUND EFFECTS ===

// Play a sound
audioManager.playSound('jump');

// Play with options
audioManager.playSound('laser', {
  volume: 0.5,    // 0-1 (default: 1)
  rate: 1.2,      // Playback speed (default: 1)
  loop: false     // Loop sound (default: false)
});

// Play random sound from array (for variety)
audioManager.playRandomSound(['hit1', 'hit2', 'hit3']);

// === BACKGROUND MUSIC ===

// Play looping music
audioManager.playMusic('music/theme.mp3', {
  loop: true,     // Loop (default: true for music)
  volume: 0.7,    // Volume 0-1 (default: 1)
  rate: 1.0       // Playback speed (default: 1)
});

// Control music playback
audioManager.pauseMusic();   // Pause (can resume)
audioManager.resumeMusic();  // Resume paused music
audioManager.stopMusic();    // Stop & reset to beginning

// === VOLUME CONTROLS ===

// Master volume (affects ALL audio: SFX + music)
audioManager.setMasterVolume(0.8);  // 0-1

// Music volume only
audioManager.setMusicVolume(0.5);   // 0-1

// Sound effects volume only
audioManager.setSFXVolume(1.0);     // 0-1

// === MUTE CONTROLS ===

audioManager.mute();         // Mute all audio
audioManager.unmute();       // Unmute all audio
audioManager.toggleMute();   // Toggle mute state

// Check if muted
const muted = audioManager.isMuted();  // Returns boolean`,
  init: async (container) => {
    const { Game, Scene, Sprite, Text, Easing, audioManager } = await import('/dist/index.mjs');

    const game = new Game({
      parent: container,
      width: 400,
      height: 300,
      backgroundColor: '#0f3460'
    });

    const scene = new Scene();

    // Load audio files
    audioManager.loadSound('sfx', 'assets/sfx.mp3');

    // Web Audio API context for generated tones
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 1.0;

    let volume = 1.0;
    let musicPlaying = false;
    let musicPaused = false;

    // Generate simple beep sounds
    const generateBeep = (frequency) => {
      // Check if muted
      if (audioManager.isMuted()) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Apply base volume
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    // Title
    const title = new Text({
      text: 'Audio System Demo',
      x: 200, y: 20,
      fontSize: 18,
      color: '#4fc3f7',
      align: 'center'
    });

    // Sound Effects Section
    const sfxTitle = new Text({
      text: 'Sound Effects',
      x: 200, y: 50,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    // SFX button (real audio file)
    const sfxBtn = new Sprite({
      x: 80, y: 75,
      width: 70, height: 35,
      color: '#e94560',
      radius: 8,
      interactive: true
    });
    const sfxLabel = new Text({
      text: 'SFX',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    sfxBtn.addChild(sfxLabel);

    // Beep button (generated tone)
    const beepBtn = new Sprite({
      x: 160, y: 75,
      width: 70, height: 35,
      color: '#2a9d8f',
      radius: 8,
      interactive: true
    });
    const beepLabel = new Text({
      text: 'Beep',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    beepBtn.addChild(beepLabel);

    // Click button (generated tone)
    const clickBtn = new Sprite({
      x: 240, y: 75,
      width: 70, height: 35,
      color: '#4fc3f7',
      radius: 8,
      interactive: true
    });
    const clickLabel = new Text({
      text: 'Click',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    clickBtn.addChild(clickLabel);

    // Ding button (generated tone)
    const dingBtn = new Sprite({
      x: 320, y: 75,
      width: 70, height: 35,
      color: '#f4a261',
      radius: 8,
      interactive: true
    });
    const dingLabel = new Text({
      text: 'Ding',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    dingBtn.addChild(dingLabel);

    // Music Controls Section
    const musicTitle = new Text({
      text: 'Background Music',
      x: 200, y: 125,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    // Play Music button
    const playMusicBtn = new Sprite({
      x: 120, y: 150,
      width: 70, height: 35,
      color: '#16213e',
      radius: 8,
      interactive: true
    });
    const playMusicLabel = new Text({
      text: 'Play',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    playMusicBtn.addChild(playMusicLabel);

    // Pause Music button
    const pauseMusicBtn = new Sprite({
      x: 200, y: 150,
      width: 70, height: 35,
      color: '#16213e',
      radius: 8,
      interactive: true
    });
    const pauseMusicLabel = new Text({
      text: 'Pause',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    pauseMusicBtn.addChild(pauseMusicLabel);

    // Stop Music button
    const stopMusicBtn = new Sprite({
      x: 280, y: 150,
      width: 70, height: 35,
      color: '#16213e',
      radius: 8,
      interactive: true
    });
    const stopMusicLabel = new Text({
      text: 'Stop',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    stopMusicBtn.addChild(stopMusicLabel);

    // Mute button
    const muteBtn = new Sprite({
      x: 200, y: 200,
      width: 100, height: 35,
      color: '#16213e',
      radius: 8,
      interactive: true
    });
    const muteLabel = new Text({
      text: 'Mute: OFF',
      fontSize: 13,
      color: '#fff',
      align: 'center',
      baseline: 'middle'
    });
    muteBtn.addChild(muteLabel);

    // Volume label
    const volumeLabel = new Text({
      text: 'Master Volume: 100%',
      x: 200, y: 240,
      fontSize: 12,
      color: '#888',
      align: 'center'
    });

    // Volume slider (visual representation)
    const sliderBg = new Sprite({
      x: 200, y: 260,
      width: 200, height: 6,
      color: '#16213e',
      radius: 3
    });

    const sliderFill = new Sprite({
      x: 100, y: 260, // Left edge
      width: 200, height: 6,
      color: '#4fc3f7',
      radius: 3,
      anchorX: 0, // Anchor to left edge
      anchorY: 0.5
    });

    const sliderHandle = new Sprite({
      x: 300, y: 260,
      width: 16, height: 16,
      color: '#fff',
      radius: 8,
      interactive: true
    });

    // Play sound feedback
    const playVisualFeedback = (button) => {
      button.tween(
        { scaleX: 1.1, scaleY: 1.1 },
        {
          duration: 100,
          easing: Easing.easeOutQuad,
          onComplete: () => {
            button.tween(
              { scaleX: 1, scaleY: 1 },
              { duration: 100 }
            );
          }
        }
      );
    };

    // SFX button (real audio file)
    sfxBtn.on('tap', () => {
      audioManager.playSound('sfx');
      playVisualFeedback(sfxBtn);
    });

    // Tone buttons (generated)
    beepBtn.on('tap', () => {
      generateBeep(440); // A4 note
      playVisualFeedback(beepBtn);
    });

    clickBtn.on('tap', () => {
      generateBeep(880); // A5 note
      playVisualFeedback(clickBtn);
    });

    dingBtn.on('tap', () => {
      generateBeep(1320); // E6 note
      playVisualFeedback(dingBtn);
    });

    // Music controls
    playMusicBtn.on('tap', () => {
      if (!musicPlaying) {
        audioManager.playMusic('assets/music.mp3', { loop: true, volume: 0.7 });
        musicPlaying = true;
        playMusicBtn.color = '#2ecc71';
      }
      playVisualFeedback(playMusicBtn);
    });

    pauseMusicBtn.on('tap', () => {
      if (musicPlaying) {
        if (musicPaused) {
          // Resume
          audioManager.resumeMusic();
          musicPaused = false;
          pauseMusicLabel.text = 'Pause';
          pauseMusicBtn.color = '#16213e';
        } else {
          // Pause
          audioManager.pauseMusic();
          musicPaused = true;
          pauseMusicLabel.text = 'Resume';
          pauseMusicBtn.color = '#f4a261';
        }
      }
      playVisualFeedback(pauseMusicBtn);
    });

    stopMusicBtn.on('tap', () => {
      audioManager.stopMusic();
      musicPlaying = false;
      musicPaused = false;
      playMusicBtn.color = '#16213e';
      pauseMusicBtn.color = '#16213e';
      pauseMusicLabel.text = 'Pause';
      playVisualFeedback(stopMusicBtn);
    });

    muteBtn.on('tap', () => {
      audioManager.toggleMute();
      const muted = audioManager.isMuted();
      muteLabel.text = muted ? 'Mute: ON' : 'Mute: OFF';
      muteBtn.color = muted ? '#e94560' : '#16213e';
    });

    // Slider interaction
    sliderHandle.on('drag', (event) => {
      const minX = 100;
      const maxX = 300;
      sliderHandle.x = Math.max(minX, Math.min(maxX, sliderHandle.x + event.delta.x));

      volume = (sliderHandle.x - minX) / (maxX - minX);

      // Update both audioManager and Web Audio gain
      audioManager.setMasterVolume(volume);
      masterGain.gain.value = volume;

      // Update fill bar width (x stays at 100, width changes)
      sliderFill.width = (sliderHandle.x - minX);

      volumeLabel.text = `Master Volume: ${Math.round(volume * 100)}%`;
    });

    const info = new Text({
      text: 'Try SFX, tones, music, and volume controls',
      x: 200, y: 283,
      fontSize: 11,
      color: '#666',
      align: 'center'
    });

    scene.add(title);
    scene.add(sfxTitle);
    scene.add(sfxBtn);
    scene.add(beepBtn);
    scene.add(clickBtn);
    scene.add(dingBtn);
    scene.add(musicTitle);
    scene.add(playMusicBtn);
    scene.add(pauseMusicBtn);
    scene.add(stopMusicBtn);
    scene.add(muteBtn);
    scene.add(volumeLabel);
    scene.add(sliderBg);
    scene.add(sliderFill);
    scene.add(sliderHandle);
    scene.add(info);

    game.setScene(scene);
    game.start();
    return game;
  }
};
