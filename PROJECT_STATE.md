# M² Studios — Project State

Last verified: 2026-08-24 (Asia/Calcutta)

Current phase: Phase 1 — operational clarity and technical continuity

Production baseline commit: `f90c8edaef33ab36bb333e4e8f0c77ca0b6eb99c`

Production URL: <https://m2studios-website.pages.dev>

## Purpose

This file is the repository-level technical source of truth for Codex and human collaborators. It records what exists, what is verified, what is incomplete, and what should happen next.

This is not a greenfield project. Preserve working production behavior and make incremental changes only.

## Phase 1 objective

Create a reliable technical and operational foundation connecting:

- the existing M² website and Cloudflare deployment;
- M² Mission Control in Notion;
- the selected master media library;
- future automation, without adding unnecessary systems now.

Only these three outcomes should remain active:

1. Mission Control
2. Media Intelligence
3. Technical Continuity

## Business structure

- **M² Studios:** master brand, website, technology, automation, analytics, and shared infrastructure.
- **Movementz Factory:** dance classes, trials, admissions, workshops, performances, and referrals.
- **Momentz Photography & Events:** photography, videography, enquiries, consultations, bookings, and portfolio authority.

The website's primary job is to convert visitors into enquiries, trials, consultations, or bookings.

## Source-of-truth hierarchy

The project currently has multiple technical states. Do not treat them as interchangeable.

1. **GitHub `main` / Cloudflare production baseline**
   - Repository: `m2studioscbe-dotcom/m2studios-website`
   - Verified baseline: commit `f90c8eda` from 2026-08-13 IST
   - Architecture: Vite 6 + Handlebars + modular CSS/JavaScript
   - This is the provisional code baseline for new work.

2. **Live Cloudflare Pages deployment**
   - URL: <https://m2studios-website.pages.dev>
   - Read-only checks on 2026-08-24 returned HTTP 200 for `/`, `/services.html`, `/portfolio.html`, `/admin/`, `/editor/`, `/robots.txt`, and `/sitemap.xml`.
   - `/movementz.html` and `/momentz.html` currently return the homepage content instead of dedicated pages.

3. **Legacy dirty local worktree**
   - Path: `C:\Users\MSI\Documents\Desktop\M2_Studios_Website`
   - Local `main` was based on commit `fd18e8e` while `origin/main` was at `f90c8eda`.
   - It contains extensive uncommitted July/August work and an unfinished Eleventy migration.
   - Preserve this worktree. Do not reset, clean, overwrite, merge, or deploy it without a separate recovery plan.
   - A no-write Eleventy dry run failed with `unknown block tag: icon` in `src/pages/index.njk`.

4. **Phase 1 feature worktree**
   - Path: `C:\Users\MSI\Documents\Desktop\M2_Studios_Website-phase1`
   - Branch: `docs/phase1-project-state`
   - Based directly on `origin/main` at `f90c8eda`.

## Current production architecture

### Build and frontend

- `package.json` — Vite scripts and runtime dependencies.
- `vite.config.js` — Vite root is `src`; output is `dist`.
- `src/index.html` — homepage source.
- `src/services.html` — services source.
- `src/portfolio.html` — portfolio/contact source.
- `src/partials/` — shared header, head, and footer templates.
- `src/css/` — modular source styles.
- `src/js/` — modular behavior including navigation, motion, gallery, form, and Three.js effects.
- `public/` — passthrough static assets copied into the Vite build.
- Root `index.html`, `services.html`, `portfolio.html`, `assets/`, `images/`, `styles.css`, and `script.js` are synchronized production artifacts. Confirm the deployment contract before changing or removing these duplicates.

The current Vite input list contains only homepage, services, and portfolio. Dedicated Movementz and Momentz pages are not included.

### Backend and integrations

- `functions/api/` — Cloudflare Pages Functions:
  - `ai.js` — OpenAI-backed editor content generation.
  - `save.js` — forwards page-save data to n8n.
  - `load.js` — loads saved page data through n8n.
  - `deploy.js` — triggers deployment through n8n.
  - `auth.js` and `callback.js` — GitHub OAuth flow.
- `editor/` — GrapesJS visual editor.
- `admin/` — Decap CMS plus a separate dashboard.
- Secrets must come from Cloudflare environment variables. Never commit `.env` or tokens.

### External services present in code

- Cloudflare Pages and Pages Functions
- GitHub repository/API
- n8n webhooks
- OpenAI API
- WhatsApp click-to-chat
- Google Fonts
- Decap CMS
- GrapesJS

Current operational status of n8n, GitHub OAuth, save/load/deploy workflows, and the AI endpoint is **unverified**. Historical January reports are not sufficient evidence of current health.

