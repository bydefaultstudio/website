# 🎵 Audio System Guide

A lightweight, accessible audio system for ByDefault Studio websites that provides sound feedback for user interactions while respecting accessibility preferences.

## 🚀 Quick Start

### Basic Usage

Add the `data-bd-audio` attribute to any interactive element:

```html
<!-- Click sound only -->
<button data-bd-audio="click">Click me</button>

<!-- Hover sound only -->
<a data-bd-audio="hover">Hover me</a>

<!-- Both click and hover -->
<button data-bd-audio="click,hover">Interactive Button</button>

<!-- Success feedback -->
<div data-bd-audio="success">Success Message</div>

<!-- Error feedback -->
<div data-bd-audio="error">Error Message</div>
```

### How It Works

1. **First click enables audio** - System starts disabled, enabling on first user interaction
2. **Built-in sounds** - Uses dedicated audio files hosted on GitHub
3. **Sound toggle button** - Users can toggle audio on/off with `#bd-sound` button
4. **Accessibility compliant** - Respects `prefers-reduced-motion` setting
5. **Persistent settings** - Remembers user preference

## 📋 Available Values

| Value | Description | Example |
|-------|-------------|---------|
| `click` | Plays sound on click/tap | `data-bd-audio="click"` |
| `hover` | Plays sound on mouse hover | `data-bd-audio="hover"` |
| `success` | Plays success feedback sound | `data-bd-audio="success"` |
| `error` | Plays error feedback sound | `data-bd-audio="error"` |
| `bump` | Plays bump/impact sound | `data-bd-audio="bump"` |
| `click,hover` | Plays sounds on both interactions | `data-bd-audio="click,hover"` |

## 🎛️ Configuration

### JavaScript API

```javascript
// Get the audio system instance
const audio = window.bdAudio;

// Play a sound programmatically
audio.playSound('click');

// Toggle audio on/off (also handles #bd-sound button)
audio.toggleSound();

// Control settings
audio.setEnabled(false);

// Get current settings
const settings = audio.getSettings();
```

### Default Sounds

The system includes these built-in sounds hosted on GitHub:

- `click` - General click/tap sound
- `hover` - Mouse hover sound
- `success` - Success feedback sound
- `error` - Error feedback sound
- `bump` - Bump/impact sound effect

All sounds are hosted via jsDelivr CDN for optimal performance.

## ♿ Accessibility Features

### Automatic Compliance

The audio system automatically respects:

- **Reduced Motion Preference**: Disables audio when `prefers-reduced-motion: reduce`
- **User Preferences**: Persistent enable/disable settings
- **Error Handling**: Graceful fallbacks when audio fails
- **First-click activation**: Audio only enables after user interaction

### Best Practices

```html
<!-- Good: Clear, purposeful audio -->
<button data-bd-audio="click">Submit Form</button>

<!-- Good: Multiple interaction types -->
<button data-bd-audio="click,hover">Interactive Button</button>

<!-- Avoid: Overuse -->
<div data-bd-audio="hover">Every element with sound</div>
```

## 🔧 Integration

### Webflow Setup

1. Add the audio system to your footer:

```html
<!-- Audio System -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/audio.js"></script>
```

2. Add a sound toggle button with ID `bd-sound`:

```html
<!-- Sound Toggle Button -->
<button id="bd-sound" title="Turn sound on/off">🔇</button>
```

3. Add `data-bd-audio` attributes to your elements in Webflow

4. The system uses built-in sounds hosted on GitHub, no additional files needed

### Sound Toggle Button

The `#bd-sound` button provides users with control over audio:

- **Initial State**: Shows 🔇 (muted) when page loads
- **Auto-Update**: Button icon changes to 🔊 when audio is enabled
- **Visual Feedback**: Button appearance updates based on audio state
- **Accessibility**: Includes proper ARIA labels and tooltips
- **Persistent**: User preference is remembered across sessions

**Styling the toggle button:**
```css
#bd-sound {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

#bd-sound:hover {
  background-color: rgba(0,0,0,0.1);
}

#bd-sound.bd-sound-on {
  color: #4CAF50; /* Green when sound is on */
}

#bd-sound.bd-sound-off {
  color: #757575; /* Gray when sound is off */
}
```

## 🎯 Use Cases

### Navigation

```html
<nav>
  <a data-bd-audio="hover" href="/">Home</a>
  <a data-bd-audio="hover" href="/about">About</a>
  <a data-bd-audio="hover" href="/contact">Contact</a>
</nav>
```

### Forms

```html
<form>
  <input type="text" placeholder="Name">
  <button data-bd-audio="click" type="submit">Submit</button>
</form>
```

### Interactive Elements

```html
<div class="card" data-bd-audio="hover">
  <h3>Card Title</h3>
  <button data-bd-audio="click">Action</button>
</div>
```

### Feedback Messages

```html
<!-- Success notifications -->
<div class="alert success" data-bd-audio="success">
  Form submitted successfully!
</div>

<!-- Error notifications -->
<div class="alert error" data-bd-audio="error">
  Please check your input and try again.
</div>
```

## 🔍 Troubleshooting

### Common Issues

**Audio not playing:**
- Check browser console for errors
- Ensure user has clicked once to enable audio
- Verify `prefers-reduced-motion` is not set to `reduce`

**First click doesn't work:**
- This is expected - first click enables the system
- Subsequent clicks will play audio

## 📱 Browser Support

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ⚠️ iOS Safari (requires user interaction)

---

**Remember**: Audio should enhance the user experience, not overwhelm it. Use sounds purposefully and respect user preferences.
