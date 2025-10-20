# Archive Folder

This folder contains the old documentation structure that was used before migrating to the new frontmatter-driven system.

## What's Here

### `old-structure/`
Contains the previous folder-based organization:

- **`case-studies/`** - Case study documentation
- **`components/`** - Component documentation  
- **`deployment/`** - Deployment guides
- **`features/`** - Feature documentation
- **`handbook/`** - Handbook sections
- **`overview/`** - Overview pages
- **`utilities/`** - Utility documentation

### Old Scripts
- **`generate-all.sh`** - Old batch generation script
- **`generate-page.js`** - Old single page generator
- **`deploy.sh`** - Old deployment script
- **`TEMPLATE_GUIDE.md`** - Old template documentation

## Migration Notes

All content from these old folders has been migrated to the new system:

1. **Markdown files** were moved to the root `docs/` folder
2. **Frontmatter** was added to each file for proper categorization
3. **HTML files** are now generated dynamically from the new system
4. **Navigation** is now automatically generated from frontmatter

## New System

The new documentation system uses:

- **Single root folder** (`docs/`) for all markdown files
- **Frontmatter-driven** organization by section
- **Dynamic navigation** generation
- **Base UI styling** for consistent appearance
- **Automatic HTML generation** from markdown

## When to Delete

This archive can be safely deleted once you're confident the new system is working properly and you no longer need to reference the old structure.

**Created:** $(date)
**Reason:** Migration to frontmatter-driven documentation system
