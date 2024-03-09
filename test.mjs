import { equal } from 'node:assert';
import { after, before, describe, test } from 'node:test';
import process from 'node:process';

import { findpath } from 'nw';
import selenium from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

describe('NW.js Selenium test suite example', async () => {
    let driver = undefined;

    /**
     * Setup Selenium driver.
     */
    before(async () => {
        const options = new chrome.Options();

        const seleniumArguments = [
            'nwapp=' + process.cwd(),
            'headless=new'
        ];

        options.addArguments(seleniumArguments);

        const service = new chrome.ServiceBuilder(findpath('chromedriver')).build();

        driver = chrome.Driver.createSession(options, service);
    });

    test('text is displayed on page', async () => {
        const textElement = await driver.findElement(selenium.By.id('test'));
        const text = await textElement.getText();
        equal(text, 'hello');
    });

    after(() => {
        driver.quit();
    });
});
