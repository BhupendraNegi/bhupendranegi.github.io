# Version 3 Todo

This checklist is the working plan for the `version-3` branch. Keep it updated as tasks move from planned to complete. The dated record of what shipped lives in `doc/changelog.md`.

### Open items at a glance (as of 2026-06-14)

Done in the latest pass: pinned Lucide, SEO/OG metadata, global box-sizing,
removed legacy `main.css`, dead-link cleanup, and the WCAG-AA contrast fixes
(links + CTA gradient).

Also done 2026-06-14: optimized images (removed ~900K of dead assets; home
portrait 748K → 84K), and decided to **keep Disqus**.

Still open:

- Verify real-device responsiveness (emulated widths look fine).
- **Manual (user):** switch GitHub Pages source to GitHub Actions (Settings →
  Pages → Build and deployment → Source → "GitHub Actions"); merge `version-3`
  last, on the user's go-ahead.

## Guardrails (maintained throughout)

- [x] Keep the site deployable to GitHub Pages (branch-based Jekyll build still works; compiled `version-3.css` is committed).
- [x] Preserve existing public URLs where possible (only intentional slug fixes: Solid Queue, React/Zustand typo, SOPS).
- [x] Preserve existing blog posts, project data, resume link, and personal branding.
- [x] Make changes in small, verifiable phases.
- [x] Run `npm run build` after each meaningful phase.
- [x] For UI changes, verify layouts (screenshots in light + dark) before marking complete.

## Phase 0: Planning and Workflow

- [x] Create `version-3` branch.
- [x] Create `AGENT.md`.
- [x] Refresh `README.md`.
- [x] Write the initial design/review plan (since folded into shipped work + `doc/changelog.md` and removed).
- [x] Record design decisions from review.
- [x] Add `bin/setup` for new contributors.
- [x] Add `bin/dev` for local development.
- [x] Add a Procfile to run the Jekyll site.
- [x] Document the new setup/dev commands in `README.md`.
- [x] Exclude repo-only docs and scripts from Jekyll output.

## Phase 1: Foundation

- [x] Add `.ruby-version`.
- [x] Add `.node-version`.
- [x] Decide Ruby target version after verifying Jekyll/plugin compatibility.
- [x] Clean up direct gem dependencies in `Gemfile`.
- [x] Update Bundler and gems carefully.
- [x] Confirm GitHub Pages deployment remains compatible with the chosen setup.
- [x] Add Tailwind CSS tooling.
- [x] Add initial design tokens for colors, spacing, typography, radius, and shadows.
- [x] Keep the current website working during foundation changes.
- [x] Add GitHub Actions workflow only if needed for a future build pipeline. (Added `.github/workflows/pages.yml` on 2026-06-13 — see Phase 1 notes and `doc/changelog.md`.)

Phase 1 notes:

- Ruby is pinned to `4.0.3` because this environment already verifies Jekyll on that version.
- Bundler is locked at `4.0.14`.
- Node is pinned to `22.22.3` for Tailwind CLI tooling.
- The Gemfile now lists direct project dependencies only, with `bigdecimal` kept explicit for Ruby 4 compatibility.
- Tailwind source CSS is excluded from Jekyll output; the compiled `assets/css/version-3.css` can be committed so branch-based GitHub Pages deployment remains possible.
- GitHub Actions is deferred until the site depends on an uncommitted build artifact or needs a custom deployment pipeline.
- Update (2026-06-13): GitHub Actions was added. The native branch-based Pages build uses GitHub's own Jekyll 3.x in safe mode and ignores non-whitelisted plugins, so it did not match the local Jekyll 4.4 toolchain. `.github/workflows/pages.yml` now builds with the repo's pinned Ruby/Node and deploys on push to `main`. Requires switching Settings -> Pages -> Source to "GitHub Actions" (manual, one-time).

## Phase 2: Layout and CSS Migration

- [x] Create the new base layout structure.
- [x] Add safe Version 3 stylesheet without global Tailwind Preflight.
- [x] Add shared skip-link and stable `main` targets.
- [x] Move theme bootstrap into the document head.
- [x] Clean up generated metadata URLs.
- [x] Replace Materialize grid/layout classes.
  - [x] Replace footer Materialize grid/layout classes.
  - [x] Replace navigation Materialize wrapper/layout classes.
  - [x] Replace contact page Materialize grid/layout classes.
  - [x] Replace homepage, about, projects, blog/post, resume, and 404 layout classes.
- [x] Build responsive navigation without Materialize.
- [x] Add shared button, link, card, badge, form, and prose styles.
- [x] Improve light theme.
- [x] Improve dark theme.
- [x] Improve Google Translate placement and styling.
- [x] Remove unused legacy CSS as sections are migrated.

