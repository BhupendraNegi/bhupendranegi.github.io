---
layout: post
title: Managing Secrets With SOPS
cover: /assets/images/blog/sops-secrets.jpg
subtitle: A framework-agnostic way to encrypt secrets — shown here with a Rails app
icon: lock-keyhole
---

-------
Secrets management is a problem in every stack, not just Rails. [SOPS](https://github.com/getsops/sops) (Secrets OPerationS) is a framework-agnostic tool that encrypts just the **values** in a YAML/JSON/ENV file, supports multiple keys and cloud KMS, and produces diffs you can actually review — so you can safely commit your secrets to git. It works with anything, but since I reach for it most often on Rails, that's the example we'll use here. Rails' own encrypted credentials are a fine starting point, but they have limits: one shared key, an all-or-nothing file, and noisy diffs — exactly what SOPS fixes.

<figure class="post-figure">
  <div class="post-figure-flow">
    <div class="post-figure-step">
      <i data-lucide="key" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Secrets</span>
      <span class="post-figure-step-sub">Plaintext values</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="lock" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">SOPS</span>
      <span class="post-figure-step-sub">Encrypt with an age key</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="git-branch" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Git</span>
      <span class="post-figure-step-sub">Safe to commit</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="server" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Rails</span>
      <span class="post-figure-step-sub">Decrypted into ENV</span>
    </div>
  </div>
  <figcaption class="post-figure-caption">SOPS encrypts values at rest; only the decrypt key can turn them back into ENV vars at runtime.</figcaption>
</figure>

##### Why SOPS over Rails credentials?

- `Reviewable diffs:` Only values are encrypted, so keys and structure stay readable. A PR shows *which* secret changed, not a wall of ciphertext.
- `Many keys:` Encrypt to several recipients at once — each developer's key, plus a CI key. Revoke one without re-sharing a master key.
- `KMS-ready:` Back it with AWS KMS, GCP KMS, Azure Key Vault, age, or PGP.
- `Per-environment files:` Keep `staging` and `production` secrets in separate, independently-encrypted files.

##### Install SOPS and age

We'll use [age](https://github.com/FiloSottile/age) for keys — it's simpler than PGP and perfect for a small team.

```bash
brew install sops age
```

Generate a key pair. The public key encrypts; the private key (kept off git) decrypts.

```bash
age-keygen -o config/sops/age.key
# Public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8r
```

##### Tell SOPS what to encrypt

A `.sops.yaml` at the repo root defines creation rules — which files to encrypt and to which recipients:

```yaml
# .sops.yaml
creation_rules:
  - path_regex: config/secrets/.*\.yml$
    age: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8r
```

##### Encrypt a secrets file

Write your secrets as plain YAML:

```yaml
# config/secrets/production.yml
DATABASE_URL: postgres://user:pass@db.internal/myapp
STRIPE_SECRET_KEY: sk_live_abc123
RAILS_MASTER_KEY: 0a1b2c3d4e5f
```

Then encrypt it in place. SOPS rewrites the file so every value becomes ciphertext while the keys stay legible:

```bash
sops --encrypt --in-place config/secrets/production.yml
```

The result is safe to commit — `DATABASE_URL` is still visible, but its value is now `ENC[AES256_GCM,data:...]` plus a `sops:` metadata block.

##### Load secrets into Rails

The cleanest runtime approach is `sops exec-env`, which decrypts into the process environment and runs your command — no plaintext ever touches disk:

```bash
SOPS_AGE_KEY_FILE=config/sops/age.key \
  sops exec-env config/secrets/production.yml 'bin/rails server'
```

Prefer to decrypt inside the app? Read and parse it in an initializer:

```ruby
# config/initializers/sops.rb
secrets_file = Rails.root.join("config/secrets/#{Rails.env}.yml")

if secrets_file.exist?
  decrypted = `sops --decrypt #{secrets_file}`
  YAML.safe_load(decrypted).each { |key, value| ENV[key] ||= value.to_s }
end
```

Now `ENV["STRIPE_SECRET_KEY"]` is available throughout the app, just like any other environment variable.

##### Editing secrets later

Never edit the encrypted file by hand. `sops` opens the decrypted version in your editor and re-encrypts on save:

```bash
sops config/secrets/production.yml
```

##### In CI/CD

Store the **private** age key as a single CI secret (e.g. `SOPS_AGE_KEY`), and let your pipeline decrypt at deploy time. One secret in your CI provider unlocks everything else — and that one key never lands in the repo.

##### Wrapping up

SOPS turns secrets management into normal version control: encrypted files live next to your code, diffs are reviewable, and access is controlled by who holds a key. For teams that have outgrown a single shared `master.key`, it's a clean, auditable upgrade — and it plays nicely with whatever Rails version you're on.
