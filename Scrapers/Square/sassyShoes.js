const fetch = require('node-fetch');
let count = 0;
let currentPage = '1';
var flag = true;
//var baseUrl = `https://cdn5.editmysite.com/app/store/api/v17/editor/users/132854427/sites/349105600708762559/products`;
let baseUrl = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/132854427/sites/349105600708762559/products?page=1&per_page=180&sort_by=name&sort_order=asc&include=images,media_files&excluded_fulfillment=dine_in';
var url;


let options = {
    method: 'GET',
    qs: {
        page: currentPage,
        per_page: '60',
        sort_by: 'name',
        sort_order: 'asc',
        include: 'images,media_files',
        excluded_fulfillment: 'dine_in'
    },
    headers: {authority: 'cdn5.editmysite.com', 'sec-ch-ua': '^\^'}
};


async function getProductPages(url,options) {
    fetch(url,options)
        .then(res => res.json())
        .then(async json => {

            url = json.meta.pagination.links.next;
            if (url != undefined) {
                //console.log('hello');
                console.log('current page is ' + currentPage)
                currentPage = Number(currentPage) + 1;
                currentPage = String(currentPage);
                console.log('nextpage is ' + currentPage)
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
                getProductPages(url,options);
            }

            console.log(count);

        })
        .catch(err => console.error('error:' + err));
}


getProductPages(baseUrl);


//things to change = BASEURL