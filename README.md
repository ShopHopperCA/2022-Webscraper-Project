
# 2022-Webscraper-Project

# Process Manual for ShopHopper Web Scrapers
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

For the Implementation of the web scrapers, 20 websites were scraped to get product data. Of the 20 websites there were 7 Lightspeed websites, 4 WooCommerce websites, 3 Wix websites, 3 Square websites, 2 Weebly websites, and 1 BigCommerce website.

# Folders 
WooCommerceScrapers, AlpacaScraper, WixScrapers, lightspeed-api, MostWantedAPI, SquareAndWeebly

# Files 

WooCommerceScrapers: amni_apparel.js – scrapes Amni Apparel, wearabouts.js – scrapes Wearabouts Clothing Co., naughtygirlessential.js – scrapes Naugty Girl Essentials Lingerie, and soledoc.js – scrapes Soledoc.

AlpacaScraper: index,js – scrapes Alpaca Clothing Canada.

WixScrapers: index.js – scrapes Floral Fawn Boutique and Stone Fox Clothing.

lightspeed-api: index.js – scrapes The Artful Hand, ONE Boardshop, Strut Footwear & Apparel, Honest Boutique, Envy Apparel, Attridge Snow Ski Wake, and Fossellos.

MostWantedAPI: index.js - scrapes Most Wanted Resale.

SquareAndWeebly: index.js – scrapes Morgane, Tigerlily Fashions Clothing, Sassy Shoes, Kaleco Sustainable Lifestyle, and Okanagan Skate Co. 

There is also a corresponding JSON output file for each scraper file, and a readme file in each folder that acts as both a starting point and a handy reference that explains the Scrapers structures.

# Instructuions to run scrapers
1. Go to root folder in terminal and execute npm install to install all required packages and libraries. This can be done by running “npm install puppeteer@11 node-fetch@2 request request-promise axios cheerio”.
2. Change directory to the targeted folder using cd FolderName. Or execute using node FolderName/filename.js in the terminal.
3. Execute node filename.js to run the scraper in the terminal.

# Feedback Guide
Mid-Execution/How the Scrapers Work
WooCommerce, Alpaca, and Wix Scrapers: 
Puppeteer, an automated browser visits the targeted website and gets product URLs and titles, then the individual product pages are visited to scrape more detailed information about each product. Cheerio is used to extract data from the web pages.

LightSpeed API: 
URL: This is the base URL that is currently being parsed. 
After URL: are all the individual .ajax product URLs that are scraped from that URL.

Square and Weebly API:
Square and Weebly based-sites dispose of a callable API that is used then used to populate the site. There are many API calls that can be observed through the networks tab in the Developers Tool console. The content-type for both of these calls is: application/json. 

As a preamble it’s good practice to double-check whether the Square or Weebly site allows for the response to be shared publicly, we can usually check this through the Networks Tab on the Developer Console through the “Access-Control-Allow-Origin” HTTP header, see the example below to get an idea. NOTE: There might be other important HTTP headers that allows for the information to be fetched, this was consistent across all the Square and Weebly sites scraped
  
Once we’ve checked that the response is publicly shared, we can start inspecting the products payload. 
Through some 3rd party testing tools, we can hit the endpoints and see the payload we receive and with this information we have a better idea on how to start implementing the scrapers. These site structures are populated through these different payloads being fetched, with this information in hand, we leverage the calls and try to abstract as much as we can from this pattern to create templates for them.

Once the required packages have been installed, we can proceed and use the templates.
The following information is needed in order to be able to scrape:
•	businessName = Name of the business or store being scraped
•	baseURL = this is the ALL products call (The bulk of the data will be scraped using this)
•	productCall = this is the specific product call needed to scrape the few remaining data points
Once all of these have been determined the templates are used to extract the data.

Most Wanted Resale API: 
Uses Puppeteer to visit a webpage and then scrape product URLs and titles using Cheerio. URLs are modified to .js files and then node-fetch is used to get extract data from each URL.

# Post Execution/Outputs
For LightSpeed, after execution, a small part of the results will be displayed in the terminal, as well as the number of items scraped and the execution time in milliseconds.
Weebly and Square also output how many items from each website have been scraped in the terminal.
The full output of the scrapers is written in the corresponding .json file in each folder.

# Packages and Versions
cheerio - ^1.0.0-rc.10
puppeteer - ^11.0.0
request-promise - ^4.2.6
request - ^2.88.2
node-fetch - ^2.88.2
axios - ^0.26.0

