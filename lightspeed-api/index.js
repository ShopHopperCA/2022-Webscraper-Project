const fetch = require('node-fetch');
const request = require('request-promise')
const cheerio = require('cheerio');

const fossellos = require('./fosellos_products');


const data = {};
const product_urls = []

const fossellos_urls = fossellos.scrapeProductTitles();

async function main() {
    product_urls.push(await fossellos_urls)
    await console.log(product_urls)
}

/* UTILITY FUNCTIONS */

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

main();



