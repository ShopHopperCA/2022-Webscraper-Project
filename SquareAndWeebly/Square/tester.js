const fetch = require('node-fetch');

let count = 0;
let baseurl = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/132854427/sites/349105600708762559/products?page=1&per_page=180&sort_by=price&sort_order=desc&categories[]=11eb07edb45212cea1570cc47a2b63ac&include=images,media_files&excluded_fulfillment=dine_in';


const main = async ()=> {
  const response = await fetch(baseurl);
  const body = await response.json();

    const result = Object.values(body.data).map(item =>{      //item (is current value)
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
  console.log(count);
};


main();


async function sleep(milliseconds){
    return new Promise(resolve=> setTimeout(resolve,milliseconds));
}


