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

    fetch(product_urls[0][0], {
        "method": "GET",
        "headers": {}
    }).then(response => {
        console.log(response);
    })
}

/* API FUNCTIONS */

async function getTitle(productJson) {
    
}

async function getId(productJson) {

}

async function getBodyHtml() {

}

async function getVendor(productJson) {

}

async function getProductType(productJson) {

}

async function getTags(productJson) {

}

async function getVariants(productJson) {

}

async function getImages(productJson) {

}

/* UTILITY FUNCTIONS */

//Stops the program for a specified number of seconds
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

main();



