# Agent Guide

This repository is a Jekyll-powered personal portfolio and blog for Bhupendra Negi, published at `https://bhupendranegi.github.io/`.

## Project Snapshot

- Static site generator: Jekyll 4.x, managed with Bundler.
- Runtime pins: Ruby `4.0.3`, Bundler `4.0.14`, and Node.js `22.22.3`.
- Design: the light-first "Aurora" theme — white background, navy text, blue accent, blue→violet gradient — with a dark mode via the theme toggle. Fonts: Inter (sans), JetBrains Mono (code), Newsreader (serif accents).
- Front end: Liquid templates, Version 3 Tailwind CSS, and vanilla JavaScript. (Legacy Materialize CSS and Highlight.js have been removed; a small `assets/css/main.css` remnant is still being folded into Tailwind.)
- Motion: GSAP (ScrollTrigger, SplitText, CustomEase) in `assets/js/motion.js` — heading intros and scroll reveals, with reduced-motion and no-GSAP fallbacks. Native scroll (Lenis was trialed and reverted).
- Version 3 styling: Tailwind CLI source lives at `assets/css/tailwind.css` and compiles to `assets/css/version-3.css` (committed for GitHub Pages). Syntax highlighting is build-time Rouge, themed in `assets/css/syntax.css`.
- Icons: Lucide for UI icons; Devicon for technology logos. Lucide no longer ships brand glyphs, so GitHub/LinkedIn/X/Stack Overflow logos are inline SVGs in `_includes/social-icon.html`.
- Content model: pages live at the repo root and in `blog/`; posts live in `_posts/`; portfolio and profile data live in `_data/`.
- Generated output: `_site/`, `.jekyll-cache/`, `.sass-cache/`, and `.jekyll-metadata` are build artifacts and should not be committed.

## Important Files

- `_config.yml`: Site metadata, social links, analytics ID, pagination, plugin config, permalink style.
- `Gemfile` and `Gemfile.lock`: Ruby/Jekyll dependency definitions. Use `bundle exec` for Jekyll commands.
- `index.html`: Home page entry point using the `homepage` layout.
- `_layouts/`: Shared page shells:
  - `default.html`: Base HTML wrapper, theme bootstrap, fixed nav, page container, Google Translate bootstrap.
  - `homepage.html`: The Aurora home page — hero (name/role/social), featured projects, recent writing, CTA.
  - `site_layout.html`: Standard inner-page layout (`.site-page` → `.site-page-inner` rail) with footer.
  - `post.html`: Single blog post — two-column reading shell (sticky TOC + article), reading-progress bar, optional `subtitle:` lead, Disqus.
- `_includes/`: Reusable Liquid partials — `nav.html`, `footer.html`, `head.html`, `scripts.html`, `project.html`/`project_card.html`, `social-icon.html` (inline brand SVGs), `disqus.html`, analytics.
- `_data/sections.yml`: Home hero content and nav sections.
- `_data/projects.yml`: Project cards, filters, technology icons, screenshots, and links.
- `_data/skills.yml`: Skills shown on the About page.
- `_posts/`: Markdown blog posts (`YYYY-M-D-title.md` or `YYYY-MM-DD-title.md`). Optional front matter: `subtitle:` (lead under the title), and for the blog-index thumbnail `cover:` (image), `tech:` (one devicon class), `techs:` (list of devicon classes), or `icon:` (one Lucide name).
- `assets/css/main.css`: Small legacy stylesheet remnant, still being folded into the Tailwind source.
- `assets/css/tailwind.css`: Version 3 source CSS (the single source of truth for styling).
- `assets/css/version-3.css`: Compiled, minified CSS committed for GitHub Pages. Regenerate with `npm run css:build` after editing `tailwind.css`.
- `assets/css/syntax.css`: Rouge code-highlight theme (github light/dark), imported into the Tailwind source.
- `_sass/`: Sass source files retained in the repo.
- `assets/js/version-3.js`: Vanilla behavior — theme toggle, mobile nav, project filters, modals/carousel, contact form, nav state, and the post enhancers (TOC + scroll-spy, copy buttons, reading progress).
- `assets/js/motion.js`: GSAP motion layer (heading intros, scroll reveals).
- `assets/images/`: Images, logos, SVG tech icons, and the resume PDF.

