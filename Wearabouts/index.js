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
    await scrapeProductPage();
    await console.log(data);
}

//Gets all data needed from the product page
async function scrapeProductPage() {
    const html = await request.get(descriptionUrl);
    const $ = await cheerio.load(html);
    await sleep(1000);

    const colorElement = $("#pa_color option");
    const sizeElement = $("#pa_size option");
    const allSelects = $("select");

    data.sizes = selectScraper($, sizeElement, sizes);
    data.colors = selectScraper($, colorElement, colors);
    data.options = await getOptions($, allSelects);
}

//Gets all values for options data point
async function getOptions($, selectElements) {
    const optionArray = [];
    //console.log(selectElements);

    selectElements.each((index, element) => {
        const option = {};

        option.name = $('label[for=' + $(element).attr('id') + ']').text();
        option.values = selectScraper($, $('#' + $(element).attr('id') + ' option'));
        option.position = index + 1;

        optionArray.push(option)
    });
    //console.log(optionArray);
    return optionArray;
    
}



/* UTILITY FUNCTIONS */

//Takes in a select element scrapes all of the values into an array
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