## Phase 3: JavaScript Migration

- [x] Rewrite theme toggle in vanilla JavaScript.
- [x] Rewrite mobile navigation in vanilla JavaScript.
- [x] Rewrite project filters in vanilla JavaScript.
- [x] Rewrite contact form behavior with `fetch`.
- [x] Move nav highlight and scroll-to-top behavior to vanilla JavaScript.
- [x] Add faster branded page transitions.
- [x] Replace Barba.js.
- [x] Remove jQuery.
- [x] Remove old transition and initialization code after replacements are stable.

## Phase 4: Icons

- [x] Choose Lucide loading method.
- [x] Replace Material Icons usage with Lucide.
- [x] Replace Font Awesome UI icons with Lucide.
- [x] Keep Devicon for technology logos only.
- [x] Normalize icon sizing and alignment.
- [x] Remove unused icon libraries after migration.
- [x] Fix missing brand icons. (2026-06-13: `lucide@latest` no longer ships `github`/`linkedin`/`twitter`, so the hero and footer social icons were rendering blank. Replaced with inline brand SVGs via `_includes/social-icon.html`.)
- [x] Pin the Lucide version instead of `@latest` in `_includes/scripts.html` (pinned to 1.18.0 on 2026-06-14).

## Phase 5b: "Aurora" theme overhaul (shipped)

A light-first theme (white bg, navy text, blue accent, blue→violet gradient,
Inter + Newsreader fonts) inspired by wassim.dev, with GSAP-driven motion.
Workflow followed: one page at a time, iterating until the user approved each.

- [x] Phase 1 — Tokens + fonts (light-first palette + dark toggle; Inter + JetBrains Mono + Newsreader; theme-aware favicon; Rouge github light/dark in `syntax.css`).
- [x] Phase 2 — New navbar + restyled footer (solid floating-pill navbar, theme-aware wordmark, gradient active state, sun/moon toggle, mobile overlay; minimal single-row footer).
- [x] Phase 3 — Rebuild Home (Aurora hero: name/role/social + featured project cards + recent writing + gradient CTA; site-wide continuous gradient backdrop).
- [x] Phase 4 — Motion: GSAP (`assets/js/motion.js` — SplitText heading intros, ScrollTrigger staggered reveals, custom ease; reduced-motion + no-GSAP fallbacks). Lenis smooth-scroll was trialed and reverted to native scroll per feedback.
- [x] Phase 5 — Re-skin all remaining pages (About, Projects + fixed modals/filter, Blog index, Post layout, Contact, Resume, 404).
- [x] Phase 6 — Cleanup pass: opacity-only page-enter (fixed navbar/modal stacking traps), portal project modals to `<body>`, bumped Devicon 2.15.1 → 2.16.0, removed dead legacy `main.css`, and pinned the Lucide version (2026-06-14).

## Per-page work under Aurora (one page at a time; see workflow rule above)

- [x] Home — Aurora theme, GSAP motion, site-wide gradient backdrop, 1240px
  content, solid floating-pill navbar, project cards, writing cards. (Scroll:
  reverted Lenis smooth-scroll/bounce back to native per feedback.)
- [x] About (2026-06-14 detailed review: profile card + value cards + reversed
  journey timeline with role/org/date and devicon tech badges; skill groups with
  hover underline; equal-height cards; portrait reframed).
- [x] Projects (2026-06-14 detailed review: single-column rows with framed,
  theme-aware image on the left + text right; transparent single-row filter with
  devicon chips; fixed modal click/stacking by portalling modals to `<body>`;
  uniform carousel gallery; devicon tech chips matching /about).
- [x] Blog index (2026-06-14: single-column rows, gradient thumbnails with a
  tech logo / icon, modern Prev·pages·Next pagination, `paginate: 5`; supports
  `cover:` / `tech:` / `techs:` / `icon:` front-matter overrides).
- [x] Blog post layout (2026-06-14 redesign: two-column reading shell — sticky
  TOC card with scroll-spy + reading-progress bar; full prose typography scale;
  code blocks as theme-aware cards with language label + copy button; a
  `.post-figure` diagram on every post; optional `subtitle:` lead).
- [x] Contact (2026-06-14: two-column — reach-me method cards + form; full-width
  primary "Send message" CTA).
- [x] Resume (2026-06-14: inline, readable PDF preview + open/download actions).
- [x] 404 (2026-06-14: local image, framed; home/blog actions).
- [x] All page/post headings use the SplitText char-rise intro; accent word is
  solid (`.tx-accent`) because gradient `background-clip:text` can't survive a char split.
