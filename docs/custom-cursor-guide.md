---
title: "Custom Cursor System"
subtitle: "Advanced cursor interactions for desktop users with progressive enhancement"
description: "Documentation for the custom cursor system including desktop detection, fallbacks, and interaction states."
section: "features"
order: 1
---

# Custom Cursor System

The ByDefault website features a sophisticated custom cursor system that enhances user interaction on desktop devices.

## Overview

The custom cursor system provides:

* **Desktop-only activation** - Only activates on screens 991px and wider
* **Progressive enhancement** - Gracefully falls back to default cursor
* **Smooth animations** - Fluid transitions between cursor states
* **Performance optimized** - Minimal impact on page load times

## Implementation

The cursor system is implemented using JavaScript and CSS:

```javascript title="cursor.js"
// Desktop detection
const isDesktop = window.innerWidth >= 991;

if (isDesktop) {
  // Initialize custom cursor
  initCustomCursor();
}
```

```css title="cursor.css"
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease-out;
}
```

## Features

### Cursor States

The cursor system includes several interactive states:

1. **Default** - Standard cursor appearance
2. **Hover** - Expanded cursor on interactive elements
3. **Click** - Compressed cursor during click events
4. **Loading** - Spinning animation for async operations

### Interactive Elements

The cursor responds to various element types:

* **Links** - Slight expansion on hover
* **Buttons** - Color change and size increase
* **Images** - Zoom indicator overlay
* **Forms** - Focus state indication

> **Note:** The cursor system respects user preferences and will disable if the user has reduced motion enabled in their system settings.

## Browser Support

The custom cursor system works in all modern browsers:

* Chrome 60+
* Firefox 55+
* Safari 12+
* Edge 79+

## Performance Considerations

* **Hardware acceleration** - Uses `transform` for smooth animations
* **Event delegation** - Efficient event handling
* **Memory management** - Proper cleanup on page unload
* **Throttling** - Mouse move events are throttled for performance