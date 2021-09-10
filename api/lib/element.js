const {getBrowserDriver} = require('./share')

class Element {
    constructor(driver, locatorBy, parent) {
        this.driver = driver;
        this.locatorBy = locatorBy;
        this._parent = parent;
    }

    async init() {
        this.driver = this.driver || getBrowserDriver();
        this._root = await this.driver.findElement(this.locatorBy);
    }

    async sendKeys(...args) {
        if (this._root) {
            await this._root.sendKeys(...args);
        } else {
            await this.init()
            await this._root.sendKeys(...args);
        }
    }

    $(locatorBy) {
        return new Element(this.driver, locatorBy, this)
    }
}

function $(locatorBy) {
    return new Element(null, locatorBy);
}

module.exports = {
    $
}