# Single Blog Post Redesign

Working checklist for making individual blog post pages (`_layouts/post.html`)
more readable and engaging. Scope: the reading experience of one post, not the
blog index (that was handled separately).

## Goals (from review)

1. Make the post body readable — typography, measure, spacing, heading hierarchy.
2. Add a diagram/image to at least one post to make it more engaging (start with
   "Getting Started With Jekyll").
3. Make code blocks more readable — language label, copy button, theme-aware card.
4. Intentional styling throughout (lists, blockquotes, rules, images, links).
5. Fix the "More articles" button — its label was invisible (blue text on the
   blue gradient button, caused by `.post a` overriding `.btn-primary`).
6. Add a left-hand index (table of contents) so readers can see a summary and
   jump between sections, with active-section highlighting.

## Tasks

- [x] Restructure `post.html` into a two-column reading layout: sticky TOC rail
      on the left, article column (~720px measure) on the right. Collapses to a
      single column on tablet/mobile (TOC becomes a collapsible "On this page").
- [x] Add a slim reading-progress bar at the top of the post.
- [x] Improve `.site-prose` typography: heading scale for h2–h6 (these posts use
      h5/h6 as their de-facto section titles), paragraph rhythm, lists,
      blockquotes, horizontal rules, images, and tables.
- [x] Redesign code blocks: rounded theme-aware card, header bar showing the
      language, and a one-click copy button. Keep Rouge token colors (syntax.css).
- [x] Fix the prose-link scope so `.btn-primary` / `.btn-ghost` keep their own
      colors (the "More articles" visibility bug).
- [x] Build the TOC, scroll-spy, smooth in-page scroll, copy buttons, and
      progress bar in `assets/js/version-3.js`; register in the init list.
- [x] Add a build-flow diagram to the "Getting Started With Jekyll" post
      (Markdown + Liquid -> Jekyll -> Static HTML -> GitHub Pages), theme-aware.
- [x] Build, screenshot, and verify in light and dark themes, desktop + mobile.
- [x] Update `doc/changelog.md`.

## Notes / decisions

- TOC is generated client-side from the headings already inside `.site-prose`
  (kramdown emits stable `id`s), so no per-post front matter is required.
- Content width stays inside the canonical 1240px rail; the two columns live
  inside it. The reading column is capped near 720px for comfortable measure.
</content>
</invoke>
