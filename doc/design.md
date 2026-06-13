# Version 3 Design Plan

This document captures the modernization plan for the next version of `bhupendranegi.github.io`. It is intentionally a review document first. After review, the implementation work should be broken into `doc/todo.md`.

## Goals

- Refresh the whole website without losing the existing portfolio, blog posts, resume, and personal branding.
- Update Ruby, Bundler, Jekyll, gems, and the local development workflow.
- Replace older frontend dependencies where they no longer help.
- Move away from jQuery-driven UI behavior.
- Replace Barba.js with a maintained page transition/navigation approach or remove full-page transitions if the design is stronger without them.
- Use one consistent icon strategy instead of mixing multiple libraries casually.
- Improve UI quality, visual hierarchy, readability, accessibility, performance, and mobile friendliness.
- Keep the site simple to maintain as a personal portfolio and blog.

## Current State

The current site is a Jekyll static site.

Core stack:

- Jekyll 4.4.1
- Ruby and Bundler
- Liquid layouts and includes
- Markdown posts in `_posts/`
- Data-driven sections, projects, and skills in `_data/`
- Materialize CSS 0.100.2
- jQuery
- Barba.js 1.x
- Highlight.js plus Rouge
- Devicon, Font Awesome, Material Icons, and local SVG/image assets

Current strengths:

- Content is already mostly static and data-driven.
- Blog posts and project data are easy to preserve.
- The site deploys well as static HTML.
- The homepage has a memorable visual concept.
- The repo is small enough for a controlled modernization.

Current pain points:

- Materialize 0.100.2, jQuery, and Barba.js 1.x are old dependencies.
- UI behavior is spread across several JavaScript files with repeated initialization after page transitions.
- Multiple icon libraries create inconsistent sizing, stroke weight, and visual tone.
- The CSS is large and has legacy sections, making design changes harder.
- Mobile behavior depends heavily on old Materialize components.
- Page transitions add complexity around scripts, Disqus, Google Translate, overlays, and reinitialization.
- Some HTML structure and copy can be improved for accessibility, SEO, and responsive layout.

## External Documentation Checked

Checked on 2026-06-10:

- Jekyll docs: Jekyll requires Ruby 2.7.0 or higher and documents `bundle exec jekyll serve` as the local server command: https://jekyllrb.com/docs/
- Jekyll installation docs: https://jekyllrb.com/docs/installation/
- Ruby downloads: current stable Ruby is listed as 4.0.5: https://www.ruby-lang.org/en/downloads/
- Bundler docs: Bundler tracks and installs exact gem versions from `Gemfile` and `Gemfile.lock`: https://bundler.io/
- GitHub Pages and Jekyll docs: GitHub Actions are now recommended for deploying and automating GitHub Pages sites: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Tailwind CLI docs: Tailwind scans templates and writes static CSS with zero runtime: https://tailwindcss.com/docs/installation/tailwind-cli
- Turbo Drive handbook: https://turbo.hotwired.dev/handbook/drive
- Swup docs: https://swup.js.org/getting-started/
- Lucide static icon docs: https://lucide.dev/guide/static
- Devicon docs: https://devicon.dev/

## Recommended Direction

Use an incremental modernization instead of a full rewrite.

Recommended stack for Version 3:

- Keep Jekyll for content, posts, Liquid templates, and GitHub Pages compatibility.
- Add a small Node build step only for Tailwind CSS and optional JavaScript bundling.
- Replace Materialize with Tailwind CSS plus a small amount of custom CSS.
- Replace jQuery with modern browser APIs.
- Replace Barba.js with either Swup or no global page-transition library.
- Use Lucide for interface icons.
- Keep Devicon only for technology logos.
- Keep Rouge for code highlighting and remove Highlight.js unless there is a specific reason to keep runtime highlighting.
- Deploy through GitHub Actions so custom build steps are reliable.

Why this path:

