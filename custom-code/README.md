# Custom Code

This directory contains custom CSS and JavaScript code used in the By Default Webflow project.

## Directory Structure

```
custom-code/
├── css/           # Custom CSS snippets
├── js/            # Custom JavaScript
└── README.md      # This file
```

## Usage Guidelines

### Adding Custom Code

1. **Create a new file** in the appropriate directory (css/ or js/)
2. **Document the code** with comments explaining its purpose
3. **Test thoroughly** before adding to Webflow
4. **Update this README** with information about the new code

### CSS Files

Custom CSS should be:
- Well-commented
- Organized by component or section
- Use consistent naming conventions
- Avoid !important unless absolutely necessary
- Consider accessibility (focus states, contrast, etc.)

### JavaScript Files

Custom JavaScript should be:
- Well-documented
- Error-handled
- Performance-optimized
- Accessible (keyboard support, ARIA)
- Compatible with Webflow's jQuery

## Implementation in Webflow

### Site-wide Code
1. Go to Project Settings > Custom Code
2. Add CSS in the Head Code section
3. Add JavaScript in the Footer Code section

### Page-specific Code
1. Go to Page Settings > Custom Code
2. Add code in appropriate section (Head or Footer)

### Embedded Code
1. Use Embed element in Webflow
2. Paste code snippet
3. Preview and test

## Current Custom Code

### CSS
(Add entries as custom CSS is created)

### JavaScript

#### cursor.js
- **Purpose:** Desktop custom cursor with GSAP follow animation
- **Author:** Erlen Masson
- **Version:** 2.3
- **Last Updated:** 2025-10-08
- **Dependencies:** GSAP (GreenSock Animation Platform)
- **Features:**
  - Smooth cursor following with GSAP animations
  - Support for nested `data-cursor` attributes (child elements win)
  - Custom cursor types via CSS classes
  - Press/release animations
  - Safeguard checks for required elements
- **Required HTML Elements:**
  - `.cursor-default` - Main cursor element
  - `.cursor-halo` - Cursor halo/outer ring element
- **Usage:** Add `data-cursor="type"` attribute to elements to trigger custom cursor states
- **Implementation:** Add to Webflow Site Settings > Custom Code > Footer Code

## Best Practices

- Always backup code before making changes
- Test in staging environment first
- Minimize and optimize for production
- Keep code modular and reusable
- Comment thoroughly for future reference
- Version control all changes

## Notes

- Webflow uses jQuery - you can use $ for selectors
- Webflow interactions may conflict with custom JS
- Always test responsive behavior
- Consider performance impact of custom code

