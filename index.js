//const request = require("request-promise");
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const clothes_url = "https://wearabouts.ca/product-category/women";
const shoes_url = "https://wearabouts.ca/product-category/womens-footwear";

let finalres = [];

async function scrapeMain(url,page) {
    
    let result;
    let end_page;
    
    //get amount of pages
    end_page = await get_pagination_end(url,page);

    //sleep to limit requests
    await sleep(1000);

    //pagination loop
    for(let i = 1; i <= end_page; i++){
    
    
    await page.goto(url +'/page/'+ i +'/');
    const html = await page.content();
    const $ = await cheerio.load(html);
   

    result = $('li.product-type-variable').map((index,element) =>{
        
        const titleElement = $(element).find(".woocommerce-loop-product__title");
        const urlElement = $(element).find(".woocommerce-loop-product__link");
        
        const id = $(element).attr("class").split(" ")[2].split("-")[1];
        const title = titleElement.text();

        let business_name = "";
        if(i == 1)
        {
            business_name = $("title").text().split("-")[1].trim();
        }
        else
        {
            business_name = $("title").text().split("-")[2].trim();
        }

        const url = urlElement.attr('href');

        return{id,title,business_name,url};
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
       let tags = [];
        $(".posted_in").find('a').each((index,element) => 
        {
            const tag = $(element).text()
            tags.push(tag);
        });
        
        //get tag urls to find vendor and product type
        let tag_urls = [];
        $(".posted_in").find('a').each((index,element) => 
        {
            const t_url = $(element).attr('href')
            tag_urls.push(t_url);
        });
        
        let vendor_index;
        for(let j = 0; j <tag_urls.length;j++){
          if(tag_urls[j].indexOf("brand") != -1){
            vendor_index = j;
          }
        }
          
        //vendor
        if(vendor_index == undefined)
        {
            item[i].vendor = "N/A";
        }
        else
        {
            item[i].vendor = tags[vendor_index];
        }
    

        //insert tags into JSON
        item[i].tags = tags;
      
        //variant
        const v = JSON.parse($(".cart").attr("data-product_variations"));
        let index = 1;
        item[i].variants = Object.values(v).map(elem => {
           const id = elem.variation_id;
           const sku = elem.sku;
           const grams = elem.weight;
           const price = elem.display_price;
       
           const size = elem.attributes.attribute_pa_size;
           const colors = elem.attributes.attribute_pa_color;
       
           const position = index;
            index++;
       
           const available = elem.is_in_stock;
           const compare_at_price = elem.display_regular_price;

       
           return{id,sku,grams,price,size,colors,position,available, compare_at_price};
            
        });
    
        //images
        item[i].images = $('.woocommerce-product-gallery__image').map((index,element) =>{
            
            const src = $(element).find("a").find("img").attr("src");
            const width = $(element).find("a").find("img").attr("width");
            const height = $(element).find("a").find("img").attr("height");
            const position = index + 1;
       
            return{src,height,width,position};
        }).get();
      
      
    //body html
    item[i].body_html = $(".woocommerce-product-details__short-description").html();
      
    //product_type
    let pt_index;
    for(let j = 0; j <tag_urls.length;j++){
      if(tag_urls[j].indexOf("brand") == -1){
        pt_index = j;
        break;
      }
    }

    item[i].product_type = tags[pt_index];
      
    //updated time
    item[i].updated_at = $('meta[property="article:modified_time"]').attr('content');
      
    //colors
    item[i].colors = $('.woocommerce-product-attributes-item--attribute_pa_color').find('.woocommerce-product-attributes-item__value').text().trim().split(',');
 
    //price
    const price = $('div.summary.entry-summary > p > span > bdi').text().replace('$','').replace('.','');
    item[i].original_price = price;
      
    }

    return item;
}

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


//main function to call all scraping functions
async function main()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    //scrape clothing
    const clothing_title_and_url = await scrapeMain(clothes_url,page);
    const clothing_info = await scrapeSecondary(clothing_title_and_url,page);
    console.log(clothing_info);
    console.log(clothing_info.length);

    //scrape shoes
    const shoes_title_and_url = await scrapeMain(shoes_url,page);
    const shoes_info = await scrapeSecondary(shoes_title_and_url,page);
    console.log(shoes_info);
    console.log(shoes_info.length);

}

main();