- The site is content-first, so Jekyll still fits.
- Tailwind gives fast design iteration without a runtime dependency.
- Removing jQuery and Materialize reduces script weight and old component constraints.
- Keeping Jekyll avoids a risky content migration before the visual redesign.
- GitHub Actions makes it easier to use current Ruby, Bundler, Jekyll, Tailwind, and any future build steps.

## Architecture Options

### Option A: Keep Jekyll, Add Tailwind

This is the recommended option.

What changes:

- Keep `_posts/`, `_data/`, `_layouts/`, and `_includes/`.
- Introduce `package.json`.
- Add Tailwind CLI.
- Create a source CSS file such as `assets/css/input.css`.
- Compile to `assets/css/main.css` or `assets/css/site.css`.
- Replace Materialize classes gradually with semantic layouts and Tailwind utilities.
- Replace jQuery scripts with vanilla JavaScript modules.

Pros:

- Lowest migration risk.
- Blog posts and Liquid templates stay usable.
- Works well for a static GitHub Pages site.
- Clear upgrade path from the current repo.

Cons:

- Still uses Ruby and Node together.
- Liquid templates can become noisy if Tailwind utilities are overused.
- Some old layout files must be carefully cleaned.

### Option B: Keep Jekyll, Use Custom CSS Without Tailwind

What changes:

- Remove Materialize.
- Rewrite CSS into a modern token-based stylesheet.
- Use CSS Grid, Flexbox, container queries where appropriate, and custom properties.
- Keep JavaScript minimal.

Pros:

- No Node requirement.
- Very lightweight.
- Easier to understand for a small site.

Cons:

- Slower to build a full design system.
- More manual CSS maintenance.
- Less standard than a Tailwind-based workflow for future utility work.

### Option C: Migrate to Astro

What changes:

- Move from Jekyll/Liquid to Astro components and content collections.
- Convert posts and data into Astro-compatible content.
- Use Tailwind or scoped CSS.
- Deploy through GitHub Actions.

Pros:

- Modern static-site developer experience.
- Great component model.
- Easy asset optimization and future interactive islands.

Cons:

- Bigger migration.
- Existing Liquid templates must be rewritten.
- More moving pieces than needed for a portfolio/blog refresh.

### Option D: Migrate to Next.js

What changes:

- Rebuild the site as a React app.
- Convert posts and data to MDX or content collections.
- Deploy statically through GitHub Actions or another host.

Pros:

- Strong React ecosystem.
- Good if the portfolio becomes app-like or dashboard-like.

Cons:

- Overkill for this site right now.
- More dependency surface.
- Requires a full rewrite of templates and routing.

## Dependency Upgrade Plan

Ruby and Bundler:

- Add a `.ruby-version` file so local and CI Ruby versions are explicit.
- Target current stable Ruby after verifying gem compatibility.
- Keep Bundler locked in `Gemfile.lock`.
- Consider adding `BUNDLED WITH` updates only through `bundle update --bundler`.

Gems:

- Keep `jekyll`, `jekyll-feed`, `jekyll-paginate`, `jekyll-sass-converter`, `jekyll-pdf-embed`, `webrick`, `kramdown`, and `rouge` only if still needed.
- Remove direct gem entries that are only transitive dependencies unless the project truly uses them directly.
- Remove old `sass` if Tailwind replaces Sass or if Jekyll no longer needs it directly.
- Review `minima`: the site overrides most layouts and styling, so the theme may not be needed long-term.
- Keep `webrick` if local serving requires it with modern Ruby.

Build tooling:

- Add `package.json` for CSS tooling.
- Add scripts:
  - `dev`: run Jekyll and Tailwind in watch mode.
  - `build`: build Tailwind CSS and run `jekyll build`.
  - `css:build`: compile Tailwind once.
  - `css:watch`: compile Tailwind in watch mode.
- Add `.node-version` or document a Node LTS version if Node tooling is introduced.

Deployment:

