const fetch = require('node-fetch');
const request = require('request-promise')
const cheerio = require('cheerio');
fs = require('fs');

const fossellos = require('./fosellos_products');

const result = [];
const product_urls = []

const fossellos_urls = fossellos.scrapeProductTitles();

async function main() {
    product_urls.push(await fossellos_urls)

    for(var i = 0; i < product_urls.length; i++) {
        for(var j = 0; j < product_urls[i].length; j++) {
            
            var data = {}
            let response = await fetch(product_urls[i][j])
            //await console.log(response)
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

    await console.log(result);
    //Write to output file
    //fs.writeFileSync('./outputJson.json', JSON.stringify(result));
    
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