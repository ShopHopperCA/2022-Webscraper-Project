# 2022-Webscraper-Project

Instructions(How to Run): 
The structure of how the separate scrapers are organized is through having different folders based off of the ecommerce website structures and whether or not there was an API or a regular web scraper. There are folders for Woocomerce Scrapers, lightspeed-api, Wix Api, Wix web scrapers, the alpaca web scraper (BigCommerce), and Kaleco and Weebly APIs. To run each scraper go to the terminal and run the scraper by using the following format: node foldername/filename.js. The three packages that must be installed to run all of the scrapers are node-fetch version 2, puppeteer version 11, and cheerio version 1. These can be installed using npm install cheerio, node-fetch@2, puppeteer@11.

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
