/* 

site_objects.js - This file only contains 'SITE_OBJECTS' a constant array of objects that is based into 'scrapeProductUrls()'. It contains the information
that the function needs to find the product urls for a given site.

*/
const SITE_OBJECTS = [
    FOSSELLOS = {
        baseUrl : [
            "https://www.fossellos.com/shop/tops/",
            "https://www.fossellos.com/shop/tanks/",
            "https://www.fossellos.com/shop/tees/",
            "https://www.fossellos.com/shop/sweatshirts/",
            "https://www.fossellos.com/shop/knitwear/",
            "https://www.fossellos.com/shop/denim/",
            "https://www.fossellos.com/shop/pants/",
            "https://www.fossellos.com/shop/dresses-skirts/",
            "https://www.fossellos.com/shop/jackets/",
            "https://www.fossellos.com/shop/footwear/",
            "https://www.fossellos.com/shop/belts/",
            "https://www.fossellos.com/shop/bags/",
            "https://www.fossellos.com/shop/eyewear/",
            "https://www.fossellos.com/shop/hats/",
            "https://www.fossellos.com/shop/accessories/", 
            "https://www.fossellos.com/shop/jewelry/"
        ],
        paginationSelector : "div.pagination > ul > li", 
        productListSelector : "div.products-list", 
        productLinkSelector : ".product-image-wrapper",
        bodyHtmlSelector : "div.product-description"
    },

    //RED TOP FOOTWEAR IS DOWN

    // RED_TOP_FOOTWEAR = {
    //     baseUrl : ["https://red-top-footwear.shoplightspeed.com/ladies/",],
    //     paginationSelector : "ul.right > li", 
    //     productListSelector : "div.col-md-9", 
    //     productLinkSelector : "a.title",
    //     removeNodes : [".clearfix",],
    //     bodyHtmlSelector : ".clearfix"
    // },

    ENVY_APPAREL = {
        baseUrl : ["https://shop.envyapparelfit.com/shop/"],
        paginationSelector : "div.pagination > ul > li", 
        productListSelector : "div.products-list", 
        productLinkSelector : ".product-image-wrapper",
        bodyHtmlSelector : "div.product-description"
    },

    HONEST_BOUTIQUE = {
        baseUrl : ["https://www.honestboutique.ca/clothing/"],
        paginationSelector : "div.pagination > ul > li", 
        productListSelector : "div.products-list", 
        productLinkSelector : ".product-image-wrapper",
        bodyHtmlSelector : "div.product-description"
    },

    ARTFUL_HAND = {
        baseUrl : ["https://www.theartfulhandstores.com/clothing/"],
        paginationSelector : '',
        productListSelector : 'ul.list-collection',
        productLinkSelector : 'h3.mobile-nobrand > a',
        bodyHtmlSelector : ".tabs-a"

    },
  
    ONE_BOARD = {
        baseUrl : [
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-jackets/",
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-pants/",
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-one-piece-suits/",
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-bib-pants/",
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-vests/",
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-gloves/",
            "https://www.oneboardshop.com/snow/womens-outerwear/womens-mitts/",
            "https://www.oneboardshop.com/footwear/womens/shoes/",
            "https://www.oneboardshop.com/footwear/womens/sandals/",
    ],
        paginationSelector : "div.mid-height:nth-child(2) > ul:nth-child(1) > li",
        productListSelector : ".col-md-9 > div:nth-child(1)",
        productLinkSelector : "div.product-block-image > a",
        productItemSelector : ".col-md-4",
        bodyHtmlSelector : ".product-content",
        removeNodes : [".cf"],
    },
  
    ATTRIDGE = {
        baseUrl : [
            "https://www.attridge.ca/women/womens-tops/",
            "https://www.attridge.ca/women/sandals/",
            "https://www.attridge.ca/women/womens-bottoms/",
            "https://www.attridge.ca/women/swim/",
            "https://www.attridge.ca/women/casual-socks/",
            "https://www.attridge.ca/women/headwear/",
        ],
        paginationSelector : 100,
        productListSelector : ".list-collection",
        productLinkSelector : "h3.title > a",
        bodyHtmlSelector : ".module-product > div > div > p"
    },
    STRUT_FOOTWEAR = {
        baseUrl : [
            "https://www.strutfootwear.com/footwear/shoes/",
            "https://www.strutfootwear.com/footwear/boots/",
            "https://www.strutfootwear.com/footwear/sandals/",
        ],
        paginationSelector: "div.pagination > ul > li",
        productListSelector: "div.products-list",
        productLinkSelector: ".product-image-wrapper",
        bodyHtmlSelector: "div.product-description", 
    }
]

module.exports = { SITE_OBJECTS }