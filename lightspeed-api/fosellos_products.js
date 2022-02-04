const request = require('request-promise');
const cheerio = require('cheerio');
const baseUrl = 'https://www.fossellos.com/shop/';

let pageUrl = "";
let productListLength = 0;
let page$;
let pageHtml;

async function main() {

    return await scrapeProductTitles();
}

/* SCRAPER FUNCTIONS */

async function scrapeProductTitles() {
    const html = await request.get(baseUrl);
    const $ = await cheerio.load(html)

    const product_urls = [];
    const paginationEnd = $("div.pagination > ul > li").eq(-2).text();
    let productUrl;
    let productElement;

    for(var i = 1; i <= paginationEnd; i++) {
        await sleep(1000);
        pageUrl = baseUrl + 'page' + i + '.html';
        pageHtml = await request.get(pageUrl);
        page$ = cheerio.load(pageHtml);
        
        productListLength = await page$("div.products-list").children().length;

        for(var j = 0; j < productListLength; j++) {
            productElement = await page$("div.products-list").children().eq(j);
            productUrl = await page$(productElement).find(".product-image-wrapper").attr('href');
            productUrl = productUrl.replace('.html', '.ajax');
            //console.log(productUrl);
            product_urls.push(productUrl);
            
        }
    }

    return product_urls;
}

async function scrapeBodyHtml($) {

}

/* UTILITY FUNCTIONS */

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

module.exports = {scrapeProductTitles}