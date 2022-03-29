const fetch = require('node-fetch');
let count = 0;
let currentPage = 1;
var flag = true;
let baseUrl=`https://cdn5.editmysite.com/app/store/api/v17/editor/users/132504777/sites/962101679689053553/products?page=1&per_page=180&sort_by=popularity_score&sort_order=desc&include=images,media_files&excluded_fulfillment=dine_in`; //from cat
var url;

var siteUrl = 'https://morganekelowna.square.site/'


async function getProductPages(url) {
    fetch(url)
        .then(res => res.json())
        .then(async json => {

            url = json.meta.pagination.links.next;
            if (url != undefined) {
                //console.log('hello');
                //console.log('current page is ' + currentPage)
                currentPage = currentPage + 1;
                //console.log('nextpage is ' + currentPage)
                flag = true;
            }

            else {
                //console.log('goodbye')
                flag = false;
            }


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
                return {
                    id,
                    title,
                    url,
                    product_type,
                    original_price,
                    images,
                    created_at,
                    updated_date,
                    is_on_sale,
                    rating
                };


            });

            console.log(result);
            //console.log(count);

            if(flag){
                getProductPages(url);
            }

            console.log(count);

        })
        .catch(err => console.error('error:' + err));
}


getProductPages(baseUrl);