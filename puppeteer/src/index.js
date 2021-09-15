const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = process.env.PORT
const host = process.env.HOST

var browser = null
var pageAuthCopart = null;
var pageAuthIaai = null;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/init-auth-page', ((req, res) => {
    (async () => {
        try {
            if (browser !== null) {
                browser.close();
                browser = null;
            }
            await initBrowser();
            await initIaaiPage();
            await initCopartPage();

            res.send({status: true, msg: 'Iaai && Copart Authorization Success!'});
        } catch (e) {
            res.send({status: false, msg: e.text});
        }
    })();

}))

app.post('/iaai-lot', (req, res) => {
    let lotLink = req.body.lotLink;
    console.log(lotLink);
    (async () => {
        try {
            let iaaiPage = await browser.newPage();
            iaaiPage.goto(`${lotLink}`).then(() => {
                iaaiPage.close();
            }).catch(function (e) {
                iaaiPage.close();
                console.log('iaaiPage error');
            });
            await iaaiPage.waitForSelector("#ProductDetailsVM");
            let lotDetails = await iaaiPage.$eval('#ProductDetailsVM', (el) => el.innerText);

            res.send(lotDetails);
        } catch (e) {
            res.send({returnCode: false, msg: e.text});
        }

    })();

});

app.post('/copart-details', (req, res) => {
    let lotLink = req.body.lotLink;
    console.log(lotLink);
    (async () => {
        try {
            let copartPage = await browser.newPage();
            await copartPage.setViewport({
                width: 1400, height: 900
            })
            await copartPage.goto(`${lotLink}`)
            let lotDetails = await copartPage.$eval('body', (el) => el.innerText);
            await copartPage.close();
            res.send(lotDetails);
        } catch (e) {
            await copartPage.close();
            res.send({returnCode: false, msg: e.text});
        }
    })();
});

app.listen(3000, async () => {
    console.log(`Started api service on port: ${port}`);
    console.log(`On host: ${host}`)

    await initBrowser();
    initIaaiPage();
    initCopartPage();
})


async function initBrowser() {
    browser = await puppeteer.launch({
        // defaultViewport: {width: 1800, height: 1200},
        // executablePath: '/usr/bin/chromium-browser',
        headless: false,
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
    // await pageAuthIaai.setViewport({
    //     width: 1800, height: 1200
    // });
    await pageAuthIaai.goto(`${loginUrl}`);

    await pageAuthIaai.waitForSelector('#account');

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

        await pageAuthCopart.goto(`${loginUrl}`, {waitUntil: 'load'});

        await pageAuthCopart.waitForSelector('#username');

        // let test = await pageAuthCopart.$eval('body', (el) => el.innerHTML);
        // console.log(test);


        await pageAuthCopart.type('#username', authParams.email);
        await pageAuthCopart.type('#password', authParams.password);

        await pageAuthCopart.evaluate((authParams) => {
            // document.querySelector('input[ng-model="form.username"]').value = authParams.email;
            // document.querySelector('input[ng-model="form.password"]').value = authParams.password;
            document.querySelector('input[name="remember-me"]').checked = authParams.rememberMe;
            document.querySelector('button[data-uname="loginSigninmemberbutton"]').click();
        }, authParams);

    } catch (e) {
        console.log(e)
    }

    console.log('Copart Auth finish!');
}