- Prefer GitHub Actions Pages deployment over relying only on branch-based GitHub Pages Jekyll builds.
- Build the site with the repo's chosen Ruby, Bundler, and Node versions.
- Upload `_site` as the Pages artifact.

## CSS and UI Framework Plan

Recommended: Tailwind CSS.

Why Tailwind fits here:

- The site is mostly static templates.
- Tailwind generates static CSS and has no runtime.
- Responsive and dark-mode design can be handled consistently.
- It lets us remove Materialize without adopting another heavy component framework.

How to use it responsibly:

- Define design tokens for colors, spacing, radius, type scale, shadow, and breakpoints.
- Keep repeated patterns in includes or component-like Liquid partials.
- Avoid dumping hundreds of utilities into one unreadable line when a small custom class is clearer.
- Use custom CSS for prose, animations, and special homepage effects.

Alternatives:

- Bootstrap: faster component replacement, but less distinct and still brings framework styling opinions.
- Pico.css: lightweight, but too plain for a custom portfolio redesign.
- Open Props/custom CSS: excellent for a handcrafted site, but slower to implement consistently.

## JavaScript Plan

Remove jQuery.

Replace with:

- `querySelector` and `querySelectorAll`.
- `addEventListener`.
- `classList`.
- `fetch` for Formspree submission.
- Native `<dialog>` or accessible custom modal logic for project details.
- CSS transitions and small JavaScript state toggles.

Existing behaviors to rewrite:

- Theme toggle.
- Mobile navigation.
- Project filters.
- Project modal open/close.
- Project image carousel or gallery.
- Contact form AJAX submission.
- Scroll-to-top button.
- Page transition hooks if a transition library remains.

Preferred JavaScript file structure:

```text
assets/js/
├── main.js
├── modules/
│   ├── theme.js
│   ├── navigation.js
│   ├── projects.js
│   ├── contact-form.js
│   └── transitions.js
```

If we avoid bundling JavaScript, use plain ES modules directly from the browser. If compatibility or optimization becomes a concern, add a small bundler later.

## Page Transition Plan

The current Barba.js integration creates complexity because page content changes without a full browser reload.

Options:

### Option A: Remove Global Page Transitions

Use normal navigation and make each page feel polished through layout, hover, focus, and local animations.

Pros:

- Simplest and most reliable.
- Better compatibility with analytics, Disqus, Google Translate, forms, and accessibility.
- Reduces reinitialization bugs.

Cons:

- Loses the current animated page-to-page feel.

### Option B: Use Swup

Swup is focused on page transitions for server-rendered sites.

Pros:

- Direct conceptual replacement for Barba.
- Good fit for static pages.
- Lets us keep tasteful transitions.

Cons:

- Still requires lifecycle hooks.
- Still needs careful handling of scripts, comments, analytics, and third-party widgets.

### Option C: Use Turbo Drive

Turbo Drive accelerates navigation by intercepting links and replacing body content.

Pros:

- Maintained and robust.
- Good navigation cache behavior.

Cons:

- Less focused on decorative transitions.
- Lifecycle handling is still needed.
- May be more app-oriented than this site needs.

Recommendation:

- Start with Option A for the first redesign pass.
- Add Swup only if page transitions are still part of the desired brand after the new UI exists.

## Icon Strategy

Current problem:

- The site mixes Material Icons, Font Awesome, Devicon, local SVGs, and image logos.
- Icon stroke, fill, sizing, and alignment vary.

Recommended strategy:

- Use Lucide for UI icons: navigation, theme toggle, buttons, contact actions, external links, filters, arrows, close buttons.
- Use Devicon only for technology logos in skills and project tech lists.
- Use local brand/logo images only for the personal logo and portrait assets.
- Remove Material Icons and Font Awesome after replacements are complete.

Icon sizing rules:

- UI icons: consistent `20px` or `24px`.
- Button icons: `18px` or `20px`, aligned with text.
- Technology icons: use a fixed square box, for example `32px` desktop and `28px` mobile.
- Decorative logos should not be used as functional icons unless they have accessible labels.

