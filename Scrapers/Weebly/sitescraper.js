const axios = require('axios');
const cheerio = require('cheerio');

let productId = 0;
let productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/131535993/sites/542536437781936289/store-locations/11ea74fbb0ae20b2ae500cc47a2ae330/products/${productId}/skus?page=1&per_page=100&include=image,media_files,product`

async function getVariants(id){
    let productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/131535993/sites/542536437781936289/store-locations/11ea74fbb0ae20b2ae500cc47a2ae330/products/${id}/skus?page=1&per_page=100&include=image,media_files,product`;
    axios(productCall)
        .then(response =>{
            let datArr = response.data.data;
            let variance = [];
            for(p in datArr){
                if(datArr[p].inventory > 0) {
                    console.log(datArr[p].name);
                    variance.push(datArr[p].name);
                    //variance.push(datArr[p].inventory)
                }
            }

            //console.log(datArr.length);
            // const variants = Object.values(response.data).map(item =>{      //item (is current value)
            //     const name = item.name;
            //     const sold_out = item.sold_out;
            //     const invetory = item.inventory;
            //     return {name,sold_out,invetory};
            //     //console.log(variants);
            // });


        })
}


async function getDescription(site){
    axios(site)
        .then(response =>{
        const html = response.data;
        const $ = cheerio.load(html);
        const descriptions = [];
        //console.log($);

        $(".product-description",html).each((index,element) =>{
                const description = $(element).text();
                console.log('description: ' + $(this));
                descriptions.push({
                    description
                });

            });
           // console.log(descriptions);
        }).catch(err => console.error(err))
}

let site = 'https://www.kaleco.ca/product/BambooPrintDrapeNeckTop/1415'
let productUrl = 'product/BambooPrintDrapeNeckTop/1415';
let parts = productUrl.split('/');
let id = parts[parts.length-1];

getVariants(id);
//getDescription(site);


//https://www.kaleco.ca/product/TreeblendV-NeckT-Shirt/773