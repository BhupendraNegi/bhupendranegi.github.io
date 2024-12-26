---
layout: post
title: Getting Started With Jekyll
---

-------
`Jekyll` is a static site generator that makes building simple websites fast and easy. Whether you're creating a blog, portfolio, or project site, Jekyll provides a flexible and efficient solution. Here's why you should consider Jekyll:

###### Why Choose Jekyll?
1. `Speed:` Jekyll generates static HTML files, resulting in faster load times and improved performance.
2. `No Database:` You don’t need a database. Content is stored in simple Markdown files, making the site more secure and easier to manage.
3. `Customizable:` Full control over the site layout, themes, and structure. You can create dynamic content with Liquid templating.
4. `GitHub Pages Integration:` Easy deployment through GitHub Pages, making it simple to host your site for free.

##### Getting Started with Jekyll

##### Install Jekyll
Make sure you have Ruby installed, then install Jekyll with:

```bash
gem install jekyll bundler
```
##### Create a New Site
Run the following command to create a new Jekyll project:

```bash
Copy code
jekyll new my-awesome-site
cd my-awesome-site
```
This creates a new directory with the necessary files.

##### Directory Structure
Here’s what you’ll see:
- `_config.yml:` Configuration file for your site settings.
- `_posts/:` Folder for your blog posts. Each post is a Markdown file.
- `_layouts/:` Templates that define the structure of pages and posts.
- `index.md:` The homepage.


##### The Gemfile
In your newly created Jekyll site, you'll notice a Gemfile. This file is used by Bundler to manage the Ruby gems (libraries) your site depends on. Gems are packages that extend Jekyll's functionality, and the Gemfile ensures the right versions of these gems are installed.

Here’s a simple Gemfile:

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.2"
gem "minima", "~> 2.5"  # This is the default theme for Jekyll
gem "jekyll-feed"  # Adds RSS feed support
gem "jekyll-seo-tag"  # Adds SEO tags for better search engine optimization
```

After you make any changes to the Gemfile, run this command to install the necessary gems:

```bash
bundle install
```

##### Customize Your Site
Open `_config.yml` and add details like your site’s title:

```yaml
title: My Awesome Site
description: A personal blog
url: "https://my-awesome-site.com"
theme: minima
```

##### Layouts: Understanding Templates
Jekyll uses layouts to define the structure of your pages and posts. Layouts are stored in the _layouts/ directory. For example, the default layout file is default.html.

A typical layout might look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} | {{ site.title }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
</head>
<body>
  <header>
    <h1>{{ site.title }}</h1>
  </header>
  <main>
    {{ content }}
  </main>
  <footer>
    <p> {{ site.time | date: "%Y" }} {{ site.title }}. All rights reserved.</p>
  </footer>
</body>
</html>
```

You can also create custom layouts for different page types, such as a post layout in _layouts/post.html for blog posts.

##### Create Your First Post
Create a new post in the _posts/ folder with the filename 2024-12-22-my-first-post.md. Inside the file:

```bash
---
layout: post
title: "My First Post"
date: 2024-12-22
---
Welcome to my first post on Jekyll!
```

##### Preview Your Site
Run this command to see your site locally:

```bash
bundle exec jekyll serve
```
Your site will be available at `http://localhost:4000`


##### Deploy on GitHub Pages
Once you’ve finished customizing your site, you can easily deploy it on GitHub Pages.

- Push your project to a GitHub repository.
- Go to Settings > Pages.
- Choose the source branch (usually main) and save.
- Your site will be live at `https://your-username.github.io/your-repository-name`

##### Conclusion

`Jekyll` is a powerful yet simple way to build static websites. It’s fast, secure, and customizable. With Jekyll, you can easily create blogs, portfolios, and documentation sites. Follow the steps above, and you'll have your own site up and running in no time!