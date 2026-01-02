# M2 Studios Visual Editor

## How to Use:

### 1. Access the editor:
- **Local:** http://localhost:8000/editor/
- **Live:** https://m2studioscbe-dotcom.netlify.app/editor/ (after deployment)

### 2. First-time setup:
- Click "⚙️ GitHub Setup" button (bottom-right corner)
- Paste your GitHub Personal Access Token
- Click "Save Token"
- Click "Close"

### 3. Design workflow:
- Drag blocks from left sidebar onto canvas
- Click elements to select and edit them
- Use right sidebar to style elements (colors, fonts, spacing, etc.)
- Click Save button (floppy disk icon) to push changes to GitHub
- Wait 1-2 minutes for Netlify to auto-deploy

### 4. Custom M2 Studios blocks:
- **CTA Button** - Call-to-action buttons for dance classes and bookings
- **Dance Section** - Movementz Factory dance studio section template
- **Photography Section** - Momentz Photography section template

### 5. Export workflow:
- Click Export button (download icon) in toolbar
- Code is automatically copied to clipboard
- Paste into any HTML file manually if needed

## Technical Details:

### Installed Packages:
- grapesjs (v0.22.14) - Core visual editor
- grapesjs-preset-webpage (v1.0.3) - Webpage building blocks
- grapesjs-blocks-basic (v1.0.2) - Basic UI components

### Files Structure:
```
editor/
├── index.html       # Main editor page
├── editor.js        # GrapesJS configuration & custom blocks
├── github-sync.js   # GitHub integration for auto-deployment
└── README.md        # This file
```

### GitHub Integration:
- Repository: m2studioscbe-dotcom/m2studios-website
- Target file: index.html
- Auto-deployment: Netlify triggers on GitHub commits

## Security Note:
- GitHub token is stored locally in browser's localStorage
- Never share your token with anyone
- Regenerate token immediately if compromised
- Token expires on: February 1, 2026

## Troubleshooting:

### If save fails:
- Check GitHub token in Settings (click ⚙️ GitHub Setup)
- Verify token has 'repo' permissions
- Check browser console (F12) for error details

### If editor won't load:
- Clear browser cache and reload (Ctrl+Shift+R)
- Check browser console for JavaScript errors
- Ensure local server is running (http-server or npm run dev)

### If deployment fails:
- Check Netlify build logs at app.netlify.com
- Verify GitHub commit was successful
- Check for syntax errors in generated HTML/CSS

### Known Issues:
- **GitHub API Authentication:** Currently experiencing "Bad credentials" error
  - Token is correctly saved in localStorage
  - May need to regenerate token or check repository permissions
  - Workaround: Export code and commit manually via Git

## Starting Local Server:

### Option 1: Using http-server (Node.js)
```bash
npx http-server -p 8000
```
Then visit: http://localhost:8000/editor/

### Option 2: Using Python
```bash
python -m http.server 8000
# or
python3 -m http.server 8000
```
Then visit: http://localhost:8000/editor/

### Option 3: Using VS Code Live Server extension
1. Install "Live Server" extension
2. Right-click index.html
3. Select "Open with Live Server"

## Support:

For issues or questions:
- Check browser console (F12) for error messages
- Review Netlify deployment logs
- Verify GitHub repository permissions
- Contact: Arun @ M2 Studios

---

**Created:** January 3, 2026
**Version:** 1.0.0
**Powered by:** GrapesJS Visual Editor
