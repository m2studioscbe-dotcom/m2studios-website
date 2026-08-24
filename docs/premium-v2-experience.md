# M² Studios Premium V2 experience

## Art direction

M² is treated as a dual-stage creative house: Movementz creates motion and Momentz preserves it. The shared system uses deep black, warm bone, restrained brass, oversized Outfit typography, and selective Playfair Display italics. Layouts are editorial and asymmetric rather than card-grid based.

The homepage signature interaction is an intent switchboard. Movementz uses sharper transitions, outlined kinetic type, rails and stage imagery. Momentz uses slower image reveals, quieter tonal surfaces and a deliberately limited gallery.

## Public experience

- Homepage: immediate intent paths for dance, photography and events; no invented statistics, placeholder testimonials or generic service grid.
- Movementz: verified HERO A media, interactive six-service stage, real-media filmstrip, honest proof language, achievement frame and trial configurator.
- Momentz: one verified premium image used strongly, three additional real supporting frames, text-only states where premium portfolio proof is missing, and a shoot configurator.
- Mobile: horizontal intent/service/gallery rails, compact menu, persistent contextual actions and bottom-sheet enquiry dialogs.

## Enquiry contract

The V2 dialogs are frontend-only progressive forms. Values live only in the open DOM, are reset when the dialog closes and are never written to local storage, a query string or a network endpoint. The final action opens WhatsApp with only a generic service-intent message; customers choose what details to send there.

A future server integration can replace the final step with a validated endpoint while keeping the same field and step structure.

## Motion and runtime

- Native scroll is used on V2 routes.
- Small IntersectionObserver reveals, panel transitions and fine-pointer media depth are implemented in `src/js/v2-experience.js`.
- Reduced-motion media rules remove reveals, hero scaling and panel animation.
- Legacy Lenis and GSAP modules are dynamically loaded only for non-V2 routes.
- Three.js remains available for existing legacy showcase routes but is not loaded by the V2 homepage, Movementz or Momentz pages.
- The legacy custom cursor is not loaded on V2 routes.

## Media truth

Movementz uses only corrected verified frame derivatives. Momentz uses:

- premium: `prewedding-couple-outdoor.jpg` via the non-destructive cropped WebP derivative
- usable: `function-auditorium.jpg`, `housewarming-ceremony.jpg`, `birthday-family-group.jpg`
- not used as premium proof: `portrait-casual-red.jpg`, `portrait-outdoor-green.jpg`

The portrait and corporate/video selector states explicitly say that premium samples are pending. No synthetic media is presented as portfolio work.

## Frontend-design skill

Primary skill: Anthropic `frontend-design` from `anthropics/skills` (`skills/frontend-design`). The repository folder was inspected before installation and contained only `SKILL.md` and the Apache 2.0 license—no binaries, scripts, credentials or package requirements. It was installed through the supported Codex skill installer. Its principles drove the design thesis, typography-led hierarchy, subject-specific visual system, deliberate motion and screenshot critique loop.

## QA notes

- Vite production build passes.
- V2 pages were checked at 1920×1080, 1440×900, 768×1024, 375×812 and 320 px width.
- No V2 horizontal page scrolling or broken images were found.
- Mobile menu focus moves into the open menu and Escape closes it and restores focus.
- Service tabs support arrow, Home and End keys.
- Enquiry dialogs expose labels, native validation, progress text, close controls and keyboard-operable actions.
- `/`, `/movementz.html`, `/momentz.html`, `/services.html`, `/portfolio.html` and `/editor/` return locally.
- The current Vite production output contains only `public/admin/config.yml`; `/admin/` therefore falls back to the homepage in local preview. The root `admin/` source was not changed in this visual sprint. Production/admin build wiring requires separate confirmation before deployment.

## Known media limitation

The corrected Momentz hero crop removes a baked-in black matte, but the source content is only 1184×672 and is visibly softer than the Movementz material at very large desktop sizes. A broader, higher-resolution Momentz portfolio remains the main genuine limitation.