## Verified working systems

- Production homepage, services, and portfolio pages respond.
- Production admin and editor shells respond.
- Production `robots.txt` and `sitemap.xml` respond.
- Real M² media is present in the production repository.
- Navigation, animation, galleries, FAQ, counters, and form modules exist in the Vite source.
- The production contact form validates input and opens WhatsApp with a structured enquiry message.
- Call and WhatsApp CTAs use `+91 97908 25751` / `wa.me/919790825751`.
- Basic canonical, social metadata, favicon, robots, and sitemap infrastructure exists.
- Cloudflare Functions, editor, and admin files are present and must be preserved.

## Incomplete, broken, or unverified systems

### Critical

- Dedicated Movementz and Momentz production routes are missing from the Vite build and currently fall back to the homepage.
- The dirty local Eleventy migration does not build and must not be deployed.
- `admin/config.yml` appears syntactically invalid because `repo` is over-indented beneath `name`.
- Mutation endpoints (`save`, `deploy`, and AI generation) do not show an authorization gate and return permissive `Access-Control-Allow-Origin: *` headers.
- The editor can store a GitHub personal access token in browser `localStorage`; this should not be considered an acceptable production credential model.

### Important

- Google Analytics/Tag Manager and Meta Pixel conversion tracking are absent.
- The admin dashboard substitutes static values when integrations fail, so displayed metrics cannot be treated as authoritative.
- No committed Playwright suite or test command enforces `PROJECT_RULES.md` verification requirements.
- Current n8n workflows and temporary Cloudflare tunnel URLs have not been revalidated.
- Testimonials, experience counts, student counts, and similar business claims require human verification.
- The separate `D:\m2-editor-backend` repository remains the default Create Next App starter and is not an active backend.
- Notion Mission Control is outside this repository and has not yet been connected to technical task state.
- Page titles currently render encoded text such as `M&#178;` and `&amp;` instead of clean `M²` and `&` characters.
- Homepage, services, portfolio, and editor output contain `href="#"` controls, which fail the repository's no-empty-link rule.
- The editor's external `grapesjs-preset-webpage` stylesheet request fails in Playwright, and the showcase video request can be aborted during editor loading.
- A local Vite preview serves the homepage fallback at `/admin/`; production serves the admin shell. This proves the deployment includes root-synchronized artifacts beyond the three Vite HTML outputs, but the exact Cloudflare build/output contract is not documented in the repository.

## Master media relationship

Master library: `D:\M2-Master-Media-Library`

Current canonical media-analysis record:

- `D:\M2-Master-Media-Library\08_DOCUMENTATION\phase3-final-report.md`
- `D:\M2-Master-Media-Library\08_DOCUMENTATION\website-final-media-map.md`
- `D:\M2-Master-Media-Library\08_DOCUMENTATION\video-highlight-index.csv`
- `D:\M2-Master-Media-Library\08_DOCUMENTATION\m2-shoot-and-asset-gap-plan.md`

Latest Phase 3 findings:

- 34 selected assets analyzed.
- 11 images reviewed.
- 20 videos reviewed.
- 12 useful timestamped video moments identified.
- Website sections classified as Ready, Usable, or Missing.
- Media discovery and intelligence are complete enough for Phase 1.

Older reports mention 50 selected items. Until reconciled, use the Phase 3 set of 34 as the operational review set.

Next media work is stakeholder selection, controlled copying, optimization, and website mapping implementation. Do not continue broad D: drive discovery.

## Media and privacy restrictions

- Never modify, rename, move, compress, or delete master originals.
- Website-ready derivatives must be copied into the project; originals remain untouched.
- Do not inspect or automate searches inside excluded personal locations, including variations of:
  - `D:\GOWTHAM INDOOR & OUTDOOR SHOOTS`
  - `D:\GOWTHAM SISTER`
  - `D:\moses`
  - `D:\DANCE BATTLE & EVENTS`
  - selected Movementz edit exports
  - system, cache, and temporary folders
- Do not publish personal, ambiguous, Tier D, or unrelated media.
- Authentic M² media must take precedence over generated imagery.

## Development commands

Run commands from a clean feature worktree, never directly on `main`.

```powershell
npm ci
npm run dev
npm run build
npm run preview
```

Expected build input/output:

- Input root: `src/`
- Output: `dist/`
- Public passthrough: `public/`

There is currently no valid `npm test` or committed Playwright test command. Add verification infrastructure in a dedicated task before relying on automated release claims.

### Latest local build verification

Verified on 2026-08-24 from commit `f90c8eda`:

