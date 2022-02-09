const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const url = 'https://mostwantedresale.com/collections/clothing?page=';
const url_start = url.split('/')[0] + "/" + url.split('/')[1] + "/" + url.split('/')[2];
let b_name;

// get product urls, because API acessed via producturl.js
async function getProductUrls(url) {

    let urlArray = [];
    const last_page = await get_pagination_end();

    //pagination loop
    for(let i = 1; i <= last_page; i++){

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(url + i);
    const html = await page.content();
    const $ = await cheerio.load(html);

    b_name = $('meta[name="description"]').attr('content');

    $('.product-tile__images').each((index,element) =>{
        const item_url = $(element).find('a').attr('href');
        const absolute_url = url_start+item_url+'.js';
        urlArray.push(absolute_url);
        sleep(1000);    
    });
        sleep(1000); 
    }

    return urlArray;
}

//combine JSON of each product into one JSON object
async function getJSON()
{
    let finalResult;
    const urls = await getProductUrls(url);
    return await Promise.all(
        urls.map(url =>
            fetch(url)
                .then(e => e.json())
            )
        ).then(data => {
            finalResult = data.flat();
            //console.log(finalResult.length)
            return finalResult;
        });
}

//Exteract data needed from JSON
async function extract()
{
    const json_all = await getJSON();
    final = Object.values(json_all).map(elem => {
       const id = elem.id;
       const title = elem.title;
       const business_name = b_name;
       const url = url_start + elem.url 
       const handle = elem.handle;
       const vendor = elem.vendor;
       const tags =elem.tags;
       
       const v = elem.variants;
       const variants = Object.values(v).map(elem => {
        const id = elem.id;
        const sku = elem.sku;
        const price = elem.price;
        const sizes = elem.options[0];
        const title = elem.title;
        const option1 = elem.option1;
        const option2 = elem.option2;
        const option3 = elem.option3;
        const taxable = elem.taxable;
        const available = elem.available;
        const compare_at_price = elem.compare_at_price;
        const requires_shipping = elem.requires_shipping;
       
        return{id,sku,price,sizes,title,option1,option2,option3,taxable,available,compare_at_price,requires_shipping};
             
         });
       
       const imgs = elem.images;
      
       const images = imgs.map((element,index) =>{
            
        const src = element;
   
            return{src};
        });

       const options = elem.options;
       const body_html = elem.description;
       const created_at = elem.created_at;
       const product_type = elem.type;
       const published_at = elem.published_at;
       const colors = [];
       const compare_at_price = elem.compare_at_price;
       const original_price = elem.price;
       const sizes = elem.options[0].values;

       return {id,title,business_name,url,handle,vendor,tags,variants,images,options,body_html,created_at,product_type,published_at,colors,compare_at_price,original_price,sizes};
         });

         console.log(final);
         return final;
    
}


//main function to get JSON Data
async function main()
{
    const JSON_data = await extract();
}

//call main
main()


//utility functions

//function to limit requests
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

//get pagination end from first page
async function get_pagination_end()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(url + 1);
    const html = await page.content();
    const $ = await cheerio.load(html);

    const pagination_end = $(".pagination__item:nth-last-child(2)").text();
    return pagination_end;
}


