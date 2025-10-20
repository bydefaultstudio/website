#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');

/**
 * Frontmatter-driven Documentation Generator
 * Scans MD files in docs/ folder and generates HTML pages with dynamic navigation
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
 * Convert markdown to HTML with Base UI styling
 */
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Store code blocks as placeholders BEFORE any other processing
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\s*(?:title="([^"]*)")?\s*\n([\s\S]*?)```/g, (match, language, title, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({ language, title, code: code.trim() });
    return placeholder;
  });
  
  // Headers with cleaner typography and spacing
  html = html.replace(/^### (.*$)/gim, '<h3 class="mt-8 mb-3 scroll-mt-20 text-lg font-semibold text-gray-900" id="$1"><a class="HeadingLink text-gray-900 hover:text-primary-600 transition-colors duration-200" href="#$1">$1</a></h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="mt-10 mb-4 scroll-mt-20 text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2" id="$1"><a class="HeadingLink text-gray-900 hover:text-primary-600 transition-colors duration-200" href="#$1">$1</a></h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="mb-4 text-3xl font-bold text-gray-900" id="$1">$1</h1>');
  
  // Callouts (cleaner style)
  html = html.replace(/^> \*\*(.*?)\*\*\s*\n> (.+)$/gm, '<div class="mb-3 p-3 border-l-3 border-blue-400 bg-blue-50"><div class="font-medium text-blue-900 mb-1 text-sm">$1</div><div class="text-blue-800 text-sm">$2</div></div>');
  html = html.replace(/^> (.+)$/gm, '<div class="mb-3 p-3 border-l-3 border-gray-300 bg-gray-50"><div class="text-gray-700 text-sm">$1</div></div>');
  
  // Inline code with enhanced styling
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2.5 py-1 text-sm font-mono text-gray-800 border border-gray-200/60 shadow-sm hover:bg-gray-200/80 transition-colors duration-150">$1</code>');
  
  // Strong/Bold text
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Emphasis/Italic text
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  
  // Lists with enhanced styling - handle both * and - for unordered lists
  // First, convert list items to temporary placeholders
  html = html.replace(/^[\*\-] (.+)$/gm, 'UNORDERED_LIST_ITEM:$1');
  html = html.replace(/^\d+\. (.+)$/gm, 'ORDERED_LIST_ITEM:$1');
  
  // Then process consecutive list items into proper lists
  // Handle unordered lists
  html = html.replace(/(UNORDERED_LIST_ITEM:[^\n]*(?:\nUNORDERED_LIST_ITEM:[^\n]*)*)/g, (match) => {
    const items = match.split('\n').map(line => {
      const content = line.replace('UNORDERED_LIST_ITEM:', '');
      return `<li class="mb-1 text-gray-700 leading-6">${content}</li>`;
    }).join('\n');
    return `<ul class="mb-4 list-disc list-inside space-y-1 pl-4">\n${items}\n</ul>`;
  });
  
  // Handle ordered lists
  html = html.replace(/(ORDERED_LIST_ITEM:[^\n]*(?:\nORDERED_LIST_ITEM:[^\n]*)*)/g, (match) => {
    const items = match.split('\n').map(line => {
      const content = line.replace('ORDERED_LIST_ITEM:', '');
      return `<li class="mb-1 text-gray-700 leading-6">${content}</li>`;
    }).join('\n');
    return `<ol class="mb-4 list-decimal list-inside space-y-1 pl-4">\n${items}\n</ol>`;
  });
  
  // Links with Tailwind styling
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-800 underline font-medium">$1</a>');
  
  // Paragraphs with cleaner typography
  html = html.replace(/^(?!<[h1-6]|<div|<ul|<ol|<li|<pre|<code)(.+)$/gm, '<p class="mb-4 text-gray-700 leading-6">$1</p>');
  
  // Replace code block placeholders with actual HTML
  codeBlocks.forEach((block, index) => {
    const placeholder = `__CODE_BLOCK_${index}__`;
    const lang = block.language || 'text';
    const blockTitle = block.title || (lang === 'bash' ? 'Terminal' : lang);
    
    // Use highlight.js for syntax highlighting
    let highlightedCode;
    if (lang && hljs.getLanguage(lang)) {
      highlightedCode = hljs.highlight(block.code, { language: lang }).value;
    } else {
      highlightedCode = hljs.highlightAuto(block.code).value;
    }
    
    // Escape the code for the onclick attribute
    const escapedCode = block.code.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    const codeBlockHtml = `
<div class="my-6 bg-gray-50 border border-gray-200 overflow-hidden">
  <div class="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
    <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">${blockTitle}</span>
    <button type="button" class="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200" aria-label="Copy code" onclick="navigator.clipboard.writeText(\`${escapedCode}\`)">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      Copy
    </button>
  </div>
  <div class="relative overflow-auto bg-gray-50">
    <pre class="p-3 m-0 text-sm leading-snug font-mono text-gray-800 scrollbar-none">
      <code class="hljs">${highlightedCode}</code>
    </pre>
  </div>
</div>`;
    
    html = html.replace(placeholder, codeBlockHtml);
  });
  
  return html;
}

