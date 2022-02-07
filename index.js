const request = require("request-promise");
const cheerio = require('cheerio');

const url = "https://wearabouts.ca/product-category/women/shirts-tops/";

async function scrapeMain() {

    const html = await request.get(url);
    const $ = await cheerio.load(html);
  
  

    const result = $('.product').map((index,element) =>{
        
        const titleElement = $(element).find(".woocommerce-loop-product__title");
        const urlElement = $(element).find(".woocommerce-loop-product__link");
        
        const id = $(element).find(".add_to_cart_button").attr('data-product_id');
        const title = titleElement.text();
        const business_name = $("title").text().split("-")[1].trim(); 
        const url = urlElement.attr('href');
        //const vendor = titleElement.text().split("W")[0];
        return{id,title,business_name,url};
    }).get();

return result;

}


scrapeMain();


async function scrapeSecondary(item_title_and_url)
{
    
    return await Promise.all( item_title_and_url.map(async(item)=>{

        const htmlResult = await request.get(item.url);
        const $ = await cheerio.load(htmlResult);
        await sleep(1000);
        
        //scrape tags
        let tags = [];
        $(".posted_in").find('a').each((index,element) => 
        {
            const tag = $(element).text()
            tags.push(tag);
        });
      
          
        //vendor
        if(tags.length == 3)
        {
          item.vendor = tags[0]
        }
        else
        {
         item.vendor = "N/A";
        }
      
        //insert tags into JSON
        item.tags = tags;
      
        //variant
        const v = JSON.parse($(".cart").attr("data-product_variations"));
        let i = 1;
        item.variants = Object.values(v).map(elem => {
           const id = elem.variation_id;
           const sku = elem.sku;
           const grams = elem.weight;
           const price = elem.display_price;
       
           const sizes = elem.attributes.attribute_pa_size;
           const colors = elem.attributes.attribute_pa_color;
       
           const position = i;
            i++;
       
           const available = elem.is_in_stock;
           const compare_at_price = elem.display_regular_price;

       
           return{id,sku,grams,price,sizes,colors,position,available, compare_at_price};
            
        });
    
        //images
        item.images = $('.woocommerce-product-gallery__image').map((index,element) =>{
            
            const src = $(element).find("a").find("img").attr("src");
            const width = $(element).find("a").find("img").attr("width");
            const height = $(element).find("a").find("img").attr("height");
            const position = index + 1;
       
            return{src,height,width,position};
        }).get();
      
    //options
      
    //body html
    item.body_html = $(".woocommerce-product-details__short-description").html();
      
    //product_type
    if(tags.length == 3)
    {
        item.product_type = tags[1]
    }
    else
    {
       item.product_type = tags[0];
    }
      
    //updated time
    item.updated_at = $('meta[property="article:modified_time"]').attr('content');
      
    //colors
      
    
    //price
    item.original_price = $('div.summary.entry-summary > p > span > bdi').text().replace('$','').replace('.','');
      
      
    //sizes
        
      
          return item;
    })
    )
}

async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

async function main()
{
    const item_title_and_url = await scrapeMain();
    const item_info = await scrapeSecondary(item_title_and_url);
    console.log(item_info);
}

main();