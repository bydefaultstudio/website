#!/bin/bash

# Generate all missing documentation pages
echo "🚀 Generating documentation pages..."

# Overview pages
echo "📖 Creating overview pages..."
node generate-page.js overview about "About"
node generate-page.js overview accessibility "Accessibility"

# Handbook pages  
echo "📚 Creating handbook pages..."
node generate-page.js handbook animation "Animation"
node generate-page.js handbook composition "Composition"
node generate-page.js handbook customization "Customization"
node generate-page.js handbook typescript "TypeScript"

# Component pages (sample)
echo "🧩 Creating component pages..."
node generate-page.js components accordion "Accordion"
node generate-page.js components dialog "Dialog"
node generate-page.js components menu "Menu"

# Utility pages
echo "🔧 Creating utility pages..."
node generate-page.js utilities direction-provider "Direction Provider"
node generate-page.js utilities use-render "useRender"

echo "✅ All pages generated!"
echo ""
echo "📝 Next steps:"
echo "1. Edit the generated pages to add your content"
echo "2. Create corresponding .md files for the 'View as Markdown' links"
echo "3. Test the pages in your browser"
