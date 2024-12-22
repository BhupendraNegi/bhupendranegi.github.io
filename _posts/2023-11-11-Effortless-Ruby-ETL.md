---
layout: post
title: Effortless Ruby ETL
---

-------
Have you ever wondered how raw data gets transformed into something meaningful and useful? Whether you're migrating a database, cleaning up messy data, or synchronizing information between systems, you've likely been doing ETL (Extract-Transform-Load) without even realizing it!

##### What is ETL?
1. `Extract:` The first step is like being a data detective—you gather data from various sources. Whether it's a CSV file, a database, or even an API, your mission is to pull in all the information you need.

2. `Transform:` Next, the fun part—transforming the data! This is where you clean, filter, and reformat your data into a shiny, polished version. It’s like giving your data a makeover so it’s ready for action.

3. `Load:` Finally, you place the transformed data into its final destination. Whether it’s a database, a report, or a dashboard, this is where your hard work pays off, and your data is ready to be used

##### Why Ruby?

Ruby is a fantastic language for building ETL processes because it’s simple, powerful, and flexible. And with the Kiba gem, you can create robust ETL pipelines with ease. Let’s walk through a basic example of how to implement ETL using Kiba.


##### Setting Up Kiba
-------


First, you'll need to install the Kiba gem. Add it to your Gemfile:


```ruby
gem 'kiba'
```

Then, run bundle install to install the gem.


##### Building Your ETL Pipeline

`1. Extract the Data`

We’ll start by extracting data from a CSV file. Kiba makes defining a source for your data straightforward:

```ruby
require 'kiba'
require 'csv'

module ETLJob
  extend Kiba::DSLExtensions
  source Kiba::Common::Sources::CSV, filename: 'users.csv', csv_options: { headers: true }
end
```

`2. Transform the Data`

Next, we’ll transform the data. We’ll clean up names, convert emails to lowercase, and ensure ages are integers. Here’s how:

```ruby
module ETLJob
  transform do |row|
    row['Name'] = row['Name'].strip
    row['Age'] = row['Age'].to_i
    row['Email'] = row['Email'].downcase
    row
  end
end
```

`3. Load the Data`

Finally, we’ll load the transformed data. This integrates the ETL process into your Rails application, making data handling smooth and consistent:

```ruby
# app/models/user.rb
class User < ApplicationRecord
end

# etl_job.rb
module ETLJob
  destination Kiba::Common::Destinations::Lambda, ->(row) {
    User.create(
      name: row['Name'],
      age: row['Age'],
      email: row['Email']
    )
  }
end

```

##### Running the ETL Job

Now that you’ve defined the source, transformation, and destination, it’s time to run the ETL job. Here’s how you can do it:

```ruby
Kiba.run(ETLJob)
```

Once the job runs successfully, your data will be extracted from the CSV file, transformed to ensure consistency, and loaded into the SQLite database—all with just a few lines of Ruby code!

##### What we learnt?
ETL is a powerful process that turns raw data into valuable insights, and with Ruby and the Kiba gem, you can create your own ETL pipelines with ease. Whether you're working on a small project or handling large-scale data processing, Ruby gives you the tools to get the job done efficiently.

So the next time you’re working with data in Ruby, remember: with Kiba, you’re just a few steps away from turning your data into gold!
