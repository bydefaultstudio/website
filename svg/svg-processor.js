#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MARKDOWN_FILE = path.join(__dirname, 'svg-optimizer.md');

/**
 * Process SVG code according to the specified rules
 */
function processSVG(svgCode, options = {}) {
  const {
    hasSizeFlag: sizeFlagFromOptions = false,
    hasLogoTickerFlag: logoTickerFlagFromOptions = false,
  } = options;

  // Check for inline flag markers inside the code block
  const sizeFlagMatch = svgCode.match(/SIZE=100%\s*\n/);
  const logoTickerFlagMatch = svgCode.match(/LOGO\s*TICKER\s*\n/i);

  const hasSizeFlag = sizeFlagFromOptions || sizeFlagMatch !== null;
  const hasLogoTickerFlag = logoTickerFlagFromOptions || logoTickerFlagMatch !== null;
  
  // Remove the SIZE flag line if present
  let processedCode = svgCode.replace(/SIZE=100%\s*\n/, '');
  // Remove the LOGO TICKER flag line if present
  processedCode = processedCode.replace(/LOGO\s*TICKER\s*\n/gi, '');
  
  // Remove xmlns attributes from root svg tag
  processedCode = processedCode.replace(
    /<svg([^>]*?)\s+xmlns(?::xlink)?="[^"]*"([^>]*?)>/g,
    '<svg$1$2>'
  );
  
  // Tidy root <svg> attributes based on flags
  processedCode = processedCode.replace(
    /<svg([^>]*?)>/,
    (match, attributes) => {
      let newAttributes = attributes;

      if (hasSizeFlag || hasLogoTickerFlag) {
        newAttributes = newAttributes
          .replace(/\s+width="[^"]*"/gi, '')
          .replace(/\s+height="[^"]*"/gi, '');
      }

      // Apply SIZE=100% flag if requested
      if (hasSizeFlag) {
        newAttributes += ' width="100%" height="100%"';
      }

      // Apply Logo Ticker spec if flag present
      if (hasLogoTickerFlag) {
        if (/\s+preserveAspectRatio="/i.test(newAttributes)) {
          newAttributes = newAttributes.replace(
            /\s+preserveAspectRatio="[^"]*"/gi,
            ' preserveAspectRatio="xMidYMid meet"'
          );
        } else {
          newAttributes += ' preserveAspectRatio="xMidYMid meet"';
        }
      }

      return `<svg${newAttributes}>`;
    }
  );
  
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
- Apply the Logo Ticker spec when the \`LOGO TICKER\` flag is present (keep \`viewBox\`, set \`preserveAspectRatio="xMidYMid meet"\`, remove any \`width\`/\`height\`)
- Preserve all other attributes and formatting

## Instructions

1. Paste your SVG code in the code blocks below
2. Optionally add flag lines (e.g. \`SIZE=100%\`, \`LOGO TICKER\`) before the SVG to enable extra rules
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
        
        // Detect flag lines just before the code block
        const beforeBlockContent = content.slice(0, match.index);
        const precedingLines = beforeBlockContent.split('\n');
        let hasSizeFlagBeforeBlock = false;
        let hasLogoTickerFlagBeforeBlock = false;

        for (let i = precedingLines.length - 1; i >= 0; i--) {
          const trimmedLine = precedingLines[i].trim();
          if (trimmedLine === '') {
            continue;
          }

          const upperLine = trimmedLine.toUpperCase();
          if (upperLine === 'SIZE=100%') {
            hasSizeFlagBeforeBlock = true;
            continue;
          }
          if (upperLine === 'LOGO TICKER') {
            hasLogoTickerFlagBeforeBlock = true;
            continue;
          }

          break;
        }

        // Process the SVG
        const processedSVG = processSVG(svgCode, {
          hasSizeFlag: hasSizeFlagBeforeBlock,
          hasLogoTickerFlag: hasLogoTickerFlagBeforeBlock,
        });
        
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
    const commands = data
      .split(/\r?\n/)
      .map(line => line.trim().toLowerCase())
      .filter(line => line.length > 0);

    commands.forEach((input) => {
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
      } else {
        console.log('❓ Unknown command. Type "help" for available commands.');
      }
    });
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
