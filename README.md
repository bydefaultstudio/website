# By Default Website

A neurodiverse-led interactive brand experiences and innovation studio designing with inclusion, accessibility, and culture as our default starting point.

## 🌐 Project Overview

This repository contains the codebase and documentation for the By Default studio website, built on Webflow.

### URLs
- **Staging:** https://bydefault.webflow.io/
- **Production:** https://bydefault.studio

## 📋 About By Default

By Default is a first of its kind neurodiverse-led interactive brand experiences and innovation studio. We build experiences that don't just reflect culture, they spark it.

### Core Values
- Inclusion
- Accessibility
- Culture-driven design

## 🛠 Technology Stack

- **Platform:** Webflow
- **Hosting:** Webflow Hosting
- **CMS:** Webflow CMS

## 📁 Project Structure

```
.
├── README.md                 # Project documentation
├── docs/                     # Additional documentation
│   ├── design-system.md     # Design system guidelines
│   └── content-strategy.md  # Content strategy
├── assets/                   # Project assets
│   ├── images/              # Image assets
│   └── videos/              # Video assets
├── css/                     # Custom CSS
└── js/                      # Custom JavaScript
```

## 🚀 Getting Started

### Prerequisites
- Access to Webflow workspace
- Designer/Editor permissions

### Webflow Setup
1. Log in to Webflow
2. Navigate to the By Default project
3. Use the Designer for layout and styling changes
4. Use the Editor for content updates

### Custom Code
Any custom CSS or JavaScript should be:
1. Documented in this repository
2. Tested in staging environment
3. Reviewed before production deployment

## 📝 Development Workflow

1. **Design Changes**
   - Make changes in Webflow Designer
   - Preview in staging environment
   - Test across devices and browsers
   - Publish to staging

2. **Content Updates**
   - Use Webflow Editor or CMS
   - Review content for accessibility
   - Publish changes

3. **Custom Code**
   - Add custom CSS to `/css/` and JavaScript to `/js/`
   - Document usage and purpose
   - Test thoroughly before implementation
   - Add to Webflow via Custom Code sections

## 🎨 Design System

Key design elements:
- **Colors:** Culture-driven, accessible color palette
- **Typography:** Modern, readable font system
- **Components:** Reusable, accessible components
- **Interactions:** Engaging, purposeful animations

## ♿ Accessibility

Accessibility is core to By Default. All features must:
- Meet WCAG 2.1 AA standards minimum
- Support keyboard navigation
- Include proper ARIA labels
- Provide text alternatives for media
- Ensure sufficient color contrast

## 📱 Responsive Design

The website is optimized for:
- Desktop (1920px+)
- Laptop (1440px)
- Tablet (768px - 991px)
- Mobile (320px - 767px)

## 🔧 Custom Features

- Interactive brand experiences
- Custom cursor integration
- Blog system
- Case studies showcase
- Project portfolio
- Newsletter integration
- Cookie consent management
- Privacy preferences

## 💻 Custom Code Documentation

### JavaScript Files

#### script.js
- **Purpose:** Main custom scripts for By Default website
- **Author:** Erlen Masson
- **Version:** 1.0
- **Created:** 2025-06-29
- **Last Updated:** 2025-07-04
- **Dependencies:** 
  - GSAP (GreenSock Animation Platform)
  - ScrollSmoother (GSAP plugin)
  - ScrollTrigger (GSAP plugin)
  - ScrollToPlugin (GSAP plugin)
  - Splide.js (slider library)
  - Splide AutoScroll extension
- **Features:**
  - **ScrollSmoother:** Smooth scrolling on non-touch devices (smoothness: 1.5)
  - **Touch Detection:** Disables smooth scroll on mobile/tablet devices
  - **Logo Slider:** Auto-scrolling logo ticker with Splide
  - **Blog Slider:** Responsive blog post carousel (3 → 2 → 1 posts)
  - **Pin Elements:** Desktop-only sticky pinning with `data-pin` attribute
  - **Table of Contents:** Auto-generated TOC with smooth scroll and active states
  - **GSAP Refresh Observer:** Automatic ScrollTrigger refresh on resize
- **Usage:**
  - Add `data-pin="100"` to elements for sticky pinning (desktop only, value in px)
  - Add class `.logo-slider` for auto-scrolling logo carousels
  - Add class `.blog-slider` for blog post sliders
  - Use `#single-article` and `#toc` for table of contents
  - Add `data-toc-offset="100"` to customize TOC scroll offset
- **Implementation:** Add to Webflow Site Settings > Custom Code > Footer Code (after GSAP and Splide)

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

### Implementation in Webflow

#### Site-wide Code
1. Go to Project Settings > Custom Code
2. Add CSS in the Head Code section
3. Add JavaScript in the Footer Code section

#### Page-specific Code
1. Go to Page Settings > Custom Code
2. Add code in appropriate section (Head or Footer)

#### Embedded Code
1. Use Embed element in Webflow
2. Paste code snippet
3. Preview and test

### Best Practices

- Always backup code before making changes
- Test in staging environment first
- Minimize and optimize for production
- Keep code modular and reusable
- Comment thoroughly for future reference
- Version control all changes
- Well-commented CSS and JavaScript
- Error-handled and performance-optimized
- Consider accessibility (focus states, contrast, keyboard support, ARIA)
- Compatible with Webflow's jQuery

## 📊 Sections

- **Home:** Hero, featured projects, brand friends, services, news
- **Work:** Project showcase and case studies
- **About:** Studio information and team
- **Services:** Service offerings
- **Blog:** News and insights
- **Contact:** Contact form and booking
- **Custom Cursor:** Custom cursor feature

## 🔒 Privacy & Compliance

- Privacy Policy
- Terms of Service
- Cookie Management
- GDPR Compliance

## 👥 Team

For questions or access requests:
- **Email:** hello@bydefault.studio
- **Social:** TikTok, Instagram, LinkedIn, YouTube

## 📄 License

© 2025 By Default. All rights reserved.

## 🔗 Links

- [GitHub Repository](https://github.com/bydefaultstudio/website)
- [Webflow Project](https://bydefault.webflow.io/)
- [Production Site](https://bydefault.studio)
- [By Default Studio](https://bydefault.studio)

---

**Note:** This is a Webflow project. The main design and development work happens in the Webflow Designer. This repository serves as a central location for custom code, documentation, and asset management.

