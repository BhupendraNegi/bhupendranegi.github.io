# Version 3 Changelog

A dated log of meaningful changes on the `version-3` branch, with rationale.
Newest entries first. This complements `doc/design.md` (the plan) and
`doc/todo.md` (the checklist).

## 2026-06-13 — Inner-page polish + sitewide consistency

Applied the home "Aurora" design language across every inner page, then a
series of consistency fixes from review feedback.

### Inner pages reskinned

- Shared `.page-hero` header (eyebrow + title + lead) on About, Projects,
  Contact, Blog, Post, Resume, 404.
- About: profile-card layout (portrait with gradient ring + "Open to work"
  status badge, name, role, quick facts, social) beside an emphasized bio.
  Skills shown as gradient-accent cards with pill chips.
- Projects: card grid reusing the home `.proj-card` shell with image tiles +
  hover "Learn more" overlay; modal/carousel/filter behaviour preserved.
- Blog index + Post: reuse the home post-card component / prose styling.

### Consistency fixes

- **Background:** inner pages were solid white over the fixed `.aurora-bg`.
  `.site-page` is now transparent so the same ambient gradient shows sitewide.
- **Content width:** `.site-page-inner` matches the home rail exactly (1240px +
  same padding) with `box-sizing: border-box` to avoid mobile overflow.
- **Nav:** solid pill (was translucent); current section highlighted via
  build-time `is-active` + `aria-current` (Blog stays active on posts); more
  padding around the logo / right-side actions.
- **Footer:** trimmed to a single row (copyright + social icons).
- **Nav moved** out of `.site-content` into `default.html` so the content
  wrapper is never an ancestor of the fixed nav (prevents transform-trap bugs).

### Animation, fonts, quotes

- **Headings:** all page/post titles now use the hero's SplitText character-rise
  intro (`motion.js`). Split type is `words,chars` so lines never break
  mid-word. The accent word uses a solid colour (`.tx-accent`), not the gradient
  `.grad` — `background-clip:text` does not survive a SplitText char split
  (the characters render transparent), whereas a solid colour is inherited fine.
- **Fonts:** `body` had no `font-family`, so prose fell back to the browser's
  serif. Set `font-family: var(--font-sans)` on `body` so all text is Inter.
- **Quotes removed** sitewide: deleted `_includes/quote.html`, the per-page
  `quote`/`author` front matter, and the `.quote*` CSS.

### Scroll

- Tried Lenis smooth-scroll + a rubber-band overscroll bounce, but it felt worse
  than native scrolling. Reverted to native scroll; in-page anchor links use
  `window.scrollTo({ behavior: "smooth" })`. Lenis removed from the page.

### Project modals

- Fixed modals not opening: the fixed-position modal had been nested inside the
  reveal-animated `.proj-card`, whose leftover GSAP transform trapped it.
  Restructured so the modal is a sibling of the card, and stopped the anchor
  handler from hijacking `.modal-trigger` clicks (and crashing on numeric ids).

## 2026-06-13 — "Aurora" theme overhaul (phases 1–4)

Brand-new light-first theme matching https://wassim.dev/ with richer motion like
https://koysor.me/. Full plan in `doc/redesign-plan.md`. Replaces the rejected
full-screen/dark direction. Committed as four phases:

1. Tokens + fonts — swapped the teal/ink palette for wassim's light-first tokens
   (white bg, navy text, blue accent, blue→violet gradient), kept the `--site-*`
   names so components inherit them; dark mode restyled to wassim's dark palette;
   loaded Inter + JetBrains Mono; theme-aware favicon. Fixed a latent bug:
   `--font-sans`/`--font-mono` were declared only in `@theme prefix(v)` and never
   emitted unprefixed, so every `font:` shorthand using `var(--font-sans)` was
   invalid — now defined as plain custom properties in `:root`.
2. Navbar + footer — new light navbar (theme-aware wordmark logo using the user's
   light/dark logo files, gradient active-underline, sun/moon toggle, mobile
   overlay); footer and mobile nav moved onto theme tokens.
3. Home rebuild — wassim-style scrolling layout: hero with an animated
   blue→violet gradient graphic, featured project cards, recent writing list,
   gradient CTA; Home now uses the shared navbar/footer. Dropped the full-screen
   image panels, section images, and the curtain "BN" intro. Neutralized legacy
   `main.css` rules (dark body background, global `main` top padding) that fought
   the light theme.
4. Motion — `assets/js/motion.js`: GSAP 3.13 (ScrollTrigger, SplitText,
   CustomEase) + Lenis smooth scroll. Hero name reveals per-character, hero items
   stagger in, sections reveal on scroll with a custom ease; anchor links routed
   through Lenis. Progressive enhancement: reduced-motion and missing-GSAP both
   fall back to showing content immediately; version-3.js yields reveal ownership
   to motion.js. Verified in headless that all libs load, motion runs, and the
   hero ends visible.

Logo mapping note: the user's filenames describe the logo COLOR, not the theme,
so they are mapped by visibility — light theme uses the black logo
(`Bhupendra_black_logo.png`), dark theme uses the white logo
(`Bhupendra_light.png`); favicons likewise.

