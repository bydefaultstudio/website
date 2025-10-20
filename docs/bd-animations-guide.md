---
title: "BD Animations Guide"
subtitle: "ByDefault Studio Animation System v4.0 with GSAP and ScrollTrigger"
description: "Comprehensive guide to using the ByDefault animations library built with GSAP and ScrollTrigger for creating engaging, performant animations across the website."
section: "features"
order: 6
---

# BD Animations Guide

**Version 4.0** - ByDefault Studio Animation System

A comprehensive guide to using the ByDefault animations library built with GSAP and ScrollTrigger.

## 🚀 Quick Start

### Basic Usage

Add the `data-bd-animate` attribute to any element you want to animate:

```html
<!-- Simple fade in animation (default) -->
<h1 data-bd-animate>Welcome to ByDefault</h1>

<!-- Slide up animation -->
<p data-bd-animate="slide-up">This text slides up from below</p>

<!-- Scale in animation -->
<div data-bd-animate="scale-in">This element scales in</div>
```

### Legacy Support

The system also supports legacy `data-text-animate` attributes:

```html
<!-- Legacy syntax (automatically converted to data-bd-animate="fade") -->
<h2 data-text-animate="element">Legacy Animation</h2>
```

---

## 📋 Available Animations

### All Animations

| Animation | Attribute Value | Description |
|-----------|----------------|-------------|
| **Fade** | `fade` or empty | Default fade in animation |
| **Slide** | `slide` | Fade + slide up from below |
| **Slide Up** | `slide-up` | Slide up from below |
| **Slide Down** | `slide-down` | Slide down from above |
| **Slide Left** | `slide-left` | Slide in from left |
| **Slide Right** | `slide-right` | Slide in from right |
| **Scale In** | `scale-in` | Scale from 80% to 100% |
| **Rotate In** | `rotate-in` | Rotate in from -15° to 0° |
| **Expand Spacing** | `expand-spacing` | Expand letter spacing |
| **Skew** | `skew` | Skew animation |
| **Flip** | `flip` | 3D flip effect |
| **Fade In/Out** | `fade-in-out` | Smooth fade transition |
| **Blur In** | `blur-in` | Blur to clear effect |
| **Bounce In** | `bounce-in` | Bouncy entrance |
| **Shake** | `shake` | Shake effect |
| **Flash** | `flash` | Continuous flashing |
| **Neon** | `neon` | Neon glow effect |
| **Tilt** | `tilt` | 3D perspective tilt |
| **In View** | `in-view` | Animate when element enters viewport |
| **Delay** | `data-bd-delay` | Animation delay in seconds (e.g., "0.5") |
| **Scrub** | `data-bd-scrub` | Scroll-tied animation speed ("true" or "0.1-5.0") |
| **From Y** | `data-bd-from-y` | Starting Y position offset (e.g., "50", "-30") |
| **From X** | `data-bd-from-x` | Starting X position offset (e.g., "100", "-50") |
| **From Scale** | `data-bd-from-scale` | Starting scale size (e.g., "0.8", "1.2") |

### Text-Specific Animations

| Animation | Attribute Value | Description |
|-----------|----------------|-------------|
| **Characters** | `data-text-animate="chars"` | Animate each character |
| **Words** | `data-text-animate="words"` | Animate each word |
| **Lines** | `data-text-animate="lines"` | Animate each line |
| **Rich Text** | `data-text-animate="rich-text"` | Animate rich text elements |
| **List Items** | `data-text-animate="list"` | Animate list items |

---

## ⚙️ Configuration Options

### Scroll Behavior

#### Scrub Animation
Make animations tied to scroll position:

```html
<!-- Smooth scroll-tied animation -->
<div data-bd-animate="slide-up" data-bd-scrub="true">
  Scrolls smoothly with page
</div>

<!-- Custom scrub speed (0.1 = slow, 2 = fast) -->
<div data-bd-animate="slide-up" data-bd-scrub="0.5">
  Medium speed scroll animation
</div>

<!-- No scrub (default) - fires once when element enters viewport -->
<div data-bd-animate="slide-up">
  Fires once when visible
</div>
```

#### Delay
Add delays to animations:

```html
<!-- Delay animation by 0.5 seconds -->
<h1 data-bd-animate="fade" data-bd-delay="0.5">Delayed Animation</h1>

<!-- Delay by 1.2 seconds -->
<p data-bd-animate="slide-up" data-bd-delay="1.2">Longer Delay</p>
```

### Viewport Positioning

#### Custom Starting Position
For `in-view` animations, customize the starting position using multiple positioning attributes:

```html
<!-- Start from 50px below -->
<div data-bd-animate="in-view" data-bd-from-y="50">
  Starts 50px below current position
</div>

<!-- Start from left and scaled down -->
<div data-bd-animate="in-view" data-bd-from-x="-100" data-bd-from-scale="0.8">
  Starts from left, scaled down
</div>

<!-- Complex starting position -->
<div data-bd-animate="in-view" data-bd-from-y="80" data-bd-from-x="30" data-bd-from-scale="0.6">
  Starts 80px below, 30px right, at 60% scale
</div>
```

