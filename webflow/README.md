# Webflow Custom Code Reference

This directory contains local copies of custom code used in the Webflow project. These files are for reference and backup purposes only and are **NOT** pushed to GitHub.

## 📁 Files

### header.html
Contains all custom code that goes in the **Head** section of Webflow:
- Custom CSS
- Meta tags
- External library links (CDN)
- Analytics scripts
- Font loading scripts

### footer.html
Contains all custom code that goes in the **Footer** section of Webflow:
- Custom JavaScript
- GSAP library and plugins
- Splide.js slider library
- Custom scripts (cursor.js, script.js, text-animation.js)
- Analytics scripts that need to load last

### switch-mode.sh
Shell script to quickly switch between production (CDN) and local development (Live Server) modes. Includes optional automated deployment to Webflow.

### deploy-to-webflow.js
Node.js script that uses the Webflow API to automatically update custom code in Webflow. Called by switch-mode.sh when using --deploy flag.

## ⚙️ Requirements

### For Automated Deployment
- Node.js installed
- npm packages installed (`npm install` in project root)
- Webflow API token configured in `../.cursor/mcp.json`

### For Manual Workflow
- Live Server extension (for local development)
- Access to Webflow project settings

## 🚀 Quick Start

### Local Development & Testing Workflow

When testing locally with Live Server:

```bash
cd webflow

# Switch to local mode
./switch-mode.sh local

# When ready to test on Webflow, tell your AI:
# "deploy to webflow and publish"
```

This workflow:
1. Switches URLs to localhost (127.0.0.1:5500)
2. Updates header.html and footer.html
3. AI assistant deploys to Webflow via MCP
4. Published to Webflow for testing

**Requirements:**
- Live Server running in VS Code
- Webflow MCP server connected in Cursor

### Production Release Workflow

When ready to release to production:

```bash
cd webflow

# Run the production release script
./release-to-production.sh
```

This comprehensive workflow:
1. **Commits & pushes** your changes to GitHub
2. **Creates a GitHub release** with version tag (e.g., v1.3)
3. **Updates CDN URLs** in header/footer to new version
4. **Commits version bump** and pushes
5. **Prompts you to deploy** to Webflow via AI assistant

After the script completes, tell your AI:
```
"deploy to webflow and publish"
```

### Manual Mode Switching (Advanced)

If you just need to switch URLs without deploying:

```bash
# Switch to local (localhost URLs)
./switch-mode.sh local

# Switch to production (CDN URLs)
./switch-mode.sh prod
```

## 📋 Workflow

### For Production Deployment (Automated)
```bash
# Quick deploy to Webflow staging
./switch-mode.sh prod --deploy

# Deploy and publish live
./switch-mode.sh prod --deploy --publish
```

### For Production Deployment (Manual)
1. Run `./switch-mode.sh prod`
2. Copy `header.html` to Webflow → Project Settings → Custom Code → Head Code
3. Copy `footer.html` to Webflow → Project Settings → Custom Code → Footer Code
4. Publish to staging, test, then publish to production

### For Local Development
1. Start Live Server in VS Code (right-click project → Open with Live Server)
2. Run `./switch-mode.sh local`
3. Copy `header.html` and `footer.html` to Webflow (or use them locally)
4. Make changes to your CSS/JS files
5. Refresh to see changes
6. When done testing, run `./switch-mode.sh prod --deploy` to push live

## Implementation in Webflow

### Site-wide Custom Code
1. Go to **Project Settings** → **Custom Code**
2. Paste header code in the **Head Code** section
3. Paste footer code in the **Footer Code** section
4. Publish to staging first, then production

### Page-specific Custom Code
1. Go to **Page Settings** → **Custom Code**
2. Add code in appropriate section (Head or Footer)
3. Test thoroughly before publishing

## Notes

- These files are excluded from version control (see `.gitignore`)
- Keep these files updated when making changes in Webflow
- Always test in Webflow's staging environment first
- Document any dependencies or requirements in this README