Accessibility rules:

- Decorative icons should be hidden from assistive tech.
- Action icons need visible text, `aria-label`, or both.
- External links should use consistent external-link indicators.

## Visual Design Direction

Target feeling:

- Personal, polished, sharp, developer-focused, and trustworthy.
- More portfolio/product than old-school animated template.
- Technical but warm.
- Useful on mobile first, not just responsive after desktop.

Recommended design language:

- Clean dark and light themes.
- Strong typography and spacing.
- High-contrast text.
- Subtle motion.
- Real project screenshots.
- Consistent cards with restrained radius.
- Clear section hierarchy.
- Fewer decorative effects, more readable content.

Color direction:

- Avoid a one-note dark blue/slate or purple palette.
- Use a neutral base with one primary accent and one supporting accent.
- Keep brand contrast strong in both light and dark modes.

Possible palette:

- Background dark: near-black neutral.
- Background light: warm white or neutral white.
- Text: high-contrast neutral.
- Primary accent: cyan/teal or blue-green.
- Secondary accent: amber or rose used sparingly.
- Borders: low-opacity neutral.

Typography:

- Replace the current mixed font stack with one strong sans-serif and one optional display/accent face.
- Recommended sans-serif options:
  - Inter
  - Manrope
  - Geist
  - Source Sans 3
- Use a readable code font for code blocks:
  - JetBrains Mono
  - Fira Code
  - IBM Plex Mono

Layout principles:

- Use a max-width content shell for text pages.
- Use grid layouts for projects and skills.
- Keep home page visually interesting but make the navigation obvious.
- Avoid full-screen traps on mobile.
- Show enough content above the fold to make the site purpose clear immediately.

## UX Plan by Page

### Home

Current:

- Four animated tiles linking to major sections.

Version 3 ideas:

- Make the first viewport identify Bhupendra Negi clearly.
- Add concise role text: Ruby on Rails, React, backend/frontend, product-minded engineering.
- Keep four primary destinations, but make them easier to scan on mobile.
- Add calls to action: View Projects, Read Blog, Contact.
- Consider a split between intro and quick navigation rather than only large tiles.

Recommendation:

- Use a hero plus compact navigation sections.
- Keep a nod to the current visual tile concept through background images or hover states.

### About

Current:

- Personal story, profile image, years of experience, skills list.

Version 3 ideas:

- Tighten copy while keeping personality.
- Add a timeline or "what I work on" section.
- Group skills with cleaner visual hierarchy.
- Make profile image responsive and optimized.

Recommendation:

- Structure as intro, experience summary, strengths, skills, and calls to action.

### Projects

Current:

- Large project rows with background images, filters, modals, and carousels.

Version 3 ideas:

- Use responsive project cards.
- Add featured projects.
- Replace modal-heavy browsing with project detail sections or better cards.
- Keep filters but make them accessible toggle buttons.
- Show tech stack, description, source link, live link, and screenshots clearly.

Recommendation:

- Use card grid on desktop and single-column cards on mobile.
- Use simple image gallery inside cards or details pages rather than complex modals unless needed.

### Blog

Current:

- Paginated list with post excerpt.

Version 3 ideas:

- Improve typography, spacing, tags, and reading time.
- Add category/tag support if useful.
- Improve post pages with better code blocks, table styles, and next/previous links.
- Keep Disqus only if comments are still valuable.

Recommendation:

- Make blog pages reading-first.
- Use Rouge-generated code styling and remove runtime Highlight.js.

### Contact

Current:

- Formspree form with Materialize fields and modal success message.

Version 3 ideas:

- Simpler accessible form fields.
- Clear validation messages.
- Better mobile tap targets.
- Add direct email and social links.
- Use a non-blocking success state instead of a heavy modal.

Recommendation:

- Rewrite with vanilla JavaScript and accessible form states.

### Resume

Current:

- Button linking to PDF and lots of spacing.