#### Available Position Attributes

| Attribute | Description | Example Values |
|-----------|-------------|----------------|
| `data-bd-from-y` | Vertical offset from current position | `"50"` (down), `"-30"` (up) |
| `data-bd-from-x` | Horizontal offset from current position | `"100"` (right), `"-50"` (left) |
| `data-bd-from-scale` | Starting scale (1.0 = normal size) | `"0.8"` (80%), `"1.2"` (120%) |

**Note**: These attributes only work with `data-bd-animate="in-view"` animations.

---

## 🔗 Attribute Combinations & Compatibility

### What Works Together

#### ✅ Compatible Combinations

**All Animations Support:**
```html
<!-- Delay + Scrub (any animation type) -->
<div data-bd-animate="slide-up" data-bd-delay="0.5" data-bd-scrub="1">
  Delayed scroll animation
</div>

<!-- Delay + Any animation type -->
<h1 data-bd-animate="scale-in" data-bd-delay="0.3">Delayed scale animation</h1>
```

**In-View Animations Support:**
```html
<!-- Position + Delay (in-view only) -->
<div data-bd-animate="in-view" data-bd-from-y="50" data-bd-delay="0.8">
  Starts below, with delay
</div>

<!-- Multiple position attributes (in-view only) -->
<div data-bd-animate="in-view" data-bd-from-y="30" data-bd-from-x="-20" data-bd-from-scale="0.9">
  Complex starting position
</div>
```

**Text Animations Support:**
```html
<!-- Text animation + Delay + Scrub -->
<h1 data-text-animate="chars" data-bd-delay="0.5" data-bd-scrub="2">
  Delayed character animation with scroll
</h1>
```

#### ❌ Incompatible Combinations

**Position Attributes Only Work With In-View:**
```html
<!-- ❌ This won't work - position attributes ignored -->
<div data-bd-animate="slide-up" data-bd-from-y="50">
  Position attributes ignored for slide-up
</div>

<!-- ✅ This works - use in-view instead -->
<div data-bd-animate="in-view" data-bd-from-y="50">
  Position attributes work with in-view
</div>
```

### Complete Compatibility Matrix

| Animation Type | `data-bd-delay` | `data-bd-scrub` | `data-bd-from-*` |
|----------------|-----------------|-----------------|------------------|
| **Core animations** (fade, slide, etc.) | ✅ | ✅ | ❌ |
| **Advanced animations** (scale-in, rotate-in, etc.) | ✅ | ✅ | ❌ |
| **Text animations** (chars, words, lines) | ✅ | ✅ | ❌ |
| **In-view animations** | ✅ | ❌* | ✅ |
| **Special effects** (flash, neon, shake) | ✅ | ✅ | ❌ |

*In-view animations don't use scrub because they trigger based on viewport entry, not scroll position.

### Practical Examples

#### Hero Section with Multiple Elements
```html
<section class="hero">
  <!-- Main title with delay -->
  <h1 data-bd-animate="slide-up" data-bd-delay="0.3">Welcome</h1>
  
  <!-- Subtitle with character animation and delay -->
  <p data-text-animate="chars" data-bd-delay="0.8">Animated Characters</p>
  
  <!-- Button with bounce and longer delay -->
  <button data-bd-animate="bounce-in" data-bd-delay="1.2">Get Started</button>
</section>
```

#### Scroll-Tied Content Section
```html
<section>
  <!-- Image that scales with scroll -->
  <img data-bd-animate="scale-in" data-bd-scrub="1" src="image.jpg" alt="Hero">
  
  <!-- Text that fades with scroll -->
  <p data-bd-animate="fade" data-bd-scrub="1.5">Scroll-tied content</p>
  
  <!-- Words that animate with scroll -->
  <h2 data-text-animate="words" data-bd-scrub="2">Scroll Animation</h2>
</section>
```

#### Viewport Entry Animations
```html
<section>
  <!-- Card that enters from below with delay -->
  <div class="card" data-bd-animate="in-view" data-bd-from-y="100" data-bd-delay="0.5">
    <h3>Card Title</h3>
    <p>Card content</p>
  </div>
  
  <!-- Another card entering from left -->
  <div class="card" data-bd-animate="in-view" data-bd-from-x="-150" data-bd-delay="0.8">
    <h3>Another Card</h3>
    <p>More content</p>
  </div>
</section>
```

#### Mixed Animation Types
```html
<div class="content-grid">
  <!-- Each element has different animation + timing -->
  <div data-bd-animate="slide-up" data-bd-delay="0.1">Item 1</div>
  <div data-bd-animate="scale-in" data-bd-delay="0.3">Item 2</div>
  <div data-text-animate="words" data-bd-delay="0.5">Item 3</div>
  <div data-bd-animate="rotate-in" data-bd-delay="0.7">Item 4</div>
</div>
```

### Best Practices

