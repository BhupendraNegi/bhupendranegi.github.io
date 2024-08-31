---
layout: post
title: ETL with Ruby Efficient Data Transformation
---

#### Understanding ETL in Ruby

Have you ever migrated a database, cleaned up data, or synchronized information between two systems? If so, you’ve likely been performing ETL (Extract-Transform-Load) without even realizing it.

ETL is a process that involves:

1. **Extracting** data from one or more sources.
2. **Transforming** the data into the desired format.
3. **Loading** the transformed data into a destination.

Ruby is an excellent language for building ETL processes, offering simplicity and flexibility. Let’s dive into a basic ETL example using Ruby.

##### Step 1: Extract the Data

First, we need to extract the data from a source. In this example, we’ll use a CSV file as our data source:

```ruby
require 'csv'

def extract(file_path)
  CSV.read(file_path, headers: true)
end
```
##### Step 2: Transform the Data

Next, we’ll clean and format the data. For example, we’ll trim any whitespace from names, convert emails to lowercase, and ensure ages are integers:

```ruby
def transform(data)
  data.map do |row|
    {
      name: row['Name'].strip,
      age: row['Age'].to_i,
      email: row['Email'].downcase
    }
  end
end
```

##### Step 3: Load the Data

Finally, we’ll load the transformed data into a SQLite database. Here’s how:

```ruby
require 'sqlite3'

def load(data, db)
  db.execute("CREATE TABLE IF NOT EXISTS users (name TEXT, age INTEGER, email TEXT)")
  data.each do |row|
    db.execute("INSERT INTO users (name, age, email) VALUES (?, ?, ?)", row[:name], row[:age], row[:email])
  end
end
```

##### Bringing It All Together

Let’s see how these steps work together in a complete ETL process:

```ruby
data = extract('users.csv')
transformed_data = transform(data)
db = SQLite3::Database.new('users.db')
load(transformed_data, db)

puts "ETL process completed successfully!"

```
