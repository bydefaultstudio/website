#!/usr/bin/env node

/**
 * Script Purpose: Deploy custom code to Webflow and optionally publish
 * Author: Erlen Masson
 * Created: 2025-10-12
 * Version: 1.0
 * Usage: node deploy-to-webflow.js [--publish]
 */

const fs = require('fs');
const path = require('path');
const { WebflowClient } = require('webflow-api');

// Read environment from parent .cursor/mcp.json
const mcpConfigPath = path.join(__dirname, '../.cursor/mcp.json');
let webflowToken;

try {
  const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  webflowToken = mcpConfig.mcpServers.webflow.env.WEBFLOW_TOKEN;
} catch (error) {
  console.error('❌ Error reading MCP config:', error.message);
  console.error('💡 Make sure .cursor/mcp.json exists with your WEBFLOW_TOKEN');
  process.exit(1);
}

if (!webflowToken) {
  console.error('❌ WEBFLOW_TOKEN not found in .cursor/mcp.json');
  process.exit(1);
}

// Initialize Webflow API
const webflow = new WebflowClient({ accessToken: webflowToken });

// Read header and footer files
const headerPath = path.join(__dirname, 'header.html');
const footerPath = path.join(__dirname, 'footer.html');

let headerCode, footerCode;

try {
  headerCode = fs.readFileSync(headerPath, 'utf8');
  footerCode = fs.readFileSync(footerPath, 'utf8');
} catch (error) {
  console.error('❌ Error reading HTML files:', error.message);
  process.exit(1);
}

const shouldPublish = process.argv.includes('--publish');

console.log('🚀 Deploying custom code to Webflow...\n');
console.log('📄 Header Code:', headerCode.length, 'characters');
console.log('📄 Footer Code:', footerCode.length, 'characters');
console.log('');

async function deploy() {
  try {
    // List sites to get the site ID
    console.log('🔍 Finding your Webflow site...');
    const sitesResponse = await webflow.sites.list();
    
    console.log('Debug - Sites response:', JSON.stringify(sitesResponse, null, 2));
    
    const sites = sitesResponse.sites || sitesResponse;
    
    if (!sites || sites.length === 0) {
      console.error('❌ No Webflow sites found');
      console.error('💡 Make sure your API token has access to the site');
      process.exit(1);
    }
    
    // Use the first site
    const site = sites[0];
    const siteName = site.displayName || site.name || site.shortName || 'Unknown';
    const siteId = site.id || site._id;
    
    console.log(`✅ Found site: ${siteName}`);
    console.log(`   Site ID: ${siteId}`);
    console.log('');
    
    // Update custom code
    console.log('⬆️  Updating custom code...');
    
    // Try the sites.update method with proper data structure
    const updateData = {
      customCode: {
        head: headerCode,
        footer: footerCode
      }
    };
    
    await webflow.sites.update(siteId, updateData);
    
    console.log('✅ Custom code updated in Webflow!');
    console.log('');
    
    // Publish if requested
    if (shouldPublish) {
      console.log('📤 Publishing site...');
      const domains = await webflow.sites.publishSite({ siteId });
      console.log('✅ Site published!');
      console.log('');
    } else {
      console.log('💡 Tip: Add --publish to automatically publish the site');
      console.log('');
    }
    
    console.log('🎉 Deployment complete!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('');
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    console.error('Full error:', error);
    process.exit(1);
  }
}

deploy();