/**
 * Generate table of contents from HTML content
 */
function generateQuickNav(htmlContent) {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(?:.*?<a[^>]*href="#[^"]*"[^>]*>([^<]*)<\/a>.*?|([^<]*))<\/h[1-6]>/g;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3] || match[4]; // Use match[3] if it exists (with <a> tag), otherwise use match[4] (without <a> tag)
    
    headings.push({ level, id, text });
  }
  
  if (headings.length === 0) {
    return `
    <!-- Desktop Table of Contents -->
    <div class="hidden xl:block sticky top-20 overflow-y-auto">
      <div class="bg-gray-50/80 backdrop-blur-sm p-6 border border-gray-200/60">
        <div class="flex flex-col gap-4">
          <h3 class="font-mono text-sm font-semibold tracking-widest text-gray-600 uppercase">On this page</h3>
          <ul class="flex flex-col gap-2">
            <li>
              <a class="inline-block text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200" href="#">(Top)</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Mobile Table of Contents -->
    <div class="xl:hidden mb-8">
        <div class="bg-gray-50/80 backdrop-blur-sm p-4 border border-gray-200/60">
        <div class="flex flex-col gap-3">
          <h3 class="font-mono text-sm font-semibold tracking-widest text-gray-600 uppercase">On this page</h3>
          <ul class="flex flex-wrap gap-2">
            <li>
              <a class="inline-block text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white px-3 py-1.5 border border-gray-200" href="#">(Top)</a>
            </li>
          </ul>
        </div>
      </div>
    </div>`;
  }
  
  // Group headings by level to create proper hierarchy
  const groupedHeadings = [];
  let currentGroup = null;
  
  headings.forEach(heading => {
    if (heading.level === 1) {
      // Start a new top-level group
      currentGroup = {
        heading: heading,
        children: []
      };
      groupedHeadings.push(currentGroup);
    } else if (currentGroup) {
      // Add as child of current group
      currentGroup.children.push(heading);
    }
  });
  
  const renderHeading = (heading, isChild = false) => {
    const indentClass = isChild ? 'pl-4' : 'pl-0';
    return `
      <li class="flex flex-col items-start gap-1">
        <a class="inline-block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 px-2 py-1 transition-all duration-200 ${indentClass}" href="#${heading.id}">${heading.text}</a>
      </li>`;
  };
  
  const renderGroup = (group) => {
    const children = group.children.length > 0 ? `
      <ul class="flex flex-col gap-1 ml-4 mt-2">
        ${group.children.map(child => renderHeading(child, true)).join('')}
      </ul>` : '';
    
    return `
      <li class="flex flex-col items-start gap-1">
        <a class="inline-block text-sm font-medium text-gray-800 hover:text-gray-900 hover:bg-gray-100/50 px-2 py-1 transition-all duration-200" href="#${group.heading.id}">${group.heading.text}</a>
        ${children}
      </li>`;
  };
  
  const quickNavItems = groupedHeadings.map(group => renderGroup(group)).join('');
  
  return `
    <!-- Desktop Table of Contents -->
    <div class="hidden xl:block sticky top-20 overflow-y-auto">
      <div class="bg-gray-50/80 backdrop-blur-sm p-6 border border-gray-200/60">
        <div class="flex flex-col gap-4">
          <h3 class="font-mono text-sm font-semibold tracking-widest text-gray-600 uppercase">On this page</h3>
          <ul class="flex flex-col gap-2">
            <li>
              <a class="inline-block text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200" href="#">(Top)</a>
            </li>
            ${quickNavItems}
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Mobile Table of Contents -->
    <div class="xl:hidden mb-8">
        <div class="bg-gray-50/80 backdrop-blur-sm p-4 border border-gray-200/60">
        <div class="flex flex-col gap-3">
          <h3 class="font-mono text-sm font-semibold tracking-widest text-gray-600 uppercase">On this page</h3>
          <ul class="flex flex-wrap gap-2">
            <li>
              <a class="inline-block text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white px-3 py-1.5 border border-gray-200" href="#">(Top)</a>
            </li>
            ${quickNavItems.replace(/text-sm/g, 'text-xs').replace(/px-2 py-1/g, 'px-3 py-1.5').replace(/hover:bg-gray-100\/50/g, 'hover:bg-white').replace(/border border-gray-200\/60/g, 'border border-gray-200')}
          </ul>
        </div>
      </div>
    </div>`;
}

/**
 * Generate navigation HTML from file data
 */
