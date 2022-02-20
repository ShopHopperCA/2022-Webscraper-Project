const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://www.soledoc.ca/product-category/womens-sandals";
let finalres = new Array();

async function scrapeMain(page) {
    
    let result;
    
    //get last page
    let end_page;
    end_page = await get_pagination_end(url,page);
    await sleep(1000);
  
    //pagination loop
    for(let i = 1; i <= end_page; i++){
      
    await page.goto(url +'/page/'+ i +'/');
    const html = await page.content();
    const $ = await cheerio.load(html);
      
    result = $('.product-type-variable').map((index,element) =>{
        
        const titleElement = $(element).find('.gridview').find(".woocommerce-loop-product__title");
        const urlElement = $(element).find('.gridview').find(".woocommerce-loop-product__link");
        
        const id = $(element).attr("class").split(" ")[6].split("-")[1];;
        const title = titleElement.text();
        const business_name = $("title").text().split("-")[1].trim(); 
        const url = urlElement.attr('href');
        const vendor = business_name;
        return{id,title,business_name,url,vendor};
    }).get();
        finalres.push(result);
    }
  
  finalres = finalres.flat();
  return finalres;
}


async function scrapeSecondary(item,page)
{
    
    for(var i=0;i<item.length;i++){

        await page.goto(item[i].url)
        const html = await page.content();
        const $ = await cheerio.load(html);
        await sleep(1000);

        //scrape tags
        
      
        //variant
        const v = JSON.parse($(".cart").attr("data-product_variations"));
        let index = 1;
        item[i].variants = Object.values(v).map(elem => {
           const id = elem.variation_id;
           //const sku = elem.sku;
           //const grams = elem.weight;
           const price = elem.display_price;
       
           const size = elem.attributes['attribute_pa_women-size'];
           const colors = elem.attributes.attribute_pa_color;
       
           const position = index;
            index++;
       
           const available = elem.is_in_stock;
           const compare_at_price = elem.display_regular_price;

       
           return{id,price,size,colors,position,available, compare_at_price};
            
        });
    
        //images
        item[i].images = $('.zoom').map((index,element) =>{
            
            const src = $(element).find("a").attr('href');
            const position = index + 1;
       
            return{src,position};
        }).get();
      
      
    //body html
    item[i].body_html = $(".woocommerce-Tabs-panel--description").html();
      
    //product_type
     let categories = [];
     $(".posted_in").find('a').each((index,element) => 
     {
         const tag = $(element).text()
         categories.push(tag);
     });

     item[i].product_type = categories[0];

    //colors
    item[i].colors = $('.woocommerce-product-attributes-item--attribute_pa_color').find('.woocommerce-product-attributes-item__value').text().trim().split(',');
    
    //if color is empty set solors to empty array
    if(item[i].colors[0] == "")
    {
        item[i].colors = [];
    }

    //price
    item[i].original_price = $('div.col-12.col-lg-6.col-xl-7 > div > p > span > bdi').text().replace('$','').replace('.','');
      
    }
    return item;
}


async function main()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const item_title_and_url = await scrapeMain(page);
    const item_info = await scrapeSecondary(item_title_and_url,page);
    //console.log(item_info);
    //console.log(item_info.length);
    const data = JSON.stringify(item_info);

    // write JSON string to a file
    fs.writeFile('soledoc.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

main();



//limit number of requests
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

//function to get how many pages will needed to be scraped
async function get_pagination_end(url,page)
{

    await page.goto(url);
    const html = await page.content();
    const $ = await cheerio.load(html);

    const last_page = $(".page-numbers li:nth-last-child(2)").text();

    return last_page;
}