const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const clothing_url = "https://naughtygirlessentials.com/product-category/clothing/";
const lingerie_url = "https://naughtygirlessentials.com/product-category/lingerie/";
const bra_url = "https://naughtygirlessentials.com/product-category/bras/";
const underwear_url = "https://naughtygirlessentials.com/product-category/panties/";

let finalres = new Array();

async function scrapeMain(url,page) {
    
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
           let price = elem.display_price.toString().replace(".","");
            
           if(elem.display_price.toString().indexOf(".") == -1)
           {

                price = price + "00";
           }
       
           const size = elem.attributes.attribute_pa_sizes;
           let colors = elem.attributes.attribute_pa_colors;
           let metal_color = elem.attributes['attribute_metal-color'];

           if(colors == undefined && metal_color == undefined)
           {
                colors = "";
           }
           else if(colors == undefined && metal_color != undefined)
           {
                colors = metal_color;
           }
       
           const position = index;
            index++;
       
           const available = elem.is_in_stock;
           let compare_at_price = elem.display_regular_price.toString().replace(".","");

           if(elem.display_regular_price.toString().indexOf(".") == -1)
           {

               compare_at_price = compare_at_price + "00";
           }

       
           return{id,price,size,colors,position,available, compare_at_price};
            
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
    item[i].product_type = $(".woocommerce-breadcrumb a:nth-child(4)").text();

    //colors
    item[i].colors = $('.woocommerce-product-attributes-item--attribute_pa_colors').find('.woocommerce-product-attributes-item__value').text().trim().split(',');
    //if color is empty set solors to empty array
    if(item[i].colors[0] == "")
    {
        item[i].colors = [];
    }

    //prices
    item[i].compare_at_price = $('.elementor-widget-woocommerce-product-price > div > p > span > span > bdi').text().replace('$','').replace('.','').trim();

    item[i].original_price = item[i].compare_at_price;
    
    if(item[i].original_price.length == 0)
    {
        item[i].original_price =  $('.elementor-widget-woocommerce-product-price > div > p > span > ins > span > bdi').text().replaceAll('$','').replaceAll('.','').trim();
        item[i].compare_at_price = $(".elementor-widget-woocommerce-product-price > div > p > span > del > span > bdi").text().replaceAll('$','').replaceAll('.','').trim();
    }
    else if(item[i].original_price.length > 0 && item[i].original_price.indexOf('$')>-1)
    {
        item[i].original_price = $('.elementor-widget-woocommerce-product-price > div > p > span > span:nth-child(1) > bdi').text().replaceAll('$','').replaceAll('.','').trim();
        item[i].compare_at_price = $('.elementor-widget-woocommerce-product-price > div > p > span > span:nth-child(2) > bdi').text().replaceAll('$','').replaceAll('.','').trim();
    }

    }
    return item;
}


async function main()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    //scrape products
    const clothing_title_and_url = await scrapeMain(clothing_url,page);
    const lingerie_title_and_url = await scrapeMain(lingerie_url,page);
    const bra_title_and_url = await scrapeMain(bra_url,page);
    const uw_title_and_url = await scrapeMain(underwear_url,page);
    const products_info = await scrapeSecondary(uw_title_and_url,page);
    const cleaned_info = await removeDuplicates(products_info);
    const data = JSON.stringify(cleaned_info);

    await writeJSOn("WooCommerceScrapers/nge.json",data);
  
}

main();


//---------------------------------------------------utility functions
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

//function for removing duplicate products
async function removeDuplicates(json)
{
    var final = [];
    json.forEach(function(item) {
        var unique = true;
        final.forEach(function(item2) {
            if (item.id== item2.id) 
            {
                unique = false;
            }
        });
        if (unique)
        {
            final.push(item);
        }
    });
    return final;
}