1. **Use delays sparingly** - Too many delayed animations can feel sluggish
2. **Combine scrub with caution** - Multiple scrub animations can impact performance
3. **In-view for precise control** - Use when you need custom starting positions
4. **Test on mobile** - Some combinations may behave differently on smaller screens
5. **Consider reduced motion** - All animations respect user accessibility preferences

---

## 📱 Responsive Behavior

### Automatic Responsiveness

The animation system automatically adjusts trigger points based on screen size:

- **Desktop**: Triggers at `top 85%` → `bottom 75%`
- **Mobile**: Triggers at `top 100%` → `top 60%`

### Reduced Motion Support

The system respects user preferences for reduced motion:

```css
/* Automatically applied when user has prefers-reduced-motion: reduce */
/* Elements simply appear without animation */
```

---

## 🎯 Advanced Examples

### Character Animation

```html
<!-- Animate each character with stagger -->
<h1 data-text-animate="chars">Animated Characters</h1>

<!-- With custom scrub -->
<h1 data-text-animate="chars" data-bd-scrub="1">Smooth Character Animation</h1>
```

### Word Animation

```html
<!-- Animate each word -->
<h2 data-text-animate="words">Each Word Animates</h2>

<!-- With delay -->
<h2 data-text-animate="words" data-bd-delay="0.3">Delayed Word Animation</h2>
```

### Rich Text Animation

```html
<!-- Animate all rich text elements -->
<div data-text-animate="rich-text">
  <h1>This heading animates</h1>
  <p>This paragraph animates</p>
  <ul>
    <li>Each list item animates</li>
    <li>With staggered timing</li>
  </ul>
</div>
```

### Complex Animation Combinations

```html
<!-- Multiple animations on different elements -->
<section>
  <h1 data-bd-animate="slide-up" data-bd-delay="0.2">Main Title</h1>
  <p data-text-animate="words" data-bd-delay="0.5">Animated paragraph</p>
  <div data-bd-animate="scale-in" data-bd-delay="0.8">
    <img src="image.jpg" alt="Scaled image">
  </div>
</section>
```

### Scroll-Tied Hero Section

```html
<!-- Hero section with scroll-tied animations -->
<section class="hero">
  <h1 data-bd-animate="slide-up" data-bd-scrub="1">Hero Title</h1>
  <p data-text-animate="chars" data-bd-scrub="1.5">Hero subtitle</p>
  <button data-bd-animate="bounce-in" data-bd-delay="1">Call to Action</button>
</section>
```

---

## 🔧 Technical Details

### Dependencies

- **GSAP**: Core animation library
- **ScrollTrigger**: Scroll-based animation triggers
- **SplitText**: Text splitting for character/word animations

### Performance

- **Debounced Resize**: 150ms debounce for resize events
- **Smart Rebuilding**: Only rebuilds SplitText on resize
- **Memory Management**: Automatically reverts SplitText instances
- **Reduced Motion**: Respects accessibility preferences

### Browser Support

- Modern browsers with ES6+ support
- Automatic fallback for reduced motion preferences
- Optimized for mobile performance

---

## 🐛 Troubleshooting

### Common Issues

#### Animation Not Working
1. Check that GSAP and ScrollTrigger are loaded
2. Verify the `data-bd-animate` attribute is correct
3. Ensure the element is in the DOM when animations initialize

#### Duplicate Animations
The system prevents duplicate bindings with `data-bd-bound` attributes.

#### Performance Issues
- Use `data-bd-scrub` sparingly for complex animations
- Avoid too many SplitText animations on one page
- Test on mobile devices for performance

### Debug Mode

Check browser console for animation initialization messages:
```
ByDefault Animations v4.0 - Canonical data-bd-* namespace
Fonts loaded successfully
```

---

## 📚 Migration Guide

### From Legacy System

If you're upgrading from an older version:

1. **Replace** `data-text-animate="element"` with `data-bd-animate="fade"`
2. **Keep** existing `data-text-animate` values for text animations
3. **Add** `data-bd-scrub` for scroll-tied animations
4. **Update** any custom CSS that conflicts with new animations

### Breaking Changes

- `data-text-animate="element"` now requires `data-bd-animate="fade"`
- Some animation timing has been optimized
- ScrollTrigger refresh behavior improved

---

## 🎨 Customization

### Extending Animations

To add custom animations, extend the animation functions:

```javascript
// Add to bd-animations.js
function customAnimation() {
  gsap.utils.toArray("[data-bd-animate='custom']").forEach((element) => {
    if (element.dataset.bdBound) return;
    
    gsap.set(element, { opacity: 0, customProperty: 0 });
    
    gsap.to(element, {
      opacity: 1,
      customProperty: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "bottom 75%"
      }
    });
    
    element.dataset.bdBound = "1";
  });
}

// Add to textAnimations() function
customAnimation();
```

---

## 📞 Support

For questions or issues:

1. Check this documentation first
2. Review browser console for errors
3. Test with reduced motion disabled
4. Verify GSAP dependencies are loaded

---

**ByDefault Studio** - Creating beautiful, accessible animations for modern web experiences.
