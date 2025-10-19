# Webflow Deployment Workflows

Quick reference for deploying to Webflow with AI assistance.

---

## 🧪 Local Testing Workflow

**When:** Testing changes locally with Live Server

**Steps:**
1. Make your code changes (CSS/JS files)
2. Start Live Server in VS Code
3. Run: `./switch-mode.sh local`
4. Tell AI: **"deploy to webflow and publish"**

**What happens:**
- ✅ URLs switch to localhost (127.0.0.1:5500)
- ✅ Deploys to Webflow staging
- ✅ Publishes to Webflow subdomain
- ✅ You can test live with localhost code

---

## 🚀 Production Release Workflow

**When:** Ready to push to production with versioned CDN

**Steps:**
1. Run: `./release-to-production.sh`
2. Enter new version (e.g., `1.3`)
3. Enter release notes
4. Script handles:
   - Git commit & push
   - GitHub release creation
   - CDN URL version bump
   - Version commit & push
5. Tell AI: **"deploy to webflow and publish"**

**What happens:**
- ✅ New GitHub release created (e.g., v1.3)
- ✅ CDN URLs updated to new version
- ✅ Deployed to Webflow
- ✅ Published live
- ✅ Production uses versioned CDN

---

## 📋 Command Reference

### Switch Modes
```bash
# Local development mode (localhost URLs)
./switch-mode.sh local

# Production mode (CDN URLs)
./switch-mode.sh prod
```

### Full Production Release
```bash
# Complete workflow: git push, release, version bump
./release-to-production.sh
```

### AI Deployment Commands

Tell your AI assistant:

**Deploy only (staging):**
> "deploy to webflow"

**Deploy and publish (live):**
> "deploy to webflow and publish"

**Check deployment info:**
> "node deploy-via-ai.js"

---

## 🔄 Typical Development Cycle

### Day-to-day Development
1. Edit CSS/JS files
2. Test locally with Live Server
3. `./switch-mode.sh local`
4. Tell AI: "deploy to webflow and publish"
5. Test on Webflow

### When Ready for Production
1. Finalize changes
2. `./release-to-production.sh`
3. Enter version: `1.4`
4. Enter notes: "Added new animations"
5. Tell AI: "deploy to webflow and publish"
6. ✅ Live with v1.4 CDN

---

## ⚙️ Configuration

### Requirements
- ✅ Node.js 22.3.0 or higher
- ✅ Webflow MCP server connected in Cursor
- ✅ GitHub CLI (`gh`) for automated releases
- ✅ Git repository with remote origin

### Optional Tools
- `gh` (GitHub CLI): `brew install gh`
  - Enables automated GitHub release creation
  - Without it, you'll need to create releases manually

---

## 🆘 Troubleshooting

**"Not a git repository"**
- Make sure you're in the project root
- Run: `git init` if needed

**"GitHub CLI not found"**
- Install: `brew install gh`
- Or create releases manually at GitHub

**"MCP server not connected"**
- Restart Cursor
- Check `.cursor/mcp.json` configuration
- Clear auth: `rm -rf ~/.mcp-auth`

**"Live Server not running"**
- Open VS Code
- Right-click project → "Open with Live Server"
- Make sure port is 5500

---

## 📚 File Structure

```
webflow/
├── header.html              # Custom head code
├── footer.html              # Custom footer code
├── switch-mode.sh           # Switch between local/prod URLs
├── release-to-production.sh # Full production workflow
├── deploy-via-ai.js         # AI deployment helper
├── manual-deploy.js         # Manual copy-paste helper
└── README.md                # Full documentation
```

---

## 💡 Pro Tips

1. **Always test locally first** with `./switch-mode.sh local`
2. **Use semantic versioning** (1.0, 1.1, 2.0, etc.)
3. **Write descriptive release notes** for your team
4. **Check Webflow staging** before publishing live
5. **The AI assistant** handles all Webflow MCP operations automatically

---

**Questions?** See [README.md](./README.md) for detailed documentation.