## Local Commands

Install dependencies:

```sh
./bin/setup
```

Serve locally:

```sh
./bin/dev
```

Build the site:

```sh
npm run build
```

Build with drafts, if drafts are added later:

```sh
bundle exec jekyll build --drafts
```

## Editing Guidelines

- Keep site-wide identity, links, analytics, pagination, and plugin settings in `_config.yml`.
- Prefer `_data/sections.yml`, `_data/projects.yml`, and `_data/skills.yml` for content that is already data-driven.
- Add blog posts under `_posts/` with YAML front matter and Markdown content.
- Use existing Liquid includes and layouts before creating new page-specific markup.
- **Content width is consistent site-wide:** every page's main content uses the same 1240px rail (the home `.hero`/`.home-section` and inner pages' `.site-page-inner`, both `width: min(100%, 1240px)` with `padding-inline: clamp(1.25rem, 5vw, 2rem)`). Do not give a page its own narrower `max-width`; if a block must be narrower (e.g. a form or reading column), nest it inside the rail rather than shrinking the page container.
- Keep asset paths root-relative where the current code already does so, for example `/assets/images/...`.
- After editing `assets/css/tailwind.css`, run `npm run css:build` to regenerate the committed `assets/css/version-3.css`. Never hand-edit the compiled file.
- Keep interactive behavior in `assets/js/version-3.js` and motion in `assets/js/motion.js`; avoid adding jQuery or Barba.js back into the runtime.
- Posts use a reusable diagram component: `<figure class="post-figure">` with either a `.post-figure-flow` (icon-card steps joined by arrows) or a `.post-figure-compare` (a row of cards). Reuse it for new post diagrams rather than inventing new markup.
- Post body headings use `#####`/`######` as section titles by convention; the prose CSS styles them as real headings and the TOC is generated from them client-side.
- The project cards depend on numeric `id` values in `_data/projects.yml`; the "Next" modal behavior increments these IDs.
- Project filter buttons in `projects.html` must match tags used in `_data/projects.yml`.
- The skills page uses Devicon class names from `_data/skills.yml`; check that new icon classes exist in the loaded Devicon version.
- Contact form submission is handled client-side through Formspree and `fetch`.
- Disqus and Google Analytics are configured through `_config.yml` and included from `_includes/`.

## Verification Checklist

Before finishing meaningful changes, run:

```sh
npm run build
```

For visual or behavior changes, also run the local server and check:

- Home hero intro animation and scroll reveals.
- Inner-page navigation, active nav state, and mobile nav.
- Light/dark theme toggle (verify both themes).
- Blog index pagination/thumbnails; single-post TOC + scroll-spy, code copy buttons, reading-progress bar, and the `.post-figure` diagram.
- Project filters, project modals (open/close/click + "Next"), and carousel images.
- Contact form validation and success modal.
- Resume PDF inline preview and download.

## Notes for Future Agents

- Do not edit `_site/`; it is generated by Jekyll.
- Do not commit local caches or vendored dependencies.
- Avoid broad refactors unless the user asks for them.
- The Aurora theme is the shipped direction (see `doc/changelog.md`). Match the existing tokens, components, and the 1240px content rail rather than introducing new patterns.
- If updating dependencies, verify Disqus, Google Translate, Lucide, Devicon, GSAP, and the Rouge/`syntax.css` highlighting still work together. (Lucide is loaded via CDN at `@latest` — pinning it is a known open item.)
- Preserve user content and personal branding unless the user explicitly asks to rewrite it.
