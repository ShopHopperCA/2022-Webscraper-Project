const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const url = "https://naughtygirlessentials.com/product-category/clothing";
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
        
        const titleElement = $(element).find(".woocommerce-loop-product__title");
        const urlElement = $(element).find(".woocommerce-loop-product__link");
        
        const id = $(element).attr("class").split(" ")[2].split("-")[1];;
        const title = titleElement.text();
        const business_name = $("title").text().split("-")[1].trim(); 
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

        //scrape vendor
        item[i].vendor = $('.elementor-post-info__terms-list-item').text();

        //scrape tags
        let tags = [];
        $(".tagged_as").find('a').each((index,element) => 
        {
            const tag = $(element).text()
            tags.push(tag);
        });
        
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
       
           const size = elem.attributes.attribute_pa_sizes;
           const colors = elem.attributes.attribute_pa_colors;
       
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
    item[i].colors = $('.woocommerce-product-attributes-item--attribute_pa_colors').find('.woocommerce-product-attributes-item__value').text().trim().split(',');
 
    //price
    item[i].original_price = $('.elementor-widget-woocommerce-product-price > div > p > span > span > bdi').text().replace('$','').replace('.','');
      
    }
    return item;
}


async function main()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const item_title_and_url = await scrapeMain(page);
    const item_info = await scrapeSecondary(item_title_and_url,page);
    console.log(item_info);
    console.log(item_info.length);
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

    let last_page = $(".page-numbers li:nth-last-child(2)").text();

    if(last_page == '')
    {
        last_page = 1;
    }

    return last_page;
}