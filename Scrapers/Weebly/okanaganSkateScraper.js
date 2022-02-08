const fetch = require('node-fetch');

let url = 'https://cdn5.editmysite.com/app/store/api/v17/editor/users/117455569/sites/947780008751768186/products';

let options = {
    method: 'GET',
    qs: {
        page: '1',
        limit: '120',
        sort_by: 'category_order',
        sort_order: 'asc',
        per_page: '120',
        'categories[]': '11ea746b801d3743a53a0cc47a2b63cc',
        include: 'images,media_files',
        excluded_fulfillment: 'dine_in'
    },
    headers: {Connection: 'keep-alive', 'Cache-Control': 'max-age=0', 'sec-ch-ua': '^\^'}
};

fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));