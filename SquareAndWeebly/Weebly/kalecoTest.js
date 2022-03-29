const fetch = require('node-fetch');
const cheerio = require('cheerio');
const request = require('request-promise');
const axios = require('axios');
const helper = require('./helperFunctions.js');
const {getSizes} = require("./helperFunctions");

var siteUrl = 'https://kaleco.ca/'

let count = 0;
let urls = [];

let baseUrl = "https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=1&per_page=180&sort_by=popularity_score&sort_order=desc&categories[]=11ea7aa7c1810cefae500cc47a2ae330&include=images,media_files&excluded_fulfillment=dine_in";


async function main() {
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

   await fetch(baseUrl, options)
        .then(async res => await res.json())
        .then(async json => {

            // console.log(json.meta);

            const result = await Object.values(json.data).map(async item => {      //item (is current value)

                count++;


                const id = item.id;
                const title = item.name;
                //const buisness_ name (String) =
                const url = item.site_link;
                //let productIdentifier = getId(url);

                const place_id = item.site_id;
                //const handle (String) =
                //const vendor (String) =
                //const tags (String) = []
                //const variants = {}                               // probably not needed with sizes
                //const options =                                  // helper function done
                // const body_html = ''                            // helper function is done
                //const published_at = dateTime
                //const compare_at_price = Int
                //const sizes = []                                //helper function is done
                //const buckets = []
                const colors = []                              //this can be left empty for now since sizes gets the colors too

                const product_type = item.product_type;
                const original_price = item.price.high_subunits;
                    let productId = helper.getId(url);
                const sizes = await helper.getSizes(productId);
                const images = item.images;
                const options = await helper.getOptions(productId);
                const created_at = item.created_date;
                const updated_at = item.updated_date;
                const is_on_sale = item.on_sale;
                const rating = item.avg_rating_all;
                const body_html = await helper.getDescription(productId);

               return {
                    id,
                    title,
                    url,
                    place_id,
                    images,
                    options,
                    rating,
                    body_html,
                    created_at,
                    product_type,
                    updated_at,
                    colors,
                    original_price,
                    sizes,
                    is_on_sale
                };


            });

            await console.log(result);
            await console.log(`Total number of items scraped: ${count}`);

        })
        .catch(err => console.error('error found:' + err));
}

main();