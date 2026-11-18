source "https://rubygems.org"

ruby file: ".ruby-version"

gem "jekyll", "~> 4.4"
gem "webrick", "~> 1.9"
gem "bigdecimal", "~> 4.1"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
end

group :development do
  # Validates the built _site HTML: broken internal links, missing images,
  # malformed markup. Run via ./bin/lint (see bin/lint and package.json).
  gem "html-proofer", "~> 5.0"
end

platforms :windows, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", platforms: [:windows]
