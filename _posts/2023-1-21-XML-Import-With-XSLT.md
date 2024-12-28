---
layout: post
title: XML Import With XSLT
---

-------
XSLT is a powerful tool for transforming XML data into a desired format. It can be especially useful in Rails applications when you need to:

1. Transform incoming XML into a format compatible with your application's database.

2. Extract only the necessary information from complex XML documents.

3. Convert XML into JSON for use in APIs or front-end applications.

4. Leverage a declarative approach that separates transformation logic from application code, making it easier to maintain and modify.

5. Handle complex XML structures efficiently without extensive custom parsing logic.

6. Reuse existing XSLT stylesheets for standardized transformations across different applications or services.

##### Sample XML and XSLT

Let's assume you have the following XML file (data.xml):
```xml
<products>
  <product>
    <id>1</id>
    <name>Product A</name>
    <price>100</price>
    <category>Electronics</category>
  </product>
  <product>
    <id>2</id>
    <name>Product B</name>
    <price>200</price>
    <category>Furniture</category>
  </product>
  <product>
    <id>3</id>
    <name>Product C</name>
    <price>150</price>
    <category>Electronics</category>
  </product>
</products>
```

And an enhanced XSLT file (transform.xslt) to transform the XML into a JSON-like format, including a condition to filter products by category:

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" indent="yes"/>
  <xsl:template match="/">
    [
    <xsl:for-each select="products/product[category='Electronics']">
      {
        "id": "<xsl:value-of select="id"/>",
        "name": "<xsl:value-of select="name"/>",
        "price": "<xsl:value-of select="price"/>",
        "category": "<xsl:value-of select="category"/>"
      }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
    ]
  </xsl:template>
</xsl:stylesheet>
```

This XSLT transformation filters products to include only those in the "Electronics" category. You can further customize the conditions, such as filtering by price range or combining multiple criteria.

##### Implementation
`Create a Service Object`

To keep your code clean, encapsulate the logic in a service object. Create a file app/services/xml_importer.rb:
```ruby
require 'nokogiri'

class XmlImporter
  def self.import(xml_path, xslt_path)
    xml = File.read(xml_path)
    xslt = File.read(xslt_path)

    doc = Nokogiri::XML(xml)
    stylesheet = Nokogiri::XSLT(xslt)

    transformed_data = stylesheet.transform(doc)
    JSON.parse(transformed_data)
  end
end
```

`Generate a controller to handle XML imports:`
```ruby
rails generate controller Imports
```

In app/controllers/imports_controller.rb, add the following code:
```ruby

class ImportsController < ApplicationController
  def create
    xml_path = Rails.root.join('data.xml')
    xslt_path = Rails.root.join('transform.xslt')

    @data = XmlImporter.import(xml_path, xslt_path)

    render json: @data
  end
end
```
`Set Up Routes`

Add a route for the import action in config/routes.rb:
```ruby

Rails.application.routes.draw do
  post 'imports', to: 'imports#create'
end
```

`Testing the Implementation`

Place the data.xml and transform.xslt files in the Rails root directory. Start the Rails server:
```ruby
rails server
```

Use a tool like curl or Postman to test the endpoint:
```bash
curl -X POST http://localhost:3000/imports
```

You should receive a JSON response with the transformed data:
```bash
[
  {"id": "1", "name": "Product A", "price": "100", "category": "Electronics"},
  {"id": "3", "name": "Product C", "price": "150", "category": "Electronics"}
]
```
##### Conclusion

By leveraging XSLT and Nokogiri, you can easily transform and import XML data into your Rails application. This approach is powerful, flexible, and allows for clean separation of transformation logic from application code. Experiment with different XML and XSLT structures to unlock the full potential of this technique!



