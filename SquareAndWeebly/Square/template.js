/*
Square Sites templates
change buisness name
change baseURL and productCall/productUrl inside the helper functions
 */

const axios = require("axios");
const chalk = require('chalk');                      // npm i chalk@2.4.1
const baseUrl = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/132854427/sites/349105600708762559/products?page=1&per_page=180&sort_by=name&sort_order=asc&include=images,media_files&excluded_fulfillment=dine_in';
const businessName = 'TEMPLATE'
let count = 0;

var options = {
    method: 'GET',
    url: 'https://cdn5.editmysite.com/app/store/api/v18/editor/users/132854427/sites/349105600708762559/products/56',
    params: {include: 'images,options,modifiers,category,media_files,fulfillment'},
    headers: {authority: 'cdn5.editmysite.com', 'sec-ch-ua': '^\^'}
};

const main = async (urlCall) =>{
    const response = await axios(urlCall);
    //console.log(response.data.data);

    const data = await Object.values(response.data.data).map(async item =>{
        count++;

        const id = item.id;
        const title = item.name;
        const business_name = businessName;
        const url = item.site_link;
        let productId = getId(url);
        const place_id = item.site_id;
        const colors = await getColors(productId);
        const product_type = item.product_type;
        const original_price = item.price.high_subunits;
        const sizes = await getSizes(productId);
        const images = item.images;
        //  const options = await getOptions(productId);
        const created_at = item.created_date;
        const updated_at = item.updated_date;
        const is_on_sale = item.on_sale;
        const rating = item.avg_rating_all;
        const body_html = await getDescription(productId);


        return{
            id,
            title,
            url,
            business_name,
            place_id,
            colors,
            product_type,
            original_price,
            sizes,
            images,
            created_at,
            updated_at,
            is_on_sale,
            rating,
            body_html
        };

    });

    Promise.all(data).then(
        value => {
            for(var i =0; i < value.length; i++){
                console.log(chalk.green('This is item number: ') + chalk.blue(i));
                for(v in value[i]){
                    // if(v == 'images' || v == 'IMAGES'){               //to show what's inside the images
                    //     console.log(v);
                    //     for(prop in value[i]['images'])
                    //         console.log(value[i]['images'][prop])
                    // }
                    console.log(chalk.red(v.toUpperCase()) + ": " + value[i][v]);
                }
            }
        }
    )
    await console.log('Total number of items scraped: ' + count);
}



const getId = function(productUrl){
    let parts = productUrl.split('/');
    let id = parts[parts.length-1];

    return id;
}

const getDescription = async (productId) => {
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132854427/sites/349105600708762559/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`
        const response = await axios(productCall);
        const data = response.data.data;
        return data['short_description']
    }catch (err){
        console.log('error getting desription')
    }
}


const getColors = async (productId) => {
    let colors = [];
    let colorsArr;
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132854427/sites/349105600708762559/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`
        var options = {
            method: 'GET',
            url: `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132854427/sites/349105600708762559/products/${productId}`,
            params: {include: 'images,options,modifiers,category,media_files,fulfillment'},
            headers: {authority: 'cdn5.editmysite.com', 'sec-ch-ua': '^\^'}
        };
        //const response = await axios.request(options);
        //console.log(productId);
        const response = await axios(productCall)
        //console.log(response)
        const data = response.data.data;
        let colorOrSize = data['options']['data'][0].name;
        //console.log(colorOrSize);
        if(colorOrSize == 'Colour' || colorOrSize == 'Color' || colorOrSize == 'colour' || colorOrSize == 'color'){
            colorsArr = data['options']['data'][0]['choice_order'];
        }
        else{
            colorsArr = data['options']['data'][1]['choice_order'];
        }

        if(colorsArr == undefined){
            // console.log('colors Array is not defined');
            return colors;
        }
        for (let i =0; i<colorsArr.length;i++){
            colors.push(colorsArr[i]);
        }
        // console.log(colors);
        return colors; //trade back
    }catch (err){
        // console.log('error getting colors')
    }
}

const getSizes = async (productId) => {
    let sizes = [];
    let sizesArr;
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132854427/sites/349105600708762559/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`
        //const response = await axios.request(options);
        //console.log(productId);
        const response = await axios(productCall)
        //console.log(response)
        const data = response.data.data;
        let options = data['options']['data'];
        if(options == undefined){
            return sizes;
        }
        let colorOrSize = data['options']['data'][0].name;
        //  console.log(colorOrSize); // checks what comes FIRST
        if(colorOrSize == 'Size' || colorOrSize == 'size' || colorOrSize == 'Sizes' || colorOrSize == 'size'){
            sizesArr = data['options']['data'][0]['choice_order'];
        }
        else{
            sizesArr = data['options']['data'][1]['choice_order'];
        }

        if(sizesArr == undefined){
            // console.log('colors Array is not defined');
            return sizes;
        }
        for (let i =0; i<sizesArr.length;i++){
            sizes.push(sizesArr[i]);
        }
        // console.log(sizes);
        return sizes; //trade back
    }catch (err){
        console.log('error getting sizes')
    }
}


let test = 'product/wanda-panda-vind-ankle-boot/90';
let test2 = 'product/montana-hudson-cowhide-eva-bag/192';


//getColors(getId(test2));
//getSizes(getId(test));
main(baseUrl);