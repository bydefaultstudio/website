# Quick Start - By Default Website

## 🚀 Get Started in 5 Minutes

Follow these steps to get your repository up and running with GitHub.

### Step 1: Install Git (One-Time Setup)

Run this command in your terminal:
```bash
xcode-select --install
```

Click **"Install"** when the dialog appears. This will take a few minutes.

### Step 2: Configure Git (First Time Only)

Set your identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@bydefault.studio"
```

### Step 3: Initialize and Push to GitHub

Copy and paste these commands one by one:

```bash
# Navigate to project directory
cd "/Users/erlenmasson/Library/CloudStorage/GoogleDrive-erlen@anonivate.com/Shared drives/Studio/03 Branding/ByDefault/Website/Code"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: By Default website repository"

# Add GitHub remote
git remote add origin https://github.com/bydefaultstudio/website.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify

Visit https://github.com/bydefaultstudio/website to see your repository live!

---

## 📖 What's Next?

- **Read the docs**: Check out [README.md](README.md) for full documentation
- **Webflow guidelines**: See [docs/webflow-guidelines.md](docs/webflow-guidelines.md)
- **Daily reference**: Bookmark [docs/quick-reference.md](docs/quick-reference.md)

## 🔄 Daily Workflow

After setup, use these commands regularly:

```bash
# See what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: description of what you did"

# Push to GitHub
git push
```

## 🆘 Need Help?

- **Detailed setup**: See [SETUP.md](SETUP.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Email**: hello@bydefault.studio

---

**Repository**: https://github.com/bydefaultstudio/website  
**Staging**: https://bydefault.webflow.io/  
**Production**: https://bydefault.studio

