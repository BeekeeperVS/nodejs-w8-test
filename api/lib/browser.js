const {Builder} = require('selenium-webdriver');
const {setBrowserDriver} = require('./../lib/share');

class Browser {
    constructor() {
    }

    async init() {
        this.driver = await new Builder()
            .usingServer('http://localhost:4444')
            .forBrowser('chrome')
            .build();

        setBrowserDriver($this.driver);
    }

    async get(url) {
        if (!this.driver) {
            await this.init();
        }
        await this.driver.get(url)
    }

    async wait(...args) {
        if (!this.driver) {
            await this.init();
        }
        await this.driver.wait(...args);
    }

    async close() {
        await this.driver.quit();
    }
}
module.exports = {
    Browser
}