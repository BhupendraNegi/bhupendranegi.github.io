# Version 3 Todo

This checklist is the working plan for the `version-3` branch. Keep it updated as tasks move from planned to complete.

## Guardrails

- [ ] Keep the site deployable to GitHub Pages.
- [ ] Preserve existing public URLs where possible.
- [ ] Preserve existing blog posts, project data, resume link, and personal branding unless intentionally updated.
- [ ] Make changes in small, verifiable phases.
- [ ] Run `bundle exec jekyll build` after each meaningful phase.
- [ ] For UI changes, verify desktop and mobile layouts before marking the task complete.

## Phase 0: Planning and Workflow

- [x] Create `version-3` branch.
- [x] Create `AGENT.md`.
- [x] Refresh `README.md`.
- [x] Create `doc/design.md`.
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
- [ ] Pin the Lucide version instead of `@latest` in `_includes/scripts.html` so icons do not silently break when Lucide drops more glyphs.

## Phase 5: Page Redesigns

- [x] Redesign Home. (2026-06-13: added a hero — eyebrow, name, role + stack, blurb, CTAs, social links — driven by a `hero` block in `_data/sections.yml`; replaced the full-bleed glitch tiles with a responsive image-backed card grid (`_includes/box.html`) that stacks on mobile; verified no horizontal overflow at 360/390px and `prefers-reduced-motion` support. See `doc/changelog.md`.)
- [ ] Redesign About.
- [ ] Redesign Projects so all projects are featured without feeling crowded.
- [ ] Remove project modals in favor of cards, sections, or detail pages.
- [ ] Redesign Blog index.
- [ ] Redesign Blog post layout.
- [ ] Keep Disqus only if comments remain valuable after review.
- [ ] Redesign Contact.
- [ ] Redesign Resume using current PDF/content, with placeholders for future updates.

## Phase 6: Mobile and Accessibility

- [ ] Verify 360px mobile layout.
- [ ] Verify 390px mobile layout.
- [ ] Verify 768px tablet layout.
- [ ] Verify 1024px laptop layout.
- [ ] Verify 1440px desktop layout.
- [x] Add skip link.
- [ ] Ensure semantic landmarks.
- [ ] Ensure visible focus states.
- [ ] Ensure strong color contrast in both themes.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Ensure project filters expose selected state accessibly.
- [ ] Ensure forms have clear labels and validation states.
- [ ] Add a global `box-sizing: border-box` base rule. Tailwind Preflight is intentionally off, so containers using `width: min(100%, Npx)` plus padding (e.g. `.site-page-inner`) can overflow horizontally on mobile under the default `content-box`. The Home redesign worked around this locally on `.home-wrap`; a single base rule would fix it everywhere and let the local workaround be removed. Verify it does not disturb remaining legacy `main.css` layout before applying.

## Phase 7: Performance, SEO, and Content

- [x] Remove Materialize. (CDN `<link>` removed from `_includes/scripts.html` on 2026-06-13; no template used Materialize JS or bare grid classes. Legacy `assets/css/main.css` reduction continues separately.)
- [x] Remove Highlight.js if Rouge handles code styling. (Removed on 2026-06-13; added a Rouge-generated theme in `assets/css/syntax.css`, imported into the Tailwind source, so syntax colors are now build-time with zero runtime JS.)
- [ ] Resolve the font mismatch: the head loads only the old Google Fonts (Raleway, Open Sans, Josefin Slab, Lobster Two), but the Tailwind theme references Inter / Manrope (`--font-sans`) and JetBrains Mono / Fira Code (`--font-mono`), which are never loaded. Either load the new fonts or update the tokens to match what is loaded.
- [ ] Audit and remove legacy `assets/css/main.css` (~683 lines): determine what is still referenced, fold the rest into the Tailwind source, then drop the file.
- [ ] Optimize images where possible.
- [ ] Reduce external scripts where possible without removing required features.
- [ ] Review Google Analytics behavior after navigation changes.
- [ ] Review Disqus behavior after navigation changes.
- [ ] Improve page titles and descriptions.
- [ ] Improve Open Graph defaults.
- [ ] Review project links for dead URLs.
- [ ] Add clear replacement points for future resume and screenshot updates.

## Phase 8: Launch

- [ ] Run production build.
- [ ] Verify generated `_site`.
- [ ] Verify GitHub Pages deployment path.
- [ ] **Switch the Pages source to GitHub Actions** (repo Settings -> Pages -> Build and deployment -> Source -> "GitHub Actions"). The `.github/workflows/pages.yml` workflow only becomes the live deploy after this manual switch; until then the native branch build stays live.
- [ ] Smoke test Home, About, Projects, Blog, Contact, Resume, and 404.
- [ ] Review on mobile and desktop.
- [ ] Update `README.md` with final Version 3 commands and architecture.
- [ ] Merge `version-3` when ready.
