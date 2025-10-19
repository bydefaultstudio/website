#!/usr/bin/env node

/**
 * Test Site Token Capabilities
 * This script tests what a Site Token can actually do
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

async function testSiteToken() {
  try {
    console.log('🔍 Testing Site Token capabilities...\n');
    
    // Test 1: List sites
    console.log('1️⃣  Testing sites.list()...');
    const sites = await webflow.sites.list();
    console.log('✅ Success! Found', sites.sites.length, 'site(s)');
    const siteId = sites.sites[0].id;
    console.log('');
    
    // Test 2: Get site details
    console.log('2️⃣  Testing sites.get()...');
    const siteDetails = await webflow.sites.get(siteId);
    console.log('✅ Success! Got site details');
    console.log('   Site name:', siteDetails.displayName);
    console.log('   Custom code present:', !!siteDetails.customCode);
    if (siteDetails.customCode) {
      console.log('   Head code length:', siteDetails.customCode.head?.length || 0);
      console.log('   Footer code length:', siteDetails.customCode.footer?.length || 0);
    }
    console.log('');
    
    // Test 3: Try different update approaches
    console.log('3️⃣  Testing alternative update methods...');
    
    // Try updating site config
    try {
      console.log('   Trying sites.updateSiteConfig()...');
      await webflow.sites.updateSiteConfig(siteId, {});
      console.log('   ✅ updateSiteConfig works!');
    } catch (error) {
      console.log('   ❌ updateSiteConfig failed:', error.message);
    }
    
    // Try updating site settings
    try {
      console.log('   Trying sites.updateSiteSettings()...');
      await webflow.sites.updateSiteSettings(siteId, {});
      console.log('   ✅ updateSiteSettings works!');
    } catch (error) {
      console.log('   ❌ updateSiteSettings failed:', error.message);
    }
    
    // Try updating site directly
    try {
      console.log('   Trying sites.update()...');
      await webflow.sites.update(siteId, {});
      console.log('   ✅ sites.update works!');
    } catch (error) {
      console.log('   ❌ sites.update failed:', error.message);
    }
    
    console.log('');
    
    // Test 4: Check what methods are available
    console.log('4️⃣  Available methods on sites object:');
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(webflow.sites))
      .filter(name => typeof webflow.sites[name] === 'function')
      .sort();
    
    methods.forEach(method => {
      console.log('   -', method);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.body) {
      console.error('Error details:', JSON.stringify(error.body, null, 2));
    }
  }
}

testSiteToken();