Version 3 ideas:

- Add a short resume summary on the page.
- Keep PDF download/open action.
- Add recent experience, technical focus, and contact links.

Recommendation:

- Make the page useful even before opening the PDF.

## Mobile Plan

Mobile-first requirements:

- Navigation must be thumb-friendly and keyboard-accessible.
- No text should overflow its container.
- Project cards should stack naturally.
- Filters should wrap cleanly.
- Buttons should have minimum comfortable tap size.
- Home page should not require awkward full-screen tile navigation.
- Images should be responsive and not cause layout shift.
- Modals, if kept, must fit small screens and trap focus correctly.
- Blog posts should have readable line length and code block overflow handling.

Testing viewports:

- 360px wide small mobile.
- 390px wide iPhone-style mobile.
- 768px tablet.
- 1024px small laptop.
- 1440px desktop.

## Accessibility Plan

Required improvements:

- Use semantic landmarks: `header`, `nav`, `main`, `footer`, `article`, `section`.
- Add skip link.
- Ensure visible focus states.
- Use accessible color contrast in both themes.
- Make mobile nav keyboard-accessible.
- Make project filters real buttons with `aria-pressed`.
- Avoid icon-only controls unless they have accessible labels.
- Use form labels that remain visible and clear.
- Respect `prefers-reduced-motion`.
- Ensure page transitions do not trap focus or confuse screen readers.
- Add descriptive alt text for meaningful images.

## Performance Plan

Quick wins:

- Remove jQuery, Materialize, Font Awesome, Material Icons, Highlight.js, and Barba if replaced.
- Reduce external CDN dependencies.
- Optimize local images.
- Use responsive image sizes where practical.
- Avoid loading project screenshots at full size when thumbnails are enough.
- Keep CSS output purged by Tailwind.
- Defer non-critical JavaScript.

Third-party scripts to review:

- Google Analytics.
- Google Translate.
- Disqus.
- Formspree.
- External icon and font CDNs.

Recommendation:

- Keep analytics and Formspree.
- Reconsider Google Translate and Disqus because they add script weight and lifecycle complexity.
- Self-host fonts and icons where practical.

## SEO and Metadata Plan

Improve:

- Page titles and descriptions.
- Open Graph images per page or at least a strong default.
- Canonical URLs.
- `sitemap.xml` if not already generated by plugins.
- RSS feed.
- Structured data for person/profile if useful.
- Blog post metadata.

Keep:

- Clean permalinks.
- Existing public URLs where possible.

## Content Plan

Recommended content updates:

- Rewrite homepage copy for immediate clarity.
- Update About copy to sound confident and current.
- Refresh project descriptions and remove unavailable/dead live URLs where needed.
- Add newer projects if available.
- Update resume PDF.
- Review blog list and add tags/categories if useful.
- Fix small copy issues and typos.

Project data improvements:

- Add `featured`.
- Add `status`.
- Add `role`.
- Add `year`.
- Add `summary`.
- Add `problem`.
- Add `outcome`.
- Add `links`.
- Add local image paths where possible instead of hotlinking GitHub raw images.

Possible future `_data/projects.yml` shape:

```yml
- id: data-management
  title: Data Management
  featured: true
  year: 2024
  role: Full-stack developer
  summary: Rails application for managing personnel records.
  tags: [ruby, rails, postgresql]
  links:
    source: https://github.com/BhupendraNegi/databasebank
    live:
  images:
    thumbnail: /assets/images/projects/data-management/home.webp
    gallery:
      - /assets/images/projects/data-management/home.webp
```

## Suggested Folder Structure

Possible Version 3 structure:

```text
.
├── .github/workflows/pages.yml
├── .ruby-version
├── .node-version
├── doc/
│   ├── design.md
│   └── todo.md
├── _data/
├── _includes/
│   ├── components/
│   └── sections/
├── _layouts/
├── _posts/
├── assets/
│   ├── css/
│   │   ├── input.css
│   │   └── site.css
│   ├── images/
│   │   └── projects/
│   └── js/
│       ├── main.js
│       └── modules/
├── package.json
├── Gemfile
└── README.md
```

