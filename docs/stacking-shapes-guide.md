---
title: "Stacking Shapes Guide"
subtitle: "Interactive physics-driven experience with draggable brand shapes and Matter.js"
description: "Complete guide to the Stacking Shapes component featuring interactive physics simulation, draggable shapes, logo integration, and sound effects for engaging user interactions."
section: "features"
order: 5
---

# Stacking Shapes Guide

## Overview

The Stacking Shapes component is an interactive physics-driven experience built with Matter.js that features draggable brand shapes, a logo sprite, sound effects, and a scoring system. It creates an engaging, playful experience perfect for 404 pages or other interactive sections of the By Default website.

## Features

- **Interactive Physics**: Draggable shapes with realistic physics simulation
- **Logo Integration**: SVG logo as a physics body with custom rendering
- **Sound System**: Collision-based audio feedback with user controls
- **Scoring System**: Progress tracking with win condition at 100%
- **Responsive Design**: Scales appropriately across different screen sizes
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance Optimized**: Pauses when tab is hidden, cleans up on unload

## File Structure

```
stacking-shapes/
├── stacking-shapes.css    - Styling for canvas, modal, and UI elements
├── stacking-shapes.js     - Main physics engine implementation
├── stacking-shapes-1.js   - Backup version 1
└── stacking-shapes-2.js   - Backup version 2
```

## Technical Stack

- **Matter.js 0.20.x** - 2D physics engine
- **pathseg polyfill** - SVG path compatibility
- **Web Audio API** - Sound generation
- **Canvas 2D** - Rendering
- **LocalStorage** - Sound preference persistence

## HTML Structure

### Required Elements

```html
<!-- Main container -->
<div id="stacking-shapes-canvas"></div>

<!-- Score HUD -->
<div class="stacking-shapes-score-bar">
  <span id="stacking-shapes-score-fill" style="width:0%"></span>
</div>
<div id="stacking-shapes-score-number">0%</div>
<button id="stacking-shapes-score-reset">Reset</button>

<!-- Sound Controls -->
<input type="checkbox" id="stacking-shapes-sound-toggle" />
<span class="stacking-shapes-voice-control">Sound : On</span>

<!-- Modal -->
<div id="stacking-shapes-media-modal" class="stacking-shapes-modal" aria-hidden="true">
  <div class="stacking-shapes-modal__dialog">
    <button id="stacking-shapes-modal-close">Close</button>
    <div id="stacking-shapes-modal-body"></div>
  </div>
</div>

<!-- SVG Paths (hidden) -->
<svg width="0" height="0" style="position:absolute;left:-9999px;">
  <path id="shape1" d="..." />
  <path id="shape2" d="..." />
  <path id="shape3" d="..." />
  <path id="shape4" d="..." />
  <path id="logo-shape" d="..." />
</svg>
```

## Shape Configuration

### Adding New Shapes

1. **Add SVG Path**: Create a new `<path>` element in the hidden SVG
2. **Update JavaScript**: Add shape to the `shapes` array in `initHeroPhysics()`

```javascript
// In initStackingShapes() function
window.heroPhysics.shapes = [
  bodyFromPath("shape1", innerWidth * 0.25, innerHeight * 0.25, "#094C45", "one", "#news"),
  bodyFromPath("shape2", innerWidth * 0.5, innerHeight * 0.3, "#F7A3BC", "two", "#founders"),
  bodyFromPath("shape3", innerWidth * 0.75, innerHeight * 0.3, "#FFB533", "three", "#work"),
  bodyFromPath("shape4", innerWidth * 0.15, innerHeight * 0.15, "#88D3CD", "four", "#about"),
  // Add your new shape here
  bodyFromPath("shape5", innerWidth * 0.6, innerHeight * 0.4, "#FF6B6B", "five", "#contact"),
];
```

### Shape Properties

```javascript
bodyFromPath(id, x, y, fill, label, link)
```

- **id**: SVG path element ID
- **x, y**: Initial position coordinates
- **fill**: Hex color code (e.g., "#094C45")
- **label**: Text displayed on the shape
- **link**: Optional URL for click actions

### Physics Properties

Shapes can be customized with different physics properties:

```javascript
{
  restitution: 0.6,        // Bounciness (0-1)
  frictionAir: 0.02,       // Air resistance
  render: { 
    fillStyle: "#094C45",  // Color
    strokeStyle: "transparent"
  }
}
```

## Logo Customization

### Changing the Logo

1. **Update SVG Path**: Modify the `#logo-shape` path element
2. **Update Image Source**: Change the logo image URL in `addLogoSprite()`

```javascript
// In addLogoSprite() function
logoImage.src = "path/to/your/logo.svg";
```

