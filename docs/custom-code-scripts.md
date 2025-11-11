---
title: "Custom Code Scripts"
subtitle: "Production and local development code snippets for Webflow"
description: "Complete guide with all Webflow custom code snippets for both production (CDN) and local development (localhost) URLs."
section: "deployment"
order: 1
---

# Custom Code Scripts

Complete guide to all custom code snippets for Webflow. Includes both production (CDN) and local development (localhost) URLs.

## Overview

This guide contains only the custom script and CSS links that change with version updates. Simply copy the code blocks and paste them into the appropriate sections in Webflow's Custom Code settings.

> **For local development:** Ensure Live Server is running in VS Code on port 5500 before using localhost URLs.

---

## Global

### Header

**Production:**
```html
<!-- Custom Cursor CSS -->
<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/css/cursor.css" rel="stylesheet">
```

**Local:**
```html
<!-- Custom Cursor CSS -->
<link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet">
```

### Footer

**Production:**
```html
<!-- Global Scripts -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/script.js"></script>

<!-- BD Animation -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/bd-animations.js"></script>

<!-- Custom Cursor JS -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/cursor.js"></script>

<!-- Audio System -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/audio.js"></script>
```

**Local:**
```html
<!-- Global Scripts -->
<script src="http://127.0.0.1:5500/js/script.js"></script>

<!-- BD Animation -->
<script src="http://127.0.0.1:5500/js/bd-animations.js"></script>

<!-- Custom Cursor JS -->
<script src="http://127.0.0.1:5500/js/cursor.js"></script>

<!-- Audio System -->
<script src="http://127.0.0.1:5500/js/audio.js"></script>
```

---

## Homepage

### Header

**Production:**
```html
<!-- Hero Section CSS -->
<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/css/hero.css" rel="stylesheet">
```

**Local:**
```html
<!-- Hero Section CSS -->
<link href="http://127.0.0.1:5500/css/hero.css" rel="stylesheet">
```

### Footer

**Production:**
```html
<!-- Splide -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.5.3/dist/js/splide-extension-auto-scroll.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-intersection@0.2.0/dist/js/splide-extension-intersection.min.js"></script>

<!-- Hero Section JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/hero.js"></script>

<!-- Homepage Scripts -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/homepage.js"></script>
```

**Local:**
```html
<!-- Splide -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.5.3/dist/js/splide-extension-auto-scroll.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-intersection@0.2.0/dist/js/splide-extension-intersection.min.js"></script>

<!-- Hero Section JavaScript -->
<script src="http://127.0.0.1:5500/js/hero.js"></script>

<!-- Homepage Scripts -->
<script src="http://127.0.0.1:5500/js/homepage.js"></script>
```

---

## Blog Pages

### Blog Post Footer

**Production:**
```html
<!-- Blog Template Scripts -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/blog-template.js"></script>
```

**Local:**
```html
<!-- Blog Template Scripts -->
<script src="http://127.0.0.1:5500/js/blog-template.js"></script>
```

### Blog Feed Footer

**Production:**
```html
<!-- Blog Feed Scripts (for blog listing pages) -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/blog-feed.js"></script>
```

**Local:**
```html
<!-- Blog Feed Scripts (for blog listing pages) -->
<script src="http://127.0.0.1:5500/js/blog-feed.js"></script>
```

---

## Case Study Pages

### Footer

**Production:**
```html
<!-- Splide -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>

<!-- Case Studies Scripts -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/case-study.js"></script>

<!-- Custom Code -->
<script>
  document.addEventListener("DOMContentLoaded", () => {
    blogPostSlider();
  });
</script>
```

**Local:**
```html
<!-- Splide -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>

<!-- Case Studies Scripts -->
<script src="http://127.0.0.1:5500/js/case-study.js"></script>

<!-- Custom Code -->
<script>
  document.addEventListener("DOMContentLoaded", () => {
    blogPostSlider();
  });
</script>
```

---

## Interactive Shapes Pages

### Stacking Shapes Footer

**Production:**
```html
<!-- Stacking Shapes Scripts -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/stacking-shapes.js"></script>
```

**Local:**
```html
<!-- Stacking Shapes Scripts -->
<script src="http://127.0.0.1:5500/js/stacking-shapes.js"></script>
```

### Holding Page Footer

**Production:**
```html
<!-- Holding Page Scripts -->
<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/holding-page.js"></script>
```

**Local:**
```html
<!-- Holding Page Scripts -->
<script src="http://127.0.0.1:5500/js/holding-page.js"></script>
```

---

## Quick Reference

| Page Type | Header | Footer |
|-----------|--------|--------|
| **All Pages** | Global Header | Global Footer |
| **Homepage** | Home Header | Home Footer |
| **Blog Post** | - | Blog Footer |
| **Blog Listing** | - | Blog Feed Footer |
| **Case Study** | - | Case Studies Footer |
| **Stacking Shapes** | - | Stacking Shapes Footer |
| **Holding Page** | - | Holding Page Footer |

---

**Current Version:** v1.9.9

**Production CDN:** `https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/`
**Local Server:** `http://127.0.0.1:5500`

*Last updated: November 11, 2025*

