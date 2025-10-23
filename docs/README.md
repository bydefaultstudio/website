---
title: "Documentation System"
subtitle: "Frontmatter-driven documentation generator with Base UI styling"
description: "Complete guide to using the ByDefault documentation system for creating and managing documentation pages."
section: "overview"
---

# Documentation System

The ByDefault documentation system is a powerful, frontmatter-driven static site generator that creates beautiful documentation pages with Base UI styling.

## Quick Start

1. **Create a new documentation page:**
   ```bash
   # Create a new .md file in the docs/ folder
   touch my-new-guide.md
   ```

2. **Add frontmatter to your file:**
   ```yaml
   ---
   title: "My New Guide"
   subtitle: "A comprehensive guide to something important"
   description: "SEO description for search engines"
   section: "features"
   ---
   
   # My New Guide
   
   Your content goes here...
   ```

3. **Generate HTML pages:**
   ```bash
   npm run docs
   ```

4. **View your documentation:**
   ```bash
   # Server should already be running on http://localhost:8080
   # If not, run: npm run serve
   ```

## Frontmatter Schema

Every documentation page should start with frontmatter:

```yaml
---
title: "Page Title"           # Required - Used for H1 and navigation
subtitle: "Page subtitle"     # Optional - Shows under H1 with "View as Markdown" button
description: "Meta description" # Optional - Used for SEO meta description
section: "category-name"      # Optional - Groups pages in navigation (defaults to "uncategorized")
order: 1                      # Optional - Controls page order within section (defaults to alphabetical)
---
```

## Sections

Pages are automatically organized by section in the navigation:

- **Overview** - General project information and getting started guides
- **Features** - Interactive features and components
- **Case Studies** - Real-world examples and use cases
- **Deployment** - Deployment guides and workflows
- **Custom Sections** - Add any section name you want

## Page Ordering

Control the order of pages within each section using the `order` field:

```yaml
---
title: "Quick Start"
section: "overview"
order: 1          # This page will appear first in the overview section
---
```

```yaml
---
title: "Advanced Guide"
section: "overview"
order: 2          # This page will appear second in the overview section
---
```

```yaml
---
title: "Reference"
section: "overview"
# No order specified - will be sorted alphabetically after ordered pages
---
```

**Ordering Rules:**
- Lower numbers appear first (1, 2, 3...)
- Pages without `order` default to 999 and are sorted alphabetically
- If two pages have the same order, they're sorted alphabetically

## Markdown Features

The system supports enhanced markdown with Base UI styling:

### Code Blocks

````markdown
```javascript title="example.js"
console.log('Hello, world!');
```
````

### Callouts

```markdown
> **Note:** This is an important note with a title.

> This is a simple callout without a title.
```

### Lists

```markdown
- **Bold item** - Description
- *Italic item* - Another description
- Regular item
```

### Links

```markdown
[Link text](https://example.com)
```

## File Organization

All markdown files go in the root `docs/` folder:

```
docs/
├── quick-start.md
├── custom-cursor-guide.md
├── audio-system-guide.md
├── project-info.md
└── ... (all other .md files)
```

## Navigation

Navigation is automatically generated based on:

1. **Sections** - Grouped alphabetically
2. **Pages within sections** - Sorted alphabetically by title
3. **Dynamic updates** - Navigation updates when you add/remove files

## Commands

```bash title="Terminal"
# Generate HTML from markdown files (most common)
npm run docs

# Generate HTML only
npm run generate

# Start server only (if not already running)
npm run serve

# Generate and start server (one-time setup)
npm run docs:serve

# Watch for file changes and auto-regenerate
npm run watch

# Watch + serve (full development mode)
npm run watch:dev
```

## Development Workflow

### Option 1: Manual Generation
1. Edit your `.md` files
2. Run `npm run docs` to generate HTML from markdown
3. Refresh browser to see changes (server stays running)

### Option 2: Auto-Watch (Recommended)
1. Run `npm run watch:dev` to start both server and file watcher
2. Edit your `.md` files - HTML regenerates automatically
3. Refresh browser to see changes

## Styling

The system uses Base UI styling for:

- **Headers** - Proper hierarchy with scroll anchors
- **Code blocks** - Syntax highlighting and copy buttons
- **Callouts** - Colored info boxes and notes
- **Navigation** - Sticky sidebar with smooth scrolling
- **Table of contents** - Auto-generated from headings

## Adding New Content

1. **Create your markdown file** with proper frontmatter
2. **Run `npm run generate`** to create HTML
3. **Your page appears automatically** in the navigation

## Customization

### Adding New Sections

Simply use any section name in your frontmatter:

```yaml
section: "my-new-section"
```

### Custom Styling

Modify `styles.css` to customize the appearance of your documentation.

### Template Changes

Update `template.html` to modify the overall page structure.

## Best Practices

- **Use descriptive titles** - Clear, concise page titles
- **Add subtitles** - Help users understand what each page covers
- **Organize by sections** - Group related content together
- **Use callouts** - Highlight important information
- **Include code examples** - Show practical implementations
- **Keep content focused** - One main topic per page

## Troubleshooting

### Pages not appearing in navigation
- Check that your frontmatter is properly formatted
- Ensure the file is saved as `.md`
- Run `npm run generate` to regenerate

### Styling issues
- Check that `styles.css` is linked correctly
- Verify Tailwind CSS is loading
- Clear browser cache

### Generation errors
- Check markdown syntax
- Verify frontmatter format
- Look for special characters in filenames