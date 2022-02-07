const fetch = require('node-fetch');
const request = require('request-promise')
const cheerio = require('cheerio');
fs = require('fs');

const so = require('./site_objects');
const url_scraper = require('./product_url_scrapper');

const result = [];
const product_urls = []

const RED_TOP_URLS = url_scraper.scrapeProductUrls(
    so.siteObjects().RED_TOP_FOOTWEAR.baseUrl,
    so.siteObjects().RED_TOP_FOOTWEAR.paginationSelector,
    so.siteObjects().RED_TOP_FOOTWEAR.productListSelector,
    so.siteObjects().RED_TOP_FOOTWEAR.productLinkSelector,
    so.siteObjects().RED_TOP_FOOTWEAR.removeNodes);

const FOSSELLOS_URLS = url_scraper.scrapeProductUrls(
    so.siteObjects().FOSSELLOS.baseUrl,
    so.siteObjects().FOSSELLOS.paginationSelector,
    so.siteObjects().FOSSELLOS.productListSelector,
    so.siteObjects().FOSSELLOS.productLinkSelector
)

const ENVY_URLS = url_scraper.scrapeProductUrls(
    so.siteObjects().ENVY_APPAREL.baseUrl,
    so.siteObjects().ENVY_APPAREL.paginationSelector,
    so.siteObjects().ENVY_APPAREL.productListSelector,
    so.siteObjects().ENVY_APPAREL.productLinkSelector
)

const HONEST_URLS = url_scraper.scrapeProductUrls(
    so.siteObjects().HONEST_BOUTIQUE.baseUrl,
    so.siteObjects().HONEST_BOUTIQUE.paginationSelector,
    so.siteObjects().HONEST_BOUTIQUE.productListSelector,
    so.siteObjects().HONEST_BOUTIQUE.productLinkSelector
)

async function main() {
    product_urls.push(await FOSSELLOS_URLS);
    product_urls.push(await RED_TOP_URLS);
    product_urls.push(await ENVY_URLS);
    product_urls.push(await HONEST_URLS);

    for(var i = 0; i < product_urls.length; i++) {
        for(var j = 0; j < product_urls[i].length; j++) {
            
            var data = {}
            let response = await fetch(product_urls[i][j])

            let json = await response.json();

            data.id = await getId(json);
            data.title = await getTitle(json);
            data.url = await getUrl(json);
            data.description = await getDescription(json);
            data.vendor = await getVendor(json);
            data.price = await getPrice(json);
            data.available = await getInStock(json);
            data.variants = await getVariants(json);
            data.images = await getImages(json);
            
            result.push(data);
        }
    }

    //await console.log(results);

    //Write to output file
    fs.writeFileSync('./outputJson.json', JSON.stringify(result));
    
}

/* API FUNCTIONS */

async function getTitle(productJson) {
    return productJson['title'];
}

async function getId(productJson) {
    return productJson['id'];
}

async function getBodyHtml() {

}

async function getVendor(productJson) {
    return productJson['brand']['title'];
}

async function getProductType(productJson) {

}

async function getTags(productJson) {

}

async function getVariants(productJson) {
    return productJson['variants']
}

async function getImages(productJson) {
    return productJson['images']
}

async function getPrice(productJson) {
    let priceString = productJson['price']['price_money_without_currency'];
    priceString = priceString.replace('.', '');
    
    return priceString;
}

async function getDescription(productJson) {
    return productJson['description']
}

async function getInStock(productJson) {
    return productJson['stock']['available']
}

async function getUrl(productJson) {
    return productJson['url']
}

/* UTILITY FUNCTIONS */

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

main();