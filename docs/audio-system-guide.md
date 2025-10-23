---
title: "Audio System"
subtitle: "Sound feedback system for enhanced user interactions"
description: "Documentation for the audio system including sound effects, volume controls, and accessibility features."
section: "features"
order: 2
---
# Audio System

The ByDefault website includes a comprehensive audio system that provides sound feedback for user interactions.

## Overview

The audio system enhances user experience through:

- **Interactive feedback** - Sound effects for clicks, hovers, and transitions
- **Volume controls** - User-configurable audio levels
- **Accessibility** - Respects system audio preferences
- **Performance** - Optimized audio loading and playback

## Audio Files

The system includes several pre-loaded audio files:

- `bump.mp3` - Click feedback sound
- `hover.mp3` - Hover state sound
- `success.mp3` - Success action confirmation
- `error.mp3` - Error state notification
- `click.mp3` - Button click sound

## Implementation

### Audio Manager

The audio system is managed through a centralized audio manager:

```javascript title="audio.js"
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.volume = 0.5;
    this.enabled = true;
  }

  async init() {
    // Initialize audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load audio files
    await this.loadSounds();
  }

  play(soundName) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume = this.volume;
      sound.currentTime = 0;
      sound.play();
    }
  }
}
```

### Usage Examples

```javascript
// Initialize audio system
const audioManager = new AudioManager();
await audioManager.init();

// Play sound effects
button.addEventListener('click', () => {
  audioManager.play('click');
});

link.addEventListener('mouseenter', () => {
  audioManager.play('hover');
});
```

## Configuration

### Volume Control

Users can adjust audio volume through the settings panel:

```javascript
// Set volume (0.0 to 1.0)
audioManager.setVolume(0.7);

// Mute/unmute
audioManager.setEnabled(false);
```

### Audio Preferences

The system respects user preferences:

- **System volume** - Inherits from OS settings
- **Reduced motion** - Disables audio if user prefers reduced motion
- **Browser autoplay** - Handles autoplay restrictions gracefully

## Accessibility

The audio system includes several accessibility features:

- **Visual indicators** - Visual feedback when audio is disabled
- **Keyboard controls** - Volume adjustment via keyboard
- **Screen reader support** - Proper ARIA labels for audio controls
- **Focus management** - Audio controls are keyboard accessible

> **Important:** The audio system will not play sounds until the user has interacted with the page, respecting browser autoplay policies.

## Browser Support

Audio system compatibility:

- **Chrome** - Full support with Web Audio API
- **Firefox** - Full support with Web Audio API  
- **Safari** - Full support with Web Audio API
- **Edge** - Full support with Web Audio API

## Performance

- **Preloading** - Audio files are preloaded for instant playback
- **Compression** - Audio files are optimized for web delivery
- **Memory management** - Proper cleanup and garbage collection
- **Lazy loading** - Audio context is created only when needed

---

## Troubleshooting

### Common Issues

- **Audio not playing** - Check browser autoplay policies
- **Volume too low** - Verify system volume settings
- **Performance issues** - Check for memory leaks in audio context

### Debug Mode

Enable debug mode to see audio system logs:

```javascript
// Enable debug logging
window.audioDebug = true;
```

---

## API Reference

### AudioManager Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `init()` | None | Initialize audio context and load sounds |
| `play(soundName)` | `soundName: string` | Play a specific sound effect |
| `setVolume(volume)` | `volume: number` | Set volume (0.0 to 1.0) |
| `setEnabled(enabled)` | `enabled: boolean` | Enable/disable audio system |