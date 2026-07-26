# PROJECT_RULES.md

> This file defines how you **must** work on this project. These rules are permanent and non-negotiable.

---

## Rules

### 1. Never modify main directly.
All changes must go through feature branches. Direct commits to `main` are forbidden.

### 2. Always create a feature branch.
Every task, fix, or feature gets its own branch. Name it descriptively:
- `fix/whatsapp-links`
- `feature/lazy-loading`
- `chore/update-deps`

### 3. Maximum 10 files per commit.
Keep commits atomic and focused. If a task requires more than 10 file changes, split it into multiple commits.

### 4. Verify every commit using Playwright.
After every commit (and before merging), run Playwright tests:
- Desktop (1920px): Homepage, Services, Portfolio, Admin, Editor
- Mobile (375px): Homepage, Services, Portfolio
- Check console errors, broken images, broken links on every page.

### 5. Never leave console errors.
Zero console errors on every page. If a console error exists, it must be fixed before merge.

### 6. Never leave broken images.
Every `<img>` tag must load successfully (`naturalWidth > 0`). Replace broken sources with valid placeholders or remove them.

### 7. Never leave broken links.
Every `<a href>` must point to a valid destination. WhatsApp links must include the full phone number (`wa.me/919790825751`). No empty or placeholder URLs.

### 8. Verify desktop and mobile.
Every verification pass must include both viewports:
- **Desktop**: 1920x1080
- **Mobile**: 375x812 (iPhone form factor)

### 9. Preserve Cloudflare Functions.
Never delete, rename, or break files under `functions/`. These handle API routing on Cloudflare Pages.

### 10. Preserve GrapesJS editor.
Never break `editor/index.html`, `editor/editor.js`, `editor/github-sync.js`, or `editor/ai-integration.js`. The visual editor is a critical feature.

### 11. Preserve admin dashboard.
Never break `admin/config.yml` or the CMS admin interface. Test it loads without errors during verification.

### 12. Preserve GitHub workflows.
Never delete or break `.github/` workflows. If you need to add CI, extend existing workflows.

### 13. Never expose API keys.
- Never commit `.env`, `.env.local`, or any secrets.
- Never hardcode API keys in HTML, JS, or CSS.
- All secrets must be set via Cloudflare Pages environment variables.
- PATs and tokens are for local use only.

### 14. Always create meaningful commit messages.
Follow this format:
```
<type>: <short description>

<optional body explaining what and why>
```
Types: `fix`, `feat`, `chore`, `refactor`, `style`, `docs`, `test`

### 15. Before declaring success, verify the production deployment.
After merging to `main`:
1. Wait for Cloudflare Pages deployment to complete (`check-runs` status: `completed / success`).
2. Run Playwright verification against `https://m2studios-website.pages.dev`.
3. Only declare success after production passes all checks.

---

## Verification Checklist

```
[ ] Branch created from main
[ ] Changes committed (max 10 files each)
[ ] Desktop verified (1920px) — all pages
[ ] Mobile verified (375px) — all pages
[ ] 0 console errors
[ ] 0 broken images
[ ] 0 broken links
[ ] 0 empty WhatsApp links
[ ] Cloudflare Functions intact
[ ] GrapesJS editor loads
[ ] Admin dashboard loads
[ ] No secrets exposed
[ ] Branch merged to main
[ ] Cloudflare deployment completed
[ ] Production site verified via Playwright
```
