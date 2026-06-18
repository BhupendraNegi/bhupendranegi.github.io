---
layout: post
title: Deploying Rails With Kamal 2.0
cover: /assets/images/blog/kamal-deploy.jpg
tech: docker-plain
tags: [DevOps, Rails]
---

-------
Platforms like Heroku are convenient, but they get expensive fast — and you give up control. Kamal, the deploy tool that now ships with Rails, lets you deploy a containerised app to any server you can SSH into, with zero-downtime releases and automatic SSL. Version 2.0 made it dramatically simpler. Let's ship a Rails app to a plain VPS.

<figure class="post-figure">
  <div class="post-figure-flow">
    <div class="post-figure-step">
      <i data-lucide="code" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Your app</span>
      <span class="post-figure-step-sub">Rails + Dockerfile</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="package" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Image</span>
      <span class="post-figure-step-sub">kamal build</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="upload-cloud" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Registry</span>
      <span class="post-figure-step-sub">Push the image</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="server" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Servers</span>
      <span class="post-figure-step-sub">Zero-downtime swap</span>
    </div>
  </div>
  <figcaption class="post-figure-caption">Kamal builds a Docker image, pushes it to a registry, and rolls it out across your servers.</figcaption>
</figure>

##### What is Kamal?

Kamal deploys web apps as Docker containers to your own servers. It SSHes in, pulls your image, boots the new container, health-checks it, and only then routes traffic to it — so users never see a blip. You own the infrastructure, but you get a Heroku-like `git push` workflow.

##### What's new in 2.0

- `kamal-proxy:` A purpose-built reverse proxy replaces Traefik. It handles zero-downtime cutovers and **automatic HTTPS** via Let's Encrypt out of the box.
- `Easier multi-app hosting:` Run several apps on one server without fighting over ports.
- `First-class secrets:` A dedicated `.kamal/secrets` file with helpers to pull values from your environment or a password manager.

##### Install and initialise

Kamal ships with Rails 8. On older apps, add it and generate the config:

```bash
gem install kamal
kamal init
```

This creates `config/deploy.yml`, a `.kamal/secrets` file, and a `Dockerfile` (Rails 7.1+ already includes a production-ready one).

##### Configure the deploy

`config/deploy.yml` is the heart of it — name the service, the image, your servers, and the registry:

```yaml
service: myapp
image: yourname/myapp

servers:
  web:
    - 192.168.0.1

proxy:
  ssl: true
  host: myapp.com

registry:
  username: yourname
  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  secret:
    - RAILS_MASTER_KEY
  clear:
    RAILS_ENV: production
```

Setting `proxy.ssl: true` with a `host` is all it takes for kamal-proxy to provision and renew a Let's Encrypt certificate.

##### Manage secrets

In 2.0, secrets live in `.kamal/secrets` (never commit the resolved values). You can read them straight from the environment or a tool like 1Password:

```bash
# .kamal/secrets
KAMAL_REGISTRY_PASSWORD=$KAMAL_REGISTRY_PASSWORD
RAILS_MASTER_KEY=$(cat config/master.key)
```

##### Your first deploy

Provision the servers (installs Docker, boots the proxy) once, then deploy:

```bash
kamal setup
```

After that, every release is a single command:

```bash
kamal deploy
```

Kamal builds the image, pushes it, pulls it on each server, runs your `bin/docker-entrypoint` (migrations included), health-checks the new container, and swaps traffic over with no downtime.

##### Day-to-day commands

```bash
kamal app logs -f        # tail logs
kamal console            # rails console on the server
kamal rollback           # revert to the previous release
kamal app exec "bin/rails db:migrate"
```

##### Wrapping up

Kamal 2.0 hits a sweet spot: the simplicity of a PaaS with the cost and control of your own hardware. Once `config/deploy.yml` is set up, shipping is just `kamal deploy` — and automatic SSL plus zero-downtime cutovers mean you spend time building features, not babysitting servers.
