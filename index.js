const request = require("request-promise");
const cheerio = require('cheerio');

const url = "https://wearabouts.ca/product-category/women";
let finalres = new Array();

async function scrapeMain() {
    
    let result;
    let end_page;
    
    //get amount of pages
    end_page = await get_pagination_end(url);

    //sleep to limit requests
    await sleep(1000)

    //pagination loop
    for(let i = 1; i <= end_page; i++){
      
    const html = await request.get(url+'/page/'+ i +'/');
    const $ = await cheerio.load(html);

     result = $('li.product-type-variable').map((index,element) =>{
        
        const titleElement = $(element).find(".woocommerce-loop-product__title");
        const urlElement = $(element).find(".woocommerce-loop-product__link");
        
        const id = $(element).find(".add_to_cart_button").attr('data-product_id');
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
  console.log(finalres.length)
  console.log(finalres);
  return result;
}

/*
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
        
        //get tag urls to find vendor and product type
        let tag_urls = [];
        $(".posted_in").find('a').each((index,element) => 
        {
            const t_url = $(element).attr('href')
            tag_urls.push(t_url);
        });
        
        let vendor_index;
        for(let i = 0; i <tag_urls.length;i++){
          if(tag_urls[i].indexOf("brand") != -1){
            vendor_index = i;
          }
        }
          
        //vendor
        if(vendor_index == undefined)
        {
            item.vendor = "N/A";
        }
        else
        {
            item.vendor = tags[vendor_index];
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
       
           const size = elem.attributes.attribute_pa_size;
           const colors = elem.attributes.attribute_pa_color;
       
           const position = i;
            i++;
       
           const available = elem.is_in_stock;
           const compare_at_price = elem.display_regular_price;

       
           return{id,sku,grams,price,size,colors,position,available, compare_at_price};
            
        });
    
        //images
        item.images = $('.woocommerce-product-gallery__image').map((index,element) =>{
            
            const src = $(element).find("a").find("img").attr("src");
            const width = $(element).find("a").find("img").attr("width");
            const height = $(element).find("a").find("img").attr("height");
            const position = index + 1;
       
            return{src,height,width,position};
        }).get();
      
      
    //body html
    item.body_html = $(".woocommerce-product-details__short-description").html();
      
    //product_type
    let pt_index;
    for(let i = 0; i <tag_urls.length;i++){
      if(tag_urls[i].indexOf("brand") == -1){
        pt_index = i;
        break;
      }
    }

    item.product_type = tags[pt_index];
      
    //updated time
    item.updated_at = $('meta[property="article:modified_time"]').attr('content');
      
    //colors
    item.colors = $('.woocommerce-product-attributes-item--attribute_pa_color').find('.woocommerce-product-attributes-item__value').text().trim().split(',');
 
    //price
    item.original_price = $('div.summary.entry-summary > p > span > bdi').text().replace('$','').replace('.','');
      
        
      return item;
    })
    )
}

*/

//limit number of requests
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}

//function to get how many pages will needed to be scraped
async function get_pagination_end(url)
{
    const html = await request.get(url);
    const $ = await cheerio.load(html);

    const last_page = $(".page-numbers li:nth-last-child(2)").text();

    return last_page;
}


//main function to call all scraping functions
async function main()
{
    const item_title_and_url = await scrapeMain();
    //const item_info = await scrapeSecondary(item_title_and_url);
    //console.log(item_info);
}

main();