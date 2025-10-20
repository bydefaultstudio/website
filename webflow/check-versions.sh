#!/bin/bash

# Check versions across all Webflow files
# Usage: ./check-versions.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🔍 Checking versions across all Webflow files..."
echo ""

# Define all Webflow files
FILES=(
  "global-header.html"
  "global-footer.html"
  "home-header.html"
  "home-footer.html"
  "blog-footer.html"
  "case-studies-footer.html"
)

# Check each file
for file in "${FILES[@]}"; do
  if [ -f "$SCRIPT_DIR/$file" ]; then
    echo "📄 $(basename "$file"):"
    
    # Check for CDN URLs
    cdn_urls=$(grep -o 'https://cdn.jsdelivr.net/gh/bydefaultstudio/website@[^"]*' "$SCRIPT_DIR/$file" 2>/dev/null)
    if [ -n "$cdn_urls" ]; then
      echo "   🌐 CDN URLs found:"
      echo "$cdn_urls" | sed 's/^/      /'
    fi
    
    # Check for local URLs
    local_urls=$(grep -o 'http://127.0.0.1:5500/[^"]*' "$SCRIPT_DIR/$file" 2>/dev/null)
    if [ -n "$local_urls" ]; then
      echo "   🏠 Local URLs found:"
      echo "$local_urls" | sed 's/^/      /'
    fi
    
    # Check for commented URLs
    commented_urls=$(grep -o '<!--.*https://cdn.jsdelivr.net/gh/bydefaultstudio/website@[^"]*.*-->' "$SCRIPT_DIR/$file" 2>/dev/null)
    if [ -n "$commented_urls" ]; then
      echo "   💬 Commented URLs found:"
      echo "$commented_urls" | sed 's/^/      /'
    fi
    
    echo ""
  else
    echo "⚠️  File not found: $file"
    echo ""
  fi
done

# Summary
echo "📊 Summary:"
cdn_count=$(grep -r 'https://cdn.jsdelivr.net/gh/bydefaultstudio/website@' "$SCRIPT_DIR" --include="*.html" | wc -l | tr -d ' ')
local_count=$(grep -r 'http://127.0.0.1:5500/' "$SCRIPT_DIR" --include="*.html" | wc -l | tr -d ' ')

echo "   🌐 CDN URLs: $cdn_count"
echo "   🏠 Local URLs: $local_count"

if [ "$cdn_count" -gt 0 ] && [ "$local_count" -gt 0 ]; then
  echo "   ⚠️  Mixed mode detected! Run './switch-mode.sh [local|prod]' to fix"
elif [ "$cdn_count" -gt 0 ]; then
  echo "   ✅ Production mode (CDN)"
elif [ "$local_count" -gt 0 ]; then
  echo "   ✅ Development mode (Local)"
else
  echo "   ❓ No URLs detected"
fi
