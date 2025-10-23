---
title: "Markdown Style Guide"
subtitle: "Consistent formatting standards for all documentation pages"
description: "Comprehensive guide to markdown formatting standards, ensuring consistent and readable documentation across all pages."
section: "overview"
order: 2
---

# Markdown Style Guide

This guide defines the consistent formatting standards for all documentation pages in the ByDefault project.

## Overview

All markdown files should follow these standardized patterns to ensure:

- **Consistent visual hierarchy** - Clear heading structure and spacing
- **Readable content** - Proper list formatting and code block styling
- **Maintainable structure** - Standardized dividers and organization
- **Professional appearance** - Clean, modern documentation styling

---

## Headings

### Hierarchy

Use a clear heading hierarchy with consistent spacing:

```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection Title (H3)
#### Detail Title (H4)
```

### Styling Rules

- **No emojis in headings** - Keep headings clean and professional
- **Use sentence case** - Capitalize only the first word and proper nouns
- **Be descriptive** - Headings should clearly indicate content

### Examples

```markdown
# Audio System Guide
## Implementation
### Audio Manager
#### Configuration Options
```

---

## Lists

### Bullet Points

Use dashes (`-`) for all unordered lists:

```markdown
- **Bold item** - Description with explanation
- *Italic item* - Another description
- Regular item - Simple description
```

### Nested Lists

Use proper indentation for nested items:

```markdown
- Main item
  - Nested item
    - Deeply nested item
- Another main item
```

### Numbered Lists

Use numbered lists for sequential steps:

```markdown
1. First step
2. Second step
3. Third step
```

### List Spacing

Always add a blank line before lists:

```markdown
The system includes several features:

- Feature one
- Feature two
- Feature three
```

---

## Code Blocks

### Language Tags

Always specify the language for code blocks:

```markdown
```javascript title="example.js"
const example = 'code here';
```
```

### Common Languages

- `javascript` - JavaScript code
- `html` - HTML markup
- `css` - CSS styles
- `bash` - Terminal commands
- `yaml` - YAML configuration
- `json` - JSON data
- `markdown` - Markdown examples

### Titles

Use descriptive titles for code blocks:

```markdown
```bash title="Terminal"
npm install package-name
```

```javascript title="script.js"
function example() {
  return 'code';
}
```
```

---

## Dividers

### Usage

Use horizontal dividers (`---`) to separate major sections:

```markdown
## First Section

Content here...

---

## Second Section

More content...
```

### Placement

Place dividers:

- **Between major sections** - Separate different topics
- **Before troubleshooting** - Isolate help content
- **Before API references** - Separate technical details
- **After frontmatter** - Never use dividers in frontmatter

---

## Callouts

### Important Notes

```markdown
> **Important:** This is a critical piece of information that users need to know.
```

### General Notes

```markdown
> This is a helpful note or tip for users.
```

### Warning Callouts

```markdown
> **Warning:** This action cannot be undone.
```

---

## Tables

### Basic Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Table Alignment

Use consistent column alignment:

```markdown
| Method | Parameters | Description |
|--------|------------|-------------|
| `init()` | None | Initialize system |
| `play()` | `sound: string` | Play sound effect |
```

---

## Links

### Internal Links

```markdown
[Link text](/path/to/page)
```

### External Links

```markdown
[External link](https://example.com)
```

### Code Links

```markdown
[`functionName()`](#function-name)
```

---

## Inline Code

### Code Snippets

```markdown
Use the `data-bd-animate` attribute to enable animations.
```

### File Names

```markdown
Edit the `package.json` file to add dependencies.
```

### Commands

```markdown
Run `npm install` to install dependencies.
```

---

## Emphasis

### Bold Text

```markdown
**Important text** for emphasis
```

### Italic Text

```markdown
*Optional text* for subtle emphasis
```

### Code Emphasis

```markdown
**Required:** `data-bd-animate` attribute
```

---

## File Structure

### Frontmatter

Every file must start with frontmatter:

```yaml
---
title: "Page Title"
subtitle: "Brief description"
description: "SEO description"
section: "category"
order: 1
---
```

### Content Organization

Structure content logically:

1. **Overview** - Brief introduction
2. **Main sections** - Core content
3. **Examples** - Code examples
4. **Configuration** - Settings and options
5. **Troubleshooting** - Common issues
6. **API Reference** - Technical details

---

## Best Practices

### Content Guidelines

- **Be concise** - Get to the point quickly
- **Use examples** - Show, don't just tell
- **Be consistent** - Follow established patterns
- **Test thoroughly** - Verify all code examples work

### Formatting Guidelines

- **Consistent spacing** - Use blank lines appropriately
- **Proper hierarchy** - Use headings logically
- **Clean code blocks** - Always include language tags
- **Readable lists** - Use proper indentation

### Maintenance

- **Regular reviews** - Check for consistency
- **Update examples** - Keep code current
- **Test changes** - Verify formatting works
- **Follow standards** - Use this guide as reference

---

## Common Patterns

### Feature Documentation

```markdown
# Feature Name

Brief description of the feature.

## Overview

What this feature does and why it's useful.

## Implementation

How to implement the feature.

```javascript title="example.js"
// Code example
```

## Configuration

Available options and settings.

---

## Troubleshooting

Common issues and solutions.
```

### API Documentation

```markdown
# API Reference

Complete reference for the API.

## Methods

### methodName()

Description of the method.

**Parameters:**
- `param1` (string) - Description
- `param2` (number) - Description

**Returns:** Description of return value

**Example:**

```javascript title="example.js"
const result = methodName('param1', 123);
```
```

---

## Validation

### Checklist

Before submitting documentation, verify:

- [ ] All headings follow the hierarchy
- [ ] Lists use dashes (`-`) consistently
- [ ] Code blocks have language tags
- [ ] Dividers separate major sections
- [ ] Callouts use proper formatting
- [ ] Tables are properly aligned
- [ ] Links work correctly
- [ ] Examples are tested

### Tools

Use these tools to validate formatting:

```bash title="Terminal"
# Generate HTML to check formatting
npm run generate

# Start server to preview changes
npm run serve
```

---

## Examples

### Good Example

```markdown
# Audio System

The audio system provides sound feedback for user interactions.

## Overview

The system enhances user experience through:

- **Interactive feedback** - Sound effects for interactions
- **Volume controls** - User-configurable levels
- **Accessibility** - Respects user preferences

## Implementation

### Basic Usage

```javascript title="audio.js"
const audioManager = new AudioManager();
await audioManager.init();
```

---

## Configuration

### Volume Control

Set the audio volume:

```javascript
audioManager.setVolume(0.7);
```
```

### Bad Example

```markdown
# 🎵 Audio System Guide

The audio system provides sound feedback for user interactions.

## Overview
The system enhances user experience through:
* Interactive feedback - Sound effects for interactions
* Volume controls - User-configurable levels
* Accessibility - Respects user preferences

## Implementation
### Basic Usage
```javascript
const audioManager = new AudioManager();
await audioManager.init();
```
## Configuration
### Volume Control
Set the audio volume:
```javascript
audioManager.setVolume(0.7);
```
```

---

## Conclusion

Following this style guide ensures consistent, professional, and maintainable documentation. When in doubt, refer to this guide or check existing files for examples of proper formatting.