function generateNavigation(filesBySection) {
  let navigation = '';
  
  // Sort sections alphabetically
  const sortedSections = Object.keys(filesBySection).sort();
  
  for (const section of sortedSections) {
    const files = filesBySection[section].sort((a, b) => {
      // First sort by order (lower numbers first)
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      // If order is the same, sort alphabetically by title
      return a.title.localeCompare(b.title);
    });
    
    navigation += `
                            <!-- ${section.charAt(0).toUpperCase() + section.slice(1)} Section -->
                            <div class="mb-8">
                                <div class="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 px-3">${section.charAt(0).toUpperCase() + section.slice(1)}</div>
                                <ul class="space-y-1">`;
    
    for (const file of files) {
      navigation += `
                                    <li><a href="${file.htmlPath}" class="group block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 border border-transparent hover:border-primary-200/50 hover:shadow-sm"><span class="group-hover:translate-x-1 transition-transform duration-200 inline-block">${file.title}</span></a></li>`;
    }
    
    navigation += `
                                </ul>
                            </div>`;
  }
  
  return navigation;
}

/**
 * Scan docs directory for markdown files
 */
function scanMarkdownFiles() {
  const files = [];
  const items = fs.readdirSync(DOCS_DIR);
  
  for (const item of items) {
    const itemPath = path.join(DOCS_DIR, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isFile() && item.endsWith('.md')) {
      const content = fs.readFileSync(itemPath, 'utf8');
      const { frontmatter, content: markdownContent } = parseFrontmatter(content);
      
      const filename = path.basename(item, '.md');
      const section = frontmatter.section || 'uncategorized';
      const title = frontmatter.title || filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const order = frontmatter.order || 999; // Default to 999 for alphabetical fallback
      
      files.push({
        filename,
        section,
        title,
        order: parseInt(order),
        frontmatter,
        markdownContent,
        htmlPath: `${filename}.html`
      });
    }
  }
  
  return files;
}

/**
 * Generate HTML page from template and file data
 */
function generatePage(fileData, template, navigation) {
  const htmlContent = markdownToHtml(fileData.markdownContent);
  const quickNav = generateQuickNav(htmlContent);
  
  // Determine CSS path based on file location (all files in root for now)
  const cssPath = 'styles.css';
  const indexPath = './';
  
  // Add subtitle if it exists - place it AFTER the h1
  let pageContent = htmlContent;
  if (fileData.frontmatter.subtitle) {
    const subtitleHtml = `
<div class="flex items-baseline justify-between flex-col md:flex-row -mt-2 mb-8">
  <p class="text-lg text-gray-600 leading-relaxed">${fileData.frontmatter.subtitle}</p>
  <a href="${fileData.filename}.md" class="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 hover:text-primary-800 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md" aria-label="View markdown source" rel="alternate" type="text/markdown">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <title>Markdown</title>
      <path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z" fill="currentColor"></path>
    </svg>
    View as Markdown
  </a>
</div>`;
    // Place subtitle AFTER the h1 closing tag
    pageContent = pageContent.replace(/<\/h1>/, '</h1>' + subtitleHtml);
  }
  
  // Add meta description if it exists
  const metaDescription = fileData.frontmatter.description || fileData.frontmatter.subtitle || `Documentation for ${fileData.title}`;
  
  let finalContent = template
    .replace('{{PAGE_TITLE}}', fileData.title)
    .replace('{{META_DESCRIPTION}}', metaDescription)
    .replace('{{CSS_PATH}}', cssPath)
    .replace('{{INDEX_PATH}}', indexPath)
    .replace('{{PAGE_CONTENT}}', pageContent)
    .replace('{{QUICK_NAV}}', quickNav)
    .replace('{{NAVIGATION}}', navigation);
  
  return finalContent;
}

/**
 * Main generation function
 */
function generateDocs() {
  console.log('🚀 Starting documentation generation...');
  
  // Read template
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  console.log('✅ Template loaded');
  
  // Scan markdown files
  const files = scanMarkdownFiles();
  console.log(`📁 Found ${files.length} markdown files`);
  
  // Group files by section
  const filesBySection = {};
  for (const file of files) {
    if (!filesBySection[file.section]) {
      filesBySection[file.section] = [];
    }
    filesBySection[file.section].push(file);
  }
  
  console.log(`📂 Found sections: ${Object.keys(filesBySection).join(', ')}`);
  
  // Generate navigation
  const navigation = generateNavigation(filesBySection);
  console.log('🧭 Navigation generated');
  
  // Generate HTML pages
  for (const file of files) {
    const pageContent = generatePage(file, template, navigation);
    const outputPath = path.join(DOCS_DIR, `${file.filename}.html`);
    
    fs.writeFileSync(outputPath, pageContent);
    console.log(`📄 Generated: ${file.filename}.html`);
  }
  
  console.log('✅ Documentation generation complete!');
  console.log(`📊 Generated ${files.length} HTML pages`);
}

// Run if called directly
if (require.main === module) {
  generateDocs();
}

module.exports = { generateDocs, parseFrontmatter, markdownToHtml, generateQuickNav };