### Logo Positioning

Adjust logo offset and scaling:

```javascript
// Logo image offset adjustments
const offsetX = -3;  // Move left/right
const offsetY = -24; // Move up/down

// Original body dimensions (adjust if needed)
const originalBodyWidth = 370;  // Half of viewBox width
const originalBodyHeight = 176; // Half of viewBox height
```

### Logo Physics

The logo uses the same physics properties as other shapes but with special rendering:

```javascript
const logo = Matter.Bodies.fromVertices(
  x, y, logoVertices,
  {
    restitution: 0.6,
    frictionAir: 0.02,
    render: { 
      fillStyle: "transparent",
      strokeStyle: "transparent"
    },
    label: "logo"
  },
  true // Enable poly-decomp for concave shapes
);
```

## Sound System

### Sound Configuration

Sounds are generated using Web Audio API with configurable parameters:

```javascript
// In stackingShapesPlayPop() function
const speed = Math.min(Math.max(impact, 0), 10);
const peak = 0.01 + 0.02 * (speed / 10);  // Volume
const pitch = 100 + 10 * speed;           // Frequency
```

### Sound Triggers

- **Collision Speed**: Minimum 2.0 units for sound
- **Cooldown**: 300ms between sounds per body
- **User Interaction**: First gesture enables audio context

### Sound Controls

```html
<!-- Toggle switch -->
<input type="checkbox" id="hero-sound-toggle" />

<!-- Voice control for accessibility -->
<span class="hero-voice-control" role="button" tabindex="0">
  Sound : On
</span>
```

### Customizing Sound

To modify sound characteristics:

```javascript
// In stackingShapesPlayPop() function
osc.type = "triangle";  // Wave type: sine, square, triangle, sawtooth
gain.gain.exponentialRampToValueAtTime(peak, t + 0.01);  // Attack
gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); // Decay
```

## Scoring System

### How Scoring Works

- **Collision-based**: Only shape-to-shape collisions score
- **Speed threshold**: Minimum 2.2 units relative velocity
- **Cooldown**: 600ms per collision pair
- **Interaction window**: 4 seconds after user interaction
- **Win condition**: 100% score triggers victory modal

### Score Configuration

```javascript
// In initScoreSystem() function
const MIN_SPEED_FOR_SCORE = 2.2;    // Minimum collision speed
const SCORE_COOLDOWN_MS = 600;      // Time between scores
const inc = Math.min(2, 0.2 + speed * 0.2); // Score increment
```

### Score Display

```html
<div class="hero-score-bar">
  <span id="hero-score-fill" style="width:0%"></span>
</div>
<div id="hero-score-number">0%</div>
<button id="hero-score-reset">Reset</button>
```

## Responsive Design

### Scaling System

The hero uses a responsive scaling system based on a 1280×800 base:

```javascript
const BASE_W = 1280, BASE_H = 800;

function getResponsiveScale() {
  const s = Math.min(innerWidth / BASE_W, innerHeight / BASE_H);
  return Math.max(0.45, Math.min(1.2, s)); // Min 45%, Max 120%
}
```

### Responsive Behavior

- **Shapes scale uniformly** with screen size
- **Walls rebuild** on resize
- **Shapes reposition** within safe margins
- **Logo scales** proportionally

### Mobile Considerations

- **Touch support**: Drag shapes with touch
- **Scroll prevention**: `touch-action: pan-y` allows vertical scroll
- **Performance**: Pauses when tab hidden

## Styling and Theming

### CSS Custom Properties

The hero uses CSS custom properties for theming:

```css
:root {
  --_semantic---background--background-primary: #f5f6f8;
  --_semantic---background--background-secondary: #ffffff;
  --_semantic---text--text-primary: #000000;
  --_semantic---border--border-faded: #e0e0e0;
}
```

### Canvas Styling

```css
#stacking-shapes-canvas {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#stacking-shapes-canvas canvas {
  display: block;
  border: none;
  outline: none;
  touch-action: pan-y;
}
```

### Modal Styling

```css
.stacking-shapes-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

body.stacking-shapes-modal-open {
  overflow: hidden;
}
```

## Performance Optimization

### Lifecycle Management

- **Initialization**: Only runs once, guards against double-init
- **Pause/Resume**: Stops when tab hidden, resumes when visible
- **Cleanup**: Properly destroys engine on page unload

### Memory Management

```javascript
// Cleanup function
function cleanupStackingShapes() {
  if (window.stackingShapes.engine) {
    Matter.Runner.stop(window.stackingShapes.runner);
    Matter.Render.stop(window.stackingShapes.render);
    Matter.Engine.clear(window.stackingShapes.engine);
    // Reset all references
  }
}
```

