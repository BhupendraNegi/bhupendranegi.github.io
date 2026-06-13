# Version 3 Changelog

A dated log of meaningful changes on the `version-3` branch, with rationale.
Newest entries first. This complements `doc/design.md` (the plan) and
`doc/todo.md` (the checklist).

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

## 2026-06-13 — Locked theme + full-screen Home (v2) with curtain transitions [SUPERSEDED]

The first Home redesign (hero + image-card grid) was rejected for losing the
full-screen feel. After reviewing design references (pmportfolio.ca as the north
star; Awwwards fullscreen/portfolio galleries; brittanychiang.com), the site-wide
direction was locked: full-screen, clean, minimal-dark, transition-forward.
Recorded in `doc/design.md` ("Locked Visual Direction").

### Transition system (curtain)

- Intro curtain: a full-screen accent panel covers the page before first paint
  (armed in `_includes/head.html` so there is no flash) and wipes away on load
  (`initializeIntroCurtain` in `assets/js/version-3.js`). A 2s safety timeout
  guarantees the page is never left covered if JS fails, and reduced-motion users
  skip it entirely. Markup added to `_layouts/default.html`.
- Page-to-page transition: navigating lowers the same curtain to cover the page,
  then performs the navigation; the next page arrives with the curtain covering
  and wipes it away. This is a full reload masked by the curtain — visually the
  curtain transition the design calls for, with zero re-initialization risk.
  (True Swup no-reload SPA swaps are logged as an optional follow-up since they
  require re-initializing every interactive component and live testing.)
- Scroll reveals: `[data-reveal]` elements fade/translate in via
  IntersectionObserver. Made progressive-enhancement — only armed when JS adds
  `html.reveals` (set pre-paint, skipped under reduced motion) — so content stays
  visible without JS.
- All motion animates only `transform`/`opacity`, short durations, with
  `prefers-reduced-motion` handling throughout.

### Full-screen Home (v2)

- `_layouts/homepage.html` rebuilt as full-viewport panels: an intro panel
  (eyebrow, name, role + stack, blurb, CTAs, social links, scroll cue) followed by
  four full-screen image-backed section panels (About/Projects/Blog/Contact) via
  `_includes/box.html`, each with an index number, heading, description, and an
  Explore CTA. The original section illustrations return as panel backgrounds
  under a left-dark→right-light gradient, keeping the visual nod while staying
  readable.

### Fixes found during this work

- Added `body { margin: 0 }` to the base layer. With Tailwind Preflight off there
  was no reset, so the default 8px body margin showed as a light frame around the
  dark home.
- Dropped the experimental scroll-snap on the home. Making `<html>` a snap
  container caused a stray ~80px initial scroll and let the light scroll-container
  background show as a frame. Replaced with a dark scroll-container background and
  smooth anchor scrolling; full-screen feel is preserved by the 100vh panels.

### Verification

- `npm run css:build` and `bundle exec jekyll build` succeed.
- Desktop (1440px) verified visually: intro and all four section panels render
  with images, content, and CTAs. Mobile overflow verified via an injected probe
  (`scrollWidth == clientWidth`, no real overflowers). Note: this Chrome build
  enforces a ~500px minimum headless viewport, so a true 360/390px screenshot
  could not be captured; the name's clamp sizing ensures it wraps rather than
  overflows.

## 2026-06-13 — Phase 5: Home page redesign (v1, superseded)

First page redesign of Phase 5. Goal (from `doc/design.md`): make the first
viewport clearly identify Bhupendra Negi, add role text and CTAs, keep four
primary destinations but make them scannable and mobile-first, and keep a nod to
the original visual tile concept.

### Hero

- Added a hero to `_layouts/homepage.html`: eyebrow, name, role + tech stack,
  a one-line blurb, three CTAs (View Projects / Read Blog / Contact), and social
  links.
- Hero copy is data-driven from a new `hero` block in `_data/sections.yml`, so it
  stays editable without touching markup.

### Section cards

- Replaced the full-bleed 2x2 "glitch"-animated tiles with a responsive grid of
  image-backed cards (`_includes/box.html`): a refined overlay, a heading, a
  short description, and an "Explore" affordance, with a subtle hover (image zoom
  + lift). This keeps the image-tile nod while dropping the heavy multi-layer
  glitch animation, in line with the "subtle motion, mobile-first" direction.
- Cards are a 2-column grid on desktop and stack to a single column at <=680px.
- Section card copy in `_data/sections.yml` was rewritten to be descriptive.
- The old `.homepage-*` and `#homepage .home_heading/.words` rules in the Tailwind
  source were replaced with the new `.home-hero-*` and `.home-card-*` styles. The
  now-orphaned glitch rules still live in legacy `assets/css/main.css` and should
  be removed in the pending `main.css` audit (Phase 7).

### Fixed: missing brand icons (affected hero AND footer)

- Discovered that `lucide@latest` no longer ships brand icons (`github`,
  `linkedin`, `twitter`) — verified they resolve to nothing. The footer social
  icons were therefore already rendering blank in production, and the new hero
  icons would have too.
- Added `_includes/social-icon.html` with inline brand SVGs (GitHub, LinkedIn,
  X, Stack Overflow) and used it in both the hero and `_includes/footer.html`.
  This is CDN- and Lucide-version-independent.

### Fixed: mobile horizontal overflow

- With Tailwind Preflight intentionally off, there is no global
  `box-sizing: border-box`. `.home-wrap` used `width: min(100%, 1180px)` plus
  horizontal padding, so under the default `content-box` it overflowed the
  viewport by ~24px on narrow screens (confirmed a horizontal scrollbar at
  360px). Added `box-sizing: border-box` to the home containers and switched the
  mobile grid track to `minmax(0, 1fr)`. Re-measured: zero overflowing elements,
  `scrollWidth == clientWidth` at 360px.
- This same content-box pattern likely affects other page containers
  (`.site-page-inner`) on mobile; logged a Phase 6 task to add a global
  border-box base rule rather than per-page workarounds.

### Verification

- `npm run css:build` and `bundle exec jekyll build` succeed.
- Visually checked the rendered home at 360px, 390px, and 1440px (headless
  Chrome): hero and cards render correctly, social/CTA icons show, text wraps
  within the viewport, no horizontal scroll.

### Follow-ups logged in todo.md

- Pin the Lucide version instead of `@latest` (Phase 4) so icons do not silently
  break when Lucide drops more glyphs.
- Add a global `box-sizing: border-box` base rule (Phase 6).

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
