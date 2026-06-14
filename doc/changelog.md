# Version 3 Changelog

A dated log of meaningful changes on the `version-3` branch, with rationale.
Newest entries first. This is the record of what shipped; `doc/todo.md` tracks
remaining work. (The earlier planning docs — `design.md`, `redesign-plan.md`,
`blog-post-redesign.md` — were folded into this log and removed; they remain in
git history if needed.)

## 2026-06-14 — Hardening: Lucide pin, SEO, box-sizing, dead CSS, a11y

- **Pinned Lucide** to `1.18.0` (was `@latest`) so icons can't silently break
  when Lucide drops/renames glyphs.
- **SEO:** added a canonical link; `og:type` is `article` for posts (with
  `article:published_time`/`author`), else `website`; meta description now derives
  from `description` → `subtitle` → post excerpt → site default.
- **Global `box-sizing: border-box`** base rule (Tailwind Preflight is off), and
  removed the scoped `.site-page *` workaround.
- **Removed legacy `assets/css/main.css`** (~676 lines, almost all dead old-home
  CSS). Folded the only live rules — the sticky-footer `body`/`main` flex layout
  and `.center` — into the Tailwind base; dropped the stylesheet `<link>`.
- **Dead link:** removed the Health Tracker live URL (old Heroku free dyno is
  gone); Code + gallery remain.
