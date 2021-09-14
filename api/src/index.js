const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = 3000;//process.env.PORT
const host = 'localhost';//process.env.HOST

var browser = null
var pageAuthCopart = null;
var pageAuthIaai = null;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/iaai-lot', (req, res) => {
    let lotLink = req.body.lotLink;
    (async () => {
        try {
            let iaaiPage = await browser.newPage();
            await iaaiPage.goto(`${lotLink}`, {waitUntil: ['domcontentloaded']})
            let lotDetails = await iaaiPage.$eval('body', (el) => el.innerText);
            await iaaiPage.close();
            res.send(lotDetails);
        } catch (e) {
            res.send({status: false});
            console.log(e);
        }
    })();
});

app.post('/copart-details', (req, res) => {
    let lotLink = req.body.lotLink;
    console.log(lotLink);
    (async () => {
        try {
            let copartPage = pageAuthCopart;
            await copartPage.setViewport({
                width: 1400, height: 900
            })
            await copartPage.goto(`${lotLink}`)
            let lotDetails = await copartPage.$eval('body', (el) => el.innerText);

            let lotDetailsH = await copartPage.$eval('body', (el) => el.innerHTML);
            // await copartPage.close();

            console.log(lotDetailsH);
            res.send(lotDetails);
        } catch (e) {
            res.send({status: false});
            console.log(e);
        }
    })();
});

app.post('/iaai', (req, res) => {
    let loginUrl = 'https://www.iaai.com/MyDashboard/Default';
    let email = 'auctioncars834@cartreksd.com';
    let pass = 'Chanel21';
    let rememberMe = true;

    const authParams = {email: email, password: pass};

    (async () => {
        try {
            if (pageIaai) {

            }
            let browser = await puppeteer.launch({
                defaultViewport: {width: 1800, height: 1200},
                // executablePath: '/usr/bin/chromium-browser',
                headless: true,
                slowMo: 100,
                devtools: false,
                args: ['--no-sandbox', '--disable-dev-shm-usage'],
            })

            let page = await browser.newPage();
            await page.setViewport({
                width: 1800, height: 1200
            })

            // const navigationPromise = page.waitForNavigation({ waitUntil: ['networkidle2'] })

            await page.goto(`${loginUrl}`);
            await page.waitForSelector('#account');


            // await page.type('#Email', authParams.email);
            // await page.type('#Password', authParams.password);

            await page.evaluate((authParams) => {
                let d = document;
                document.getElementById('Email').value = authParams.email;
                d.getElementById('Password').value = authParams.password;
                d.getElementById('account').submit();
                d.querySelector('input[name="Input.RememberMe"]').checked = true;
            }, authParams);
            await Promise.all([
                // page.click('#account'),
                page.waitForNavigation({
                    waitUntil: 'networkidle0',
                }),
            ]);

            // await page.evaluate((authParams) => {
            //     let d = document;
            //     document.getElementById('Email').value = authParams.email;
            //     d.getElementById('Password').value = authParams.password;
            //     d.getElementById('account').submit();
            // }, authParams);
            //
            // await navigationPromise;

            await page.goto('https://www.iaai.com/vehicledetails/41328756', {waitUntil: ['networkidle2']})
            // await page.waitForSelector('#ProductDetailsVM',{ visible: true });
            const lotDetails = await page.$eval('#ProductDetailsVM', (el) => el.innerText)

            await browser.close();
            res.send(lotDetails)
        } catch (e) {
            console.log(e);
            await browser.close();
        }
    })();
});


// POST method route
app.post('/puppeteer', function (req, res) {

    const link = 'https://www.copart.com/public/data/lotdetails/solr/';
    const linkId = req.body.lotId;
    (async () => {
        try {
            let browser = await puppeteer.launch({
                // executablePath: '/usr/bin/chromium-browser',
                headless: false,
                slowMo: 100,
                devtools: false,
                args: ['--no-sandbox', '--disable-dev-shm-usage'],
            })

            let page = await browser.newPage();
            await page.setViewport({
                width: 1400, height: 900
            })
            await page.goto(`${link}${linkId}`);
            const lotDetails = await page.$eval('body', (el) => el.innerText)
            res.send(lotDetails)
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

app.listen(3000, async () => {
    console.log(`Started api service on port: ${port}`);
    console.log(`On host: ${host}`)

    try {
        await initBrowser();
        // initIaaiPage();
        initCopartPage()
    } catch (e) {
        console.log(e);
    }

})


async function initBrowser() {
    browser = await puppeteer.launch({
        // defaultViewport: {width: 1800, height: 1200},
        // executablePath: '/usr/bin/chromium-browser',
        headless: true,
        slowMo: 100,
        devtools: false,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage'
        ]
    });

    console.log('Browser init finish');
}

async function initIaaiPage() {

    /* init page iaai */
    let loginUrl = 'https://www.iaai.com/MyDashboard/Default';

    let authParams = {email: 'auctioncars834@cartreksd.com', password: 'Chanel21', rememberMe: true};
    pageAuthIaai = await browser.newPage();
    await pageAuthIaai.setViewport({
        width: 1800, height: 1200
    });
    await pageAuthIaai.goto(`${loginUrl}`, {waitUntil: 'load'});

    // await pageAuthIaai.waitForSelector('#account');

    // await page.type('#Email', authParams.email);
    // await page.type('#Password', authParams.password);
    await pageAuthIaai.evaluate((authParams) => {
        let d = document;
        document.getElementById('Email').value = authParams.email;
        d.getElementById('Password').value = authParams.password;
        d.querySelector('input[name="Input.RememberMe"]').checked = authParams.rememberMe;
        d.getElementById('account').submit();
    }, authParams);

    console.log('Iaai Auth finish!');
}

async function initCopartPage() {

    /* init page Copart */
    let loginUrl = 'https://www.copart.com/login/';

    let authParams = {email: 'y.ivanov.auction@gmail.com', password: 'copart2121', rememberMe: true};

    try {
        pageAuthCopart = await browser.newPage();
        await pageAuthCopart.setUserAgent(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
        );
        // pageAuthCopart.setCookie({
        //     g2usersessionid: "e1719a0c957899ec65cb43c82aa62a1a",
        //     G2JSESSIONID: "3E93DE6D32A2CD26E85B0A879DE5638C-n1"
        // })
        //
        // await pageAuthCopart.setViewport({
        //     width: 1800, height: 1200
        // });
        await pageAuthCopart.goto(`${loginUrl}`, {waitUntil: 'load'});

        // await pageAuthCopart.waitForTimeout(2000).then(() => console.log('Waited a 20000 second!'));

        // await pageAuthCopart.waitForNavigation('#username');

        // let test = await pageAuthCopart.$eval('body', (el) => el.innerHTML);
        // console.log(test);
        pageAuthCopart.reload();

        await pageAuthCopart.type('input[ng-model="form.username"]', authParams.email);
        await pageAuthCopart.type('input[ng-model="form.password"]', authParams.password);

        await pageAuthCopart.evaluate((authParams) => {
            // document.querySelector('input[ng-model="form.username"]').value = authParams.email;
            // document.querySelector('input[ng-model="form.password"]').value = authParams.password;
            document.querySelector('input[ng-model="form.rememberme"]').checked = authParams.rememberMe;
            document.querySelector('button[data-uname="loginSigninmemberbutton"]').click();
        }, authParams);

    } catch (e) {
        console.log(e)
    }

    console.log('Copart Auth finish!');
}
