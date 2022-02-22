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
const product_urls = []

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
            data.available = await getInStock(json);
            data.variants = await getVariants(json);
            data.images = await getImages(json);
            data.tags = await getTags(json);
            // data.body_html = await scrapeBodyHtml(json);
            
            await result.push(data);
        }
    }

    await console.log(result);
    await console.log("Number of items scraped: " + result.length);

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

async function getVendor(productJson) {
    return productJson['brand']['title'];
}

async function getVariants(productJson) {
    let cleanVariants;



    async function getVariantId(i) {
       return productJson['variants'][i]['id']; 
    }

    async function getVariantSKU(i) {
        return productJson['variants'][i]['sku'];
    }

    async function getVariantPrice(i) {
        return productJson['variants'][i]['price']['price_money_without_currency']; //price x.xx
    }

    async function getVariantTitle(i) {
        return productJson['variants'][i]['title'];//title
    }

    async function getVariantAvailable(i) {
        return productJson['variants'][i]['stock']['available']//available
    }

    async function getVariantCompPrice(i) {
        return productJson['variants'][i]['price']['compare_at_price'];//compare price
    }

    async function scrubVariants() {
        cleanVariants = [];
        
        async function getVariantSize(title) {
            let variantSize;
            let sizeString;
        
            title = title.split(',');
            sizeString = title[1].replace('"', '').replace('\"', '');

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
            compare_at_price : productJson['variants'][key]['price']['compare_at_price'],
        }));



        // for(let i = 0; i < productJson['variants'].length; i++) {
        //     cleanVariants[i]['id'] = await getVariantId(i);
        //     cleanVariants[i]['sku'] = await getVariantSKU(i); 
        //     cleanVariants[i]['price'] = await getVariantPrice(i);
        //     cleanVariants[i]['size'] = await getVariantSize(productJson['variants'][i]['title']);//size
        //     cleanVariants[i]['title'] = await getVariantTitle(i);
        //     cleanVariants[i]['available'] = await getVariantAvailable(i)
        //     cleanVariants[i]['compare_at_price'] = await getVariantCompPrice(i)
        // }
        
        //console.log(cleanVariants);
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

async function scrapeBodyHtml(productJson) {
    const url = await getUrl(productJson);
    const html = await request.get(url);
    const $ = await cheerio.load(html);
    
    let bodyHtml = $("body").html();

    return bodyHtml;
}

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

main();