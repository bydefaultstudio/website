# Contributing to By Default Website

Thank you for contributing to the By Default website project! This guide will help you understand our workflow and standards.

## Getting Started

1. Read the [README.md](README.md) for project overview
2. Review [docs/webflow-guidelines.md](docs/webflow-guidelines.md) for development standards
3. Check [SETUP.md](SETUP.md) if you haven't set up the repository yet

## How to Contribute

### For Webflow Changes

1. **Access the Webflow Project**
   - Log in to Webflow
   - Navigate to By Default project
   - Use Designer for layout/styling or Editor for content

2. **Make Your Changes**
   - Follow accessibility guidelines
   - Test responsive design
   - Ensure cross-browser compatibility

3. **Test in Staging**
   - Publish to staging: https://bydefault.webflow.io/
   - Review all changes thoroughly
   - Test on multiple devices

4. **Document Changes**
   - Update relevant documentation in this repository
   - If you added custom code, save it to `/custom-code/`
   - Commit documentation changes with descriptive message

5. **Deploy to Production**
   - Get approval from stakeholders
   - Publish to production: https://bydefault.studio
   - Verify live site

### For Custom Code Contributions

1. **Create Your Code**
   - Write clean, commented code
   - Follow accessibility standards
   - Test thoroughly

2. **Add to Repository**
   - Place CSS in `/custom-code/css/`
   - Place JavaScript in `/custom-code/js/`
   - Include comments explaining purpose and usage

3. **Document Your Code**
   - Update `/custom-code/README.md`
   - Include implementation instructions
   - Note any dependencies or requirements

4. **Commit Changes**
   ```bash
   git add custom-code/
   git commit -m "feat: add [description of feature]"
   git push
   ```

5. **Implement in Webflow**
   - Add to appropriate Custom Code section
   - Test in staging first
   - Deploy to production after approval

### For Documentation

1. **Update Documentation**
   - Keep information current and accurate
   - Use clear, concise language
   - Include examples where helpful

2. **Commit Changes**
   ```bash
   git add docs/
   git commit -m "docs: update [what was changed]"
   git push
   ```

## Code Standards

### CSS
- Use consistent naming (BEM recommended)
- Comment complex selectors
- Ensure mobile-first approach
- Test for accessibility (color contrast, focus states)
- Minify for production

### JavaScript
- Use meaningful variable names
- Comment complex logic
- Handle errors gracefully
- Test across browsers
- Ensure accessibility (keyboard support, ARIA)
- Minify for production

### Accessibility Requirements
All code must meet WCAG 2.1 AA standards:
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators
- Screen reader compatibility

## Commit Message Format

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/design changes (not code style)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(blog): add new blog post template
fix(navigation): resolve mobile menu closing issue
docs(readme): update setup instructions
style(homepage): update hero section colors
```

## Pull Request Process (If Using)

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Commit**
   - Follow commit message format
   - Keep commits focused and atomic

3. **Push Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Describe changes clearly
   - Link related issues
   - Request review from team members

5. **Address Feedback**
   - Make requested changes
   - Push updates to the same branch

6. **Merge**
   - Once approved, merge to main
   - Delete feature branch after merge

## Testing Checklist

Before deploying any changes, verify:

- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Forms submit correctly
- [ ] Links are functional
- [ ] Images load and have alt text
- [ ] No console errors
- [ ] Page load time is acceptable
- [ ] SEO meta tags are present
- [ ] Accessibility standards met

## Accessibility Testing

### Tools to Use
- **Automated:** WAVE, aXe, Lighthouse
- **Manual:** Keyboard navigation, screen reader testing
- **Color:** Contrast checkers

### Screen Readers to Test
- VoiceOver (macOS/iOS)
- NVDA (Windows)
- JAWS (Windows) if available

## Questions or Issues?

- **Email:** hello@bydefault.studio
- **Documentation:** Check the `/docs` folder
- **Webflow Support:** https://university.webflow.com/

## Core Values

Remember, By Default is built on:
- **Inclusion:** Design for everyone
- **Accessibility:** Make it usable for all
- **Culture:** Create experiences that spark culture

Every contribution should honor these values.

---

Thank you for contributing to By Default! 🎨

