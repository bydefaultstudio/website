---
title: Quick start
subtitle: A quick guide to getting started with ByDefault components and documentation.
description: Learn how to get started with ByDefault components and documentation.
---

# Quick start

A quick guide to getting started with ByDefault components and documentation.

ByDefault components are unstyled, don't bundle CSS, and are compatible with Tailwind, CSS Modules, CSS-in-JS, or any other styling solution you prefer.
You retain total control of your styling layer.

## Install the library

Install ByDefault components using a package manager.

```bash
npm i @base-ui-components/react
```

All components are included in a single package. ByDefault is tree-shakeable, so your app bundle will contain only the components that you actually use.

## Set up

### Portals

ByDefault uses portals for components that render popups, such as Dialog and Popover. To make portalled components always appear on top of the entire page, add the following style to your application layout root:

```tsx
<body>
  <div className="root">
    {children}
  </div>
</body>
```

```css
.root {
  isolation: isolate;
}
```

This style creates a separate stacking context for your application's `.root` element. This way, popups will always appear above the page contents, and any `z-index` property in your styles won't interfere with them.

### iOS 26+ Safari

Starting with iOS 26, Safari allows content beneath the UI chrome to be visible. Backdrops such as those used by dialogs must use `position: absolute` instead of `position: fixed` to cover the entire visual viewport. For this to work after the page was scrolled, the following style must be added to your global styles:

```css
body {
  position: relative;
}
```

## Assemble a component

This demo shows you how to import a [Popover](/react/components/popover) component, assemble its parts, and apply styles. There are examples for both Tailwind and CSS Modules below, but since ByDefault is unstyled, you can use CSS-in-JS, plain CSS, or any other styling solution you prefer.

## Next steps

This walkthrough outlines the basics of putting together a ByDefault component. Browse the rest of the documentation to see what components are available in the library and how to use them.

## Working with LLMs

For those of you working with LLMs, each docs page has a "View as Markdown" link at the top, which can be shared with AI chat assistants to help them understand ByDefault concepts and component APIs.

Additionally, there is an ["llms.txt"](/llms.txt) link in the "Handbook" section of the navigation sidebar, which you can feed to AI chat assistants to help them navigate the docs.
