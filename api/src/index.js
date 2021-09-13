const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = 3000;//process.env.PORT
const host = 'localhost';//process.env.HOST

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/test', (req, res) => {
    res.send("Our api server is working correctly")
});

// POST method route
app.post('/puppeteer', function (req, res) {

    const link = 'https://www.copart.com/public/data/lotdetails/solr/';
    const linkId = req.body.lotId;
    (async () => {
        try {
            let browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium-browser',
                headless: true,
                slowMo: 100,
                devtools: false,
                args: ['--no-sandbox', '--disable-dev-shm-usage'],
            })

            let page = await browser.newPage();
            await page.setViewport({
                width: 1400, height: 900
            })
            await page.goto(`${link}${linkId}`);
            const subs = await page.$eval('body', (el) => el.innerText)
            console.log(subs)
            res.send(subs)
        } catch (e) {
            console.log(e)
            await browser.close();
        }
    })();
});

app.post('/copart-lot-parse', (req, res) => {

    let lotId = req.body.lotId
    let cookie = req.body.cookie
    var axios = require('axios');
console.log(lotId);

    console.log(cookie);
    var config = {
        method: 'GET',
        url: `https://www.copart.com/public/data/lotdetails/solr/${lotId}`,
        maxRedirects: 100,

        headers: {
            'cookie': `${cookie}`,
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
        }
    };

    axios(config)
        .then(function (response) {
            res.send(response.data)
            console.log("Copart Lot parser success!!!");
        })
        .catch(function (error) {
            console.log(error);
        });

});

app.get('/selenium', (req, res) => {

});

app.listen(3000, () => {
    console.log(`Started api service on port: ${port}`);
    console.log(`On host: ${host}`)
})