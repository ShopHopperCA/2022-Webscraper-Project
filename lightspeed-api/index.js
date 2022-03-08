/* 

index.js - This file is where the scrape product urls function is called and the product data is processed and outputed as JSON.

Important Functions:

main() - This function is where the scraping and data processing are executed.

get[Datapoint] - Each of these functions returns [Datapoint] from the .ajax site gotten from the product url scrape.

*/

const request = require('request-promise');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
fs = require('fs');

const so = require('./site_objects');
const url_scraper = require('./product_url_scrapper');

const result = [];
const product_urls = [];
const body_html = [];

console.time("execution")

async function main() {

    for (var i = 0; i < so.SITE_OBJECTS.length; i++) {
        product_urls.push(await url_scraper.scrapeProductUrls(so.SITE_OBJECTS[i]))
    }

    for(var i = 0; i < product_urls.length; i++) {
        for(var j = 0; j < product_urls[i].length; j++) {

            var data = {}
            let response = await fetch(product_urls[i][j])

            let json = await response.json();

            data.id = await getId(json);
            data.title = await getTitle(json);
            data.business_name = await scrapeBusinessName(json);
            data.url = await getUrl(json);
            data.description = await getDescription(json);
            data.vendor = await getVendor(json);
            data.price = await getPrice(json);
            data.compare_at_price = await getCompareAtPrice(json);
            data.available = await getInStock(json);
            data.variants = await getVariants(json);
            data.images = await getImages(json);
            data.tags = await getTags(json);
            data.body_html = await getBodyHtml(json);
            
            await result.push(data);
        }
    }

    await console.log(result);
    await console.log("Number of items scraped: " + result.length);

    //Write to output file
    fs.writeFileSync('./outputJson.json', JSON.stringify(result, null, 4));
    console.timeEnd("execution");
}

/* API FUNCTIONS */

async function getTitle(productJson) {
    return productJson['title'];
}

async function getId(productJson) {
    return productJson['id'];
}

async function getVendor(productJson) {
    return productJson['brand']['title'];
}

async function getVariants(productJson) {
    let cleanVariants;

    async function scrubVariants() {
        cleanVariants = [];
        
        async function getVariantSize(title) {
            let variantSize;
            let sizeString;
        
            title = title.split(',');
            sizeString = title[0].replace('"', '').replace('\"', '');

            variantSize = sizeString.substring(sizeString.indexOf(' ') + 1)
            return variantSize;
        }
        ``
        await Object.keys(productJson['variants']).forEach(async key => cleanVariants.push({
            id : key,
            sku : productJson['variants'][key]['sku'],
            price : productJson['variants'][key]['price']['price_money_without_currency'],
            size : await getVariantSize(productJson['variants'][key]['title']),
            title : productJson['variants'][key]['title'],
            available : productJson['variants'][key]['stock']['available'],
            compare_at_price : productJson['variants'][key]['price']['price_old_money_without_currency'],
        }));

        return cleanVariants;
    }
    
    return await scrubVariants();
}

async function getTags(productJson) {
    var title = await getTitle(productJson);
    var tags = [];

    tags = title.split(' ');

    return tags;
}

async function getImages(productJson) {
    return productJson['images']
}

async function getPrice(productJson) {
    let priceString = productJson['price']['price_money_without_currency'];
    priceString = priceString.replace('.', '');
    
    return priceString;
}

async function getCompareAtPrice(productJson) {
    try {
        let comparePriceString = productJson['price']['price_old_money_without_currency']    
        comparePriceString = comparePriceString.replace('.', '');

        return comparePriceString;
    } catch (e) {
        return;
    }
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

async function scrapeBusinessName(productJson) {
    const url = await getUrl(productJson);
    startPos = url.indexOf('.');
    endPos = url.indexOf('.', startPos + 1);

    return url.substring(startPos + 1, endPos);

}

async function getBodyHtml(productJson) {
    let url = await getUrl(productJson)
    
    return url_scraper.body_html[url];
}

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

main();