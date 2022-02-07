const request = require('request-promise');
const cheerio = require('cheerio');
//const baseUrl = 'https://www.fossellos.com/shop/';

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