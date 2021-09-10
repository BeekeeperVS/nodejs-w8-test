const fs = require('fs');
const puppeteer = require('puppeteer');
const link = 'https://www.copart.com/public/data/lotdetails/solr/';
const linkId = 29851591;
(async () => {
    try {
        let browser = await puppeteer.launch({
            headless: false,
            slowMo: 100,
            devtools: true
        })

        let page = await browser.newPage();
        await page.setViewport({
            width: 1400, height: 900
        })
        await page.goto(`${link}${linkId}`);
        const subs = await page.$eval('body', (el) => el.innerText)
        console.log(subs)
    } catch (e) {
        console.log(e)
        await browser.close();
    }
})();