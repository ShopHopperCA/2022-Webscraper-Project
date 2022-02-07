/* 

product_url_scraper.js - This file is where the product urls needed to access the Lightspeed AJAX pages are scraped. We need to use this since the
only way to access the AJAX for the products is to add ".ajax" to the end of the products url.

Important Functions:

scrapeProductUrls(site) - This function takes in a site object from `site_objects.js` which includes all of the selectors and the base url for the given site.
It will then loop through each page related to the base url, scraping all product urls based on the given selectors.

removeNodes(page$, nodes) - This function takes in an array of nodes that are deleted from the page at the beginning of the outer for loop execution. 
Its purpose is to remove any any HTML elements that may be a part of the product list but do not have a link to a product page.
*/

const request = require('request-promise');
const cheerio = require('cheerio');

let pageUrl = "";
let productListLength = 0;
let page$;
let pageHtml;

/* SCRAPER FUNCTIONS */


async function scrapeProductUrls(site) {
        
    const html = await request.get(site.baseUrl);
    const $ = await cheerio.load(html)

    const product_urls = [];
    
    let paginationEnd;
    let productUrl;
    let productElement;
    
    //Get pagination end
    try {
        if(typeof site.paginationSelector === "string")
            paginationEnd = $(site.paginationSelector).eq(-2).text();
        else if(Number.isInteger(site.paginationSelector))
            paginationEnd = site.paginationSelector;
        else
            throw "Invalid pagination"
    } catch(err) {
        console.log("Please enter a valid pagination value (Selector or Integer)");
    }


    for(var i = 1; i <= paginationEnd; i++) {
        await sleep(1000);
        pageUrl = site.baseUrl + 'page' + i + '.html';
        pageHtml = await request.get(pageUrl);
        page$ = cheerio.load(pageHtml);

        if(site.removeNodes) {
            removeNodes(page$, site.removeNodes);
        }
        
        productListLength = await page$(site.productListSelector).children().length;

        for(var j = 0; j < productListLength; j++) {
            productElement = await page$(site.productListSelector).children().eq(j);
            productUrl = await page$(productElement).find(site.productLinkSelector).attr('href');
            productUrl = productUrl.replace('.html', '.ajax');
            
            //console.log(productUrl);
            
            product_urls.push(productUrl);
            
        }
    }

    return product_urls;
}

async function scrapeBodyHtml($) {
    //This will double requests since we have to get the .html and .ajax
}

async function removeNodes(page$, nodes) {
    nodes.forEach(element => {
        page$(element).remove();
    });
}

/* UTILITY FUNCTIONS */

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

module.exports = {scrapeProductUrls: scrapeProductUrls}