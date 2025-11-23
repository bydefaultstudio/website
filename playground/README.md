# Playground

Experimental interactive builds and prototypes.

## Structure

Each build is self-contained in its own folder with:
- `index.html` - Main HTML file
- `style.css` - Styles for the build

JavaScript files are located in `js/playground/` and follow the naming convention: `[build-name].js`

```
playground/
  ├── build-1/
  │   ├── index.html
  │   └── style.css
  ├── build-2/
  │   ├── index.html
  │   └── style.css
  └── README.md

js/
  └── playground/
      ├── build-1.js
      └── build-2.js
```

## Security Notes

**API Tokens**: If your build requires API tokens (e.g., Mapbox, Google Maps), use config files that are gitignored:

1. Copy `config.example.js` to `config.js` in your build folder
2. Add your API token to `config.js`
3. Load `config.js` before your main script in `index.html`
4. The `config.js` file is automatically gitignored and won't be committed

**Never commit API tokens directly in JavaScript files.**

## Current Builds

- **la-interactive-map** - LA Interactive Map experiment