Remaining: Phase 5 (re-skin Projects + check Post/Resume/404; About/Contact/Blog
already adopt the theme) and Phase 6 (cleanup of dead legacy CSS, pin Lucide).
The motion feel needs a live eyeball via `./bin/dev` (headless can't show it).

## 2026-06-13 — Superseded Home explorations (condensed)

Two earlier Home directions were built and then rejected; condensed here for
history. Carried-forward fixes from that work that are still in the codebase:

- `_includes/social-icon.html`: inline brand SVGs (GitHub/LinkedIn/X/Stack
  Overflow) because `lucide@latest` dropped brand icons — used in the hero and
  footer.
- `body { margin: 0 }` reset (Tailwind Preflight is off).

Rejected directions (no longer in the code): (v1) a hero + image-card grid;
(v2) full-screen image panels with a curtain intro/transition referencing
pmportfolio.ca. Both replaced by the Aurora theme above.

## 2026-06-13 — Deployment hardening + legacy dependency removal

Context: a review of `doc/design.md` and `doc/todo.md` against the actual repo
surfaced a deployment mismatch and some render-blocking legacy dependencies that
were still loading during migration. The site must keep auto-deploying to
`https://bhupendranegi.github.io/` on push.

### GitHub Actions Pages deployment

- Added `.github/workflows/pages.yml`.
- Why: the repo is configured for Jekyll 4.4 and uses a Node/Tailwind build step,
  but GitHub Pages' native "build from a branch" deploy uses GitHub's own pinned
  Jekyll 3.x in `--safe` mode and ignores any plugin not on its whitelist. Local
  and production were therefore running different engines, which is fragile.
- The workflow builds with the repo's pinned Ruby (`.ruby-version`) and Node
  (`.node-version`), runs `npm run css:build` then `bundle exec jekyll build`, and
  deploys on push to `main` (same trigger and outcome as before).
- ACTION REQUIRED (one-time, manual): in the GitHub repo, go to
  Settings -> Pages -> Build and deployment -> Source and choose
  "GitHub Actions". Until this is switched, the workflow runs but the native
  branch build remains the live source.

### Removed `jekyll-pdf-embed`

- Removed from `Gemfile`, `Gemfile.lock` (via `bundle install`), and the
  `plugins:` list in `_config.yml`.
- Why: the plugin was declared but never used. `resume.html` links the PDF
  directly (`View as PDF`) with no `{% pdf %}` tag anywhere. It was also not on
  the GitHub Pages whitelist, so it never ran in production regardless.

### Removed Materialize CSS (CDN)

- Removed the Materialize 0.100.2 `<link>` from `_includes/scripts.html`.
- Why: it was a render-blocking stylesheet loading on every page alongside the new
  `version-3.css`, working against the faster-loading goal. Verified safe: no
  template loads Materialize JS, and no template uses bare Materialize classes
  (`.row`, `.chip`, grid `col sN/mN/lN`, `waves-*`, `input-field`, etc.). The
  `devicon-materialize-plain` icon on project cards is an unrelated Devicon tech
  logo and was intentionally kept.

### Removed Highlight.js (CDN) and added a Rouge theme

- Removed the Highlight.js 9.15.8 stylesheet, script, and init block from
  `_includes/scripts.html`.
- Added `assets/css/syntax.css`, generated with
  `bundle exec rougify style github.{light,dark}`, scoped for both themes
  (`.highlight` for light, `[data-theme="dark"] .highlight` for dark).
- Imported it into the Tailwind source (`@import "./syntax.css";` in
  `assets/css/tailwind.css`) so it compiles into `assets/css/version-3.css`.
- Added base code-block container styling (mono font, padding, border, horizontal
  scroll, inline `code` chip) to the Tailwind source.
- Why: Jekyll already highlights code at build time with Rouge (`highlighter:
  rouge`), but no stylesheet was coloring that markup — colors came only from
  Highlight.js re-highlighting at runtime. Moving to a Rouge stylesheet makes
  highlighting build-time with zero runtime JS.
- Regenerate the theme with the `rougify` commands above and re-run
  `npm run css:build` if the theme is ever changed.

### Housekeeping

- Added `CLAUDE.md` (points to `AGENT.md` via `See @AGENT.md`) so agent guidance
  loads automatically. Excluded `CLAUDE.md` and `assets/css/syntax.css` from
  Jekyll output in `_config.yml`.

### Verification

- `npm run css:build` succeeds; `version-3.css` now contains the Rouge token
  rules for both themes and the code-block container styles.
- `bundle exec jekyll build` succeeds with no warnings.
- Built `_site` has no Materialize/Highlight.js references (only the unrelated
  Devicon logo), code blocks retain `.highlight` markup, and neither `CLAUDE.md`
  nor `syntax.css` leak into the output.

### Follow-up suggestions (not yet done)

- The head loads only the old Google Fonts (Raleway, Open Sans, Josefin Slab,
  Lobster Two), but the Tailwind theme references Inter / Manrope / JetBrains Mono
  for `--font-sans` and `--font-mono`. Those families are not actually loaded, so
  body and code text fall back to system fonts. Decide whether to load the new
  fonts or update the tokens to match what is loaded. (Relates to design.md
  "Typography".)
- `assets/css/main.css` (legacy, ~683 lines) is still loaded. Audit what of it is
  still referenced and fold the rest into the Tailwind source, then drop it.
