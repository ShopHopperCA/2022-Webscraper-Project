const request = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://www.floralfawnboutique.com/tops';

/* SAMPLE SCHEMA */
const sample = {
    id: 1,
    title: 'Sand White Tank Top',
    business_name: 'Floral Fawn Boutique',
    url: 'https://www.floralfawnboutique.com/product-page/sand-white-tank-top',
    place_id: '?',
    handle: '?', //Not required
    vendor: '?',
    tags: '?',
    variants: '?', //What?
    images: [
        {
            id: '?',
            src: 'https://static.wixstatic.com/media/f2d5bb_560ef0867a264a83a4e968471a401c08~mv2.jpg/v1/fill/w_500,h_667,al_c,q_85,usm_0.66_1.00_0.01/f2d5bb_560ef0867a264a83a4e968471a401c08~mv2.webp',
            width: '?',
            height: '?',
            position: '1',
            created_at: '?',
            product_id: '?',
            updated_at: '?',
            variant_ids: '?'
        }
    ],
    options: [
        {
            name: 'Size',
            values: [
                '4',
                '6',
                '8',
                '10',
            ],
            position: 1
        }
    ],
    body_html: '?', //Easily scraped w/ Cheerio
    created_at: '?', //When the product was added to the site or when we scraped it to the database?
    product_type: 'top',
    published_at: '?', //See created_at comment
    updated_at: '?', //See created_at comment
    colors: [],
    compare_at_price: '?', //What does this mean
    original_price: '4600',
    sizes: [
        '4',
        '6',
        '8',
        '10'
    ],
    buckets: [
        '?'
    ],
    'is_on_sale': false,
    'sale_ratio': 100
}

/* END OF SAMPLE SCHEMA */