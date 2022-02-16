//function to get how many pages will needed to be scraped
async function get_pagination_end(url)
{
    const html = await request.get(url);
    const $ = await cheerio.load(html);

    const last_page = $(".page-numbers li:nth-last-child(2)").text();

    return last_page;
}