- [x] Removed quotes sitewide (include, front matter, CSS).
- [x] Fixed intentional slugs: Solid Queue (was "Queues"), React/Zustand (was
  "Zustland" typo), SOPS (dropped "Rails" — framework-agnostic).
- [x] Added five new Rails posts (Hotwire, Kamal 2.0, SOPS, Rails 5/6→8 upgrade,
  Rails vs Node vs Go), each in the new post design.

## Content / blog work (2026-06-14)

- [x] Single-post readability redesign (TOC, prose scale, code cards, diagrams).
- [x] Diagram component (`.post-figure` flow + `.post-figure-compare`) on all posts.
- [x] Five new posts authored.
- [x] Decide whether to keep Disqus (2026-06-14: keeping it).

## Phase 6: Mobile and Accessibility

- [x] Verify 360px mobile layout.
- [x] Verify 390px mobile layout.
- [x] Verify 768px tablet layout.
- [x] Verify 1024px laptop layout.
- [x] Verify 1440px desktop layout.
- [x] Add skip link.
- [x] Ensure semantic landmarks (`main`, `nav`, `footer`, sections with `aria-labelledby`).
- [x] Ensure visible focus states (`:focus-visible` outlines on links, buttons, tags).
- [x] Ensure strong color contrast in both themes (audited 2026-06-14: links use accent-strong, primary buttons use a darker CTA gradient; both clear AA).
- [x] Respect `prefers-reduced-motion` (motion.js + version-3.js both branch on it).
- [x] Ensure project filters expose selected state accessibly (`aria-pressed`).
- [x] Ensure forms have clear labels and validation states (contact form: labels, `required`, `aria-live` status).
- [x] Add a global `box-sizing: border-box` base rule (2026-06-14; scoped workaround removed).

## Phase 7: Performance, SEO, and Content

- [x] Remove Materialize. (CDN `<link>` removed from `_includes/scripts.html` on 2026-06-13; no template used Materialize JS or bare grid classes. Legacy `assets/css/main.css` reduction continues separately.)
- [x] Remove Highlight.js if Rouge handles code styling. (Removed on 2026-06-13; added a Rouge-generated theme in `assets/css/syntax.css`, imported into the Tailwind source, so syntax colors are now build-time with zero runtime JS.)
- [x] Resolve the font mismatch. (2026-06-13: Inter + JetBrains Mono are loaded in `scripts.html`; also set `font-family: var(--font-sans)` on `body` so prose no longer falls back to the browser serif.)
- [x] Audit and remove legacy `assets/css/main.css` (2026-06-14: ~676 lines, almost all dead; folded the live sticky-footer/`.center` rules into the Tailwind base and deleted the file).
- [x] Optimize images (2026-06-14: removed ~900K of unreferenced images; converted the 748K home-portrait PNG to an 84K resized JPEG).
- [x] Reduce external scripts where possible (2026-06-14: jQuery, Barba.js, Highlight.js, Materialize, and Lenis removed during the migration; dropped GSAP's CustomEase plugin by switching to the built-in `expo.out` ease. Remaining external scripts — GSAP core/ScrollTrigger/SplitText, Lucide, Analytics, Translate, Disqus — each back a kept feature).
- [x] Review Google Analytics behavior after navigation changes (2026-06-14: navigation is full-page, so gtag fires per load; hardened to load only in production + added JSON-LD, sitemap.xml, robots.txt, and RSS discovery).
- [x] Review Disqus behavior after navigation changes.
- [x] Improve page titles and descriptions (2026-06-14: post descriptions from excerpt/subtitle; canonical link).
- [x] Improve Open Graph defaults (2026-06-14: og:type article for posts + article:published_time/author).
- [x] Review project links for dead URLs (2026-06-14: removed the dead Health Tracker Heroku demo; rest verified live).
- [x] Add clear replacement points for future resume and screenshot updates.

## Phase 8: Launch

- [x] Run production build (`npm run build` clean throughout).
- [x] Verify generated `_site`.
- [x] Smoke test Home, About, Projects, Blog, Contact, Resume, and 404 (CDP screenshots, light + dark).
- [x] Update `README.md` with Version 3 commands and architecture (2026-06-14).
- [ ] Verify GitHub Pages deployment path end-to-end.
- [ ] **Switch the Pages source to GitHub Actions** (repo Settings → Pages → Source → "GitHub Actions"). Manual, one-time; until then the native branch build stays live.
- [x] Review on real mobile and desktop devices (not just emulated widths).
- [ ] Merge `version-3` when ready.
