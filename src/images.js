const puppeteer = require('puppeteer');
const { imagesPath, keyword } = require('./config/config');
const srcToImg = require('./helper/srcToImg');

(async () => { //eslint-disable-line
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://image.baidu.com');
    console.info('go to https://image.baidu.com');
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    console.info('reset viewport');
    await page.focus('#kw');
    await page.keyboard.sendCharacter(keyword);
    await page.click('.s_btn');
    console.info('go to search list');
    await page.on('load',async () => {
      console.info('page loading done');
      const srcs = await page.evaluate(() => {
        const images = document.querySelectorAll('img.main_img');
        return Array.prototype.map.call(images, img => img.src);
      });
      console.info(`get ${srcs.length} images`);
      srcs.forEach(async (src) => {
        await page.waitFor(200);
        await srcToImg(src, imagesPath);
      });
    });
  } catch (error) {
    console.info(error);
  }
})();