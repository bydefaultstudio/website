# Code Structure & Standards

> **Version:** 1.0  
> **Author:** Erlen Masson  
> **Purpose:** This guide defines how all front-end JavaScript should be structured, commented, and organized for clarity and maintainability.

---

## Overview

This structure ensures:
- Readable, modular, and maintainable JavaScript
- Clear comment blocks and organization
- Self-contained code

---

## Code Structure

Every script follows this skeleton:

```js
/**
 * Script Purpose: [Brief description]
 * Author: Erlen Masson
 * Created: [Date]
 * Version: [SemVer]
 * Last Updated: [Date]
 */

console.log("Script v1.0 — [ModuleName] Loaded");

//
//------- Utility Functions -------//
//

// Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get element by selector
function getElement(selector) {
  return document.querySelector(selector);
}

//
//------- Main Functions -------//
//

// Init slider
function initSlider() {
  const sliders = document.querySelectorAll(".slider");
  // ... implementation
}

// Handle click
function handleClick(event) {
  // ... implementation
}

//
//------- Initialize -------//
//

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
//  handleClick();
});
```

---

## Naming Conventions

| Type | Example | Rule |
|------|----------|------|
| Functions | `initSlider()`, `handleClick()` | Use **lower camelCase**, short & descriptive |
| Variables | `mainElement`, `scrollPos` | Contextual and readable |
| File Names | `slider.js`, `utils.js` | Use lowercase kebab-case |

---

## Section Dividers

Use **clear headers** only when grouping similar functions:

```js
//
//------- Section Name -------//
//
```

For standalone functions, simple comments are fine:

```js
// Function name
function doSomething() {
  // ... implementation
}
```

Each function should include:
- A brief comment with the function name above it

---

## Initialization Pattern

Every module:
1. Defines **helpers** first
2. Defines **main function(s)** grouped by section
3. Calls everything within a single `DOMContentLoaded` listener **at the end of the script**

---

## Common Function Types

| Function Type | Description | Example |
|----------------|--------------|----------|
| **Utility** | Helpers like debouncing or element selection | `debounce()`, `getElement()` |
| **Setup** | Registers plugins or event listeners | `registerEvents()` |
| **Component** | Controls one UI element | `initSlider()` |
| **Global Init** | Calls all modules | Inside `DOMContentLoaded` |

---

## Console Logging

**Each script should include ONE `console.log()` at the top** to confirm the script has loaded:

```js
console.log("Script v1.0 — [ModuleName] Loaded");
```

**That's it.** Don't add excessive console logs throughout your code.

Only add additional console logs when:
- Debugging a specific issue
- Monitoring critical functionality
- Required for custom functionality (e.g., error tracking)

Keep your console clean and purposeful.