- `npm ci` completed from the committed lockfile.
- `npm run build` passed with Vite 6.4.3.
- Output contained only `index.html`, `services.html`, and `portfolio.html`, confirming that Movementz and Momentz are not build entries.
- Vite reported a chunk-size warning for the approximately 734 kB uncompressed Three.js module.
- `npm ci`/`npm audit` reported one high-severity transitive `nanoid` advisory (`GHSA-2v37-7h3g-55p8`). A fix is available, but do not run an automatic dependency fix without a separate tested task.

### Latest Playwright baseline verification

Verified on 2026-08-24 at desktop 1920×1080 and mobile 375×812:

- Homepage, services, and portfolio returned HTTP 200 locally and in production.
- Production admin and editor returned HTTP 200.
- No ordinary content images failed to load.
- WhatsApp links inspected by the test used the full approved number.
- No placeholder URLs were detected.
- Homepage, services, and portfolio produced no console or page exceptions.
- Verification did **not** pass the complete `PROJECT_RULES.md` gate because of empty `#` links, encoded titles, editor resource failures, and the local `/admin/` fallback.

These are baseline defects to fix in separate feature tasks. This documentation branch must not be merged while claiming a clean production verification pass.

## Deployment

- Platform: Cloudflare Pages
- Production: <https://m2studios-website.pages.dev>
- Functions directory: `functions/`
- Vite build command: `npm run build`
- Vite output directory: `dist`
- Production also serves root-level synchronized output such as `admin/`; confirm the Cloudflare Pages build command and output directory before the next deployment.

Before declaring any deployment successful:

1. Work on a feature branch.
2. Build successfully.
3. Test desktop at 1920×1080.
4. Test mobile at 375×812.
5. Verify homepage, services, portfolio, admin, and editor.
6. Verify zero console errors, broken images, and broken links.
7. Verify WhatsApp links.
8. Preserve Cloudflare Functions.
9. Confirm the Cloudflare deployment completed successfully.
10. Run the same checks against production.

## Readiness scoring rule

Do not assign arbitrary percentages. Until Mission Control contains documented formulas, use only these deterministic states:

- `0` — Not Started
- `25` — Started
- `50` — Core Work Exists
- `75` — Usable / Testing
- `100` — Operational and Verified

Any score must link to its evidence and calculation. This file does not assign business-level readiness scores because the required Mission Control records do not yet exist.

## Prohibited actions

- Do not commit directly to `main`.
- Do not rebuild the website from scratch.
- Do not deploy the dirty Eleventy worktree.
- Do not overwrite or clean uncommitted work in the legacy local worktree.
- Do not delete, rename, or break `functions/`, `editor/`, `admin/`, or GitHub workflows.
- Do not expose API keys, tokens, webhook secrets, or `.env` contents.
- Do not invoke production save/deploy operations during diagnostics.
- Do not expand the unused Next.js backend during Phase 1.
- Do not add Paperclip, complex agent hierarchies, advanced n8n systems, or unrelated website features during Phase 1.
- Do not replace real portfolio material with AI-generated representations of students, clients, facilities, or results.

## Known blockers

1. Local and remote repositories are divergent.
2. Dedicated Movementz and Momentz production routes are absent.
3. Admin/CMS configuration and mutation-endpoint security require repair.
4. Production integrations lack current end-to-end verification.
5. Notion Mission Control has not yet become the operational source of truth.
6. Several media categories require new authentic shoots.

## Latest completed work

- Phase 1 read-only technical audit completed on 2026-08-24.
- GitHub, local worktree, live Cloudflare deployment, media documentation, and the separate Next.js starter were compared.
- Media Intelligence was confirmed substantially complete through Phase 3.
- A clean feature worktree was created from current `origin/main` without modifying the legacy dirty worktree.
- The production Vite baseline was installed from its lockfile and built successfully; it generated exactly three website pages.
- This continuity file was created on `docs/phase1-project-state`.

## Immediate next technical action

Create a dedicated feature branch from the production baseline to restore dedicated Movementz and Momentz routes in the Vite source and build inputs.

That task must:

1. preserve the homepage, services, portfolio, Functions, editor, and admin;
2. use the real media mapping rather than placeholders;
3. add or restore explicit Vite inputs for Movementz and Momentz;
4. build successfully;
5. run desktop/mobile browser verification;
6. report broken links, images, console errors, form behavior, and production deployment status;
7. update this file and the matching Notion task when complete.

## Continuation protocol

At the start of every Codex task:

1. Read `PROJECT_RULES.md` and this file.
2. Confirm the active branch and clean/dirty status.
3. Confirm the task corresponds to one Phase 1 priority or an explicit Notion task.
4. Inspect before modifying.
5. Preserve unrelated user changes.
6. Record the completed result, evidence, blocker, and next action here.
