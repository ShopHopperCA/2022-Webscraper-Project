/*
Tiger Lily Scraper
https://shoptigerlilyclothing.square.site/
 */

const axios = require("axios");
const chalk = require('chalk'); // npm i chalk@2.4.1
const fs = require('fs')
const baseURL= `https://cdn5.editmysite.com/app/store/api/v17/editor/users/132063100/sites/322749464172055185/products?page=1&per_page=180&sort_by=popularity_score&sort_order=desc&excluded_fulfillment=dine_in&include=images,media_files`;
const businessName = 'Tiger Lily'
let count = 0;


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
       // const images = item.images;
        const images = await getImages(item.images.data); // gets every absolute url image
        //  const options = await getOptions(productId);
        const created_at = item.created_date;
        const updated_at = item.updated_date;
        const is_on_sale = item.on_sale;
        const rating = item.avg_rating_all;
        //const body_html = await getDescription(productId);
        const body_html = item.short_description;


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
               // console.log(chalk.green('This is item number: ') + chalk.blue(i));
                for(v in value[i]){
                    // if(v == 'images' || v == 'IMAGES'){
                    //     console.log(v);
                    //     for(prop in value[i]['images'])
                    //         console.log(value[i]['images'][prop])
                    // }
                   // console.log(chalk.red(v.toUpperCase()) + ": " + value[i][v]);
                }
                try {
                    fs.writeFileSync('./tigerLily.json', JSON.stringify(value, null, 4));
                }
                catch (err){
                    console.log('error writing tiger lily ' +err.message)
                }
            }
        }
    )
    await console.log('Total number of items scraped for Tiger Lily: ' + count);
}



const getId = function(productUrl){
    let parts = productUrl.split('/');
    let id = parts[parts.length-1];
    return id;
}

const getDescription = async (productId) => {
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132063100/sites/322749464172055185/store-locations/11ea8cc7d836bd24a53a0cc47a2b63cc/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`
        const response = await axios(productCall);
        const data = response.data.data;
        return data['short_description']
    }catch (err){
        console.log('error getting desription')
    }
}

const getSizes = async (productId)=> {
    let sizes = [];
    let sizesArr;
    try {
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132063100/sites/322749464172055185/store-locations/11ea8cc7d836bd24a53a0cc47a2b63cc/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`
        let response = await axios(productCall);
        let data = response.data.data
        if(data['options']['data'].length == 0){
           // console.log('no options')
            return sizes;
        }
        else{
            let optionsArr = data['options']['data'];
            for(var i = 0; i<optionsArr.length; i++){
                if(optionsArr[i].name == 'Size'|| optionsArr[i].name == 'size'||optionsArr[i].name == 'Sizes'||optionsArr[i].name == 'sizes'){
                    sizesArr = optionsArr[i]['choice_order']
                    break;
                }
            }
            if(sizesArr == undefined){
                //console.log('Sizes array is undefined' +sizesArr);
                return sizes;
            }
            for(let index = 0; index<sizesArr.length; index++){
                sizes.push(sizesArr[index]);
            }
            //console.log(sizes);   //change this
            return sizes; //trade back
        }
    }catch (err){
        console.log('error getting sizes');
    }
}

const getColors = async (productId)=> {
    let colors = [];
    let colorsArr;
    try {
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132063100/sites/322749464172055185/store-locations/11ea8cc7d836bd24a53a0cc47a2b63cc/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`
        let response = await axios(productCall);
        let data = response.data.data
        if(data['options']['data'].length == 0){
            // console.log('no colors options')
            return colors;
        }
        else{
            let optionsArr = data['options']['data'];
            for(var i = 0; i<optionsArr.length; i++){
                if(optionsArr[i].name == 'Color'|| optionsArr[i].name == 'color'||optionsArr[i].name == 'Colors'||optionsArr[i].name == 'colors'){
                    colorsArr = optionsArr[i]['choice_order']
                    break;
                }
            }
            if(colorsArr == undefined){
                //console.log('Colors array is undefined' + colorsArr);
                return colors;
            }
            for(let index = 0; index<colorsArr.length; index++){
                colors.push(colorsArr[index]);
            }
            //console.log(colors);
            return colors;
        }
    }catch (err){
        console.log('error getting sizes');
    }
}
const getImages = async (arr) =>{
    let images = [];
    for(let i=0; i<arr.length; i++){

        for(img in arr[i]){
            if(img === 'absolute_url'){
                images.push(arr[i][img])
            }
        }
    }

    return images;
}

let test = getId('product/summer-a-line-dress/2')

//getSizes(test);
//getColors(test);

module.exports={main,baseURL,count};

//main(baseUrl);