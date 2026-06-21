---
layout: post
title: Ruby on Rails vs Node.js vs Go
cover: /assets/images/blog/rails-node-go.jpg
techs: [rails-plain, nodejs-plain, go-plain]
tags: [Rails, Ruby]
---

-------
"Which backend should I use?" is one of the most-argued questions in software — and most answers pick a single metric (usually raw speed) and declare a winner. That's the wrong lens. The right backend depends on what you're building, how fast you need to ship, and who you can hire. Let's compare Ruby on Rails, Node.js, and Go across the dimensions that actually move a project.

<figure class="post-figure">
  <div class="post-figure-compare">
    <div class="post-figure-step">
      <span class="post-figure-icons">
        <i class="devicon-ruby-plain" aria-hidden="true"></i>
        <i class="devicon-rails-plain" aria-hidden="true"></i>
        <i class="devicon-postgresql-plain" aria-hidden="true"></i>
      </span>
      <span class="post-figure-step-label">Ruby on Rails</span>
      <span class="post-figure-step-sub">Convention-driven. Fastest path to a business-logic-heavy product.</span>
    </div>
    <div class="post-figure-step">
      <span class="post-figure-icons">
        <i class="devicon-nodejs-plain" aria-hidden="true"></i>
        <i class="devicon-javascript-plain" aria-hidden="true"></i>
        <i class="devicon-express-original" aria-hidden="true"></i>
      </span>
      <span class="post-figure-step-label">Node.js</span>
      <span class="post-figure-step-sub">JavaScript everywhere. Great at real-time and shared front/back code.</span>
    </div>
    <div class="post-figure-step">
      <span class="post-figure-icons">
        <i class="devicon-go-plain" aria-hidden="true"></i>
        <i class="devicon-docker-plain" aria-hidden="true"></i>
        <i class="devicon-kubernetes-plain" aria-hidden="true"></i>
      </span>
      <span class="post-figure-step-label">Go</span>
      <span class="post-figure-step-sub">Compiled & concurrent. Built for high-throughput, low-overhead systems.</span>
    </div>
  </div>
  <figcaption class="post-figure-caption">Three strong backends, three different sweet spots.</figcaption>
</figure>

##### One benchmark won't decide it

A framework that wins a "requests per second" chart can still be the wrong choice if it takes twice as long to build features or you can't hire for it. Engineering decisions are trade-offs across speed-to-market, running cost, hiring, and maintainability — so weigh all of them, not just the one that's easy to measure.

##### Performance and concurrency

- `Go:` The clear winner on raw throughput. It's compiled, and goroutines make concurrency cheap, so it often needs significantly less compute for the same load. Ideal for proxies, APIs at scale, and CPU-bound work.
- `Node.js:` A non-blocking event loop makes it excellent for I/O-bound, real-time workloads — chat, streaming, live dashboards — though CPU-heavy tasks block that single thread.
- `Rails:` Not built for raw benchmarks, but rarely the bottleneck for typical web apps. With background jobs and caching, it scales comfortably for the vast majority of products.

##### Fastest to an MVP

This is where Rails earns its reputation. Convention over configuration means less boilerplate and fewer decisions — generators, an ORM, migrations, and a mature testing story are all built in. Node.js is fast too, but you assemble your own stack from many packages. Go is the most deliberate: explicit and verbose by design, which trades early speed for long-term clarity.

##### The feel of the code

A trivial "create a user" endpoint shows the ergonomics of each:

```ruby
# Rails
class UsersController < ApplicationController
  def create
    user = User.create!(user_params)
    render json: user, status: :created
  end
end
```

```js
// Node.js (Express)
app.post("/users", async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).json(user)
})
```

```go
// Go (net/http)
func createUser(w http.ResponseWriter, r *http.Request) {
    var u User
    json.NewDecoder(r.Body).Decode(&u)
    db.Create(&u)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(u)
}
```

##### Hiring and cost

- `Node.js:` The largest talent pool — most developers know JavaScript — but skill levels vary widely and architectures differ from team to team.
- `Rails:` A smaller but specialised pool. Because the framework is so opinionated, Rails developers tend to be productive in an unfamiliar codebase quickly, which makes hiring outcomes more predictable.
- `Go:` A smaller, more senior pool. Great engineers, but typically a higher rate and a longer search.

##### Ecosystem and dependencies

Rails gives you a curated, batteries-included ecosystem — most of what a web app needs is one gem away. Node.js has the largest registry by far, but that breadth brings "dependency churn": fast-moving, sometimes shallow packages. Go leans on a strong standard library and keeps dependencies minimal, which pays off in long-term stability.

##### When to choose each

- `Choose Rails` for SaaS products, marketplaces, and business systems where feature velocity and maintainability matter most.
- `Choose Node.js` when real-time features are central, or you want to share code and people across the front and back end.
- `Choose Go` for performance-critical infrastructure — high-throughput APIs, proxies, and services where compute cost is the dominant concern.

##### Conclusion

There's no universal winner. Go wins on raw efficiency, Node.js on real-time and a shared language, and Rails on getting a feature-rich product to market — and keeping it maintainable for years. For most business-logic-heavy applications, that last quality is the one that compounds, which is why Rails remains such a strong default. Pick the tool that fits the job in front of you, not the one that tops a benchmark.
