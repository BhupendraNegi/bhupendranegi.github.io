# Blog & Project Images — Plan

Planning doc for sourcing and adding images to the blog posts and project cards.
Created before any download so the picks can be reviewed first.

## Goals

- Give every **blog post** a relevant `cover:` image (shown on the blog index
  `.post-row-media`; currently posts fall back to a devicon/Lucide glyph).
- **Localize** the **project** images that are currently hot-linked from GitHub
  raw URLs into the repo, so the portfolio doesn't depend on external hosts.

## Sources & licensing

- **Blog covers → [Unsplash](https://unsplash.com/license).** Free for
  commercial + non-commercial use, no attribution required. Reachable from here
  (verified `200`). Direct URL form: `https://images.unsplash.com/photo-<id>?w=1600&q=80&fit=crop`.
- **Project images → the user's own GitHub repos** (already linked in
  `_data/projects.yml`). No third-party licensing concern — they're your
  screenshots; we're just copying them into this repo.

## Conventions

- Blog covers: downloaded to `assets/images/blog/`, ~1600px wide, JPEG, quality ~80.
- Project images: downloaded to `assets/images/projects/<project-slug>/`, kept as-is (PNG/GIF).
- Filenames: kebab-case, derived from the post slug / project title.
- Wiring:
  - Posts → add `cover: /assets/images/blog/<file>.jpg` to front matter.
  - Projects → repoint `cover:` and `images:` in `_data/projects.yml` to local paths.
- All paths root-relative (`/assets/images/...`) per the repo convention.

---

## Blog post covers (13)

| # | Post | Theme / subject | Search query | Target file |
|---|------|-----------------|--------------|-------------|
| 1 | Getting Started With Jekyll | Static site / terminal + code building a site | "code editor terminal dark" | `blog/getting-started-with-jekyll.jpg` |
| 2 | React Context vs Redux vs Zustand | State management / connected nodes, UI on screen | "react javascript ui screen code" | `blog/react-state-management.jpg` |
| 3 | CSV Import With Kiba | Tabular data / spreadsheets, rows of data | "spreadsheet data table numbers" | `blog/csv-import-kiba.jpg` |
| 4 | Efficient Data Fetching with React Query | Data fetching / network, flowing data | "network data flow abstract" | `blog/react-query-data-fetching.jpg` |
| 5 | XML Import With XSLT | Markup / structured documents, transformation | "xml code markup document" | `blog/xml-import-xslt.jpg` |
| 6 | Effortless Ruby ETL | Pipeline / pipes, moving + transforming data | "pipeline pipes industrial abstract" | `blog/ruby-etl.jpg` |
| 7 | Fancy Emails With MJML | Email / inbox, newsletter design | "email envelope mail desk" | `blog/mjml-emails.jpg` |
| 8 | Solid Queue With Rails | Background jobs / queue, conveyor, tickets | "conveyor belt queue line" | `blog/solid-queue-rails.jpg` |
| 9 | Reactive Rails With Hotwire | Realtime / speed, lightning, motion | "lightning speed motion blue" | `blog/hotwire-reactive-rails.jpg` |
| 10 | Deploying Rails With Kamal 2.0 | Containers / shipping containers, docks | "shipping containers cargo port" | `blog/kamal-deploy.jpg` |
| 11 | Managing Secrets With SOPS | Security / lock, keys, encryption | "padlock security encryption" | `blog/sops-secrets.jpg` |
| 12 | Upgrading Rails 5 & 6 to Rails 8 | Upgrade / stairs, levelling up, growth | "upgrade stairs growth arrows" | `blog/rails-upgrade.jpg` |
| 13 | Ruby on Rails vs Node.js vs Go | Comparison / three paths, race, fork in road | "three paths race comparison" | `blog/rails-node-go.jpg` |

> Each cover is chosen to be **tasteful + abstract** rather than literal stock
> cheese, so it complements the clean Aurora theme. Any pick is one-line
> swappable (just change the `cover:` path / re-download a different photo).

## Project images (new themed Unsplash images)

Decision: only the **card cover** on the projects page uses a fresh, themed
Unsplash image. The **gallery carousel** (modal) keeps the original GitHub
screenshots — those are not changed. The extra `gallery-*.jpg` files that were
downloaded are kept on disk but intentionally left **unused**.

| Project | Cover theme | Card cover (used) | Gallery (modal) |
|---------|-------------|-------------------|-----------------|
| Data Management | server room / data center | `data-management/cover.jpg` | original GitHub screenshots |
| Tic Tac Toe | arcade / game | `tic-tac-toe/cover.jpg` | original GitHub screenshots |
| Health Tracker | health / fitness tracking | `health-tracker/cover.jpg` | original GitHub screenshots |
| Tenor Play | music / headphones | `tenor-play/cover.jpg` | original GitHub screenshots |

> `gallery-1.jpg` / `gallery-2.jpg` per project remain in the repo (downloaded,
> not deleted) but are not referenced — available if you want to use them later.

## Execution order

1. Download the 13 blog covers from Unsplash → `assets/images/blog/`.
2. Add `cover:` front matter to each post.
3. Download new themed project images → `assets/images/projects/<slug>/` + repoint `_data/projects.yml`.
4. `npm run build` + `./bin/lint` (html-proofer checks every `<img>` resolves).
5. Eyeball the blog index + project cards in light/dark, then commit.

## Status

**Done.** 13 blog covers + 12 project images (4 × cover/gallery-1/gallery-2)
downloaded, all valid JPEG, wired into the 13 posts and `_data/projects.yml`.
Build + full lint (incl. html-proofer image check) pass. All images are from
Unsplash under the [Unsplash License](https://unsplash.com/license) (free, no
attribution required). Swapping any single image = re-download one file +/or
change one `cover:` path.
