#!/bin/bash

# Start the SVG processor watcher
echo "🚀 Starting SVG Optimizer Watcher..."
echo "📁 Watching: svg-optimizer.md"
echo "💡 Paste your SVG code in the 'SVG Input' section and save the file"
echo "🔄 The optimized SVG will automatically appear in the 'Optimized Output' section"
echo ""
echo "Press Ctrl+C to stop the watcher"
echo ""

node svg-processor.js
