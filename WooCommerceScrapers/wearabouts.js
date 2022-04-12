const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

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
        
        //sleep to limit requests
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
            item[i].vendor = "";
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
           let price = elem.display_price.toString().replace(".","");
            
           if(elem.display_price.toString().indexOf(".") == -1)
           {

                price = price + "00";
           }
       
       
           const size = elem.attributes.attribute_pa_size;
           let color = elem.attributes.attribute_pa_color;

           if(color == undefined)
           {
                color = "";
           }
       
           const position = index;
            index++;
       
           const available = elem.is_in_stock;
           let compare_at_price = elem.display_regular_price.toString().replace(".","");

           if(elem.display_regular_price.toString().indexOf(".") == -1)
           {

               compare_at_price = compare_at_price + "00";
           }

       
           return{id,sku,price,size,color,position,available, compare_at_price};
            
        });
    
        //images
        item[i].images = $('.woocommerce-product-gallery__image').map((index,element) =>{
            
            const src = $(element).find("a").find("img").attr("data-large_image");
            const width = $(element).find("a").find("img").attr("data-large_image_width");
            const height = $(element).find("a").find("img").attr("data-large_image_height");
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
    item[i].compare_at_price = $('div.summary.entry-summary > p > span > bdi').text().replace('$','').replace('.','');
    
    item[i].original_price = item[i].compare_at_price;

    if(item[i].original_price.length == 0)
    {
        item[i].original_price = $('div.summary.entry-summary > p > ins > span > bdi').text().replace('$','').replace('.','');
        item[i].compare_at_price = $('div.summary.entry-summary > p > del > span > bdi').text().replace('$','').replace('.','');
    }
      
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
    const shoes_title_and_url = await scrapeMain(shoes_url,page);
    const items_info = await scrapeSecondary(shoes_title_and_url,page);
    const data = JSON.stringify(items_info);

    await writeJSOn("WooCommerceScrapers/wearabouts.json",data);

}

main();

//write json file
async function writeJSOn(filename, data)
{
     fs.writeFile(filename, data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}