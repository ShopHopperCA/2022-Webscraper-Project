const request = require("request-promise");
const cheerio = require('cheerio');
const { title } = require("process");

const url = "https://wearabouts.ca/product-category/women/shirts-tops/";

async function scrapeMain() {

    const html = await request.get(url);
    const $ = await cheerio.load(html);
  
    const result = $('.product').map((index,element) =>{

        const titleElement = $(element).find(".woocommerce-loop-product__title");
        const urlElement = $(element).find(".woocommerce-loop-product__link");
    
        const title = titleElement.text();
        const business_name = $("title").text().split("-")[1].trim(); 
        const url = urlElement.attr('href');
        //const vendor = titleElement.text().split("W")[0];
        return{title,business_name,url};
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
        item.tags = tags;
    
        //images
        item.images = $('.woocommerce-product-gallery__image').map((index,element) =>{
            
            const src = $(element).find("a").find("img").attr("src");
            const width = $(element).find("a").find("img").attr("width");
            const height = $(element).find("a").find("img").attr("height");
            const position = index + 1;
       
            return{src,height,width,position};
        }).get();
      
    //options
      
      
    //colors
      
      
    //sizes
      
      
    //updated time
    item.updated_at = $('meta[property="article:modified_time"]').attr('content');
      
      
    //price
    item.original_price = $('div.summary.entry-summary > p > span > bdi').text().replace('$','').replace('.','');
      
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
