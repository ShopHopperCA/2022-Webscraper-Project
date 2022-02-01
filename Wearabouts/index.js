/* Get options, colors, sizes*/

const request = require('request-promise');
const cheerio = require('cheerio');

const url = 'http://127.0.0.1:5500/Wearabouts/dresses-test.html'
const descriptionUrl = 'https://wearabouts.ca/product/fig-ws-etosha-dress/'

const data = {};
const colors = [];
const sizes = [];
const options = [];

//Main function where all lower functions are called
async function main() {
    const html = await request.get(descriptionUrl);
    const $ = cheerio.load(html)

    await scrapeProductPage($);
    await console.log(data);
}

//Gets all data needed from the product page
async function scrapeProductPage($) {
    await sleep(1000);

    const allSelects = $("select");

    data.options = await scrapeOptions($, allSelects);

    //Get colors and sizes (change to seperate function later)
    data.options.forEach((element) => {
        if(element.name === "COLOR" || element.name === "COLORS" || element.name === "COLOUR" || element.name === "COLOURS")
            data.colors = element.values;
        else if(element.name === "SIZE" || element.name === "SIZES")
            data.sizes = element.values;
    })
}

/* DATA POINT FUNCTIONS */

//Gets all values for options data point
async function scrapeOptions($, selectElements) {
    const optionArray = [];

    selectElements.each((index, element) => {
        const option = {};

        option.name = $('label[for=' + $(element).attr('id') + ']').text().toUpperCase();
        option.values = selectScraper($, $('#' + $(element).attr('id') + ' option'));
        option.position = index + 1;

        optionArray.push(option)
    });
    
    return optionArray;
}


/* UTILITY FUNCTIONS */

//Takes in a select option element scrapes all of the values into an array
function selectScraper($, selectElement) {
    selectArray = [];

    selectElement.each((index, element) => {
        if(index !== 0) {
            const option = $(element).text();

            selectArray.push(option);
        }
    });
    return selectArray;
}

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

main();

