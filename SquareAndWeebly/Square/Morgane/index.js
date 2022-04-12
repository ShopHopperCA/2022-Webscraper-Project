/*
Morgane Scraper
https://morganekelowna.square.site/s/shop
 */

const axios = require("axios");
const chalk = require('chalk');                      // npm i chalk@2.4.1
const fs = require('fs')
const baseURL = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/132504777/sites/962101679689053553/products?page=1&per_page=180&sort_by=popularity_score&sort_order=desc&include=images,media_files&excluded_fulfillment=dine_in'
const businessName = 'Morgane'
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
        //const images = item.images;
        const images = await getImages(item.images.data); // gets every absolute url image
        //  const options = await getOptions(productId);
        const created_at = item.created_date;
        const updated_at = item.updated_date;
        const is_on_sale = item.on_sale;
        const rating = item.avg_rating_all;
       // const body_html = await getDescription(productId);
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
              //  console.log(chalk.green('This is item number: ') + chalk.blue(i));
                for(v in value[i]){
                    // if(v == 'images' || v == 'IMAGES'){
                    //     console.log(v);
                    //     for(prop in value[i]['images'])
                    //         console.log(value[i]['images'][prop])
                    // }
                   // console.log(chalk.red(v.toUpperCase()) + ": " + value[i][v]);
                }
                try {
                    fs.writeFileSync('./morgane.json', JSON.stringify(value, null, 4));
                }
                catch (err){
                    console.log('error writing tiger lily ' +err.message)
                }
            }
        }
    )
    await console.log('Total number of items scraped for Morgane Shop: ' + count);
}



const getId = function(productUrl){
    let parts = productUrl.split('/');
    let id = parts[parts.length-1];

    return id;
}

const getDescription = async (productId) => {
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132504777/sites/962101679689053553/store-locations/11eaa42c5e17a58ebaa60cc47a2b6418/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`;
        const response = await axios(productCall);
        const data = response.data.data;
      //  console.log(data['short_description']);
        return data['short_description']
    }catch (err){
        console.log('error getting desription')
    }
}

const getSizes = async (productId) => {
    let sizes = [];        //change for other methods
    let sizesArr;          // change for other methods
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132504777/sites/962101679689053553/store-locations/11eaa42c5e17a58ebaa60cc47a2b6418/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`;
        const response = await axios(productCall)
        //console.log(response)
        const data = response.data.data;
        //console.log(data['options']['data'].length);
        let optionsArr = data['options']['data'];
        //console.log(optionsArr.length);

        for(var i = 0; i<optionsArr.length; i++){
            if(optionsArr[i].name == 'Size'){
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
    }catch (err){
          console.log('error getting sizes')
    }
}

const getColors = async (productId) => {
    let colors = [];        //change for other methods
    let colorsArr;          // change for other methods
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132504777/sites/962101679689053553/store-locations/11eaa42c5e17a58ebaa60cc47a2b6418/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`;
        const response = await axios(productCall)
        //console.log(response)
        const data = response.data.data;
       // console.log(data['options']['data'].length);
        let optionsArr = data['options']['data'];
        //console.log(data['options']['data']);

        for(var i = 0; i<optionsArr.length; i++){
            if(optionsArr[i].name == 'Colors'){        //change this
                colorsArr = optionsArr[i]['choice_order'] //change this
                break;
            }
        }
        //console.log(colorsArr);

        if(colorsArr == undefined){    //change this
          //  console.log('Colors array is undefined ');  //change this
            return colors;
        }

        //console.log(colorsArr[0]);       change this

        for(let index = 0; index<colorsArr.length; index++){  //change this
            colors.push(colorsArr[index]); //change this
        }
       // console.log(colors);   //change this
        return colors; //trade back
    }catch (err){
        console.log('error getting colors')
    }
}


const getSeasons = async (productId) => {
    let seasons = [];        //change for other methods
    let seasonsArr;          // change for other methods
    try{
        const productCall = `https://cdn5.editmysite.com/app/store/api/v18/editor/users/132504777/sites/962101679689053553/store-locations/11eaa42c5e17a58ebaa60cc47a2b6418/products/${productId}?include=images,options,modifiers,category,media_files,fulfillment`;
        const response = await axios(productCall)
        //console.log(response)
        const data = response.data.data;
        // console.log(data['options']['data'].length);
        let optionsArr = data['options']['data'];
        //console.log(data['options']['data']);

        for(var i = 0; i<optionsArr.length; i++){
            if(optionsArr[i].name == 'Season'){        //change this
                seasonsArr = optionsArr[i]['choice_order'] //change this
                break;
            }
        }
        //console.log(colorsArr);

        if(seasonsArr == undefined){    //change this
            console.log('Seasons array is undefined' +seasonsArr);  //change this
            return seasons;
        }

        //console.log(colorsArr[0]);       change this

        for(let index = 0; index<seasonsArr.length; index++){  //change this
            seasons.push(seasonsArr[index]); //change this
        }

        //console.log(seasons);   //change this
        return seasons; //trade back
    }catch (err){
        console.log('error getting seasons')
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


let test = getId('product/la641p21-pink-c-dress-pink/684')

//getDescription(test)
//console.log(test);
//getSizes(getId(test));
//getColors(getId(test));
//getSeasons(getId(test));

module.exports={main,baseURL,count};

//main(baseURL);  //testing