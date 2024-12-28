---
layout: post
title: CSV Import With Kiba
---

-------
CSV (Comma-Separated Values) files are widely used for data exchange, and importing them efficiently in Ruby on Rails can be streamlined with the kiba gem. Kiba is a powerful tool for building ETL (Extract, Transform, Load) pipelines, making it an excellent choice for handling CSV imports.

##### Why Use Kiba for CSV Imports?

The kiba gem simplifies the process of importing and processing CSV files by:

`Decoupling Logic:` It separates extraction, transformation, and loading, making the code modular and easier to maintain.

`Handling Complex Pipelines:` Kiba excels at managing multi-step transformations and data flows.

`Error Handling:` It provides clear logging and error-tracking capabilities.

`Scalability:` Kiba works well with large data sets by processing records in memory-efficient batches.

##### Setting Up Kiba in Rails

Add kiba to your Gemfile and run bundle install:
```ruby
gem 'kiba'
```

##### Create a Kiba Job

A Kiba job defines the steps for your ETL pipeline. Create a file app/jobs/csv_import_job.rb:

```ruby
require 'csv'

class CsvImportJob
  extend Kiba::Common::DSLExtensions::Config

  Kiba.parse do
    source Kiba::Common::Sources::CSV, filename: Rails.root.join('products.csv'), csv_options: { headers: true }

    transform do |row|
      {
        id: row['id'],
        name: row['name'],
        price: row['price'].to_f,
        category: row['category']
      }
    end

    destination Kiba::Common::Destinations::Lambda do |row|
      Product.find_or_create_by!(id: row[:id]) do |product|
        product.name = row[:name]
        product.price = row[:price]
        product.category = row[:category]
      end
    end
  end
end
```
##### Trigger the Job

Create a service object to execute the Kiba job. Add a file app/services/csv_importer.rb:
```ruby

class CsvImporter
  def self.import(file_path)
    Kiba.run(CsvImportJob, filename: file_path)
  end
end
```

##### Create a Controller for Importing

Generate a controller to handle CSV imports:
```ruby
rails generate controller Imports
```

In app/controllers/imports_controller.rb, add the following code:
```ruby
class ImportsController < ApplicationController
  def create
    csv_path = params[:file].path

    CsvImporter.import(csv_path)

    render json: { message: 'Import successful' }
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
```

##### Set Up Routes

Add a route for the import action in config/routes.rb:
```ruby
Rails.application.routes.draw do
  post 'imports', to: 'imports#create'
end
```

##### Create a View for File Upload (Optional)

If you want a front-end interface for uploading CSV files, create a simple form in app/views/imports/new.html.erb:
```ruby
<%= form_with url: imports_path, local: true, multipart: true do |form| %>
  <div>
    <%= form.label :file, 'Choose CSV File' %>
    <%= form.file_field :file %>
  </div>

  <div>
    <%= form.submit 'Upload' %>
  </div>
<% end %>
```

##### Testing the Implementation

Start the Rails server:
```bash
rails server
```

Upload a CSV file using the form or use a tool like curl to test the endpoint:
```bash
curl -F "file=@products.csv" http://localhost:3000/imports
```

Check your database to confirm that the products were imported successfully.

##### Advanced Use Cases

With Kiba, you can handle advanced requirements, such as:

`Custom Transformations:` Add custom logic in the transformation block for data cleaning or enrichment.

`Validation:` Validate rows before saving to the database and log or skip invalid entries.

`Batch Processing:` For large files, use Kiba’s batch processing features to optimize memory usage.

##### Conclusion

The kiba gem is a robust and flexible tool for building CSV import pipelines in Rails. By leveraging its modular design, you can efficiently handle complex data transformations while keeping your code clean and maintainable. Start using Kiba today to supercharge your data imports!



