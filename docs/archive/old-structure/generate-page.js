#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate a new documentation page from template
 * Usage: node generate-page.js <section> <page-name> [title]
 * 
 * Examples:
 * node generate-page.js overview accessibility "Accessibility Guide"
 * node generate-page.js components accordion "Accordion Component"
 * node generate-page.js handbook animation "Animation Guide"
 */

function generatePage(section, pageName, title = null) {
    // Set defaults
    const pageTitle = title || pageName.charAt(0).toUpperCase() + pageName.slice(1);
    const fileName = `${pageName}.html`;
    
    // Determine the directory and CSS path
    const sectionDir = path.join(__dirname, section);
    const cssPath = section === 'overview' ? '../styles.css?v=1.0.7' : '../../styles.css?v=1.0.7';
    
    // Create section directory if it doesn't exist
    if (!fs.existsSync(sectionDir)) {
        fs.mkdirSync(sectionDir, { recursive: true });
        console.log(`Created directory: ${sectionDir}`);
    }
    
    // Read template
    const templatePath = path.join(__dirname, 'template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders
    template = template.replace(/\{\{PAGE_TITLE\}\}/g, pageTitle);
    template = template.replace(/\{\{CSS_PATH\}\}/g, cssPath);
    template = template.replace(/\{\{PAGE_CONTENT\}\}/g, getPageContent(pageTitle));
    template = template.replace(/\{\{QUICK_NAV\}\}/g, getQuickNav(pageTitle));
    
    // Write the new file
    const filePath = path.join(sectionDir, fileName);
    fs.writeFileSync(filePath, template);
    
    console.log(`✅ Generated: ${filePath}`);
    console.log(`📝 Page Title: ${pageTitle}`);
    console.log(`🔗 URL: ${section}/${fileName}`);
}

function getPageContent(pageTitle) {
    return `
                    <h1 class="mb-4 text-3xl font-bold text-balance" id="${pageTitle.toLowerCase().replace(/\s+/g, '-')}">${pageTitle}</h1>
                    <div class="Subtitle flex items-baseline justify-between flex-col md:flex-row -mt-2 mb-5">
                        <p>A guide to ${pageTitle.toLowerCase()}.</p>
                        <a href="${pageTitle.toLowerCase().replace(/\s+/g, '-')}.md" class="flex-shrink-0" aria-label="View markdown source" rel="alternate" type="text/markdown">
                            <span class="MarkdownLink">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <title>Markdown</title>
                                    <path d="M22.269 19.385H1.731a1.73 1.73 0 0 1-1.73-1.73V6.345a1.73 1.73 0 0 1 1.73-1.73h20.538a1.73 1.73 0 0 1 1.73 1.73v11.308a1.73 1.73 0 0 1-1.73 1.731zm-16.5-3.462v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z" fill="currentColor"></path>
                                </svg>
                                View as Markdown
                            </span>
                        </a>
                    </div>
                    
                    <h2 class="mt-10 mb-4 scroll-mt-18 text-xl font-medium text-balance show-side-nav:scroll-mt-6" id="introduction">
                        <a class="HeadingLink" href="#introduction">Introduction</a>
                    </h2>
                    <p class="mb-4">This is a placeholder for the ${pageTitle.toLowerCase()} content. Replace this with your actual content.</p>
                    
                    <h2 class="mt-10 mb-4 scroll-mt-18 text-xl font-medium text-balance show-side-nav:scroll-mt-6" id="getting-started">
                        <a class="HeadingLink" href="#getting-started">Getting Started</a>
                    </h2>
                    <p class="mb-4">Add your content here.</p>
                    
                    <h2 class="mt-10 mb-4 scroll-mt-18 text-xl font-medium text-balance show-side-nav:scroll-mt-6" id="examples">
                        <a class="HeadingLink" href="#examples">Examples</a>
                    </h2>
                    <p class="mb-4">Add examples and code snippets here.</p>`;
}

function getQuickNav(pageTitle) {
    const slug = pageTitle.toLowerCase().replace(/\s+/g, '-');
    return `
                        <div class="QuickNavContainer base-ui-disable-scrollbar">
                            <nav aria-label="On this page" class="QuickNavRoot sticky top-8">
                                <div class="QuickNavInner">
                                    <header class="QuickNavTitle">${pageTitle}</header>
                                    <ul class="QuickNavList">
                                        <li class="QuickNavItem"><a class="QuickNavLink" href="#">(Top)</a><ul class="QuickNavList"></ul></li>
                                        <li class="QuickNavItem"><a class="QuickNavLink" href="#introduction">Introduction</a><ul class="QuickNavList"></ul></li>
                                        <li class="QuickNavItem"><a class="QuickNavLink" href="#getting-started">Getting Started</a><ul class="QuickNavList"></ul></li>
                                        <li class="QuickNavItem"><a class="QuickNavLink" href="#examples">Examples</a><ul class="QuickNavList"></ul></li>
                                    </ul>
                                </div>
                            </nav>
                        </div>`;
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node generate-page.js <section> <page-name> [title]');
    console.log('');
    console.log('Examples:');
    console.log('  node generate-page.js overview accessibility "Accessibility Guide"');
    console.log('  node generate-page.js components accordion "Accordion Component"');
    console.log('  node generate-page.js handbook animation "Animation Guide"');
    process.exit(1);
}

const [section, pageName, title] = args;
generatePage(section, pageName, title);
