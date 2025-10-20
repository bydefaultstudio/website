# Documentation Template System

This guide explains how to efficiently create new documentation pages using the template system.

## Quick Start

To create a new documentation page, use the `generate-page.js` script:

```bash
node generate-page.js <section> <page-name> [title]
```

### Examples

```bash
# Create an overview page
node generate-page.js overview accessibility "Accessibility Guide"

# Create a component page  
node generate-page.js components accordion "Accordion Component"

# Create a handbook page
node generate-page.js handbook animation "Animation Guide"

# Create a utility page
node generate-page.js utilities direction-provider "Direction Provider"
```

## File Structure

The script will automatically:
- Create the appropriate section directory if it doesn't exist
- Generate the HTML file with proper navigation and styling
- Set up the correct CSS path based on the section
- Include a basic page structure with placeholder content

## Generated Files

For each page, the script creates:
- `{section}/{page-name}.html` - The main documentation page
- Includes proper navigation, header, and sidebar
- Sets up the sticky QuickNav table of contents
- Uses the latest CSS version

## Template Features

The template includes:
- ✅ **Fixed Header** - Sticky navigation header
- ✅ **Sidebar Navigation** - Complete navigation with all sections
- ✅ **Sticky QuickNav** - Table of contents that sticks while scrolling
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Base UI Styling** - Matches the Base UI documentation design
- ✅ **Markdown Link** - "View as Markdown" button
- ✅ **Proper CSS Linking** - Automatically sets correct CSS path

## Manual Updates

If you need to update the template (header, navigation, etc.), edit `template.html` and then regenerate any existing pages, or update them manually.

## CSS Updates

To update the CSS version across all pages:
1. Update the version number in `generate-page.js` (line with `cssPath`)
2. Regenerate pages or manually update the version number in existing files

## Customization

After generating a page, you can:
- Edit the content in the `{{PAGE_CONTENT}}` section
- Modify the QuickNav structure in the `{{QUICK_NAV}}` section
- Add custom styling or scripts as needed

## Sections

Available sections:
- `overview` - Overview pages (quick-start, accessibility, etc.)
- `handbook` - Handbook pages (styling, animation, etc.)
- `components` - Component documentation
- `utilities` - Utility documentation

Each section maintains its own directory structure and proper relative paths.
