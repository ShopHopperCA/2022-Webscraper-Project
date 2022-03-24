const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const ffawn_tops_url = "https://www.floralfawnboutique.com/tops?page=100";
const ffawn_bottoms_url = "https://www.floralfawnboutique.com/bottoms?page=100";
const ffawn_dresses_url = "https://www.floralfawnboutique.com/dresses-rompers?page=100";
const ffawn_jackets_url = "https://www.floralfawnboutique.com/jackets-1?page=100";
const ffawn_swim_url = "https://www.floralfawnboutique.com/swim?page=100";
const Sfox_url = "https://www.stonefoxclothing.com/shop-all-1?page=100";

let c;
let s;
let available;
let color_index;
let size_index;

finalres = [];
async function scrapeMain(url,page) {
    
    let result;
        
    await page.goto(url);
    const html = await page.content();
    const $ = await cheerio.load(html);
   
    result = $("li[data-hook='product-list-grid-item']").map((index,element) =>{
        
        //placeholder id until we can get JSON from project page
        const id = index;

        const title = $(element).find("div[data-hook= 'product-item-product-details']").find("h3").text();

        const business_name = $("title").text().split('|')[1].trim();

        const url = $(element).find("a[data-hook='product-item-container']").attr('href');

        finalres.push({id,title,business_name,url});
        return{id,title,business_name,url};
    }).get();

  return finalres;
}
       
async function scrapeSecondary(item,page)
{
    
    for(var i=0;i<item.length;i++){

        await page.goto(item[i].url)
        const html = await page.content();
        const $ = await cheerio.load(html);
        await sleep(1000);

        json_pindex = 'productPage_CAD_' + item[i].url.split('/')[4];
        is_size_or_color = $("div[data-hook='product-options-inputs'] > div.cell:nth(0)").text();
      
        data = $('script[id = "wix-warmup-data"]').html();
        data = JSON.parse(data);
        product = data.appsWarmupData['1380b703-ce81-ff05-f115-39571d94dfcd'][json_pindex].catalog.product;
        v = product.productItems;
        img = product.media;

        //relpace placeholder id
        item[i].id = product.id;
        
        //vendor
        item[i].vendor = product.brand;

        //variants
        item[i].variants = await get_variants($,v,is_size_or_color)

        //images
        item[i].images = Object.values(img).map(elem => {
            const src = elem.fullUrl;
            const width = elem.width;
            const height =elem.height;
            const position = elem.index + 1;
            return{src,width,height,position};   
         });

        //bodyhtml
        item[i].body_html = product.description

        //product_type
        item[i].product_type = product.productType;
        
        let colors_arr = [];
        //colors
        if(product.options.length == 2)
        {
            for(let i = 0; i < product.options[c].selections.length;i++){
                {
                    if(product.options[c].selections[i].id == color_index)
                    {
                        colors_arr.push(product.options[c].selections[i].description);
                        
                    }
                }
            }
            item[i].colors = colors_arr;
        }
        else
        {
            item[i].colors = []; 
        }

        //price
        item[i].compare_at_price = product.formattedPrice.replace("C$","").replace(".","");

        item[i].original_price = product.formattedDiscountedPrice.replace("C$","").replace(".","");

      
    }

    return item;
}

//limit number of requests
async function sleep(miliseconds)
{
    return new Promise(resolve => setTimeout(resolve,miliseconds));
}


//main function to call all scraping functions
async function main()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    const tops_title_and_url = await scrapeMain(ffawn_tops_url,page);
    const bottoms_title_and_url = await scrapeMain(ffawn_bottoms_url,page);
    const jackets_title_and_url = await scrapeMain(ffawn_jackets_url,page);
    const dresses_title_and_url = await scrapeMain(ffawn_dresses_url,page);
    const swim_title_and_url = await scrapeMain(ffawn_swim_url,page);
    const sfox_title_and_url = await scrapeMain(Sfox_url,page);
    const items_info = await scrapeSecondary(sfox_title_and_url,page);
    const cleaned_info = await removeDuplicates(items_info)

    const data_s = JSON.stringify(cleaned_info);

    await writeJSOn("WixScrapers/wixData.json",data_s);
}

main();


//------------------------------utility functions---------------------------------------//
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

//function to get variant data
async function get_variants($,v, is_size_or_color)
{
    let index = 1;
    const variants = Object.values(v).map(elem => {
        const id = elem.id;
        const price = product.formattedDiscountedPrice.replace("C$","").replace(".","");

        //size and color
        let size;
        let color;
      

        if(elem.optionsSelections.length == 0)
        {
            size = null;
            color = null;
        }
        else if(elem.optionsSelections.length == 1)
        {
            size_index = elem.optionsSelections[0];
            for(let i = 0; i < product.options[0].selections.length;i++)
            {
                if(product.options[0].selections[i].id == size_index)
                {
                    size = product.options[0].selections[i].description;
                }
            }
            
            color = null;
        }
        else
        {
            
            if(is_size_or_color.indexOf("Color")>-1 || is_size_or_color.indexOf("colour")>-1 ||is_size_or_color.indexOf("Colour")>-1)
            {
                s = 1;
                c = 0;
            }
            else
            {
                s = 0;
                c = 1;
            }

            if($(".buttonnext1002411228__content").text() == "Out of Stock")
            {
                s = 1;
                c = 0;
            }

            size_index = elem.optionsSelections[s];
            color_index = elem.optionsSelections[c];
           
            
            for(let i = 0; i < product.options[s].selections.length;i++)
            {
                if(product.options[s].selections[i].id == size_index)
                {
                    size = product.options[s].selections[i].description;
                }
            }


            for(let i = 0; i < product.options[c].selections.length;i++)
            {
                if(product.options[c].selections[i].id == color_index)
                {
                    color = product.options[c].selections[i].description;
                    
                }
            }
        }
        
        const position = index;
        index++;
        
        
        if(elem.inventory.quantity > 0)
        {
            available = true;
        }
        else
        {
            available = false;
        }
        
        const compare_at_price = elem.formattedPrice.replace("C$","").replace(".","");

    
        return{id,price,size,color,position,available, compare_at_price};
         
     });

     return variants
}