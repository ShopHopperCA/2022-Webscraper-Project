const fetch = require('node-fetch');
let count = 0;
let urls = [];

let url = "https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=1&per_page=180&sort_by=popularity_score&sort_order=desc&categories[]=11ea7aa7c1810cefae500cc47a2ae330&include=images,media_files&excluded_fulfillment=dine_in";
fetch("https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=1&per_page=60&sort_by=popularity_score&sort_order=desc&categories[]=11ea7aa7c1810cefae500cc47a2ae330&include=images,media_files&excluded_fulfillment=dine_in", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "if-none-match": "W/\"0930817c99bf6f000fdd21945c93e698\"",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://www.kaleco.ca/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
});

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

fetch(url, options)
    .then(res => res.json())
    .then(json =>{

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

        console.log(result);
        console.log(`Total number of items scraped: ${count}`);

    })
    .catch(err => console.error('error found:' + err));