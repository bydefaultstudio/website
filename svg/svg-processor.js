#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MARKDOWN_FILE = path.join(__dirname, 'svg-optimizer.md');

/**
 * Process SVG code according to the specified rules
 */
function processSVG(svgCode) {
  // Check for SIZE=100% flag
  const sizeFlagMatch = svgCode.match(/SIZE=100%\s*\n/);
  const hasSizeFlag = sizeFlagMatch !== null;
  
  // Remove the SIZE flag line if present
  let processedCode = svgCode.replace(/SIZE=100%\s*\n/, '');
  
  // Remove xmlns attributes from root svg tag
  processedCode = processedCode.replace(
    /<svg([^>]*?)\s+xmlns(?::xlink)?="[^"]*"([^>]*?)>/g,
    '<svg$1$2>'
  );
  
  // Add or modify width and height if SIZE=100% flag is present
  if (hasSizeFlag) {
    processedCode = processedCode.replace(
      /<svg([^>]*?)>/,
      (match, attributes) => {
        // Remove existing width and height
        let newAttributes = attributes
          .replace(/\s+width="[^"]*"/g, '')
          .replace(/\s+height="[^"]*"/g, '');
        
        // Add width and height 100%
        newAttributes += ' width="100%" height="100%"';
        
        return `<svg${newAttributes}>`;
      }
    );
  }
  
  // Process all <path> elements
  processedCode = processedCode.replace(
    /<path([^>]*?)>/g,
    (match, attributes) => {
      // Handle fill attribute
      if (attributes.includes('fill=')) {
        // Replace existing fill attribute
        attributes = attributes.replace(/fill="[^"]*"/g, 'fill="currentColor"');
      } else {
        // Add fill attribute
        attributes += ' fill="currentColor"';
      }
      
      // Handle style attribute with fill
      if (attributes.includes('style=')) {
        attributes = attributes.replace(
          /style="([^"]*?)"/g,
          (styleMatch, styleContent) => {
            // Replace fill in style while preserving other properties
            const newStyleContent = styleContent.replace(
              /fill\s*:\s*[^;]+/g,
              'fill: currentColor'
            );
            
            // If no fill was found in style, add it
            if (!styleContent.includes('fill:')) {
              return `style="${styleContent}; fill: currentColor"`;
            }
            
            return `style="${newStyleContent}"`;
          }
        );
      }
      
      return `<path${attributes}>`;
    }
  );
  
  return processedCode;
}

/**
 * Reset the markdown file to template state
 */
function resetMarkdownFile() {
  const templateContent = `# SVG Optimizer

Paste your raw SVG code below. The system will automatically:
- Set all \`<path>\` elements to use \`fill="currentColor"\`
- Remove \`xmlns\` attributes from the root \`<svg>\` tag
- Apply \`SIZE=100%\` flag if specified
- Preserve all other attributes and formatting

## Instructions

1. Paste your SVG code in the code blocks below
2. Add \`SIZE=100%\` on a line before the SVG if you want responsive sizing
3. Save the file - the SVG will be automatically optimized in place

---

## SVG Code Blocks

\`\`\`svg
<!-- Paste your first SVG code here -->
\`\`\`

\`\`\`svg
<!-- Paste your second SVG code here (if needed) -->
\`\`\`
`;

  fs.writeFileSync(MARKDOWN_FILE, templateContent);
  console.log('🔄 Markdown file reset to template state');
}

/**
 * Extract SVG code from markdown and process it
 */
function processMarkdownFile() {
  try {
    const content = fs.readFileSync(MARKDOWN_FILE, 'utf8');
    
    // Check for reset command
    if (content.includes('reset SVG') || content.includes('RESET SVG')) {
      resetMarkdownFile();
      return;
    }
    
    // Find all SVG code blocks and process them
    const svgCodeBlockRegex = /```svg\s*([\s\S]*?)\s*```/g;
    let updatedContent = content;
    let match;
    let processedCount = 0;
    
    while ((match = svgCodeBlockRegex.exec(content)) !== null) {
      const svgCode = match[1].trim();
      
      if (svgCode && !svgCode.includes('<!-- Paste your')) {
        console.log(`Processing SVG code block ${processedCount + 1}...`);
        
        // Process the SVG
        const processedSVG = processSVG(svgCode);
        
        // Replace the original SVG with the processed one
        updatedContent = updatedContent.replace(
          match[0],
          `\`\`\`svg\n${processedSVG}\n\`\`\``
        );
        
        processedCount++;
      }
    }
    
    if (processedCount > 0) {
      fs.writeFileSync(MARKDOWN_FILE, updatedContent);
      console.log(`✅ Processed ${processedCount} SVG code block(s) and updated in place`);
    } else {
      console.log('No SVG code found in any code blocks');
    }
    
  } catch (error) {
    console.error('Error processing SVG:', error.message);
  }
}

/**
 * Watch for file changes
 */
function startWatcher() {
  console.log('🔍 Watching for changes to svg-optimizer.md...');
  console.log('Paste your SVG code in the code blocks and save the file');
  console.log('Type "process" to manually convert SVGs');
  console.log('Type "reset" to clean up the markdown file');
  console.log('Type "quit" or "exit" to stop the watcher');
  
  // Set up stdin listener for commands
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    const input = data.trim().toLowerCase();
    
    if (input === 'process') {
      console.log('\n🔄 Processing SVGs manually...');
      processMarkdownFile();
    } else if (input === 'reset') {
      resetMarkdownFile();
    } else if (input === 'quit' || input === 'exit') {
      console.log('👋 Stopping watcher...');
      process.exit(0);
    } else if (input === 'help') {
      console.log('\n📖 Available commands:');
      console.log('  process - Manually convert SVGs in the markdown file');
      console.log('  reset   - Clean up markdown file and return to template');
      console.log('  quit    - Stop the watcher');
      console.log('  exit    - Stop the watcher');
      console.log('  help    - Show this help message\n');
    } else if (input) {
      console.log('❓ Unknown command. Type "help" for available commands.');
    }
  });
  
  // Disable automatic processing - only process on manual command
  // fs.watchFile(MARKDOWN_FILE, { interval: 1000 }, (curr, prev) => {
  //   if (curr.mtime > prev.mtime) {
  //     console.log('\n📝 File changed, processing...');
  //     processMarkdownFile();
  //   }
  // });
}

// Start the watcher
startWatcher();
