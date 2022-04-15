const axios = require('axios');
const cheerio = require('cheerio');
//let productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/131535993/sites/542536437781936289/store-locations/11ea74fbb0ae20b2ae500cc47a2ae330/products/${productId}/skus?page=1&per_page=100&include=image,media_files,product`

let site = 'https://www.kaleco.ca/product/BambooPrintDrapeNeckTop/1415'
let productUrl = 'product/V-NeckTop/375';



const getId = function(productUrl){
    let parts = productUrl.split('/');
    let id = parts[parts.length-1];

    return id;
}

const getDescription = async (productId) => {
        try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/131535993/sites/542536437781936289/store-locations/11ea74fbb0ae20b2ae500cc47a2ae330/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`;
        const response = await axios(productCall);
        const data = response.data.data;
        return data['short_description']
        }catch (err){
            console.log('error getting desription')
        }
}



const getOptions = async (productId) => {
    const options = {};
    try {
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/131535993/sites/542536437781936289/store-locations/11ea74fbb0ae20b2ae500cc47a2ae330/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`;
        const response = await axios(productCall);
        const data = response.data.data;
        //let test = ['red', 'blue', 'green']
         for (op of data['options']['data']){
            options[op] = op
         }
       }catch (err){
         console.log('Error getting options');
    }

    return options;
}


const getSizes = async (productId)=> {
    let sizes = [];
    try {
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/131535993/sites/542536437781936289/store-locations/11ea74fbb0ae20b2ae500cc47a2ae330/products/${productId}/skus?page=1&per_page=100&include=image,media_files,product`;
        let response = await axios(productCall);
        let data = response.data.data
        for (p in data) {
            if (data[p].inventory > 0) {
                sizes.push(data[p].name);
            }
        }
        return sizes;
        }catch (err){
            console.log('error getting sizes');
        }
}

let id = getId(productUrl);


//const size = getSizes(id); //this function (since its async) inherently returns a promise

// ( async () => {
//    let sizes = await getSizes(id);    //high level IIFE
//    console.log(sizes);
// //immediattely invoked function
// })();

async function main(){           //this can be important
    let id = getId('product/V-NeckTop/375')

    const sizes = await getSizes(id)
    const body_html = await getDescription(id);
    const options = await getOptions(id);
    console.log(sizes);
    console.log(body_html);
    console.log(options);
}
//main();

module.exports = {getId, getSizes,getDescription,getOptions};
//getDescription(id);
//getOptions(id)
//getSizes('223');

//console.log(teste);
//getDescription(site);

// exports = exports.getId;
// exports = exports.getSizes;

//https://www.kaleco.ca/product/TreeblendV-NeckT-Shirt/773