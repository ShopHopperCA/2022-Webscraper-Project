const request = require("request-promise");
const cheerio = require('cheerio');

const url = "https://www.soledoc.ca/product-category/womens-sandals/";

async function scrapeMain() {
    
    let result;
    let end_page;
  
    //pagination loop
    for(let i = 1; i <= 2; i++){
      
    const html = await request.get(url+'/page/'+ i +'/');
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
       
    }
  
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
        
      
        //variant
        const v = JSON.parse($(".cart").attr("data-product_variations"));
        let i = 1;
        item.variants = Object.values(v).map(elem => {
           const id = elem.variation_id;
           const sku = elem.sku;
           const grams = elem.weight;
           const price = elem.display_price;
       
           const size = elem.attributes['attribute_pa_women-size'];
           const colors = elem.attributes.attribute_pa_color;
       
           const position = i;
            i++;
       
           const available = elem.is_in_stock;
           const compare_at_price = elem.display_regular_price;

       
           return{id,sku,grams,price,size,colors,position,available, compare_at_price};
            
        });
    
        //images
        images = $('.zoom').map((index,element) =>{
            
            const src = $(element).find("a").attr('href');
            const position = index + 1;
       
            return{src,position};
        }).get();
      
      
    //body html
    item.body_html = $(".woocommerce-Tabs-panel--description").html();
      
    //product_type
     let categories = [];
     $(".posted_in").find('a').each((index,element) => 
     {
         const tag = $(element).text()
         categories.push(tag);
     });

     item.product_type = categories[0];

    //colors
    item.colors = $('.woocommerce-product-attributes-item--attribute_pa_color').find('.woocommerce-product-attributes-item__value').text().trim().split(',');
 
    //price
    item.original_price = $('div.col-12.col-lg-6.col-xl-7 > div > p > span > bdi').text().replace('$','').replace('.','');
      
        return item;
    })
    )
}


async function main()
{
    const item_title_and_url = await scrapeMain();
    const item_info = await scrapeSecondary(item_title_and_url);
    console.log(item_info);
}

main();



//limit number of requests
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}