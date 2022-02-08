const fetch = require('node-fetch');
let count = 0;

let url = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/117455569/sites/947780008751768186/products?page=1&per_page=120&sort_by=category_order&sort_order=asc&categories[]=11ea746b801d3743a53a0cc47a2b63cc&include=images,media_files&excluded_fulfillment=dine_in';

let options = {
    method: 'GET',
    qs: {
        page: '1',
        limit: '120',
        sort_by: 'category_order',
        sort_order: 'asc',
        per_page: '120',
        'categories[]': '11ea746b801d3743a53a0cc47a2b63cc',
        include: 'images,media_files',
        excluded_fulfillment: 'dine_in'
    },
   // headers: {Connection: 'keep-alive', 'Cache-Control': 'max-age=0', 'sec-ch-ua': '^\^'}
};

fetch(url, options)
    .then(res => res.json())
    .then(json => {

        const result = Object.values(json.data).map(item => {      //item (is current value)
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
            return {id, title, url, product_type, original_price, images, created_at, updated_date, is_on_sale, rating};


        });

        console.log(result);
        console.log(`Total number of items scraped: ${count}`);

    })

    .catch(err => console.error('error:' + err));