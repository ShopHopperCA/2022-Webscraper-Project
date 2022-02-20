const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const url = "https://alpacashop.ca/womens-alpaca-apparel/";

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
    
    
    await page.goto(url +'?page='+ i);
    const html = await page.content();
    const $ = await cheerio.load(html);
   

    result = $('li.product').map((index,element) =>{
        
        const titleElement = $(element).find(".card-title");
        
        const id = $(element).find(".quickview").attr("data-product-id");

        const title = titleElement.find('a').text();

        const business_name = $("title").text().split('|')[0].split('s')[1];

        const url = titleElement.find('a').attr('href');

        const vendor = business_name;

        return{id,title,business_name,url,vendor};
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
        
        
        //get sizes and colors to make variants
        let sizes = [];
        $(".form-option-variant").each((index,element) => 
        {
            const s = $(element).text();
            if(s != '')
            {
            sizes.push(s);
            }
        });


        let colors = [];
        $(".form-option-variant--color").each((index,element) => 
        {
            const c = $(element).attr("title");
            colors.push(c);
        }); 

        //variants
        item[i].variants = await get_variants(item[i].id, colors, sizes) 
    
        //images
        item[i].images = $('.productView-thumbnail').map((index,element) =>{
            
            const src = $(element).find('.productView-thumbnail-link').attr("href");
            const position = index + 1;
       
            return{src,position};
        }).get();
      
       
    //body html
    item[i].body_html = $("#description-content").html();
      
    //product_type
    item[i].product_type = $(".breadcrumbs li:nth-child(2)").text().trim();
         
    //colors
    item[i].colors = colors;
 
    //price
    const price = $('div.productView-price > div > span').text().replace('$','').replace('.','');
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

    const last_page = $(".pagination-list li:nth-last-child(2)").text().trim();

    return last_page;
}

async function get_variants(pid,colors,sizes)
{
    let variants=[];

    if(colors.length > 0 && sizes.length == 0)
    {
        for(var i = 0; i < colors.length; i++){
        const color = colors[i];
        const size = null;
        variants.push({size,color});}
    }

    else if(colors.length == 0 && sizes.length > 0)
    {
	    for(var i = 0; i < sizes.length; i++){
    	    	const color = null;
    		    const size = sizes[i];
    		    variants.push({size,color});}
    }

    else if(colors.length > 0 && sizes.length > 0)
    {
	    for(var i = 0; i < sizes.length; i++){
    		    const size = sizes[i];
    		    for(var j = 0; j < colors.length; j++){
    			    const color = colors[j];
    		    	variants.push({size,color});
		    }
	    }
    }

    return variants;
}


//main function to call all scraping functions
async function main()
{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    //scrape clothing
    const item_title_and_url = await scrapeMain(url,page);
    const item_info = await scrapeSecondary(item_title_and_url,page);
    //console.log(item_info);
    //console.log(item_info.length);
    // convert JSON object to string
    const data = JSON.stringify(item_info);

    // write JSON string to a file
    fs.writeFile('alpaca.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

main();
