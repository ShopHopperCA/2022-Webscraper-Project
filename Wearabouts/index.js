/* Get options, colors, sizes*/

const request = require('request-promise');
const cheerio = require('cheerio');

const url = 'http://127.0.0.1:5500/Wearabouts/dresses-test.html'
const descriptionUrl = 'https://wearabouts.ca/product/fig-ws-etosha-dress/'

const colors = [];
const sizes = []

async function scrapeProductPage() {
    const html = await request.get(descriptionUrl);
    const $ = await cheerio.load(html);
    await sleep(1000);

    const colorElement = $("#pa_color");
    const sizeElement = $("#pa_size option");

    selectScraper($, sizeElement, sizes);
}

async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

function selectScraper($, optionElement, optionArray) {
    optionElement.each((index, element) => {
        if(index !== 0) {
            const option = $(element).text();

            optionArray.push(option);
        }
    });
}


scrapeProductPage();

