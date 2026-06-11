# BhupendraNegi.github.io

Personal portfolio and blog for [Bhupendra Negi](https://bhupendranegi.github.io/), a software engineer specializing in Ruby on Rails and React.

The site is built with Jekyll and published through GitHub Pages at:

[https://bhupendranegi.github.io/](https://bhupendranegi.github.io/)

## Overview

This repository contains a static portfolio site with:

- A four-section animated home page for About, Projects, Blog, and Contact.
- Portfolio project cards powered by `_data/projects.yml`.
- A skills section powered by `_data/skills.yml`.
- Markdown blog posts in `_posts/`.
- A resume page linking to `assets/images/bhupendra_resume.pdf`.
- A contact form that submits through Formspree.
- Light/dark theme support, lightweight Version 3 page transitions, Disqus comments, Google Translate, and Google Analytics.

## Tech Stack

- Jekyll 4.4.1
- Ruby and Bundler
- Liquid templates
- Markdown with Kramdown
- Rouge and Highlight.js for code highlighting
- Tailwind CSS CLI for Version 3 styles
- Materialize CSS 0.100.2 as temporary legacy CSS during migration
- Vanilla JavaScript in `assets/js/version-3.js`
- Devicon and Font Awesome icons

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
│   ├── css/             # Main site stylesheet
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
- Tailwind source styles live in `assets/css/tailwind.css` and compile to `assets/css/version-3.css`.
- Do not edit `_site/` directly; it is generated output.
- Keep generated caches such as `.jekyll-cache/`, `.sass-cache/`, and `.jekyll-metadata` out of commits.
- JavaScript behavior lives in `assets/js/version-3.js`.
- Page transitions use a small vanilla JavaScript layer instead of Barba.js.
- External services include Formspree, Disqus, Google Analytics, Google Translate, CDN-hosted Materialize CSS, Highlight.js, Font Awesome, and Devicon.

## Verification

Before publishing changes, run:

```sh
npm run build
```

For UI changes, also check the site locally with `bundle exec jekyll serve` and verify the home page, navigation, project filters/modals, blog pages, theme toggle, contact form, and resume link.
