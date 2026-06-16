# BhupendraNegi.github.io

Personal portfolio and blog for [Bhupendra Negi](https://bhupendranegi.github.io/), a software engineer specializing in Ruby on Rails and React.

The site is built with Jekyll and published through GitHub Pages at:

[https://bhupendranegi.github.io/](https://bhupendranegi.github.io/)

## Overview

This repository contains a static portfolio site with:

- An "Aurora" themed home page — a hero (name, role, social) plus featured projects and recent writing.
- Portfolio project cards powered by `_data/projects.yml`, with filters and modals.
- A skills section powered by `_data/skills.yml`.
- Markdown blog posts in `_posts/`, each with a sticky table of contents, copy-able code blocks, and an inline diagram.
- A resume page with an inline PDF preview (`assets/images/bhupendra_resume.pdf`).
- A contact form that submits through Formspree.
- Light/dark theme support, GSAP-driven motion, Disqus comments, Google Translate, and Google Analytics.

## Tech Stack

- Jekyll 4.4.1
- Ruby and Bundler
- Liquid templates
- Markdown with Kramdown
- Rouge for build-time code highlighting (theme in `assets/css/syntax.css`)
- Tailwind CSS CLI for Version 3 styles (`assets/css/tailwind.css` → `assets/css/version-3.css`)
- GSAP (ScrollTrigger, SplitText, CustomEase) for motion in `assets/js/motion.js`
- Vanilla JavaScript in `assets/js/version-3.js`
- Inter, JetBrains Mono, and Newsreader web fonts
- Lucide UI icons and Devicon technology logos (brand logos are inline SVGs in `_includes/social-icon.html`)

## Repository Structure

```text
.
├── _config.yml          # Site settings, social links, plugins, pagination
├── _data/               # Navigation sections, projects, and skills data
├── _includes/           # Reusable Liquid partials
├── _layouts/            # Page and post layout templates
├── _posts/              # Blog posts
├── _sass/               # Sass sources
├── assets/
│   ├── css/             # Tailwind source + compiled version-3.css + syntax.css
│   ├── images/          # Images, logos, icons, and resume PDF
│   └── js/              # Custom JavaScript
├── blog/index.html      # Paginated blog listing
├── about.html           # About and skills page
├── projects.html        # Project listing and filters
├── contact.html         # Contact form
├── resume.html          # Resume page
└── index.html           # Home page entry point
```

## Getting Started

Recommended runtimes:

- Ruby `4.0.3`
- Bundler `4.0.14`
- Node.js `22.22.3`

These are pinned in `.ruby-version` and `.node-version`.

Install dependencies:

```sh
./bin/setup
```

Run the site locally:

```sh
./bin/dev
```

`bin/dev` runs Jekyll directly by default. To run the Procfile through a process manager, use `PROC_MANAGER=foreman ./bin/dev` or `PROC_MANAGER=overmind ./bin/dev`.

Optional local ports can be changed with environment variables:

```sh
PORT=4010 ./bin/dev
```

LiveReload is opt-in:

```sh
LIVERELOAD=1 LIVERELOAD_PORT=35740 ./bin/dev
```

Then open:

```text
http://127.0.0.1:4000/
```

Build the static site:

```sh
npm run build
```

The generated site is written to `_site/`.

Lint all source files (JS, CSS, Markdown, YAML/JSON, and the built HTML):

```sh
./bin/lint          # check everything
./bin/lint --fix    # auto-fix what each tool can
./bin/lint --quick  # skip the build + html-proofer
```

## Common Updates

Update site metadata, social links, analytics, Disqus, pagination, and permalink settings in `_config.yml`.

Add or edit projects in `_data/projects.yml`. Project tags should match the filter buttons in `projects.html`, and project `id` values should remain numeric because the project modal "Next" button increments them.

Add or edit skills in `_data/skills.yml`. Skill icon classes use Devicon class names.

Add blog posts in `_posts/` with Jekyll front matter. A typical filename looks like:

```text
YYYY-MM-DD-post-title.md
```

Update homepage sections and navigation labels in `_data/sections.yml`.

Replace resume content by updating `assets/images/bhupendra_resume.pdf`.

## Development Notes

- Use `bundle exec` when running Jekyll so the locked dependencies are used.
- Tailwind source styles live in `assets/css/tailwind.css`; run `npm run css:build` to regenerate the committed `assets/css/version-3.css`. Do not hand-edit the compiled file.
- Do not edit `_site/` directly; it is generated output.
- Keep generated caches such as `.jekyll-cache/`, `.sass-cache/`, and `.jekyll-metadata` out of commits.
- JavaScript behavior lives in `assets/js/version-3.js`; GSAP motion lives in `assets/js/motion.js`.
- Page transitions use a small vanilla JavaScript layer instead of Barba.js; jQuery has been removed.
- External services / libraries: Formspree, Disqus, Google Analytics, Google Translate, GSAP, Lucide, and Devicon (all CDN-hosted).

## Verification

Before publishing changes, run:

```sh
./bin/lint
npm run build
```

For UI changes, also check the site locally with `bundle exec jekyll serve` and verify the home page, navigation, project filters/modals, blog pages, theme toggle, contact form, and resume link.
