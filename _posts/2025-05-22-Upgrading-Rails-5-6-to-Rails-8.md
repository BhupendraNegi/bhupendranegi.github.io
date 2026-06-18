---
layout: post
title: Upgrading Rails 5 & 6 to Rails 8
cover: /assets/images/blog/rails-upgrade.jpg
tags: [Rails]
---

-------
Staying on an old Rails version feels safe, but it quietly piles up risk: missing security patches, a shrinking pool of developers who want to work on it, and features you simply can't use. The good news is that upgrading is a well-trodden path — as long as you do it **one major version at a time** and lean on the tooling Rails gives you. Here's a practical route from Rails 5/6 all the way to Rails 8.

<figure class="post-figure">
  <div class="post-figure-flow">
    <div class="post-figure-step">
      <i data-lucide="package" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Rails 5.2</span>
      <span class="post-figure-step-sub">Your baseline</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="package" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Rails 6.1</span>
      <span class="post-figure-step-sub">Zeitwerk, multi-DB</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="package" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Rails 7.x</span>
      <span class="post-figure-step-sub">Hotwire, importmaps</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="rocket" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Rails 8.0</span>
      <span class="post-figure-step-sub">Solid trifecta</span>
    </div>
  </div>
  <figcaption class="post-figure-caption">Upgrade through each major version in sequence — never jump straight from 5 to 8.</figcaption>
</figure>

##### Why bother upgrading?

- `Security:` Only the latest few releases get patches. An unpatched app is a liability.
- `Hiring:` Strong developers want to work on a modern stack, not babysit a 2018 codebase.
- `Cost & speed:` Newer Rails and Ruby are faster and cheaper to run, and unlock features like Hotwire and the Solid trifecta.

##### The golden rule: one version at a time

The single biggest mistake is jumping from 5 straight to 8. Each major version has its own deprecations and removals; skipping them turns a series of small, debuggable changes into one giant, cascading mess. Walk the path: `5.2 → 6.0 → 6.1 → 7.0 → 7.1 → 7.2 → 8.0`.

##### Step 1: Lock in a test baseline

You can't upgrade safely without a green test suite. Run it first and note what passes — that's your safety net for every step that follows.

```bash
bundle exec rspec   # or: bin/rails test
```

If coverage is thin, invest here before touching anything. Tests are what tell you an upgrade broke something.

##### Step 2: Upgrade Ruby first

Each Rails version requires a minimum Ruby. Bump Ruby on its own, get the suite green, and deploy that — so you're only changing one thing at a time.

```ruby
# .ruby-version
3.3.6
```

##### Step 3: Bump one Rails version

Point the Gemfile at the next version and update just Rails and its dependencies:

```ruby
# Gemfile
gem "rails", "~> 6.1.0"
```

```bash
bundle update rails
```

Then run the interactive updater, which walks you through framework default and config changes:

```bash
bin/rails app:update
```

Review every diff it proposes — especially files in `config/initializers` and `config/environments`.

##### Step 4: Adopt new defaults gradually

Rails gates new behaviour behind `config.load_defaults`. After upgrading, keep the *old* defaults until the app is stable, then raise them deliberately:

```ruby
# config/application.rb
config.load_defaults 6.1
```

The generated `config/initializers/new_framework_defaults_*.rb` file lets you flip individual settings on one at a time instead of all at once.

##### Step 5: Audit your gems

A blocked dependency can derail the whole project. Before each jump, check that your gems support the target version:

```bash
bundle outdated
```

Read the changelogs for anything major. Replace abandoned gems early — discovering a dead gem halfway through is the classic mid-upgrade trap.

##### Step 6: Fix deprecations and validate

Run the suite again, fix what broke, and watch the logs for deprecation warnings — those are next version's removals. Repeat steps 3–6 for each version until you reach 8.0, deploying after each successful jump.

##### Five traps to avoid

1. `Jumping multiple majors at once` — the fastest way to a mess.
2. `Upgrading with weak tests` — you'll ship regressions blind.
3. `Skipping the dependency audit` — a dead gem can block you for days.
4. `Flipping all new defaults immediately` — raise `load_defaults` only once stable.
5. `Treating it as pure tech debt` — frame it as the business investment it is, and protect dedicated time for it.

##### Wrapping up

A Rails upgrade isn't a heroic rewrite — it's a disciplined loop: bump one version, run `app:update`, audit gems, fix deprecations, get green, deploy, repeat. Do that, and you'll land on Rails 8 with its Solid Queue, Solid Cache, and Kamal goodies, on a codebase that's secure, fast, and a pleasure to hire for.
