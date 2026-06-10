source "https://rubygems.org"

ruby file: ".ruby-version"

gem "jekyll", "~> 4.4"
gem "jekyll-paginate", "~> 1.1"
gem "minima", "~> 2.5", ">= 2.5.1"
gem "webrick", "~> 1.9"
gem "bigdecimal", "~> 4.1"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-pdf-embed", "~> 1.1"
  gem "jekyll-sass-converter", "~> 2.2"
end

platforms :windows, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", platforms: [:windows]
