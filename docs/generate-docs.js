#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

/**
 * Frontmatter-driven Documentation Generator
 * Uses marked for markdown parsing and github-markdown-css for styling
 */

// Configuration
const DOCS_DIR = __dirname;
const TEMPLATE_FILE = path.join(DOCS_DIR, 'template.html');
const STYLES_FILE = path.join(DOCS_DIR, 'styles.css');

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content: content.trim() };
  }
  
  const frontmatterText = match[1];
  const markdownContent = match[2];
  
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, content: markdownContent.trim() };
}

/**
 * Convert markdown to HTML using marked
 */
function markdownToHtml(markdown) {
  // Configure marked options
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  let html = marked(markdown);
  
  // Add IDs to headings after parsing
  html = html.replace(/<h([1-6])>([^<]+)<\/h[1-6]>/g, (match, level, text) => {
    const id = text.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  return html;
}

/**
 * Generate table of contents from HTML content
 */
function generateTableOfContents(html) {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>.*?<\/h[1-6]>/g;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[0].replace(/<[^>]*>/g, '').trim();
    
    // Only include H1 and H2 headings in TOC
    if (level <= 2) {
      headings.push({ level, id, text });
    }
  }

  if (headings.length === 0) {
    return '<div class="text-sm text-gray-500 italic">No headings found</div>';
  }

  let toc = '<div class="space-y-1">';
  let currentLevel = 0;

  headings.forEach((heading, index) => {
    const { level, id, text } = heading;
    
    if (level > currentLevel) {
      // Opening new nested level
      for (let i = currentLevel; i < level; i++) {
        toc += '<ul class="ml-4 space-y-1">';
      }
    } else if (level < currentLevel) {
      // Closing nested levels
      for (let i = currentLevel; i > level; i--) {
        toc += '</ul>';
      }
    }
    
    currentLevel = level;
    
    toc += `<li class="flex flex-col items-start gap-1">
      <a class="inline-block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 px-2 py-1 transition-all duration-200 pl-${(level - 1) * 4}" href="#${id}">${text}</a>
    </li>`;
  });

  // Close any remaining nested levels
  for (let i = currentLevel; i > 0; i--) {
    toc += '</ul>';
  }

  toc += '</div>';
  return toc;
}

/**
 * Generate navigation HTML
 */
function generateNavigation(filesBySection, currentPage = null) {
  let navigation = '';
  
  // Sort sections alphabetically
  const sortedSections = Object.keys(filesBySection).sort();
  
  for (const section of sortedSections) {
    const files = filesBySection[section];
    
    // Sort files by order, then by title
    files.sort((a, b) => {
      const orderA = a.frontmatter.order || 999;
      const orderB = b.frontmatter.order || 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });
    
    navigation += `
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">${section}</h3>
        <ul class="space-y-1">
    `;
    
    for (const file of files) {
      const isActive = currentPage && currentPage.filename === file.filename;
      const activeClasses = isActive 
        ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-sm font-medium' 
        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700 border-transparent hover:border-primary-200/50 hover:shadow-sm';
      
      navigation += `
        <li><a href="${file.htmlPath}" class="group block px-4 py-3 text-sm ${activeClasses} transition-all duration-200 border hover:shadow-sm"><span class="group-hover:translate-x-1 transition-transform duration-200 inline-block">${file.title}</span></a></li>
      `;
    }
    
    navigation += `
        </ul>
      </div>
    `;
  }
  
  return navigation;
}

/**
 * Generate page HTML
 */
function generatePage(file, template, navigation) {
  const { frontmatter, content } = file;
  const htmlContent = markdownToHtml(content);
  const tableOfContents = generateTableOfContents(htmlContent);
  
  // Add page header with subtitle and markdown link
  let pageHeader = `<div class="flex items-baseline justify-between flex-col md:flex-row -mt-2 mb-8">`;
  
  if (frontmatter.subtitle) {
    pageHeader += `<p class="text-lg text-gray-600 leading-relaxed">${frontmatter.subtitle}</p>`;
  }
  
  pageHeader += `<a href="${file.markdownPath}" class="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 hover:text-primary-800 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md" aria-label="View markdown source" rel="alternate" type="text/markdown">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <title>Markdown</title>
      <path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z" fill="currentColor"></path>
    </svg>
    View as Markdown
  </a>`;
  
  pageHeader += `</div>`;
  
  const fullContent = pageHeader + htmlContent;
  
  return template
    .replace('{{PAGE_TITLE}}', frontmatter.title || 'Untitled')
    .replace('{{META_DESCRIPTION}}', frontmatter.description || '')
    .replace('{{PAGE_CONTENT}}', fullContent)
    .replace('{{NAVIGATION}}', navigation)
    .replace('{{QUICK_NAV}}', `
      <div class="sticky top-8">
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">On this page</h3>
          ${tableOfContents}
        </div>
      </div>
    `)
    .replace('{{INDEX_PATH}}', 'index.html');
}

/**
 * Main generation function
 */
async function generateDocs() {
  console.log('🚀 Starting documentation generation...');
  
  // Load template
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  console.log('✅ Template loaded');
  
  // Find all markdown files
  const markdownFiles = fs.readdirSync(DOCS_DIR)
    .filter(file => file.endsWith('.md'))
    .filter(file => !file.startsWith('README') || file === 'README.md'); // Include README.md but not other README files
  
  console.log(`📁 Found ${markdownFiles.length} markdown files`);
  
  // Parse files and organize by section
  const filesBySection = {};
  const allFiles = [];
  
  for (const filename of markdownFiles) {
    const filePath = path.join(DOCS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, content: markdownContent } = parseFrontmatter(content);
    
    const title = frontmatter.title || filename.replace('.md', '');
    const section = frontmatter.section || 'uncategorized';
    const htmlPath = filename.replace('.md', '.html');
    const markdownPath = filename;
    
    const file = {
      filename,
      title,
      section,
      htmlPath,
      markdownPath,
      frontmatter,
      content: markdownContent
    };
    
    if (!filesBySection[section]) {
      filesBySection[section] = [];
    }
    filesBySection[section].push(file);
    allFiles.push(file);
  }
  
  console.log(`📂 Found sections: ${Object.keys(filesBySection).join(', ')}`);
  
  // Generate HTML for each file
  for (const file of allFiles) {
    const navigation = generateNavigation(filesBySection, file);
    const pageContent = generatePage(file, template, navigation);
    const outputPath = path.join(DOCS_DIR, file.htmlPath);
    
    fs.writeFileSync(outputPath, pageContent);
    console.log(`📄 Generated: ${file.htmlPath}`);
  }
  
  console.log('✅ Documentation generation complete!');
  console.log(`📊 Generated ${allFiles.length} HTML pages`);
}

// Run the generator
generateDocs().catch(console.error);