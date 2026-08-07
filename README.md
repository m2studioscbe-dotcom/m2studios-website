# M² Studios Website (v2.1)

Production website for **M² Studios** — three brands under one roof:
**Movementz Factory** (dance studio), **Momentz Photography** (photo/video),
and the **M² Studios** umbrella brand. Coimbatore, India.

- Live site: https://m2studios-website.pages.dev
- Platform: Vite 6 + Handlebars partials, three.js hero, Cloudflare Pages

---

## Repository layout

This repository is the **single source of truth**. Two kinds of content live here:

### 1. Source (edit these)

| Path | Purpose |
|---|---|
| `src/index.html`, `src/services.html`, `src/portfolio.html` | The 3 pages (Handlebars templates) |
| `src/partials/` | Shared `head`, `header`, `footer` (Handlebars partials) |
| `src/css/` | `base`, `layout`, `sections`, `components`, `buttons`, `responsive`, `animations` |
| `src/js/` | Feature modules (gallery, hero-canvas, menu, faq, form, cursor, etc.) |
| `public/` | Static assets copied verbatim into the build (images, editor, admin, favicon) |
| `package.json`, `package-lock.json`, `vite.config.js` | Build tooling (lockfile is committed — use `npm ci`) |

### 2. Deployed output (produced by the build, served by Cloudflare Pages)

| Path | Purpose |
|---|---|
| `index.html`, `services.html`, `portfolio.html` | Built pages (hashed asset refs) |
| `assets/` | Hashed CSS/JS bundles + three.js chunk |
| `images/`, `favicon.svg`, `robots.txt`, `sitemap.xml` | Public assets |

**Do not hand-edit the deployed output.** Rebuild it from `src/` (see below).

### Legacy/protected areas

`functions/` (Cloudflare Workers), `editor/` (GrapesJS), `admin/` (Decap CMS) and
root `styles.css` / `script.js` (editor-generated page templates) are kept for
backwards compatibility. See `PROJECT_RULES.md` for the full protected-files list.

---

## Development

Requirements: Node 18+ and npm.

```bash
npm ci            # install exact versions from the lockfile
npm run dev       # local dev server (opens browser)
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

The build is deterministic: the same source always produces the same hashed
filenames in `dist/`. Verify with:

```bash
npm run build
# then compare dist/index.html etc. against the live site
```

---

## Deployment (Cloudflare Pages)

Cloudflare Pages serves **the repository root directly** (no build step) and
auto-deploys ~30s after a merge to `main`.

Deploying a change:

1. Create a feature branch from `main`.
2. Edit `src/` / `public/`, then run `npm run build`.
3. Commit the edited source **and** the regenerated build output
   (`index.html`, `services.html`, `portfolio.html`, `assets/`, ...) to the branch.
   The root HTML must reference the new hashed asset filenames.
4. Open a PR into `main`, verify, and merge. Cloudflare deploys automatically.

Source and deployed output travel in the same PR so the repo stays consistent.

---

## QA checklist (before merging)

- [ ] `npm run build` passes and `dist/` asset hashes match what the root HTML references
- [ ] Playwright QA: all pages at 1920px and 375px — no console errors
- [ ] No broken images / links / in-page anchors
- [ ] `sitemap.xml` and `robots.txt` still served
- [ ] Live site unchanged where intended

---

## Secrets

- Never commit `.env` / `.env.local`. See `.env.example` for the shape.
- Cloudflare Pages environment variables are set in the dashboard.
- Local GitHub PATs live in `opencode.json` (never committed).

---

## Branding

- Logo: `images/logo.png` (74 KB) — referenced as `/images/logo.png` everywhere.
- OG cover: `images/og-cover.svg`.
- Colors: near-black `#0a0a0c` base, coral accent `#ff6b6b`.
- Fonts: system stack with `-apple-system` fallbacks.

---

*Version 2.1 — gallery, showreel, and Instagram feed on the homepage.
Built for M² Studios / Movementz Factory / Momentz Photography.*
