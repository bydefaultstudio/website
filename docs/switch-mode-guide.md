---
title: "Webflow Switch-Mode Quick Reference"
subtitle: "Essential commands and workflows for Webflow development and deployment"
description: "Quick reference guide for Webflow switch-mode commands including local development, staging deployment, and production workflows for the ByDefault website."
section: "deployment"
order: 2
---

# 🚀 Webflow Switch-Mode Quick Reference

## 📋 Essential Commands

### **Daily Development**
```bash
# Start local development
./switch-mode.sh local

# Quick deploy to Webflow
./switch-mode.sh prod --deploy --publish

# Check current mode
./check-versions.sh
```

### **Production Releases**
```bash
# Full release workflow (recommended)
./release-to-production.sh
```

## 🎯 Common Workflows

### **1. Local Development**
```bash
./switch-mode.sh local
# → Make changes → Test locally → Switch back when ready
./switch-mode.sh prod
```

### **2. Quick Webflow Update**
```bash
./switch-mode.sh prod --deploy --publish
# → One command: switch + deploy + publish live
```

### **3. Major Release**
```bash
./release-to-production.sh
# → Full workflow: git push + release + version bump + deploy
```

## 📁 Files Updated
- `global-header.html` - Global theme CSS, navigation
- `global-footer.html` - Common scripts
- `home-header.html` - Hero CSS
- `home-footer.html` - Hero JS
- `blog-footer.html` - Table of contents
- `case-studies-footer.html` - Case study script

## 🔧 Command Options

| Command | What it does | When to use |
|---------|--------------|-------------|
| `./switch-mode.sh local` | Switch to localhost URLs | Starting development |
| `./switch-mode.sh prod` | Switch to CDN URLs | Ready for Webflow |
| `./switch-mode.sh prod --deploy` | Switch + deploy to Webflow | Deploy to staging |
| `./switch-mode.sh prod --deploy --publish` | Switch + deploy + publish | Deploy live |
| `./release-to-production.sh` | Full release workflow | Major version release |
| `./check-versions.sh` | Check current mode | Verify status |

## ⚡ Quick Tips

- **Local Mode**: Uses `http://127.0.0.1:5500/` (need Live Server running)
- **Production Mode**: Uses `https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.7.1/`
- **Version Detection**: Automatically detects current version
- **File Safety**: Never removes files, only switches URLs

## 🚨 Troubleshooting

### Mixed Mode Detected?
```bash
./check-versions.sh  # See which files are mixed
./switch-mode.sh prod  # Fix by switching all to production
```

### Need to Start Fresh?
```bash
./switch-mode.sh prod  # Ensure all files are in production mode
./check-versions.sh    # Verify everything is consistent
```

## 💡 Remember

- **Local**: For development and testing
- **Production**: For Webflow deployment
- **--deploy**: Deploys to Webflow via AI assistant
- **--publish**: Publishes live (use with --deploy)
- **release-to-production.sh**: Complete workflow for major releases

---
*Keep this handy! 📌*