### Performance Settings

```javascript
// Fixed timestep for consistent physics
window.stackingShapes.runner = Runner.create({ 
  isFixed: true, 
  delta: 1000/60  // 60 FPS
});
```

## Accessibility Features

### Keyboard Navigation

- **Voice control**: Space/Enter to toggle sound
- **Modal escape**: Escape key closes modals
- **Focus management**: Proper focus handling

### Screen Reader Support

```html
<!-- Score announcements -->
<div class="stacking-shapes-score-bar" aria-live="polite">
  <span id="stacking-shapes-score-fill"></span>
</div>

<!-- Modal accessibility -->
<div id="stacking-shapes-media-modal" aria-hidden="true">
  <button id="stacking-shapes-modal-close" aria-label="Close">Close</button>
</div>
```

### ARIA Attributes

```html
<!-- Voice control button -->
<span class="stacking-shapes-voice-control" 
      role="button" 
      tabindex="0" 
      aria-pressed="true">
  Sound : On
</span>
```

## Troubleshooting

### Common Issues

**Shapes not appearing:**
- Check SVG paths exist with correct IDs
- Verify Matter.js library loaded
- Check browser console for errors

**Sound not working:**
- Ensure user has interacted with page
- Check sound toggle state
- Verify Web Audio API support

**Performance issues:**
- Check if tab is hidden (physics pause)
- Monitor memory usage
- Verify cleanup on navigation

**Responsive problems:**
- Check viewport meta tag
- Verify canvas resize handling
- Test on different screen sizes

### Debug Mode

Enable debug logging:

```javascript
// Add to initStackingShapes()
console.log('Stacking Shapes Debug Mode');
console.log('Shapes:', window.stackingShapes.shapes);
console.log('Engine:', window.stackingShapes.engine);
```

## Customization Examples

### Adding a New Shape Type

```javascript
// Create custom shape with special properties
function createCustomShape(id, x, y, color, label) {
  const path = document.getElementById(id);
  const verts = Matter.Svg.pathToVertices(path, 25);
  
  return Matter.Bodies.fromVertices(x, y, verts, {
    restitution: 0.8,        // More bouncy
    frictionAir: 0.01,       // Less air resistance
    density: 0.001,          // Lighter
    render: { 
      fillStyle: color,
      strokeStyle: "#000",
      lineWidth: 2
    },
    label: label
  }, true);
}
```

### Custom Sound Effects

```javascript
// Add custom sound function
function playCustomSound(type) {
  if (!window.heroPhysics.soundEnabled || !window.heroPhysics.audioCtx) return;
  
  const t = window.heroPhysics.audioCtx.currentTime;
  const osc = window.heroPhysics.audioCtx.createOscillator();
  const gain = window.heroPhysics.audioCtx.createGain();
  
  // Custom sound parameters
  const sounds = {
    'pop': { freq: 200, duration: 0.1 },
    'ding': { freq: 400, duration: 0.2 },
    'whoosh': { freq: 100, duration: 0.3 }
  };
  
  const sound = sounds[type] || sounds['pop'];
  osc.frequency.setValueAtTime(sound.freq, t);
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + sound.duration);
  
  osc.connect(gain).connect(window.heroPhysics.audioCtx.destination);
  osc.start(t);
  osc.stop(t + sound.duration);
}
```

### Custom Scoring Rules

```javascript
// Modify scoring system
function customScoreCalculation(bodyA, bodyB, speed) {
  // Different scoring based on shape types
  const scoreMultiplier = {
    'logo': 2.0,    // Logo collisions worth double
    'shape1': 1.5,  // Shape1 worth 1.5x
    'shape2': 1.0,  // Shape2 normal
    'shape3': 0.5   // Shape3 worth half
  };
  
  const multiplier = (scoreMultiplier[bodyA.label] || 1) * 
                    (scoreMultiplier[bodyB.label] || 1);
  
  return Math.min(5, speed * 0.3 * multiplier);
}
```

## Integration with Webflow

### Webflow-Specific Considerations

- **Modal content**: Webflow handles modal content management
- **Responsive breakpoints**: Align with Webflow's responsive system
- **Asset management**: Use Webflow's asset URLs for images
- **Custom code**: Place in Webflow's custom code sections

### Deployment Checklist

- [ ] Matter.js and pathseg libraries loaded
- [ ] All required HTML elements present
- [ ] SVG paths properly defined
- [ ] CSS custom properties set
- [ ] Sound toggle functional
- [ ] Modal system working
- [ ] Responsive scaling tested
- [ ] Accessibility features verified

---

*This documentation covers the complete hero section implementation. For technical details, refer to the source code in the `hero/` directory.*
