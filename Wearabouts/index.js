const request = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://wearabouts.ca/product-category/women/dresses-and-skirts/'
const descriptionUrl = 'https://wearabouts.ca/product/fig-ws-etosha-dress/'

async function getHtml() {
    const htmlResult = await request.get(descriptionUrl);
    const $ = await cheerio.load(htmlResult)

    console.log(htmlResult);
}

getHtml();

