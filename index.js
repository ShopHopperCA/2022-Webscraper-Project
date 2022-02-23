const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const tops_url = "https://www.floralfawnboutique.com/tops?page=100";
const bottoms_url = "https://www.floralfawnboutique.com/bottoms?page=100";
const dresses_url = "https://www.floralfawnboutique.com/dresses-rompers?page=100";
const jackets_url = "https://www.floralfawnboutique.com/jackets-1?page=100";
const swim_url = "https://www.floralfawnboutique.com/swim?page=100";

async function scrapeMain(url,page) {
    
    let result;
        
    await page.goto(url);
    const html = await page.content();
    const $ = await cheerio.load(html);
   
    

    result = $('li[data-hook="product-list-grid-item"]').map((index,element) =>{
        
        //placeholder id until we can get JSON from project page
        const id = index;

        const title = $(element).find('div._1bfj5 > h3').text();

        const business_name = $("title").text().split('|')[1].trim();

        const url = $(element).find('._3mKI1').attr('href');

        return{id,title,business_name,url};
    }).get();
       
  return result;
}

async function scrapeSecondary(item,page)
{
    
    for(var i=0;i<item.length;i++){

        await page.goto(item[i].url)
        const html = await page.content();
        const $ = await cheerio.load(html);
        await sleep(1000);

        json_pindex = 'productPage_CAD_' + item[i].url.split('/')[4];

      
        data = $('script[id = "wix-warmup-data"]').html();
        data = JSON.parse(data);
        product = data.appsWarmupData['1380b703-ce81-ff05-f115-39571d94dfcd'][json_pindex].catalog.product;
        v = product.productItems;
        img = product.media;

        //relpace placeholder id
        item[i].id = product.id;
        
        //vendor
        item[i].vendor = product.brand;

        let index = 1;

        //variants
        item[i].variants = Object.values(v).map(elem => {
            const id = elem.id;
            const price = product.formattedDiscountedPrice.replace("C$","").replace(".","");

            //size and color
            let color_index;
            let size_index;
            let size;
            let color;

            if(elem.optionsSelections.length == 1)
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
                size_index = elem.optionsSelections[1];
                color_index = elem.optionsSelections[0];

                for(let i = 0; i < product.options[1].selections.length;i++)
                {
                    if(product.options[1].selections[i].id == size_index)
                    {
                        size = product.options[1].selections[i].description;
                    }
                }


                for(let i = 0; i < product.options[0].selections.length;i++)
                {
                    if(product.options[0].selections[i].id == color_index)
                    {
                        color = product.options[0].selections[i].description;
                    }
                }
            }
            
            const position = index;
            index++;
            
            let available;
            if(elem.inventory.status == "in_stock")
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

        //colors
        if(product.options.length == 2)
        {
            item[i].colors = product.options[0].selections;
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

    //scrape tops
    const tops_title_and_url = await scrapeMain(tops_url,page);
    const tops_info = await scrapeSecondary(tops_title_and_url,page);
    const data_t = JSON.stringify(tops_info);

    await writeJSOn("floralfawn_tops.json",data_t);

    //scrape bottoms
    const bottoms_title_and_url = await scrapeMain(bottoms_url,page);
    const bottoms_info = await scrapeSecondary(bottoms_title_and_url,page);
    const data_b = JSON.stringify(bottoms_info);

    await writeJSOn("floralfawn_bottoms.json",data_b);

    //scrape jackets
    const jackets_title_and_url = await scrapeMain(jackets_url,page);
    const jackets_info = await scrapeSecondary(jackets_title_and_url,page);
    const data_j = JSON.stringify(jackets_info);

    await writeJSOn("floralfawn_jackets.json",data_j);

    //scrape dresses
    const dresses_title_and_url = await scrapeMain(dresses_url,page);
    const dresses_info = await scrapeSecondary(dresses_title_and_url,page);
    const data_d = JSON.stringify(dresses_info);

    await writeJSOn("floralfawn_dresses.json",data_d);

    //scrape swimwear
    const swim_title_and_url = await scrapeMain(swim_url,page);
    const swim_info = await scrapeSecondary(swim_title_and_url,page);
    const data_s = JSON.stringify(swim_info);

    await writeJSOn("floralfawn_swim.json",data_s);
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