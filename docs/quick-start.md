---
title: "Quick Start"
subtitle: "A quick guide to getting started with the ByDefault website project and its interactive features."
description: "A quick guide to getting started with the ByDefault website project and its interactive features."
section: "overview"
order: 1
---

# Quick Start

A quick guide to getting started with the ByDefault website project and its interactive features.

## Install the library

Install ByDefault using a package manager.

```bash title="Terminal"
npm i @base-ui-components/react
```

> **Note:** All components are included in a single package. ByDefault is tree-shakeable, so your app bundle will contain only the components that you actually use.

## Features

The ByDefault website includes several interactive features:

- **Custom Cursor System** - Advanced cursor interactions for desktop users
- **Audio System** - Sound feedback for user interactions
- **BD Animations** - Smooth micro-interactions and animations
- **Hero Section** - Dynamic landing page with interactive elements
- **Stacking Shapes** - Layered visual effects and transitions

## Set up

### Portals

ByDefault uses portals for components that render popups, such as Dialog and Popover.
To make portalled components always appear on top of the entire page, add the following style to your application layout root:

```tsx title="layout.tsx"
<body>
  <div className="root">
    {children}
  </div>
</body>
```

```css title="styles.css"
.root {
  isolation: isolate;
}
```

This style creates a separate stacking context for your application's `.root` element.
This way, popups will always appear above the page contents, and any `z-index` property in your styles won't interfere with them.

## Assemble a component

This demo shows you how to import a [Popover](/react/components/popover.md) component, assemble its parts, and apply styles.
There are examples for both Tailwind and CSS Modules below, but since ByDefault is unstyled, you can use CSS-in-JS, plain CSS, or any other styling solution you prefer.

## Next steps

This walkthrough outlines the basics of putting together a ByDefault component.
Browse the rest of the documentation to see what components are available in the library and how to use them.

## Working with LLMs

For those of you working with LLMs, each docs page has a "View as Markdown" link at the top, which can be shared with AI chat assistants to help them understand ByDefault concepts and component APIs.
