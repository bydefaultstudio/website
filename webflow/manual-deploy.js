#!/usr/bin/env node

/**
 * Manual Deploy Script
 * Generates files ready for manual copy-paste to Webflow
 */

const fs = require('fs');
const path = require('path');

// Read header and footer files
const headerPath = path.join(__dirname, 'header.html');
const footerPath = path.join(__dirname, 'footer.html');

try {
  const headerCode = fs.readFileSync(headerPath, 'utf8');
  const footerCode = fs.readFileSync(footerPath, 'utf8');
  
  console.log('🚀 Manual Deploy - Ready for Copy-Paste!\n');
  console.log('📋 Follow these steps:\n');
  
  console.log('1️⃣  Go to your Webflow site: " By Default v2"');
  console.log('2️⃣  Site Settings → Custom Code');
  console.log('3️⃣  Copy the code below:\n');
  
  console.log('📄 HEAD CODE (copy this):');
  console.log('─'.repeat(50));
  console.log(headerCode);
  console.log('─'.repeat(50));
  console.log('');
  
  console.log('📄 FOOTER CODE (copy this):');
  console.log('─'.repeat(50));
  console.log(footerCode);
  console.log('─'.repeat(50));
  console.log('');
  
  console.log('✅ Paste the HEAD code into "Head Code" section');
  console.log('✅ Paste the FOOTER code into "Footer Code" section');
  console.log('✅ Click "Save Changes"');
  console.log('✅ Publish your site');
  console.log('');
  
  console.log('🎉 Your custom code will be live!');
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
  process.exit(1);
}
