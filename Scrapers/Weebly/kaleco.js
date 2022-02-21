const fetch = require('node-fetch');
let currentPage = 1;
const baseUrl = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/131535993/sites/542536437781936289/products';

let options = {
    method: 'GET',
    qs: {
        page: `${currentPage}`,
        per_page: '120',
        sort_by: 'popularity_score',
        sort_order: 'desc',
        'categories^\[^\]': '11ea7aa7c1810cefae500cc47a2ae330',
        include: 'images,media_files',
        excluded_fulfillment: 'dine_in'
    },
    headers: {authority: 'cdn5.editmysite.com', 'sec-ch-ua': '^\^'}
};


fetch(baseUrl, options)
    .then(res => res.json())
    .then(json => console.log(json.meta))
    .catch(err => console.error('error:' + err));