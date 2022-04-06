const fetch = require('node-fetch');
const cheerio = require('cheerio');
const request = require('request-promise');
const axios = require('axios');

var siteUrl = 'https://kaleco.ca/'

let count = 0;
let urls = [];

let baseUrl = "https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=1&per_page=180&sort_by=popularity_score&sort_order=desc&categories[]=11ea7aa7c1810cefae500cc47a2ae330&include=images,media_files&excluded_fulfillment=dine_in";



let options = {
    method: 'GET',
    qs: {
        page: '1',
        per_page: '180',
        sort_by: 'popularity_score',
        sort_order: 'desc',
        'categories^\[^\]': '11ea7aa7c1810cefae500cc47a2ae330',
        include: 'images,media_files',
        excluded_fulfillment: 'dine_in'
    },
};

fetch(baseUrl, options)
    .then(res => res.json())
    .then(json =>{

       // console.log(json.meta);

        const result = Object.values(json.data).map(item =>{      //item (is current value)

            count++;


            const id = item.id;
            const title = item.name;
            const url = item.site_link;
            const product_type = item.product_type;
            const original_price = item.price.high_subunits;
            const images = item.images;
            const created_at = item.created_date;
            const updated_date = item.updated_date;
            const is_on_sale = item.on_sale;
            const rating = item.avg_rating_all;
            return {id,title,url,product_type,original_price,images,created_at,updated_date,is_on_sale,rating};


        });

        //console.log(result);
        //console.log(`Total number of items scraped: ${count}`);

    })


    .catch(err => console.error('error found:' + err));


//getting sizes

// let sizes = $('select > option:not([disabled]), option[value]')
//
// const keys  = Object.keys(sizes);
//
// keys.forEach((key,index) => {
//    sizes[key];
// });


// async function getSizes (productUrl){
//     axios.get(productUrl).then((res)=>{
//            const $ = cheerio.load(res.data);
//            console.log($('body').html());
//         });
// }
//
//
// var testUrl = 'https://kaleco.ca/product/V-NeckTop/375';
//
//
// getSizes(testUrl);
//
//
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }