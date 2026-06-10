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
- Light/dark theme support, Barba.js transitions, Disqus comments, Google Translate, and Google Analytics.

## Tech Stack

- Jekyll 4.4.1
- Ruby and Bundler
- Liquid templates
- Markdown with Kramdown
- Rouge and Highlight.js for code highlighting
- Materialize CSS 0.100.2
- jQuery
- Barba.js
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
bundle exec jekyll build
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
- Do not edit `_site/` directly; it is generated output.
- Keep generated caches such as `.jekyll-cache/`, `.sass-cache/`, and `.jekyll-metadata` out of commits.
- JavaScript behavior is split across `assets/js/functions.js`, `initialize.js`, `script.js`, and `transitions.js`.
- Barba.js page transitions require initialization code to run again after transitions.
- External services include Formspree, Disqus, Google Analytics, Google Translate, CDN-hosted Materialize, Highlight.js, Font Awesome, and Devicon.

## Verification

Before publishing changes, run:

```sh
bundle exec jekyll build
```

For UI changes, also check the site locally with `bundle exec jekyll serve` and verify the home page, navigation, project filters/modals, blog pages, theme toggle, contact form, and resume link.
