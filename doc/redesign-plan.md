# Version 3.1 Redesign Plan — "Aurora" theme

A brand-new theme and motion system, replacing the teal-on-black look. This is a
site-wide change (not just Home). Decided 2026-06-13.

## References & intent

- Theme (exact target): https://wassim.dev/ — clean, light-first, blue accent
  with a blue→violet gradient as the flashy highlight; proper top navbar with a
  light/dark toggle; Inter typography.
- Motion (target feel): https://koysor.me/ — GSAP 3 (ScrollTrigger, SplitText,
  Flip, CustomEase, Observer) + Lenis smooth scroll; text-split heading reveals,
  scroll-triggered staggered entrances, buttery smooth scrolling.
- Goal: wassim.dev's theme + koysor.me's motion. Flashy but clean.

## Locked decisions (from user, 2026-06-13)

1. Theme mode: **light default + dark toggle**.
2. Home layout: **wassim.dev-style clean scrolling sections** (no full-screen
   image panels).
3. Motion: **full GSAP + Lenis**.
4. Hero visual: **abstract blue→violet gradient graphic** (CSS/SVG, no photo).
5. Remove the "BN" logo flash from the intro; keep a transition, not that.
6. New navbar that matches the theme; the current nav goes.

## Design tokens (from wassim.dev)

Light (default):
- `--bg: #ffffff`, `--bg-secondary: #f8f9fa`, `--bg-card: #ffffff`
- `--text: #1a1a2e`, `--text-secondary: #64748b`
- `--accent: #3b82f6`, `--accent-hover: #2563eb`
- `--border: #e2e8f0`, `--border-hover: #cbd5e1`
- `--tag-bg: #f1f5f9`, `--tag-text: #475569`
- `--gradient-start: #3b82f6`, `--gradient-end: #8b5cf6`

Dark (toggle):
- `--bg: #0a0a0f`, `--bg-secondary: #111118`, `--bg-card: #16161d`
- `--text: #f0f0f5`, `--text-secondary: #8b8b9e`
- `--accent: #60a5fa`, `--accent-hover: #93c5fd`
- `--border: #1e1e2a`, `--border-hover: #2a2a3a`
- `--tag-bg: #1e1e2a`, `--tag-text: #a0a0b8`
- gradient unchanged (blue→violet reads well on both)

These replace the existing `--site-*` teal/ink tokens. We will rename to the
wassim token names (or map `--site-*` onto these values) consistently.

Typography:
- Sans: **Inter** (already referenced in the Tailwind theme; will actually be
  loaded now). Weights 400/500/600/700/800.
- Mono: JetBrains Mono (or Inter's tabular) for tags/code/eyebrows.
- Load via Google Fonts (preconnect) initially; self-hosting is a later option.
- The gradient is used for: hero name highlight, section eyebrows, key links,
  and primary button background.

## Navbar (new)

- Sticky top bar, translucent with backdrop-blur, subtle bottom border.
- Left: text logo "Bhupendra Negi" (or "BN." mark) linking home.
- Center/right: links — Home, Projects, Blog, About, Contact (Resume optional).
- Far right: light/dark toggle (sun/moon, Lucide), animated.
- Active-link indicator: gradient underline.
- Mobile: hamburger → full-screen overlay menu with staggered link reveal.
- Replaces the current dark `.site-header`/`.site-nav`. The Home page will now
  ALSO use the navbar + footer (today it has neither).

## Home layout (wassim.dev-style)

Single-column, centered max-width (~720–820px), generous vertical rhythm:

1. Hero: eyebrow ("Software Engineer"), large name with gradient highlight,
   one-line role, short blurb, social links, primary CTA. The abstract gradient
   graphic sits behind/beside the hero (animated mesh/orb, CSS/SVG, GPU-cheap).
2. Featured Projects: 2-up cards from `_data/projects.yml` (title, summary, tags,
   links), hover lift, "View all →".
3. Recent Writing: list of latest posts from `_posts` (title, date, reading time,
   tags), "View all →".
4. About teaser + Contact CTA.
5. Footer (existing, restyled to the new theme).

No full-screen panels; no per-section background photos.

## Motion system (GSAP + Lenis)

- Libraries: GSAP 3.13+ core + ScrollTrigger + SplitText + CustomEase; Lenis for
  smooth scroll. Loaded from pinned CDN (GSAP & all plugins are free as of 3.13);
  self-host later if desired. Total ~50–70KB JS, deferred.
- Intro (replaces the curtain BN logo): on first load, the hero name/eyebrow
  reveal via SplitText (chars/words rise + fade with custom ease), staggered with
  the rest of the hero. No logo, no full-screen wipe panel. Fast (~0.6–0.9s).
- Scroll reveals: ScrollTrigger fades/translates section headings (SplitText) and
  cards in as they enter, with stagger. Custom ease for the polished feel.
- Smooth scroll: Lenis wraps the page scroll. Anchor links and the navbar tie in.
- Page-to-page: a light fade/slide on navigation (GSAP timeline) — kept simple to
  avoid the SPA re-init complexity; can layer Swup later if wanted.
- Accessibility: if `prefers-reduced-motion`, disable Lenis, skip SplitText/scroll
  animations, render everything static and visible. All reveals are progressive
  enhancement (content visible if JS fails).
- Performance: animate transform/opacity only; SplitText reverts after intro;
  ScrollTrigger uses `once: true` where possible.

## Hero gradient graphic

- CSS/SVG abstract: layered radial blue→violet "orbs"/mesh with a soft blur and a
  slow GPU-only drift animation (transform), respecting reduced motion. No raster
  asset, no network cost. Marked as a clear swap point if a real asset is wanted.

## Site-wide application (all pages, not just Home)

Because the theme changes globally, every page must be re-skinned to the new
tokens. Order after Home:
- Navbar + footer (shared) — first, since every page uses them.
- About, Projects, Blog index, Post, Contact, Resume, 404 — restyle cards,
  buttons, tags, forms, prose, pagination, code blocks (Rouge theme may need a
  light-friendly variant since the default now is light).

## What gets removed

- Teal/ink `--site-*` palette and the dark-default assumption.
- Full-screen home panels (`.home-panel*`), the section background images
  (about_me/project/blog/contact .png) from the home, and the scroll-cue.
- The curtain intro's "BN" logo (and likely the full curtain wipe, replaced by
  the GSAP text-reveal intro).
