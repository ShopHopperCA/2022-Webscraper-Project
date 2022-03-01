const fetch = require('node-fetch');
let count = 0;
let currentPage = 1;
var flag = true;
//var baseUrl = `https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=${currentPage}&per_page=180&sort_by=popularity_score&sort_order=desc&include=images,media_files&excluded_fulfillment=dine_in`; //from insomnia
let baseUrl=`https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=${currentPage}&per_page=180&sort_by=popularity_score&sort_order=desc&categories[]=11ea7aa7c1810cefae500cc47a2ae330&include=images,media_files&excluded_fulfillment=dine_in`; //from cat
//let baseUrl = "https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products?page=1&per_page=60&sort_by=created_date&sort_order=desc&include=images,media_files&preferred_item_order_ids=298,297,296,295,294,293,292,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,252,251,250,249,248,247,246,244,242,241,240,239,238,237,235,234,233,232,230,222,208,205,197,194,182,180,179,176,175,174,173,171,166,164,161,156,153,152,151,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109&excluded_fulfillment=dine_in"
var url;


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
            console.log(count);

            if(flag){
                getProductPages(url);
            }

          //  console.log(count);

        })
        .catch(err => console.error('error:' + err));
}


getProductPages(baseUrl);
