# Production Files for GitHub

## ✅ Files Needed for Production CDN URLs

Based on your production setup using jsDelivr CDN, only these files need to be on GitHub:

### JavaScript Files (`js/`)
- `js/script.js`
- `js/bd-animations.js`
- `js/cursor.js`
- `js/audio.js`
- `js/hero.js`
- `js/homepage.js`
- `js/blog-template.js`
- `js/case-study.js`
- `js/blog-feed.js`
- `js/stacking-shapes.js`
- `js/holding-page.js`

### CSS Files (`css/`)
- `css/cursor.css`
- `css/hero.css`
- `css/theme.css`

### Audio Files (`assets/audio/`)
- `assets/audio/bump.mp3`
- `assets/audio/click.mp3`
- `assets/audio/error.mp3`
- `assets/audio/hover.mp3`
- `assets/audio/success.mp3`

## Production CDN URLs Format

```
https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/js/script.js
https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/css/cursor.css
https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.9.9/assets/audio/click.mp3
```

## Files NOT Needed (Excluded by .gitignore)

- Documentation files (`docs/`)
- Test files (`*-test.html`, `js/test.js`)
- Archive files (`js/archive/`, `docs/archive/`)
- Backup files (`hero/`, `stacking-shapes/`)
- Development files (`webflow/`, `.cursor/`)
- Node modules and dependencies
- README, SETUP, QUICKSTART files

---
*Updated: November 11, 2025*
