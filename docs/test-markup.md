---
title: Markup Test Guide
subtitle: Comprehensive testing of all documentation markup features and styling
description: A complete test file showcasing headers, lists, code blocks, callouts, and other styling elements
section: testing
order: 1
---

# Markup Test Guide

This is a comprehensive test file to verify all the markup styling features work correctly in our documentation system.

## Headers and Typography

### H3 Header Test
This is an H3 header with proper styling and spacing.

#### H4 Header Test
This is an H4 header (should fall back to paragraph styling since we don't have specific H4 styles).

##### H5 Header Test
This is an H5 header (should also fall back to paragraph styling).

###### H6 Header Test
This is an H6 header (should also fall back to paragraph styling).

## Lists Testing

### Unordered Lists
Here's a simple unordered list:
- First item in the list
- Second item with **bold text** inside
- Third item with *italic text* inside
- Fourth item with `inline code` inside
- Fifth item with a [link to example](https://example.com)

Another unordered list with different markers:
* Alternative bullet style
* Another item with `code`
* Final item

### Ordered Lists
Here's a numbered list:
1. First numbered item
2. Second item with **bold content**
3. Third item with *italic content*
4. Fourth item with `inline code`
5. Fifth item with a [link](https://example.com)

Another numbered list:
1. Start of new list
2. Second item
3. Third item

### Mixed Content Lists
- Item with **bold** and *italic* text
- Item with `inline code` and [links](https://example.com)
- Item with multiple elements: **bold**, *italic*, `code`, and [link](https://example.com)

## Code Blocks

### JavaScript Code Block
```javascript title="example.js"
// JavaScript code example
const greeting = "Hello, World!";
const user = {
  name: "John Doe",
  age: 30,
  isActive: true
};

function sayHello(name) {
  return `Hello, ${name}!`;
}

console.log(sayHello(user.name));
```

### HTML Code Block
```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Page</title>
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>This is a test page.</p>
    </div>
</body>
</html>
```

### CSS Code Block
```css title="styles.css"
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 1rem;
}

p {
    color: #666;
    line-height: 1.6;
}
```

### Bash Code Block
```bash title="install.sh"
#!/bin/bash
echo "Installing dependencies..."
npm install
echo "Building project..."
npm run build
echo "Done!"
```

### Plain Text Code Block
```text title="README.txt"
This is a plain text file
with multiple lines
and no syntax highlighting
```

## Inline Elements

### Inline Code
Here's some `inline code` in a paragraph. You can also have **bold text** with `code` and *italic text* all mixed together.

### Links
Here are various types of links:
- [External link](https://example.com)
- [Internal link](./other-page.html)
- [Link with bold text](https://example.com) that has **bold** content
- [Link with code](https://example.com) that has `code` content

### Text Formatting
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ***Bold and italic*** combined
- `Inline code` for technical terms
- **Bold with `code`** mixed together
- *Italic with `code`* mixed together

## Callouts and Alerts

### Info Callout
> **Info**
> This is an informational callout with a title and description.

### Simple Callout
> This is a simple callout without a title, just providing additional information.

### Warning Callout
> **Warning**
> This is a warning callout to highlight important information.

### Success Callout
> **Success**
> This is a success callout to indicate successful completion.

## Complex Mixed Content

### Paragraphs with Various Elements
This paragraph contains **bold text**, *italic text*, `inline code`, and a [link to example](https://example.com). It should all be styled correctly.

Another paragraph with multiple `code snippets` and **bold emphasis** throughout the content. This tests how the parser handles mixed content.

### Lists with Complex Content
1. **Bold item** with `code` and [link](https://example.com)
2. *Italic item* with **bold** and `code` mixed
3. Item with multiple `code snippets` and **bold text**
4. Final item with all formatting: **bold**, *italic*, `code`, and [link](https://example.com)

### Code Blocks with Comments
```javascript title="complex-example.js"
// This is a complex JavaScript example
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

/**
 * Complex function with multiple parameters
 * @param {string} name - User name
 * @param {number} age - User age
 * @param {boolean} isActive - Active status
 */
function createUser(name, age, isActive) {
  if (!name || age < 0) {
    throw new Error("Invalid parameters");
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: name,
    age: age,
    isActive: isActive,
    createdAt: new Date()
  };
}

// Usage example
const user = createUser("John Doe", 30, true);
console.log("Created user:", user);
```

## Edge Cases

### Empty Lines and Spacing
This paragraph has multiple empty lines below it:



The empty lines should be handled correctly.

### Special Characters
- Item with special characters: !@#$%^&*()
- Item with quotes: "double quotes" and 'single quotes'
- Item with brackets: [brackets] and {braces}
- Item with symbols: < > & | \ / ~ \`

### Long Content
This is a very long paragraph that contains a lot of text to test how the documentation system handles lengthy content. It should wrap properly and maintain good readability with appropriate line spacing and typography. The content includes various formatting elements like **bold text**, *italic text*, `inline code`, and [links](https://example.com) to ensure they work correctly within longer paragraphs.

## Table of Contents Test

This section should appear in the table of contents on the right side of the page.

### Nested Section
This is a nested section that should appear as a child in the table of contents.

#### Deeply Nested Section
This is a deeply nested section for testing the table of contents hierarchy.

### Another Nested Section
This is another nested section at the same level.

## Final Test Section

This is the final section to test the complete document generation and ensure all elements are working correctly together.
