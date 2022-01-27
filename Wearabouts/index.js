const request = require('request-promise');
const cheerio = require('cheerio');

const url = 'http://127.0.0.1:5500/Wearabouts/dresses-test.html'
const descriptionUrl = 'http://127.0.0.1:5500/Wearabouts/dresses-description-test.html'

async function getHtml() {
    const htmlResult = await request.get(descriptionUrl);
    const $ = await cheerio.load(htmlResult)

    console.log(htmlResult);
}

getHtml();

