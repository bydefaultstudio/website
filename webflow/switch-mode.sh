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
HEADER_FILE="$SCRIPT_DIR/header.html"
FOOTER_FILE="$SCRIPT_DIR/footer.html"

if [ "$MODE" == "local" ]; then
  echo "🛠️  Switching to LOCAL development mode..."
  
  # Clean up any existing comment wrappers first, then apply correct ones
  
  # Header: CSS - Remove all comment variations first
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*[^>]*>\([[:space:]]*-->\)*[[:space:]]*-->|<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/css/cursor.css" rel="stylesheet">|g' "$HEADER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet">\([[:space:]]*-->\)*[[:space:]]*-->|<link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet">|g' "$HEADER_FILE"
  
  # Now apply the correct commenting
  sed -i '' 's|<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/css/cursor.css" rel="stylesheet">|<!-- <link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/css/cursor.css" rel="stylesheet"> -->|g' "$HEADER_FILE"
  
  # Footer: JS files - Clean and apply
  # script.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/script.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/script.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/script.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/script.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/script.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/script.js"></script> -->|g' "$FOOTER_FILE"
  
  # case-study.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/case-study.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/case-study.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/case-study.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/case-study.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/case-study.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/case-study.js"></script> -->|g' "$FOOTER_FILE"
  
  # bd-animations.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/bd-animations.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/bd-animations.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/bd-animations.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/bd-animations.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/bd-animations.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/bd-animations.js"></script> -->|g' "$FOOTER_FILE"
  
  # cursor.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/cursor.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/cursor.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/cursor.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/cursor.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/cursor.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/cursor.js"></script> -->|g' "$FOOTER_FILE"
  
  # table-of-contents.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/table-of-contents.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/table-of-contents.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/table-of-contents.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/table-of-contents.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/table-of-contents.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/table-of-contents.js"></script> -->|g' "$FOOTER_FILE"
  
  # hero.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/hero/hero.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/hero/hero.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/hero/hero.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/hero/hero.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/hero/hero.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/hero/hero.js"></script> -->|g' "$FOOTER_FILE"
  
  # audio.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/audio.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/audio.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/audio.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/audio.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/audio.js"></script>|<!-- <script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/audio.js"></script> -->|g' "$FOOTER_FILE"
  
  echo "✅ Switched to LOCAL mode (127.0.0.1:5500)"
  echo "💡 Make sure Live Server is running on port 5500!"
  
elif [ "$MODE" == "prod" ]; then
  echo "🚀 Switching to PRODUCTION mode..."
  
  # Clean up any existing comment wrappers first, then apply correct ones
  
  # Header: CSS - Remove all comment variations first
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*[^>]*>\([[:space:]]*-->\)*[[:space:]]*-->|<link href="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/css/cursor.css" rel="stylesheet">|g' "$HEADER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet">\([[:space:]]*-->\)*[[:space:]]*-->|<link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet">|g' "$HEADER_FILE"
  
  # Now apply the correct commenting
  sed -i '' 's|<link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet">|<!-- <link href="http://127.0.0.1:5500/css/cursor.css" rel="stylesheet"> -->|g' "$HEADER_FILE"
  
  # Footer: JS files - Clean and apply
  # script.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/script.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/script.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/script.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/script.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/js/script.js"></script>|<!-- <script src="http://127.0.0.1:5500/js/script.js"></script> -->|g' "$FOOTER_FILE"
  
  # case-study.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/case-study.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/case-study.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/case-study.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/case-study.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/js/case-study.js"></script>|<!-- <script src="http://127.0.0.1:5500/js/case-study.js"></script> -->|g' "$FOOTER_FILE"
  
  # bd-animations.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/bd-animations.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/bd-animations.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/bd-animations.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/bd-animations.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/js/bd-animations.js"></script>|<!-- <script src="http://127.0.0.1:5500/js/bd-animations.js"></script> -->|g' "$FOOTER_FILE"
  
  # cursor.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/cursor.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/cursor.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/cursor.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/cursor.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/js/cursor.js"></script>|<!-- <script src="http://127.0.0.1:5500/js/cursor.js"></script> -->|g' "$FOOTER_FILE"
  
  # table-of-contents.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/table-of-contents.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/table-of-contents.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/table-of-contents.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/table-of-contents.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/js/table-of-contents.js"></script>|<!-- <script src="http://127.0.0.1:5500/js/table-of-contents.js"></script> -->|g' "$FOOTER_FILE"
  
  # hero.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/hero/hero.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/hero/hero.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/hero/hero.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/hero/hero.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/hero/hero.js"></script>|<!-- <script src="http://127.0.0.1:5500/hero/hero.js"></script> -->|g' "$FOOTER_FILE"
  
  # audio.js
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v[0-9.]*/js/audio.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="https://cdn.jsdelivr.net/gh/bydefaultstudio/website@v1.5/js/audio.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<!--[[:space:]]*\(<!--[[:space:]]*\)*<script src="http://127.0.0.1:5500/js/audio.js"></script>\([[:space:]]*-->\)*[[:space:]]*-->|<script src="http://127.0.0.1:5500/js/audio.js"></script>|g' "$FOOTER_FILE"
  sed -i '' 's|<script src="http://127.0.0.1:5500/js/audio.js"></script>|<!-- <script src="http://127.0.0.1:5500/js/audio.js"></script> -->|g' "$FOOTER_FILE"
  
  echo "✅ Switched to PRODUCTION mode (CDN)"
  echo "💡 Files are ready to copy to Webflow!"
fi

echo ""
echo "📁 Updated files:"
echo "   - header.html"
echo "   - footer.html"

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
