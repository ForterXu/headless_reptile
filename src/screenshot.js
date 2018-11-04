const { screenshot } = require('./config/config');
const puppeteer = require('puppeteer');

(async () => { //eslint-disable-line
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await page.screenshot({
    path: `${screenshot}/${Date.now()}.png`
  });
  await browser.close();
})();
