# Lightspeed Scraper Documentation

## About This Document

This README is meant to give a detailed description of the Lightspeed site structure-based scraper. It will go over the different files, the functions within them, and what they do. This document will also show how to add more lightspeed sites to the scraper in the future.

## Context

Generally in Lightspeed site strucutre, data for an individual product is stored in the product url with a `.ajax` extension. For example:

HTML Page: [https://www.fossellos.com/terina-midi-dress.html]

Data Page: [https://www.fossellos.com/terina-midi-dress.ajax]

This data page contains (almost) all of the data we need to scrape including prices, availability, etc.

With this in mind, the Lightspeed scraper works by:

1. Scraping all of the product urls from a site based on given CSS selectors
2. Converting the .html urls to .ajax
3. Extracting required data from the data page and cleaning it to fit our schema.

## How to Add New Sites

You do not need to edit or add any code to add new Lightspeed sites.

Instead, sites are added by adding required information and CSS selectors to the `SITE_OBJECTS` array in `lightspeed-api/site_objects.js`. New sites are added by adding a new object to the array with parameters. There are **7** parameters in total, **5 required**, **2 optional**.

### Required Parameters

#### baseUrl (String[])

This parameter contains the URL(s) for the store on a given website. This is the url to the storefront or product category on a website, not an individual product.

For example, this is one of the baseUrl entries in One Board Shop:

["https://www.oneboardshop.com/snow/womens-outerwear/womens-jackets/"]

![baseUrl-example](https://user-images.githubusercontent.com/56736430/161148759-9a608a0e-201b-4622-9e1c-dca098a2a474.png)


#### paginationSelector (String/Integer)

This parameter is for the pagination of the given url. It will be used to get how many pages the scraper needs to go through before it can move on to the next url. This parameter can be a String or an Integer.

**String:** When this paramter is a String, it is used to get the pagination list that is generally at the bottom of the page.

![pagination-example](https://user-images.githubusercontent.com/56736430/161150564-91bc9103-0b3f-4285-9ac7-35418c6e6b36.png)

When getting the pagination list, you want to use the `<li>` selector at the end. For example, for Honest Boutique (seen in the above photo), the pagination selector is:

`div.pagination > ul > li`

**Integer:** When this parameter is an integer, it's setting the amount of pages to parse manually. This should only be used when there's no pagination on the page but you still need to navigate through pages (Attridge is a good example of this [https://www.attridge.ca/women/womens-tops/].

Note: If you're not sure how many pages to put in, just put a high number. The scraper will automatically detect when there's nothing to scrape, and if the scraper is looping back on itself. For the sake of speed and troublshooting, it's better to use a selector when you can.

#### productListSelector (String)

This parameter is the selector for the list that contains all the products on a given page. It's used to get the amount of products on a page that need to be scraped.

![productlist-example](https://user-images.githubusercontent.com/56736430/161154577-133629f1-1733-4afd-b80a-2f83d653b2a6.png)

#### productLinkSelector (String)

This parameter is the selector for the url for each individual product in the product list. It's important that the HTML element that you've selected contains an `href` parameter with the url to the product page for that product.

![productlink-example](https://user-images.githubusercontent.com/56736430/161156337-9eb1159c-809c-4f42-8256-949a0efd22de.png)


#### bodyHtmlSelector (String)

This parameter is for the `body_html` datapoint. We can't get this data point from the data page so it has to be scraped from the html page.

The `body_html` data point is the HTML that is wrapped around the description, so all you need to do it find the selector for the description on the HTML page.

![bodyhtml-example](https://user-images.githubusercontent.com/56736430/161156587-366009b0-00d3-446a-9126-dd5de4c1f5cb.png)


<br />

### Optional Parameters

#### productItemSelector (String)

This parameter takes a CSS selector of the element that you want to parse in the case that there are elements in between the product elements as seen here.

![Screenshot from 2022-04-01 13-50-18](https://user-images.githubusercontent.com/56736430/161339890-7e64fefe-f83c-4efe-8257-cbc30cac811d.png)

In this example in One Board Shop, we specify `.col-md-4` to ignore the `.cf` elements in between the product elements.

#### removeNodes (String[])

Another way to ignore elements that are in the way is to use the removeNodes parameter. This will remove any HTML elements based on the given CSS selector(s). We use this in One Board Shop to remove the `.cf` elements.

Note: While this parameter does work for the most part, it's hit or miss. `productItemSelector` is generally a more reliable solution at the time of writing this.


## File Walkthrough


