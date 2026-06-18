# Site Improvements Roadmap

A prioritised backlog of enhancements for the site, captured 2026-06-18. The
dated record of what shipped lives in `doc/changelog.md`; this file tracks the
ideas and their status. Newer ideas can be appended under the relevant tier.

Status legend: ⬜ planned · 🔄 in progress · ✅ done

## Context

The SEO/infra base is already solid: `jekyll-feed`, `jekyll-sitemap`, canonical
URLs, OG/Twitter tags, and schema.org JSON-LD are all in place (see
`_includes/head.html`). Site search and the `/uses` page shipped earlier in
this pass. The items below are mostly engagement and polish wins.

## Tier 1 — High value, low effort (this pass)

### 1. Per-post social share images ✅

- **Problem:** `meta_image` in `_includes/head.html` is hardcoded to
  `/assets/images/bhupendra.png` for every page, so links to individual posts
  shared on X/LinkedIn/Slack show the headshot instead of the post's own art.
- **Fix:** prefer `page.cover` (posts already define `cover:`) and then a
  page-level `image:`, falling back to the headshot. Used for `og:image`,
  `twitter:image`, and the JSON-LD `image`.
- **Done:** `meta_image` now resolves `page.image` → `page.cover` → default,
  run through `absolute_url`. Since every post sets `cover:`, links to posts now
  share the post's own art.

### 2. Visible Subscribe / RSS link ✅

- **Problem:** `jekyll-feed` generates `/feed.xml` and `{% feed_meta %}` adds
  discoverability `<link>`s, but there is no visible way for a human to
  subscribe.
- **Fix:** add an RSS link to the footer (site-wide) and the blog index.
- **Done:** added an RSS icon to the footer social row and a "Subscribe via RSS"
  button (`.btn-rss`, in RSS orange) in the blog-index hero, both pointing at
  `/feed.xml`.

### 3. Related posts + prev/next navigation ✅

- **Problem:** `_layouts/post.html` ends at Disqus — no on-site path to the next
  read, so readers bounce.
- **Fix:** add a post footer with previous/next links (`page.previous` /
  `page.next`) and/or a few related posts.
- **Done:** added a `.post-nav` block (Older ← / → Newer) before Disqus, using
  Jekyll's `page.previous` (older) and `page.next` (newer). Tag-based *related*
  posts were intentionally deferred to item #4 (Blog tags), since posts have no
  taxonomy yet and Liquid can't cleanly build a related list without it.

## Tier 2 — Medium effort, high engagement

### 4. Blog topic / tag filtering ✅

- 13 posts, no way to browse by topic. Reuse the projects-page filter pattern
  and the posts' existing `techs:` data. Complementary to search.
- **Done:** added a `tags:` taxonomy to all 13 posts (Rails, Ruby, React, Data,
  DevOps, Jekyll) and a single-select chip filter on the blog index
  (`.blog-filter`, driven by `initializeBlogFilter()` in `version-3.js`). Chips
  reuse the projects-page `.tag` look. The index now renders **all** posts so
  filtering works across the whole archive; pagination was disabled for this
  (jekyll-paginate removed from `_config.yml`, see note there). Re-add
  server-side tag pages + pagination if the archive grows large.

### 5. `/now` page ✅

- Short "what I'm focused on right now" page (nownownow.com style). Pairs with
  `/uses` and `/cheatsheet`; very low effort; adds personality.
- **Done:** `now.html` at `/now/` on `site_layout` — three cards (Working on /
  Learning & exploring / Away from the keyboard) with a `last_updated` stamp;
  auto-indexed by search. One `<FILL IN>` left for a personal line.
- **Bonus:** added a footer "more pages" row (Now · Uses · Cheatsheet) so these
  standalone pages are discoverable site-wide, not just from the projects CTA.

## Tier 3 — Worth considering

### 6. Performance pass ⬜

- Lucide, GSAP (+2 plugins), Devicon, and Google Fonts all load from CDNs.
  Self-host fonts and critical JS, or audit with Lighthouse, to improve
  first-load and resilience.

### 7. Accessibility audit ⬜

- Pass for colour contrast in both themes, focus order, and the search
  overlay's screen-reader behaviour.
