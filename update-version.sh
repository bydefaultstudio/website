#!/bin/bash

# Version Update Script for Webflow Documentation
# Updates version numbers in markdown documentation files

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/docs"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current version from production guide
CURRENT_VERSION=$(grep -oP '@v\K[\d.]+' "$DOCS_DIR/custom-code-scripts.md" | head -1)

echo -e "${BLUE}📦 Webflow Version Updater${NC}"
echo "================================"
echo ""

if [ -z "$CURRENT_VERSION" ]; then
  echo -e "${YELLOW}⚠️  Could not detect current version${NC}"
  read -p "Enter current version (e.g., 1.9.4): " CURRENT_VERSION
else
  echo -e "Current version: ${GREEN}v$CURRENT_VERSION${NC}"
fi

echo ""
read -p "Enter new version (e.g., 1.9.5): " NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
  echo -e "${YELLOW}❌ No version specified. Exiting.${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}🔄 Updating version v$CURRENT_VERSION → v$NEW_VERSION...${NC}"
echo ""

# Update production guide
if [ -f "$DOCS_DIR/custom-code-scripts.md" ]; then
  echo "📄 Updating custom-code-scripts.md..."
  sed -i '' "s/@v$CURRENT_VERSION/@v$NEW_VERSION/g" "$DOCS_DIR/custom-code-scripts.md"
  sed -i '' "s/Current Version: v$CURRENT_VERSION/Current Version: v$NEW_VERSION/g" "$DOCS_DIR/custom-code-scripts.md"
  echo -e "   ${GREEN}✅ Updated${NC}"
else
  echo -e "   ${YELLOW}⚠️  File not found${NC}"
fi

echo ""
echo -e "${GREEN}✅ Version update complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Review changes: git diff docs/custom-code-scripts.md"
echo "   2. Commit changes: git commit -m 'chore: update webflow docs to v$NEW_VERSION'"
echo "   3. Regenerate docs: cd docs && npm run generate"
echo ""

