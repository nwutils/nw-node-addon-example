import process from 'node:process';

import { findpath } from 'nw';
import selenium from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { main } from './index.mjs';

describe('NW.js Selenium test suite example', async () => {
    /**
     * @type {chrome.Driver | undefined}
     */
    let driver = undefined;

    /**
     * Setup Selenium driver.
     */
    beforeAll(async function () {

        await main();

        const options = new chrome.Options();

        const seleniumArguments = [
            'nwapp=' + process.cwd(),
            'headless=new'
        ];

        options.addArguments(seleniumArguments);

        const service = new chrome.ServiceBuilder(await findpath('chromedriver'), { sdk: 'flavor' }).build();

        driver = chrome.Driver.createSession(options, service);
    }, 30000);

    it('text is displayed on page', async function () {
        const textElement = await driver.findElement(selenium.By.id('test'));
        const text = await textElement.getText();
        expect(text).toEqual('world');
    }, Infinity);

    afterAll(async function () {
        await driver.quit();
    });
});
