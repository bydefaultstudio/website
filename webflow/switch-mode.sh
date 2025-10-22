#!/bin/bash

# Switch between production (CDN) and local development mode
# Usage: ./switch-mode.sh [local|prod] [--deploy] [--publish]

MODE=$1
DEPLOY=false
PUBLISH=false

# Check for flags
for arg in "$@"; do
  if [[ "$arg" == "--deploy" ]]; then
    DEPLOY=true
  fi
  if [[ "$arg" == "--publish" ]]; then
    PUBLISH=true
  fi
done

if [[ "$MODE" != "local" && "$MODE" != "prod" ]]; then
  echo "❌ Usage: ./switch-mode.sh [local|prod] [--deploy] [--publish]"
  echo ""
  echo "Examples:"
  echo "  ./switch-mode.sh local --deploy --publish    # Switch to local, deploy & publish to Webflow"
  echo "  ./switch-mode.sh prod --deploy               # Switch to prod and deploy to Webflow"
  echo "  ./switch-mode.sh prod --deploy --publish     # Switch, deploy, and publish"
  echo ""
  echo "💡 For full production workflow (git push + release + deploy), use:"
  echo "   ./release-to-production.sh"
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define all Webflow files
FILES=(
  "global-header.html"
  "global-footer.html"
  "home-header.html"
  "home-footer.html"
  "blog-footer.html"
  "case-studies-footer.html"
)

# Get current version from any file (they should all be the same)
CURRENT_VERSION=$(grep -o 'v[0-9]\+\.[0-9]\+\.[0-9]\+' "$SCRIPT_DIR/global-header.html" | head -1)
if [ -z "$CURRENT_VERSION" ]; then
  CURRENT_VERSION="v1.8.1"
  echo "⚠️  Could not detect current version, using default: $CURRENT_VERSION"
fi

echo "📋 Current version: $CURRENT_VERSION"

# Function to switch a file between local and production
switch_file() {
  local file="$1"
  local mode="$2"
  
  if [ ! -f "$file" ]; then
    echo "⚠️  File not found: $file"
    return
  fi
  
  echo "🔄 Processing: $(basename "$file")"
  
  if [ "$mode" == "local" ]; then
    # Switch to local development URLs
    sed -i '' "s|https://cdn.jsdelivr.net/gh/bydefaultstudio/website@[^/]*/|http://127.0.0.1:5500/|g" "$file"
    
  elif [ "$mode" == "prod" ]; then
    # Switch to production CDN URLs
    sed -i '' "s|http://127.0.0.1:5500/|https://cdn.jsdelivr.net/gh/bydefaultstudio/website@$CURRENT_VERSION/|g" "$file"
    
    # Ensure we're using the correct version
    sed -i '' "s|https://cdn.jsdelivr.net/gh/bydefaultstudio/website@[^/]*/|https://cdn.jsdelivr.net/gh/bydefaultstudio/website@$CURRENT_VERSION/|g" "$file"
  fi
}

if [ "$MODE" == "local" ]; then
  echo "🛠️  Switching to LOCAL development mode..."
  echo "📁 Processing $(echo ${FILES[@]} | wc -w) files..."
  
  for file in "${FILES[@]}"; do
    switch_file "$SCRIPT_DIR/$file" "local"
  done
  
  echo ""
  echo "✅ Switched to LOCAL mode (127.0.0.1:5500)"
  echo "💡 Make sure Live Server is running on port 5500!"
  echo ""
  echo "📁 Updated files:"
  for file in "${FILES[@]}"; do
    if [ -f "$SCRIPT_DIR/$file" ]; then
      echo "   - $file"
    fi
  done
  
elif [ "$MODE" == "prod" ]; then
  echo "🚀 Switching to PRODUCTION mode..."
  echo "📁 Processing $(echo ${FILES[@]} | wc -w) files..."
  
  for file in "${FILES[@]}"; do
    switch_file "$SCRIPT_DIR/$file" "prod"
  done
  
  echo ""
  echo "✅ Switched to PRODUCTION mode (CDN v$CURRENT_VERSION)"
  echo "💡 Files are ready to copy to Webflow!"
  echo ""
  echo "📁 Updated files:"
  for file in "${FILES[@]}"; do
    if [ -f "$SCRIPT_DIR/$file" ]; then
      echo "   - $file"
    fi
  done
fi

# Deploy to Webflow if requested
if [ "$DEPLOY" = true ]; then
  echo ""
  echo "🌐 Deploying to Webflow via MCP..."
  echo "💡 This will be handled by your AI assistant using Webflow MCP tools"
  echo ""
  echo "📋 To complete deployment:"
  echo "   1. Make sure Cursor has Webflow MCP server connected"
  echo "   2. Tell your AI assistant: 'deploy to webflow'"
  if [ "$PUBLISH" = true ]; then
    echo "   3. And add: 'and publish'"
  fi
  echo ""
  echo "⚠️  Or run the manual deployment:"
  echo "   node manual-deploy.js"
fi

echo ""
echo "🎯 Next steps:"
if [ "$MODE" == "local" ]; then
  echo "   1. Start Live Server on port 5500"
  echo "   2. Test your changes locally"
  echo "   3. Run './switch-mode.sh prod' when ready for production"
else
  echo "   1. Copy updated files to Webflow"
  echo "   2. Test in Webflow Designer"
  echo "   3. Publish when ready"
fi