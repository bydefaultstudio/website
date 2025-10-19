#!/usr/bin/env node

/**
 * Test Webflow API Permissions
 * This script tests what permissions the current API token has
 */

const { WebflowClient } = require('webflow-api');
const fs = require('fs');
const path = require('path');

// Read environment from parent .cursor/mcp.json
const mcpConfigPath = path.join(__dirname, '../.cursor/mcp.json');
let webflowToken;

try {
  const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  webflowToken = mcpConfig.mcpServers.webflow.env.WEBFLOW_TOKEN;
} catch (error) {
  console.error('❌ Error reading MCP config:', error.message);
  process.exit(1);
}

if (!webflowToken) {
  console.error('❌ WEBFLOW_TOKEN not found in .cursor/mcp.json');
  process.exit(1);
}

// Initialize Webflow API
const webflow = new WebflowClient({ accessToken: webflowToken });

async function testPermissions() {
  try {
    console.log('🔍 Testing API permissions...\n');
    
    // Test 1: List sites (this works)
    console.log('1️⃣  Testing sites.list()...');
    const sites = await webflow.sites.list();
    console.log('✅ Success! Found', sites.sites.length, 'site(s)');
    console.log('   Site:', sites.sites[0].displayName);
    console.log('');
    
    const siteId = sites.sites[0].id;
    
    // Test 2: Get site details
    console.log('2️⃣  Testing sites.get()...');
    try {
      const siteDetails = await webflow.sites.get(siteId);
      console.log('✅ Success! Got site details');
      console.log('   Custom code present:', !!siteDetails.customCode);
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
    console.log('');
    
    // Test 3: Try to update with minimal data
    console.log('3️⃣  Testing sites.update() with minimal data...');
    try {
      const updateResult = await webflow.sites.update(siteId, {
        displayName: sites.sites[0].displayName // Just update with same name
      });
      console.log('✅ Success! Can update site');
    } catch (error) {
      console.log('❌ Failed:', error.message);
      if (error.body) {
        console.log('   Error details:', JSON.stringify(error.body, null, 2));
      }
    }
    console.log('');
    
    // Test 4: Try to update custom code
    console.log('4️⃣  Testing custom code update...');
    try {
      const customCodeResult = await webflow.sites.update(siteId, {
        customCode: {
          head: '<!-- Test comment -->',
          footer: '<!-- Test comment -->'
        }
      });
      console.log('✅ Success! Can update custom code');
    } catch (error) {
      console.log('❌ Failed:', error.message);
      if (error.body) {
        console.log('   Error details:', JSON.stringify(error.body, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.body) {
      console.error('Error details:', JSON.stringify(error.body, null, 2));
    }
  }
}

testPermissions();
