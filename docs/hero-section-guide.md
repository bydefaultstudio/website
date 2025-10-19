# Hero Section Guide

## Overview
The hero section is the main landing area of the homepage, designed to create an impactful first impression and guide users to take action.

## File Structure
```
hero/
├── hero.js          # Main JavaScript functionality
├── hero.css         # Styling and responsive design
└── README.md        # This documentation
```

## HTML Structure
```html
<section id="hero-container">
  <div class="hero-content">
    <h1 class="hero-title">Your Main Headline</h1>
    <p class="hero-subtitle">Your compelling subtitle that explains the value proposition</p>
    <a href="#" class="hero-cta">Call to Action</a>
  </div>
</section>
```

## JavaScript API

### Initialization
The hero section automatically initializes when the DOM is ready:
```javascript
// Manual initialization (if needed)
initHero();
```

### Global Object
All hero functionality is available through `window.hero`:
```javascript
window.hero.isInitialized  // Boolean: whether hero is initialized
```

### Cleanup
```javascript
// Manual cleanup
cleanupHero();
```

## CSS Classes

### Container
- `#hero-container` - Main hero container (full viewport height)
- `.hero-content` - Content wrapper with centering

### Content
- `.hero-title` - Main headline (responsive typography)
- `.hero-subtitle` - Supporting text
- `.hero-cta` - Call-to-action button

## Customization

### Typography
The hero uses responsive typography that scales with viewport size:
- Title: `clamp(2.5rem, 8vw, 6rem)`
- Subtitle: `clamp(1.125rem, 3vw, 1.5rem)`

### Colors
- Background: `#f5f6f8`
- Title: `#111`
- Subtitle: `#666`
- CTA Background: `#111`
- CTA Text: `#fff`

### Responsive Breakpoints
- Mobile: `max-width: 768px`
- Tablet: `768px - 1024px`
- Desktop: `1024px+`

## Integration

### Webflow Setup
1. Add the hero container element with ID `hero-container`
2. Include the CSS file in your project
3. Include the JavaScript file in your project
4. The hero will automatically initialize

### CDN Integration
```html
<link rel="stylesheet" href="https://your-cdn.com/hero/hero.css">
<script src="https://your-cdn.com/hero/hero.js"></script>
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Performance
- Lightweight JavaScript (minimal dependencies)
- CSS-only animations where possible
- Optimized for fast loading and smooth interactions
