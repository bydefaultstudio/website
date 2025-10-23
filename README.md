# ByDefault Studio - Website Codebase

Welcome to the ByDefault Studio website codebase documentation. This repository contains all the code, assets, and documentation for our website.

## 📁 Project Structure

### Core Files
- **`index.html`** - Main project dashboard
- **`docs-viewer.html`** - Interactive documentation viewer with GitHub styling
- **`package.json`** - Project dependencies and scripts

### CSS & Styling
- **`css/cursor.css`** - Custom cursor animations and effects

### JavaScript Modules
- **`js/script.js`** - Main application script
- **`js/bd-animations.js`** - Animation system (v4.0) - Complete GSAP-based animation library
- **`js/cursor.js`** - Interactive cursor functionality
- **`js/table-of-contents.js`** - Dynamic table of contents generator
- **`js/case-study.js`** - Case study page functionality
- **`js/test.js`** - Testing utilities

### Hero Physics Engine
- **`js/hero.js`** - Interactive Matter.js physics engine for hero section
- **`css/hero.css`** - Hero section styles
- **`hero/hero-1.js`** - Backup version
- **`hero/hero-2.js`** - Second backup version

### Documentation
- **`docs/bd-animations-guide.md`** - Complete animation system guide (v4.0)
- **`docs/code-structure.md`** - Code architecture documentation
- **`docs/project-info.md`** - Project overview and setup
- **`docs/quick-reference.md`** - Quick reference guide
- **`docs/webflow-guidelines.md`** - Webflow integration guidelines
- **`docs/case-study-pinning.md`** - Case study implementation guide

### Webflow Integration
- **`webflow/header.html`** - Custom head code for Webflow
- **`webflow/footer.html`** - Custom footer code for Webflow
- **`webflow/deploy-to-webflow.js`** - Deployment automation
- **`webflow/manual-deploy.js`** - Manual deployment helper

### Test Pages
- **`cursor-test.html`** - Cursor functionality testing
- **`case-study-test.html`** - Case study component testing

## 🚀 Getting Started

### Local Development
1. Clone the repository
2. Start a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (if you have serve installed)
   npx serve
   
   # PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Documentation
- Use the [Interactive Documentation Viewer](docs-viewer.html) for the best browsing experience
- All documentation is written in Markdown and styled with GitHub Primer CSS
- Click on any `.md` link to navigate between documents seamlessly

## 🎨 Key Features

### Animation System (v4.0)
- **26+ animation types** with GSAP and ScrollTrigger
- **Responsive animations** that adapt to screen size
- **Accessibility support** with reduced motion preferences
- **Performance optimized** with debounced resize handling

### Hero Physics Engine
- **Interactive Matter.js physics** for engaging hero sections
- **Responsive positioning** that works on all devices
- **Logo integration** with SVG path collision detection
- **Customizable physics** parameters for different behaviors

### Webflow Integration
- **Seamless deployment** to Webflow sites
- **CDN-based loading** for production performance
- **Version management** with automated releases
- **Custom code injection** for enhanced functionality

## 📚 Documentation

Browse all documentation using the [Interactive Documentation Viewer](docs-viewer.html) for the best experience.

### Quick Links
- [BD Animations Guide](docs/bd-animations-guide.md) - Complete animation system reference
- [Code Structure](docs/code-structure.md) - Architecture and organization
- [Webflow Guidelines](docs/webflow-guidelines.md) - Integration best practices

## 🔧 Development

### Dependencies
- **GSAP** - Animation library
- **ScrollTrigger** - Scroll-based animations
- **SplitText** - Text animation splitting
- **Matter.js** - Physics engine for hero section
- **GitHub Primer CSS** - Documentation styling

### Browser Support
- Modern browsers with ES6+ support
- Automatic fallback for reduced motion preferences
- Optimized for mobile performance

## 📞 Support

For questions or issues:
1. Check the documentation first
2. Review browser console for errors
3. Test with different browsers and devices
4. Verify all dependencies are loaded correctly

---

**ByDefault Studio** - Creating beautiful, accessible web experiences with modern technologies.