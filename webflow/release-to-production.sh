#!/bin/bash

# Production Release Workflow
# This script handles the complete production release process:
# 1. Git commit & push
# 2. GitHub release creation
# 3. Switch to CDN URLs with new version
# 4. Deploy to Webflow
# 5. Publish Webflow site

set -e  # Exit on any error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
HEADER_FILE="$SCRIPT_DIR/header.html"
FOOTER_FILE="$SCRIPT_DIR/footer.html"

echo "🚀 Production Release Workflow"
echo "================================"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository!"
  exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "📝 You have uncommitted changes:"
  git status -s
  echo ""
  read -p "Do you want to commit these changes? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter commit message: " COMMIT_MSG
    git add -A
    git commit -m "$COMMIT_MSG"
    echo "✅ Changes committed"
  else
    echo "⚠️  Continuing without committing..."
  fi
  echo ""
fi

# Get current version from CDN URLs
CURRENT_VERSION=$(grep -o 'website@v[0-9.]*' "$HEADER_FILE" | head -1 | sed 's/website@v//')
echo "📌 Current CDN version: v$CURRENT_VERSION"
echo ""

# Prompt for new version
read -p "Enter new version number (e.g., 1.3): " NEW_VERSION
if [[ -z "$NEW_VERSION" ]]; then
  echo "❌ Version number required!"
  exit 1
fi

echo ""
read -p "Enter release notes/description: " RELEASE_NOTES
if [[ -z "$RELEASE_NOTES" ]]; then
  RELEASE_NOTES="Release v$NEW_VERSION"
fi

echo ""
echo "📋 Release Summary:"
echo "   Version: v$NEW_VERSION"
echo "   Notes: $RELEASE_NOTES"
echo ""
read -p "Continue with release? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Release cancelled"
  exit 1
fi

echo ""
echo "🔄 Step 1: Pushing to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
  echo "✅ Pushed to GitHub"
else
  echo "❌ Failed to push to GitHub"
  exit 1
fi

echo ""
echo "🏷️  Step 2: Creating GitHub release v$NEW_VERSION..."
# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "⚠️  GitHub CLI (gh) not installed"
  echo "💡 Install with: brew install gh"
  echo "💡 Or create release manually at: https://github.com/bydefaultstudio/website/releases/new"
  echo ""
  read -p "Press enter to continue without creating release..." 
else
  gh release create "v$NEW_VERSION" --title "v$NEW_VERSION" --notes "$RELEASE_NOTES"
  if [ $? -eq 0 ]; then
    echo "✅ GitHub release created"
  else
    echo "⚠️  Failed to create release, but continuing..."
  fi
fi

echo ""
echo "🔄 Step 3: Updating CDN URLs to v$NEW_VERSION..."

# Update header.html CDN URLs
sed -i '' "s|website@v[0-9.]*|website@v$NEW_VERSION|g" "$HEADER_FILE"

# Update footer.html CDN URLs
sed -i '' "s|website@v[0-9.]*|website@v$NEW_VERSION|g" "$FOOTER_FILE"

echo "✅ CDN URLs updated to v$NEW_VERSION"
echo ""
echo "📁 Updated files:"
echo "   - header.html"
echo "   - footer.html"

# Commit the version bump
echo ""
echo "💾 Committing version bump..."
git add "$HEADER_FILE" "$FOOTER_FILE"
git commit -m "chore: bump CDN version to v$NEW_VERSION"
git push origin main
echo "✅ Version bump committed and pushed"

echo ""
echo "🌐 Step 4: Ready to deploy to Webflow"
echo ""
echo "📋 Next steps:"
echo "   1. Tell your AI assistant: 'deploy to webflow and publish'"
echo "   2. Or run manually: node manual-deploy.js"
echo ""
echo "🎉 Production release v$NEW_VERSION complete!"
echo ""
echo "🔗 Your new CDN URLs:"
echo "   https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v$NEW_VERSION/css/cursor.css"
echo "   https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v$NEW_VERSION/js/script.js"
echo "   https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v$NEW_VERSION/js/text-animation.js"
echo "   https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v$NEW_VERSION/js/cursor.js"
echo "   https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v$NEW_VERSION/js/table-of-contents.js"

