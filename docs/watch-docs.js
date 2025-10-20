#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Simple file watcher for documentation development
 * Watches for changes to .md files and regenerates HTML automatically
 */

const DOCS_DIR = __dirname;
const WATCH_PATTERNS = ['*.md', 'template.html', 'styles.css'];

console.log('👀 Watching for changes in documentation files...');
console.log('📁 Watching directory:', DOCS_DIR);
console.log('🔄 Auto-regenerating HTML when files change...\n');

// Function to regenerate documentation
function regenerateDocs() {
  console.log('🔄 File changed, regenerating documentation...');
  exec('node generate-docs.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error regenerating docs:', error);
      return;
    }
    if (stderr) {
      console.error('⚠️  Warning:', stderr);
    }
    console.log('✅ Documentation regenerated successfully');
    console.log('🌐 Visit http://localhost:8080 to view changes\n');
  });
}

// Watch for changes to markdown files
fs.watch(DOCS_DIR, { recursive: false }, (eventType, filename) => {
  if (filename && (
    filename.endsWith('.md') || 
    filename === 'template.html' || 
    filename === 'styles.css'
  )) {
    console.log(`📝 ${eventType}: ${filename}`);
    regenerateDocs();
  }
});

// Watch for changes to the generation script itself
fs.watchFile(path.join(DOCS_DIR, 'generate-docs.js'), (curr, prev) => {
  console.log('🔧 Generation script updated, reloading...');
  regenerateDocs();
});

console.log('✅ File watcher started successfully!');
console.log('💡 Tip: Keep this running while editing documentation');
console.log('🛑 Press Ctrl+C to stop watching\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping file watcher...');
  process.exit(0);
});