## Implementation Phases

### Phase 1: Foundation

- Add `.ruby-version`.
- Update gems and Bundler carefully.
- Add GitHub Actions deployment workflow if needed.
- Add Tailwind build tooling.
- Add initial design tokens.
- Keep current UI working.

### Phase 2: Layout and CSS Migration

- Build new base layout.
- Replace Materialize layout classes.
- Create responsive navigation.
- Create shared button, link, card, badge, and prose styles.
- Remove unused CSS as sections are migrated.

### Phase 3: JavaScript Migration

- Rewrite theme toggle in vanilla JavaScript.
- Rewrite mobile navigation.
- Rewrite project filters.
- Rewrite contact form behavior.
- Replace or remove project modals and carousels.
- Remove jQuery.

### Phase 4: Page Redesigns

- Redesign Home.
- Redesign About.
- Redesign Projects.
- Redesign Blog index.
- Redesign Post layout.
- Redesign Contact.
- Redesign Resume.

### Phase 5: Cleanup and Optimization

- Remove Materialize.
- Remove Barba.js.
- Remove Font Awesome and Material Icons after Lucide migration.
- Remove Highlight.js if Rouge handles code styling.
- Optimize images.
- Audit accessibility.
- Audit mobile layouts.
- Audit performance.

### Phase 6: Launch

- Confirm all public routes still work.
- Build production site.
- Verify GitHub Pages deployment.
- Review on mobile and desktop.
- Merge `version-3` when ready.

## Risks

- Updating Ruby and gems may expose compatibility issues in plugins.
- Removing Materialize means all form, nav, modal, grid, and button styles must be replaced.
- Replacing Barba changes the feel of the site and may simplify behavior significantly.
- Tailwind introduces Node tooling and a CSS build step.
- GitHub Pages branch builds may not support every custom plugin or build step, so GitHub Actions should be used.
- Hotlinked project images from other GitHub repos can break or load slowly.
- Third-party scripts can affect performance and page-transition behavior.

## Decisions

- Keep Jekyll for Version 3.
- Keep page transitions as part of the brand, but make them faster, lighter, and less fragile.
- Keep Disqus only if comments continue to be valuable during the redesign review.
- Keep Google Translate, but improve its placement, styling, and behavior.
- Keep both light and dark themes, with better color contrast and cleaner theme logic.
- Treat all existing projects as featured, but redesign how they are presented so the page does not feel overloaded.
- There is no updated resume content or new project screenshots available yet, so the redesign should work with current assets and leave clear replacement points.
- Do not self-host fonts or icon packages for now.
- Remove project modals in favor of cards, sections, or detail pages.

## Approved Direction

Version 3 will move forward with this direction:

- Keep Jekyll.
- Add Tailwind.
- Keep branded page transitions, likely through a faster maintained approach or small custom transition layer.
- Remove Materialize, jQuery, Font Awesome, Material Icons, and Highlight.js over phases.
- Replace Barba.js with a lighter transition approach while preserving the brand feel.
- Use Lucide for UI icons and Devicon for technology logos.
- Keep Google Translate and improve its UX.
- Keep light and dark themes and improve both.
- Remove project modals and redesign project browsing.
- Keep deployment compatible with GitHub Pages.
- Create `doc/todo.md` from the phases above and start implementation one item at a time.

## Current visual direction → see doc/redesign-plan.md

The active design direction is the light-first **"Aurora" theme** (ref
https://wassim.dev/ + motion like https://koysor.me/), documented in
`doc/redesign-plan.md`. Earlier explorations (a hero/image-card grid, then a
full-screen + dark + curtain direction referencing pmportfolio.ca) were rejected;
their details are omitted here to avoid confusion. The sections above remain
accurate as the general Jekyll/Tailwind modernization plan.
