# Quick Reference Guide

## Project URLs

| Environment | URL |
|------------|-----|
| GitHub | https://github.com/bydefaultstudio/website |
| Staging | https://bydefault.webflow.io/ |
| Production | https://bydefault.studio |

## Key Contacts

- **Email:** hello@bydefault.studio
- **Social Media:** TikTok, Instagram, LinkedIn, YouTube

## Common Tasks

### Updating Blog Content
1. Log into Webflow
2. Navigate to CMS Collections > Blog Posts
3. Add/edit content
4. Publish to staging for review
5. Publish to production when approved

### Adding Custom Code
1. Create file in `/custom-code/css/` or `/custom-code/js/`
2. Document in `/custom-code/README.md`
3. Test locally if possible
4. Add to Webflow Project Settings > Custom Code
5. Publish to staging and test
6. Deploy to production

### Making Design Changes
1. Open Webflow Designer
2. Make changes
3. Preview
4. Publish to staging
5. Test thoroughly
6. Get approval
7. Publish to production

### Updating Documentation
1. Edit relevant `.md` file in `/docs/`
2. Save changes
3. Commit with message: `docs: description of change`

## File Structure

```
Code/
├── README.md                 # Main documentation
├── SETUP.md                  # Setup instructions
├── CONTRIBUTING.md           # Contribution guide
├── .gitignore               # Git ignore rules
├── .gitattributes           # Git attributes
├── docs/                    # Documentation
│   ├── project-info.md
│   ├── webflow-guidelines.md
│   └── quick-reference.md   # This file
├── custom-code/             # Custom code
│   ├── README.md
│   ├── css/                # CSS files
│   └── js/                 # JavaScript files
└── assets/                  # Assets
    ├── images/
    └── videos/
```

## Accessibility Checklist

- [ ] Alt text on all images
- [ ] Proper heading hierarchy (H1 → H6)
- [ ] Color contrast 4.5:1 minimum
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels where needed
- [ ] Form labels present
- [ ] Screen reader tested

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Device Testing

- Desktop (1920px+)
- Laptop (1440px)
- Tablet (768-991px)
- Mobile (320-767px)

## Webflow Breakpoints

| Device | Width |
|--------|-------|
| Desktop | 1920px+ |
| Laptop | 1440px |
| Tablet | 768-991px |
| Mobile Landscape | 480-767px |
| Mobile Portrait | 320-479px |

## Git Commands Quick Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "type: description"

# Push changes
git push

# Pull latest changes
git pull

# View history
git log --oneline -10

# Create branch
git checkout -b branch-name

# Switch branch
git checkout main
```

## Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - CSS/design changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance

## Deployment Workflow

1. Make changes in Webflow
2. Publish to **staging**
3. Test on staging
4. Get approval
5. Publish to **production**
6. Verify live
7. Update documentation
8. Commit changes

## Performance Targets

- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
- Page Size: < 3MB
- Image Size: < 200KB (photos), < 100KB (graphics)

## SEO Checklist

- [ ] Unique title tag (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] H1 tag (one per page)
- [ ] Logical heading hierarchy
- [ ] Descriptive URLs
- [ ] Alt text on images
- [ ] Open Graph tags
- [ ] Twitter card tags

## Emergency Contacts

If the site goes down or has critical issues:
1. Check Webflow status page
2. Contact Webflow support
3. Email: hello@bydefault.studio

## Useful Links

- [Webflow University](https://university.webflow.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## Notes

- Always test in staging first
- Keep accessibility at the forefront
- Document all custom code
- Commit changes regularly
- Follow brand guidelines
- Honor core values: Inclusion, Accessibility, Culture

---

*Last updated: October 10, 2025*

