/* 

site_objects.js - This file only contains 'SITE_OBJECTS' a constant array of objects that is based into 'scrapeProductUrls()'. It contains the information
that the function needs to find the product urls for a given site.

*/
const SITE_OBJECTS = [
    FOSSELLOS = {
        baseUrl : ["https://www.fossellos.com/shop/tops/",
                    // "https://www.fossellos.com/shop/tanks/",
                    // "https://www.fossellos.com/shop/tees/",
                    // "https://www.fossellos.com/shop/sweatshirts/",
                    // "https://www.fossellos.com/shop/knitwear/",
                    // "https://www.fossellos.com/shop/denim/",
                    // "https://www.fossellos.com/shop/pants/",
                    // "https://www.fossellos.com/shop/dresses-skirts/",
                    // "https://www.fossellos.com/shop/jackets/",
                    // "https://www.fossellos.com/shop/footwear/",
                    // "https://www.fossellos.com/shop/belts/",
                    // "https://www.fossellos.com/shop/bags/",
                    // "https://www.fossellos.com/shop/eyewear/",
                    // "https://www.fossellos.com/shop/hats/",
                    // "https://www.fossellos.com/shop/accessories/",
                    // "https://www.fossellos.com/shop/jewelry/"
                ],
        paginationSelector : "div.pagination > ul > li", 
        productListSelector : "div.products-list", 
        productLinkSelector : ".product-image-wrapper",
    },

    // RED_TOP_FOOTWEAR = {
    //     baseUrl : ["https://red-top-footwear.shoplightspeed.com/ladies/",],
    //     paginationSelector : "ul.right > li", 
    //     productListSelector : "div.col-md-9", 
    //     productLinkSelector : "a.title",
    //     removeNodes : [".clearfix",]
    // },

    // ENVY_APPAREL = {
    //     baseUrl : ["https://shop.envyapparelfit.com/shop/"],
    //     paginationSelector : "div.pagination > ul > li", 
    //     productListSelector : "div.products-list", 
    //     productLinkSelector : ".product-image-wrapper",
    // },

    // HONEST_BOUTIQUE = {
    //     baseUrl : ["https://www.honestboutique.ca/clothing/"],
    //     paginationSelector : "div.pagination > ul > li", 
    //     productListSelector : "div.products-list", 
    //     productLinkSelector : ".product-image-wrapper",
    // }
]

module.exports = { SITE_OBJECTS }