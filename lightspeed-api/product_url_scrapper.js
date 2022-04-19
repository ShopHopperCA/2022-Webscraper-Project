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

let body_html = {};

/* SCRAPER FUNCTIONS */


async function scrapeProductUrls(site) {
    const product_urls = [];

    for(var urlIndex = 0; urlIndex < site.baseUrl.length; urlIndex++) {
        const html = await request.get(site.baseUrl[urlIndex]);
        const $ = await cheerio.load(html)
        console.log("\nURL: " + site.baseUrl[urlIndex] + '\n_________________________________________________________');
        
        let paginationEnd;
        let productUrl;
        let productElement;
        let productLoop = 0;        
        /*
            Check if paginationSelector is a string, if so, check if the element exists. If true, get the last number in pagination list, if false, paginationEnd = 1.
            If paginationSelector is a number, paginationEnd = paginationSelector.
            If paginationSelector is neither a string or number, throw an exception.    
        */
        try {
            if(typeof site.paginationSelector === "string")
                if( $(site.paginationSelector).length )
                    paginationEnd = $(site.paginationSelector).eq(-2).text();
                else {
                    paginationEnd = 1;
                    console.log("`"+site.baseUrl[urlIndex]+"`" + " has no pagination");
                }
            else if(Number.isInteger(site.paginationSelector))
                paginationEnd = site.paginationSelector;
            else
                throw "Invalid pagination"
        } catch(err) {
            console.log("Please enter a valid pagination value (Selector or Integer)");
            break;
        }
    
        for(var i = 1; i <= paginationEnd; i++) {
            if(productLoop >= 5) break;

            await sleep(1000);
            let productItemSelector = "";
            pageUrl = site.baseUrl[urlIndex] + 'page' + i + '.html';
            try {
                pageHtml = await request.get(pageUrl);
                page$ = cheerio.load(pageHtml);
            } catch(err) {
                console.log("Page HTML could not be loaded, please check site status or URL")
                break;
            }
                
            if(site.removeNodes) 
                removeNodes(page$, site.removeNodes);
            
            if(site.productItemSelector) 
                productItemSelector = site.productItemSelector
            
            try {
                productListLength = await page$(site.productListSelector).children(productItemSelector).length;
            } catch (err) {
                console.log("productListLength could not be found. Please check site status or CSS selectors.")
                break;
            }

            if(productListLength == 0) break;
            
            for(var j = 0; j < productListLength; j++) {
                    try {
                        productElement = await page$(site.productListSelector).children().eq(j);
                    } catch (err) {
                        console.log("Could not get productElement. Please check site status or CSS selectors.")
                        break;
                    }

                    try {
                        productUrl = await page$(productElement).find(site.productLinkSelector).attr('href');
                    } catch (err) {
                        console.log("Could not get productUrl. Please check site status or CSS selectors.")
                        break;
                    }
                    
                    let html = await scrapeBodyHtml(productUrl, site);
                    body_html[productUrl] = html;
                    
                    try {
                        productUrl = productUrl.replace('.html', '.ajax');
                    } catch (err) {
                        console.log("productUrl is null. Please check site status or CSS selectors")
                        break;
                    }
                    
                    if(product_urls.includes(productUrl)){
                        productLoop++;
                        break;
                    }

                    console.log(productUrl);

                    product_urls.push(productUrl);
                    
            }
        } 
    }
    
    return product_urls;
}

/* UTILITY FUNCTIONS */

async function removeNodes(page$, nodes) {
    nodes.forEach(element => {
        try {    
            page$(element).remove();
        } catch (err) {
            console.log("HTML Element could not be removed")
        }
    });
}

async function scrapeBodyHtml(productUrl, site) {
    try {
        const html = await request.get(productUrl);
        const $ = await cheerio.load(html);

        let bodyHtml = await $(site.bodyHtmlSelector).prop('outerHTML');
        return bodyHtml;
    } catch (err) {
        console.log("body_html could not be scraped. Please check site status or CSS selectors")
    }
}

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}


module.exports = {scrapeProductUrls: scrapeProductUrls, body_html}