- **Contrast (WCAG AA):** prose/UI links use `--site-accent-strong` (5.17:1 vs
  3.68:1 on white); primary buttons use a dedicated darker `--site-gradient-cta`
  (#2563eb → #7c3aed) so white labels pass, while the airy hero gradient is
  unchanged.

## 2026-06-14 — Post tweaks: SOPS retitle + multi-logo comparison

- **Rails vs Node.js vs Go:** each in-article comparison card now shows **three
  tech logos** (Rails → Ruby/Rails/PostgreSQL, Node → Node.js/JavaScript/Express,
  Go → Go/Docker/Kubernetes) via a new `.post-figure-icons` row, accent-colored.
  The **blog-index thumbnail** for that post now shows Rails + Node.js + Go logos
  too, via a new `techs:` (list) front-matter override + `.post-row-logos` style.
- **SOPS post:** retitled "Managing **Rails** Secrets…" → "Managing Secrets With
  SOPS" (SOPS isn't Rails-specific), added a `subtitle:` front-matter line shown
  as a lead under the post title (new `post.subtitle` support in `post.html` +
  `.post-hero-lead`), set the blog thumbnail to a `lock-keyhole` icon, and renamed
  the file so the slug is `/Managing-Secrets-With-SOPS/`.

## 2026-06-14 — Five new Rails blog posts

- Added five posts in the established post design (intro → `.post-figure`
  diagram → `#####` sections → code cards):
  - Reactive Rails With Hotwire (2024-07-10)
  - Deploying Rails With Kamal 2.0 (2025-01-02)
  - Managing Rails Secrets With SOPS (2025-03-10)
  - Upgrading Rails 5 & 6 to Rails 8 (2025-05-22)
  - Ruby on Rails vs Node.js vs Go (2026-01-10, comparison-style figure)
- **Blog index now supports `tech:` / `icon:` front-matter overrides** for the
  thumbnail, so a title like "**React**ive Rails" no longer mis-matches the React
  logo. Set `tech: rails-plain` (Hotwire) and `tech: docker-plain` (Kamal).
- The 13 posts now span 3 paginated pages.

## 2026-06-14 — Contact, Resume, and 404 pages

- **Contact page** reworked from a lone floating form into a two-column layout
  (nested at max 1060px inside the rail): a left **"Other ways to reach me"**
  panel with tappable method cards (Email, LinkedIn, GitHub via inline brand
  SVGs, plus a response-time note) and the form on the right. The submit button
  is now a full-width **primary gradient CTA** ("Send message") instead of the
  weak ghost-styled `button.fill`; added a `.btn-primary:disabled` state and
  updated the JS busy/idle labels ("Sending…" / "Send message").
- **Resume page** now embeds a **live, readable PDF preview** (`<object>` framed
  as a card, ~82vh tall, with an "Open in new tab"/"Download PDF" action row and
  a graceful fallback link) instead of a tiny card that forced a download.
- **404 page** image now loads from the **local asset**
  (`/assets/images/octobiwan.jpg`) instead of a fragile `github.com/...blob...?raw=true`
  URL, and is framed with a border, radius, and soft shadow.

## 2026-06-14 — Diagrams on every post + TOC card

- **TOC sidebar is now a card:** `.post-aside` gets a `--site-surface` background,
  border, radius, and soft shadow (theme-aware: white in light, dark surface in
  dark).
- **A relevant diagram on every post**, inserted right after each intro using the
  reusable `.post-figure` component:
  - Jekyll — build flow (Markdown+Liquid → Jekyll → Static HTML → GitHub Pages)
  - CSV Import With Kiba — ETL pipeline (CSV → Source → Transform → Destination)
  - React Query — cache flow (Component → Query cache → API/Server)
  - XML Import With XSLT — transform flow (XML → XSLT → Output)
  - Effortless Ruby ETL — Extract → Transform → Load
  - Fancy Emails With MJML — MJML → Compiler → Responsive email
  - Solid Queue — producer–consumer (Producer → Queue → Consumer)
  - React Context vs Redux vs Zustand — a 3-up **comparison** card (new
    `.post-figure-compare` grid variant) instead of a flow.
  - All use Lucide icons; verified rendering in light and dark.
- **Fixed a typo in the React post's URL:** renamed
  `…-React-Context-Vs-Redux-Vs-Zustland.md` → `…-React-Context-vs-Redux-vs-Zustand.md`
  (was "Zustland"). New slug `/React-Context-vs-Redux-vs-Zustand/`; old URL 404s.

## 2026-06-14 — Post follow-ups: width, navbar gap, Solid Queue slug

- **Full-rail width:** the post shell now fills the canonical 1240px rail
  (`grid-template-columns: 220px minmax(0, 1fr)`, no centering) so a single post
  matches the width of every other inner page (measured 52→1228px, same as
  `.site-page-inner`). Was previously a centered ~930px block.
- **Navbar gap:** added top padding to `.post-article` so the "All articles"
  back-link clears the fixed navbar (gap ~6px → ~74px).
- **Solid Queue slug:** renamed `2024-02-02-Solid-Queues-With-Rails.md` →
  `…-Solid-Queue-With-Rails.md` so the URL is `/Solid-Queue-With-Rails/` (singular,
  matching the title). The old plural URL now 404s.

## 2026-06-14 — Single blog post redesigned for readability

- **Two-column reading layout** (`_layouts/post.html`): a sticky **table-of-
  contents rail** on the left and the article column (~720px measure) on the
  right, inside the canonical 1240px rail. Collapses to one column below 1080px
  (the TOC hides on narrow screens).
- **Table of contents** is generated client-side from the post's headings
  (`assets/js/version-3.js` → `initializePostEnhancements`): builds the list,
  ensures heading ids, two indent levels, **scroll-spy** active highlighting, and
  smooth in-page scroll. Hidden automatically when a post has < 2 headings.
- **Reading-progress bar** fixed to the top of the viewport, gradient fill driven
  by article scroll position.
- **Prose typography overhaul** (`.site-prose`): deliberate heading scale for
  h2–h6 (these posts use h5/h6 as section titles — h5 now gets a gradient tick,
  h6 an uppercase accent eyebrow), larger body measure (1.05rem/1.78), and styled
  lists, blockquotes, horizontal rules, images, tables, and inline code.
- **Code blocks** wrapped into a theme-aware `.code-card` with a header bar
  showing the **language label** and a one-click **Copy** button (with copied
  state). Rouge token colors (syntax.css) are preserved.
- **Fixed the "More articles" button** rendering invisible: `.post a` (specificity
  0,0,1,1) was overriding `.btn-primary { color:#fff }`. Prose-link colors are now
  scoped to `.site-prose`/`.entry`/`.blog-content` so the page-action buttons keep
  their own colors. The post title also no longer inherits the accent color.
- **Diagram added** to "Getting Started With Jekyll": a theme-aware build-flow
  figure (Markdown + Liquid → Jekyll build → Static HTML → GitHub Pages) via the
  reusable `.post-figure` / `.post-figure-flow` styles.

## 2026-06-14 — Blog index reworked + dev-server notes

- **Blog index:** replaced the multi-column post-card grid with a
  **single-column list of horizontal rows** (thumbnail left, text right,
  divider between), matching the Projects layout. Posts have no images, so each
  row shows a **gradient thumbnail with a Lucide icon** chosen from keywords in
  the title (react→atom, jekyll→feather, email→mail, query→database,
  xml/csv/import→file-code, ruby/rails/etl/queue→layers). A `cover:` front-matter
  field, if added to a post, overrides the placeholder with a real image.
- **Pagination:** `paginate` lowered 10 → 5 so the 8 posts span 2 pages and the
  Prev/1/2/Next control actually appears.
- **Google Translate script** made `async` + explicit `https://` (was a blocking
  protocol-relative `//` script that could stall the page-load indicator).
- Note: a reported "site won't load with DevTools open / `ERR_INTERNET_
  DISCONNECTED`" was **not** a site bug — it was Chrome DevTools' Network
  throttling stuck on "Offline" (reproduced on the live GitHub Pages site too).

## 2026-06-13 — Projects page rework

- **Layout (v3):** single-column list of **horizontal rows** — a bordered
  ~300px image on the left, text on the right (title, description, **devicon
  tech chips** matching /about), with a divider rule between projects. (v2's
  full-width top image read too big.)
- **Filter:** wrapped in a bordered, shadowed **panel** (max 760px, centered) so
  it stands out as the focus for filtering.
- **Modal gallery:** carousel slides were different sizes (object-fit:contain on
  varied images). Now a fixed **16/9 gallery frame** with `object-fit:cover`, so
  every screenshot is the same size. Modal info simplified to title +
  description + the same devicon chips; footer buttons use btn-primary/btn-ghost.
  (Also removed a duplicate `id` on the "Next" button.)
- **Filters:** themed to the Aurora palette — active tag is now accent-filled
  (was an off-theme teal); pills get hover lift; filter bar centered.
- **Modal not clickable — fixed.** `<body>` is a flex container (legacy
  `main.css`), and the modal overlay is appended to `<body>` as a flex item with
  `z-index:1300`. The page content sits in a sibling flex item (`.site-shell`),
  so its whole subtree — including the modal — painted *below* that overlay no
  matter the modal's z-index (verified: even `z-index:99999` stayed under it).
  Fix: `openModal` now **portals the modal up to `<body>`** so it shares the
  overlay's stacking context (modal `z-index:1301` > overlay `1300`). Because
  modals leave `.project_list` when portalled, the "Next" cycle uses a list of
  project modals captured at init, and the CSS that targeted `.project_list
  .modal` now targets `.modal-fixed-footer` (a class unique to project modals).

## 2026-06-13 — Inner-page polish + sitewide consistency

Applied the home "Aurora" design language across every inner page, then a
series of consistency fixes from review feedback.

### Inner pages reskinned

- Shared `.page-hero` header (eyebrow + title + lead) on About, Projects,
  Contact, Blog, Post, Resume, 404.
- About: profile-card layout (portrait with gradient ring + "Open to work"
  name, role, quick facts, social) beside the bio shown as **value cards**
  (Clean code / Problem solving / Great UX). Skills shown as gradient-accent
  cards with pill chips. The old emoji bio paragraphs became a distinct
  **"journey" timeline** (emoji nodes on a gradient line) in an editorial
  **serif** font (`--font-serif`, Newsreader); reverse-chronological (current
  role at top → school at bottom), each entry showing role · company · date,
  a one-line summary, and the **technologies** used as badges (drawn from the
  résumé). Profile card intentionally omits the "Open to work" badge / IEEE
  line per request.
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
https://koysor.me/. Replaces the rejected
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

Context: a review of the design plan and `doc/todo.md` against the actual repo
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
  fonts or update the tokens to match what is loaded. (Typography.)
- `assets/css/main.css` (legacy, ~683 lines) is still loaded. Audit what of it is
  still referenced and fold the rest into the Tailwind source, then drop it.
