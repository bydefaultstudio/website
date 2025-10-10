# Setup Guide - By Default Website Repository

## Initial Setup Required

To complete the git repository setup, you'll need to install the Xcode Command Line Tools first.

### Step 1: Install Xcode Command Line Tools

Run this command in your terminal:
```bash
xcode-select --install
```

A dialog will appear - click "Install" and accept the license agreement. This will take a few minutes.

Alternatively, you can install the full Xcode from the App Store if you prefer.

### Step 2: Verify Git Installation

After installation completes, verify git is working:
```bash
git --version
```

### Step 3: Initialize Git Repository

Navigate to the project directory and initialize:
```bash
cd "/Users/erlenmasson/Library/CloudStorage/GoogleDrive-erlen@anonivate.com/Shared drives/Studio/03 Branding/ByDefault/Website/Code"
git init
```

### Step 4: Configure Git (First Time Only)

Set your name and email for commits:
```bash
git config user.name "Your Name"
git config user.email "your.email@bydefault.studio"
```

### Step 5: Make Initial Commit

Add all files and create the first commit:
```bash
git add .
git status
git commit -m "Initial commit: By Default website repository setup"
```

### Step 6: Connect to GitHub Repository

Your GitHub repository is ready at: **https://github.com/bydefaultstudio/website**

1. **Add the remote:**
   ```bash
   git remote add origin https://github.com/bydefaultstudio/website.git
   ```

2. **Verify the remote:**
   ```bash
   git remote -v
   ```

3. **Push to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

4. **Verify on GitHub:**
   - Visit https://github.com/bydefaultstudio/website
   - You should see all your files there!

## Project Structure Created

The following structure has been set up:

```
By Default Website/
├── README.md                     # Main project documentation
├── SETUP.md                      # This file
├── .gitignore                    # Git ignore rules
├── docs/                         # Documentation
│   ├── project-info.md          # Project details and information
│   └── webflow-guidelines.md    # Webflow development guidelines
├── custom-code/                  # Custom CSS & JavaScript
│   ├── README.md                # Custom code documentation
│   ├── css/                     # Custom CSS files
│   └── js/                      # Custom JavaScript files
└── assets/                       # Project assets
    ├── images/                  # Image assets
    └── videos/                  # Video assets
```

## Next Steps After Setup

1. **Review Documentation**
   - Read through README.md for project overview
   - Check docs/webflow-guidelines.md for development guidelines

2. **Add Custom Code**
   - Place any custom CSS in `custom-code/css/`
   - Place any custom JavaScript in `custom-code/js/`
   - Update the custom-code/README.md with details

3. **Asset Management**
   - Add optimized images to `assets/images/`
   - Add videos to `assets/videos/`
   - Keep original/source files elsewhere

4. **Regular Commits**
   - Commit changes regularly with descriptive messages
   - Use conventional commit format:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation
     - `style:` for CSS/design changes
     - `refactor:` for code refactoring

## Git Workflow

### Making Changes
```bash
# Check status
git status

# Add specific files
git add path/to/file

# Or add all changes
git add .

# Commit with message
git commit -m "descriptive message about changes"

# Push to remote (if set up)
git push
```

### Viewing History
```bash
# See commit history
git log

# See recent commits (simplified)
git log --oneline -10
```

### Branching (Optional but Recommended)
```bash
# Create and switch to new branch
git checkout -b feature-name

# Switch back to main
git checkout main

# Merge feature branch into main
git merge feature-name
```

## Important Notes

⚠️ **Google Drive Sync**: Since this repository is in Google Drive, be aware:
- Git and Google Drive sync can sometimes conflict
- Consider using a dedicated git hosting service (GitHub, GitLab) as the source of truth
- Google Drive is fine for local backup, but push to a remote repository for collaboration

📝 **Webflow Specifics**:
- This repo is for documentation and custom code
- The actual Webflow design lives in Webflow's platform
- Keep this repo updated when you add custom code to Webflow

## Support

For questions:
- **Email:** hello@bydefault.studio
- **Webflow:** https://bydefault.webflow.io/
- **Production:** https://bydefault.studio

---

**Ready to Go!** Once you complete Steps 1-5 above, your repository will be fully set up and ready to use.

