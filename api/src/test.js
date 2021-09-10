// const {Builder, By, Key, until} = require('selenium-webdriver');
// const {Browser} = require('./../lib/browser');
// const {$} = require('./../lib/element');
// let lotId = 32225411;
//
// async function example() {
//     let browser = new Browser();
//     const searchGoogleFields = $(By.name('q'));
//     try {
//         // await browser.get(`https://www.copart.com/public/data/lotdetails/solr/${lotId}`);
//         await browser.get('https://www.google.com/');
//         await searchGoogleFields.sendKeys('webdriver', Key.RETURN);
//         await browser.wait(until.titleIs('webdriver - Google Search'), 1000);
//     } finally {
//         await browser.close();
//     }
// }
// example();
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var firefox = require('selenium-webdriver/firefox');

var driver = new webdriver.Builder().withCapabilities({ browserName :'chrome'} ).build();
driver.get("http://www.google.com");
driver.getTitle().then(function( title ) {

    // google page title should be printed
    console.log(title)

});

driver.quit();