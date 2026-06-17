---
layout: post
title: Reactive Rails With Hotwire
cover: /assets/images/blog/hotwire-reactive-rails.jpg
tech: rails-plain
---

-------
You don't always need a single-page app to build a snappy, modern UI. Hotwire — the default front-end stack that ships with Rails — lets you build reactive interfaces by sending **HTML over the wire** instead of JSON, keeping your logic on the server where Rails is strongest. It's made up of three pieces: Turbo, Stimulus, and Turbo Native.

<figure class="post-figure">
  <div class="post-figure-flow">
    <div class="post-figure-step">
      <i data-lucide="mouse-pointer-click" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">User action</span>
      <span class="post-figure-step-sub">Click · submit · visit</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="server" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Rails</span>
      <span class="post-figure-step-sub">Renders an HTML partial</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="zap" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">Turbo</span>
      <span class="post-figure-step-sub">Streams HTML to the page</span>
    </div>
    <div class="post-figure-arrow"><i data-lucide="arrow-right" class="site-icon" aria-hidden="true"></i></div>
    <div class="post-figure-step">
      <i data-lucide="monitor-check" class="site-icon" aria-hidden="true"></i>
      <span class="post-figure-step-label">DOM</span>
      <span class="post-figure-step-sub">Updated in place</span>
    </div>
  </div>
  <figcaption class="post-figure-caption">Hotwire keeps rendering on the server and ships HTML — not JSON — to update the page.</figcaption>
</figure>

##### What is Hotwire?

Hotwire (HTML Over The Wire) is an approach to building web apps without writing much JavaScript. Rather than serialising state to JSON and rebuilding the DOM on the client, you send the markup the browser actually needs and let the framework swap it in.

- `Turbo:` Speeds up navigation and updates the page in fragments — no custom JS required.
- `Stimulus:` A small JavaScript framework for the bits that genuinely need behaviour.
- `Turbo Native:` Wraps your web app in a hybrid iOS/Android shell.

##### Turbo Drive

Turbo Drive intercepts link clicks and form submissions, fetches the new page in the background, and swaps the `<body>` — giving you SPA-like speed with zero code. It's on by default. When you need to opt a link out, just tell it:

```erb
<%= link_to "Download report", report_path, data: { turbo: false } %>
```

##### Turbo Frames

A Turbo Frame is a slice of the page that updates independently. Wrap content in a `turbo_frame_tag`, and any link or form inside it replaces only that frame on response.

```erb
<%# app/views/posts/show.html.erb %>
<%= turbo_frame_tag "post_#{@post.id}" do %>
  <h2><%= @post.title %></h2>
  <%= link_to "Edit", edit_post_path(@post) %>
<% end %>
```

When the user clicks **Edit**, Rails renders the edit view; Turbo extracts the matching frame and swaps it in. The rest of the page never reloads.

##### Turbo Streams

Turbo Streams let the server push fine-grained changes — `append`, `prepend`, `replace`, `update`, `remove` — to specific DOM targets. They're perfect for things like adding a comment without a full reload.

```ruby
# app/controllers/comments_controller.rb
def create
  @comment = @post.comments.create!(comment_params)

  respond_to do |format|
    format.turbo_stream
    format.html { redirect_to @post }
  end
end
```

```erb
<%# app/views/comments/create.turbo_stream.erb %>
<%= turbo_stream.append "comments", @comment %>
<%= turbo_stream.update "comments_count", @post.comments.count %>
```

Pair this with `broadcasts_to` in your model and Action Cable, and the same stream reaches every connected user in real time:

```ruby
class Comment < ApplicationRecord
  belongs_to :post
  broadcasts_to :post
end
```

##### Stimulus for the rest

Some interactions are purely client-side — a dropdown, a copy-to-clipboard button, a character counter. That's Stimulus's job. It connects plain HTML to small, well-named controllers.

```js
// app/javascript/controllers/clipboard_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["source"]

  copy() {
    navigator.clipboard.writeText(this.sourceTarget.value)
  }
}
```

```erb
<div data-controller="clipboard">
  <input data-clipboard-target="source" value="https://example.com/abc" readonly>
  <button data-action="clipboard#copy">Copy</button>
</div>
```

##### When should you reach for Hotwire?

Hotwire shines for CRUD-heavy, business-logic apps — dashboards, admin panels, marketplaces — where most of the work is on the server anyway. You keep one language, one set of templates, and skip the API layer entirely. If you're building something with heavy client-side state (a drawing tool, a game), a dedicated front-end framework still makes sense. For everything else, Hotwire gets you a fast, reactive UI with a fraction of the code.