- Legacy `main.css` glitch/home rules (already orphaned) — fold remaining bits
  and delete.
- The old Josefin/Raleway font stack on the home name.

## GitHub Pages / build compatibility

- All motion libs via pinned CDN (or self-hosted in `assets/js/vendor/`), loaded
  with `defer`. No build step beyond Tailwind. Compiled `version-3.css` stays
  committed. The GitHub Actions workflow already builds with the real toolchain.

## Risks / watch-items

- JS weight (~50–70KB) vs the earlier performance goal — accepted for the flashy
  brief; mitigate with defer, reduced-motion bail-out, and pinned/self-hosted libs.
- Lenis smooth-scroll can feel off on some mobile/trackpads; provide an easy
  disable and honor reduced motion.
- SplitText + Rouge code blocks + Disqus + Google Translate must not be broken by
  the motion layer; verify each.
- Light default means the Rouge syntax theme should default to the light variant.
- Verifying GSAP/Lenis motion needs a real browser (headless can't show it well);
  user to eyeball via `./bin/dev`.

## Implementation phases

1. Tokens + fonts: swap palette to wassim tokens (light default + dark), load
   Inter + mono, set light Rouge syntax default. Rebuild; confirm existing pages
   still readable.
2. Navbar + footer: new shared navbar (with theme toggle + mobile overlay) and
   restyled footer; make Home use them.
3. Home rebuild: wassim-style hero (gradient graphic) + featured projects +
   recent writing + about/contact, data-driven.
4. Motion: add GSAP + Lenis; intro text-reveal (no logo), scroll reveals, smooth
   scroll, reduced-motion bail-out.
5. Re-skin remaining pages (About, Projects, Blog, Post, Contact, Resume, 404).
6. Cleanup (remove panels/images/curtain-logo/legacy CSS), verify build, eyeball
   motion locally, document.

## Home refinement ideas (proposed 2026-06-13, pending user pick)

Feedback: content too narrow; navbar disliked; project + writing sections too
basic. Ideas below; chosen options to be recorded once the user picks.

1. Content width — widen `.hero`/`.home-section` from 920px to at least the
   navbar width (1180px), optionally 1240px. Keep text blocks readable with an
   inner max-width on paragraphs.
2. Navbar — options: (A) floating rounded "pill" bar detached from the top with
   blur; (B) refined minimal (logo left, links right) with larger Inter type, a
   gradient active indicator, and a Resume pill CTA; (C) logo left + centered
   links + actions right. Plus larger tap targets and a smoother mobile menu.
3. Project cards — give each a generated, on-brand cover (animated blue→violet
   gradient/mesh with the project's primary tech devicon, or a tech-icon
   collage). Hover: lift + gradient border glow + cover zoom/parallax + links
   slide in. (Real photos optional if the user supplies them; stock imagery is
   avoided for licensing on a static site.)
4. Recent Writing — options: (A) cards matching projects (date, reading time,
   tags, arrow); (B) rich list rows with an index number, hover gradient fill,
   and arrow slide; (C) one featured post + a compact list. Add tags/reading time
   and a clear hover transition.

### Home refinement — chosen options (user, 2026-06-13)

- Content width: 1240px (`.hero`/`.home-section`).
- Navbar: floating rounded "pill" bar (detached from top, blurred) + Resume CTA.
- Project cards: cover = blue→violet gradient/mesh with the project's primary
  Devicon logo large + faded; hover = lift + gradient glow + glyph shift; tags +
  Code/Live links.
- Recent Writing: post cards matching the project cards (date, reading time,
  title, Read →).
