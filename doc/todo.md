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

- [ ] Add `.ruby-version`.
- [ ] Decide Ruby target version after verifying Jekyll/plugin compatibility.
- [ ] Clean up direct gem dependencies in `Gemfile`.
- [ ] Update Bundler and gems carefully.
- [ ] Add GitHub Actions workflow only if needed for the new build pipeline.
- [ ] Confirm GitHub Pages deployment remains compatible with the chosen setup.
- [ ] Add Tailwind CSS tooling.
- [ ] Add initial design tokens for colors, spacing, typography, radius, and shadows.
- [ ] Keep the current website working during foundation changes.

## Phase 2: Layout and CSS Migration

- [ ] Create the new base layout structure.
- [ ] Replace Materialize grid/layout classes.
- [ ] Build responsive navigation without Materialize.
- [ ] Add shared button, link, card, badge, form, and prose styles.
- [ ] Improve light theme.
- [ ] Improve dark theme.
- [ ] Improve Google Translate placement and styling.
- [ ] Remove unused legacy CSS as sections are migrated.

## Phase 3: JavaScript Migration

- [ ] Rewrite theme toggle in vanilla JavaScript.
- [ ] Rewrite mobile navigation in vanilla JavaScript.
- [ ] Rewrite project filters in vanilla JavaScript.
- [ ] Rewrite contact form behavior with `fetch`.
- [ ] Add faster branded page transitions.
- [ ] Replace Barba.js.
- [ ] Remove jQuery.
- [ ] Remove old transition and initialization code after replacements are stable.

## Phase 4: Icons

- [ ] Choose Lucide loading method.
- [ ] Replace Material Icons usage with Lucide.
- [ ] Replace Font Awesome UI icons with Lucide.
- [ ] Keep Devicon for technology logos only.
- [ ] Normalize icon sizing and alignment.
- [ ] Remove unused icon libraries after migration.

## Phase 5: Page Redesigns

- [ ] Redesign Home.
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
- [ ] Add skip link.
- [ ] Ensure semantic landmarks.
- [ ] Ensure visible focus states.
- [ ] Ensure strong color contrast in both themes.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Ensure project filters expose selected state accessibly.
- [ ] Ensure forms have clear labels and validation states.

## Phase 7: Performance, SEO, and Content

- [ ] Remove Materialize.
- [ ] Remove Highlight.js if Rouge handles code styling.
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
- [ ] Smoke test Home, About, Projects, Blog, Contact, Resume, and 404.
- [ ] Review on mobile and desktop.
- [ ] Update `README.md` with final Version 3 commands and architecture.
- [ ] Merge `version-3` when ready.
