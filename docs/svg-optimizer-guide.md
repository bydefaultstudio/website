---
title: SVG Optimizer Guide
section: features
order: 10
subtitle: Automated SVG optimization for logos and icons
description: Learn how to use the SVG optimizer to automatically process SVG code for web use
---

# SVG Optimizer Guide

The SVG Optimizer is a powerful tool that automatically processes SVG code to make it web-ready for logos and icons. It handles common optimizations like setting `fill="currentColor"`, removing unnecessary attributes, and making SVGs responsive.

## Features

- **Automatic fill conversion**: Sets all `<path>` elements to use `fill="currentColor"`
- **Attribute cleanup**: Removes `xmlns` attributes from root `<svg>` tags
- **Responsive sizing**: Supports `SIZE=100%` flag for responsive SVGs
- **Batch processing**: Handles multiple SVGs in one file
- **Manual control**: Process SVGs when you're ready, not automatically
- **Template reset**: Clean up and return to template state

## Quick Start

1. **Start the watcher:**
   ```bash
   cd svg
   ./start-watcher.sh
   ```

2. **Paste your SVG code** in the markdown file code blocks

3. **Process the SVGs:**
   ```bash
   process
   ```

4. **Reset when needed:**
   ```bash
   reset
   ```

## File Structure

```
svg/
├── svg-optimizer.md    # Main markdown file for SVG input
├── svg-processor.js    # Node.js processor script
└── start-watcher.sh    # Convenience script to start watcher
```

## Usage Instructions

### Basic Workflow

1. **Paste SVG code** in the ````svg` code blocks in `svg-optimizer.md`
2. **Add flags if needed** (like `SIZE=100%` for responsive sizing)
3. **Type `process`** in the terminal to convert the SVGs
4. **Copy the optimized code** from the markdown file

### Terminal Commands

| Command | Description |
|---------|-------------|
| `process` | Convert all SVGs in the markdown file |
| `reset` | Clean up and return to template state |
| `quit` | Stop the watcher |
| `exit` | Stop the watcher |
| `help` | Show available commands |

### SVG Processing Rules

The optimizer applies these transformations:

1. **Fill conversion**: All `<path>` elements get `fill="currentColor"`
   - Replaces existing fill attributes (hex, rgb, named colors, urls)
   - Handles both `fill="color"` and `style="fill: color"` formats
   - Preserves other style properties

2. **Attribute cleanup**: Removes `xmlns` attributes from root `<svg>` tag
   - Removes `xmlns="http://www.w3.org/2000/svg"`
   - Removes `xmlns:xlink` if present
   - Preserves `viewBox` and all other attributes

3. **Responsive sizing**: When `SIZE=100%` flag is present
   - Sets `width="100%"` and `height="100%"`
   - Replaces existing width/height values
   - Preserves `viewBox` for proper scaling

4. **Format preservation**: Keeps original structure
   - Maintains element order and IDs
   - Preserves classes and ARIA attributes
   - Keeps all geometry attributes (d, x, y, etc.)
   - No minification or reformatting

## Examples

### Basic SVG Processing

**Input:**
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700"/>
</svg>
```

**Output:**
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
</svg>
```

### Responsive SVG Processing

**Input:**
```svg
SIZE=100%
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700"/>
</svg>
```

**Output:**
```svg
<svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
</svg>
```

## Best Practices

### For Logos and Icons

- **Use `currentColor`**: Makes SVGs inherit text color from parent
- **Include `viewBox`**: Ensures proper scaling
- **Use responsive sizing**: Add `SIZE=100%` for flexible layouts
- **Test in context**: Verify the SVG works in your design system

### File Organization

- **One SVG per code block**: Easier to manage and process
- **Use descriptive comments**: Add context for each SVG
- **Reset regularly**: Use `reset` command to clean up between projects

## Troubleshooting

### Common Issues

- **SVG not processing**: Check that code is in ````svg` code blocks
- **Fill not changing**: Ensure paths have proper `<path>` tags
- **Responsive not working**: Verify `SIZE=100%` flag is on line before SVG
- **Multiple SVGs**: Each should be in its own code block

### Debug Mode

The processor provides console output showing:
- Number of SVG code blocks found
- Processing status for each block
- Success/failure messages

## Integration

### With Webflow

- Copy optimized SVG code directly into Webflow
- Use as inline SVG for better performance
- Apply CSS classes for styling

### With HTML/CSS

- Use `currentColor` for theme-aware icons
- Apply responsive sizing with CSS
- Combine with CSS custom properties for theming

## Advanced Usage

### Batch Processing

Process multiple SVGs at once:
1. Paste each SVG in separate code blocks
2. Add flags as needed for each
3. Run `process` command once
4. All SVGs get optimized simultaneously

### Template Customization

Modify `svg-processor.js` to add custom processing rules:
- Add new attribute transformations
- Implement custom fill logic
- Add new flags and commands

## API Reference

### Processing Function

```javascript
function processSVG(svgCode) {
  // Handles SIZE=100% flag
  // Removes xmlns attributes
  // Converts path fills to currentColor
  // Returns optimized SVG code
}
```

### Reset Function

```javascript
function resetMarkdownFile() {
  // Restores template content
  // Clears all SVG code
  // Returns to initial state
}
```

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Review console output for errors
3. Verify SVG syntax is valid
4. Test with simple SVG first

---

*This tool is designed specifically for the ByDefault website project and optimizes SVGs for use as logos and icons in web applications.*
