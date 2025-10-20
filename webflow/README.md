# Webflow Custom Code Reference

This directory contains local copies of custom code used in the Webflow project. These files are for reference and backup purposes only and are **NOT** pushed to GitHub.

## 📁 Files

### Header Files
- **global-header.html** - Global header code for all pages
- **home-header.html** - Homepage-specific header code (hero CSS)

### Footer Files
- **global-footer.html** - Global footer code for all pages
- **home-footer.html** - Homepage-specific footer code (hero JS)
- **blog-footer.html** - Blog-specific footer code (table of contents)
- **case-studies-footer.html** - Case studies-specific footer code

### Scripts
- **switch-mode.sh** - Switch between production (CDN) and local development modes
- **check-versions.sh** - Check current URL versions across all files
- **deploy-to-webflow.js** - Automated deployment to Webflow via API
- **release-to-production.sh** - Complete production release workflow

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

# Check current mode
./check-versions.sh

# When ready to test on Webflow, tell your AI:
# "deploy to webflow and publish"
```

This workflow:
1. Switches URLs to localhost (127.0.0.1:5500)
2. Updates all header and footer files
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
2. **Creates a GitHub release** with version tag (e.g., v1.7.1)
3. **Updates CDN URLs** in all files to new version
4. **Commits version bump** and pushes
5. **Prompts you to deploy** to Webflow via AI assistant

After the script completes, tell your AI:
```
"deploy to webflow and publish"
```

### Manual Mode Switching

If you just need to switch URLs without deploying:

```bash
# Switch to local (localhost URLs)
./switch-mode.sh local

# Switch to production (CDN URLs)
./switch-mode.sh prod

# Check current mode
./check-versions.sh
```

## 📋 File Structure

### Global Files (All Pages)
- **global-header.html**: Theme CSS, navigation, cursor CSS
- **global-footer.html**: Common scripts (script.js, bd-animations.js, cursor.js, audio.js)

### Page-Specific Files
- **home-header.html**: Hero section CSS
- **home-footer.html**: Hero section JavaScript
- **blog-footer.html**: Table of contents script
- **case-studies-footer.html**: Case study script

## 🔧 Scripts Reference

### switch-mode.sh
```bash
# Switch to local development
./switch-mode.sh local

# Switch to production
./switch-mode.sh prod

# Switch and deploy
./switch-mode.sh prod --deploy

# Switch, deploy, and publish
./switch-mode.sh prod --deploy --publish
```

### check-versions.sh
```bash
# Check current URL versions
./check-versions.sh
```

Shows:
- Which files have CDN vs local URLs
- Current version numbers
- Mixed mode warnings

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
2. Copy appropriate files to Webflow:
   - **Global**: `global-header.html` → Head Code, `global-footer.html` → Footer Code
   - **Homepage**: `home-header.html` → Homepage Head Code, `home-footer.html` → Homepage Footer Code
   - **Blog**: `blog-footer.html` → Blog Footer Code
   - **Case Studies**: `case-studies-footer.html` → Case Studies Footer Code
3. Publish to staging, test, then publish to production

### For Local Development
1. Start Live Server in VS Code (right-click project → Open with Live Server)
2. Run `./switch-mode.sh local`
3. Copy appropriate files to Webflow (or use them locally)
4. Make changes to your CSS/JS files
5. Refresh to see changes
6. When done testing, run `./switch-mode.sh prod --deploy` to push live

## Implementation in Webflow

### Site-wide Custom Code
1. Go to **Project Settings** → **Custom Code**
2. Paste global header code in the **Head Code** section
3. Paste global footer code in the **Footer Code** section
4. Publish to staging first, then production

### Page-specific Custom Code
1. Go to **Page Settings** → **Custom Code**
2. Add appropriate header/footer code for that page type
3. Test thoroughly before publishing

## 🎯 Key Features

### Smart Version Detection
- Automatically detects current version from existing files
- Updates all files consistently
- Prevents version mismatches

### File-Specific Management
- Handles multiple header/footer files
- Page-specific scripts (blog, case studies)
- No duplicate script loading

### Mode Switching
- **Local Mode**: Uses `http://127.0.0.1:5500/` for development
- **Production Mode**: Uses `https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.8/`
- Automatic URL replacement across all files

## Notes

- These files are excluded from version control (see `.gitignore`)
- Keep these files updated when making changes in Webflow
- Always test in Webflow's staging environment first
- Document any dependencies or requirements in this README
- Use `./check-versions.sh` to verify URL consistency