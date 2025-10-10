#!/bin/bash

# By Default Website - GitHub Setup Script
# This script will initialize your repository and push to GitHub

echo "🎨 By Default Website - GitHub Setup"
echo "======================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    echo ""
    echo "Please install Xcode Command Line Tools first:"
    echo "  xcode-select --install"
    echo ""
    echo "After installation completes, run this script again."
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Navigate to project directory
cd "/Users/erlenmasson/Library/CloudStorage/GoogleDrive-erlen@anonivate.com/Shared drives/Studio/03 Branding/ByDefault/Website/Code"

# Check if git is already initialized
if [ -d .git ]; then
    echo "⚠️  Git repository already initialized"
else
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Repository initialized"
fi

echo ""

# Check git config
if [ -z "$(git config user.name)" ]; then
    echo "⚠️  Git user.name not set"
    echo "Please run: git config --global user.name \"Your Name\""
    echo ""
fi

if [ -z "$(git config user.email)" ]; then
    echo "⚠️  Git user.email not set"
    echo "Please run: git config --global user.email \"your.email@bydefault.studio\""
    echo ""
fi

# Add all files
echo "📝 Adding files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: By Default website repository"

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/bydefaultstudio/website.git 2>/dev/null || echo "Remote already exists"

# Rename to main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✨ Setup complete!"
echo ""
echo "Your repository is now live at:"
echo "https://github.com/bydefaultstudio/website"
echo ""
echo "Next steps:"
echo "  - Visit your GitHub repository"
echo "  - Read README.md for project overview"
echo "  - Check docs/quick-reference.md for common tasks"
echo ""

