const request = require('request-promise');
const cheerio = require('cheerio');
//const baseUrl = 'https://www.fossellos.com/shop/';

let pageUrl = "";
let productListLength = 0;
let page$;
let pageHtml;

async function main() {

    return await scrapeProductUrls();
}

/* SCRAPER FUNCTIONS */

async function scrapeProductUrls(baseUrl, 
    paginationSelector = "div.pagination > ul > li", 
    productListSelector = "div.products-list", 
    productLinkSelector = ".product-image-wrapper",
    removeNodesSelectors) {
        
    const html = await request.get(baseUrl);
    const $ = await cheerio.load(html)

    const product_urls = [];
    
    let paginationEnd;
    let productUrl;
    let productElement;
    
    //Get pagination end
    try {
        if(typeof paginationSelector === "string")
            paginationEnd = $(paginationSelector).eq(-2).text();
        else if(Number.isInteger(paginationSelector))
            paginationEnd = paginationSelector;
    } catch(err) {
        console.log("Please enter a valid pagination value (Selector or Integer)");
    }


    for(var i = 1; i <= paginationEnd; i++) {
        await sleep(1000);
        pageUrl = baseUrl + 'page' + i + '.html';
        pageHtml = await request.get(pageUrl);
        page$ = cheerio.load(pageHtml);

        if(removeNodesSelectors) {
            removeNodes(page$, removeNodesSelectors);
        }
        
        productListLength = await page$(productListSelector).children().length;

        for(var j = 0; j < productListLength; j++) {
            productElement = await page$(productListSelector).children().eq(j);
            productUrl = await page$(productElement).find(productLinkSelector).attr('href');
            productUrl = productUrl.replace('.html', '.ajax');
            //console.log(productUrl);
            product_urls.push(productUrl);
            
        }
    }

    return product_urls;
}

async function scrapeBodyHtml($) {

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