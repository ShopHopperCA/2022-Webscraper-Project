
# 2022-Webscraper-Project

Process Manual for ShopHopper Web Scrapers
By Adán David Sierra Calderón,
Cole Horvat,
Justin Howson

Step 1: Look for website API, before starting the scraping process
The first step is to look for an API to extract data from rather than making a scraper. To do this go to the google developer tools, open the network tab and select the Fetch/XHR option while on a product page to see if there is a possible API. Look through the results of Fetch/XHR responses and see if there are any responses that may look like product data.

Step 2: Pagination Loop:
Assuming there are no APIs found the first step is to find out how many pages we will need to scrape. Go the main page displaying all of the products and once again open up google developer tools. Press the arrow icon in the top left corner to select and inspect elements on the page. Go to the page numbers on the main page if there are any and put your mouse over the last page, this will allow you to inspect the HTML tag of this element and give you insight on what jQuery selector will be used to get the value of the last page number. Once you get the value for the last page number then you can set up a loop, most of the websites have a clear format for how they display page numbers within the URL. You can then take the page number out of the URL and using a for loop replace it with the index of the for loop.

Step 3: Main page inspection
Continue to inspect the HTML of the main page listing all of the products using google developer tools. Look for the individual products title, URL and product id. Once you have found the HTML tags containing title, URL and product id then you can begin to inspect them and create jQuery selectors to extract the data. For business name it will likely be easiest to extract it from the title tag from the HTML. To inspect the title tag press crtl+U to open the pages HTML and then find the tag. Inspect the tag and create a jQuery selector to extract the business name. Then map all of the extracted data into a JSON object.

Step 3: Individual product page inspection
Next inspect individual product pages inspect using google developer tools once again. Another way to find any tags you are for is looking through the HTML using ctrl+U searching for keywords like variant, brand, or anything that you can’t find in the initial. Find all of the needed tags and create the jQuery selectors to extract the data from each HTML tag. Create a loop to loop through the current JSON array created in the last step, go to each product URL and use the jQuery selectors to get the data needed for each product. Check many different individual product pages to look for any special cases needed to be accounted for. Then insert all of the extracted data into the JSON array at the index in the loop.

Step 4: Output and inspect JSON
Then output the JSON array that has been created. Inspect the JSON closely to look for any potential issues. Utility functions made need to be created to eliminate duplicates, or help with any other potential problems that are found.
# ShopHopper Webscrapers

## Lightspeed

### Instructions to Run Scraper

**1.** Go to root folder in terminal and execute `npm install` to install all required packages and libraries.

**2.** Change directory to the lightspeed folder using `cd lighspeed-api`. 

**3.** Execute `node index.js` to execute the scraper.

### Feedback Guide

**Mid-Execution**

**URL:** This is the base URL that is currently being parsed.

After `URL:` are all the individual `.ajax` product urls that are scraped from that url.

**Post-Execution**

After execution, a small part of the results will be displayed in the terminal, as well as the amount of items scraped and the execution time in milliseconds.

The full output of the scraper is written in `lightspeedOutputJson.json` in the `lightspeed-api` folder.

### Packages and Versions (April 4th, 2022)

cheerio - ^1.0.0-rc.10<br />
node-fetch - ^2.88.2<br />
request: ^2.88.2<br />
request-promise - ^4.2.6<br />


## Weebly Scrapers
  - ~~Kaleco Scraper~~ (https://www.kaleco.ca/) : ***2nd draft***
  - ~~Okanagan Skate Co Scraper~~ (http://www.okanaganskate.com/) : ***2nd draft***
    
## Square Scrapers:
  - ~~Morgan Kelowna (https://morganekelowna.square.site/s/shop)~~ : ***2nd draft***
  - ~~Tigerlily Fashions Clothing (https://shoptigerlilyclothing.square.site/)~~ : ***2nd draft***
  - ~~Sassy Shoes (https://sassy-shoes.square.site/s/shop)~~ : ***2nd draft***
