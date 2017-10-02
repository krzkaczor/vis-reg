const { delay } = require("bluebird");
const puppeteer = require("puppeteer");
const { join } = require("path");
const { default: Fullscreenshot } = require('fullscreenshooter');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const basePath = join(process.cwd(), "screenshots");
  const fullscreenshot = await Fullscreenshot.create({
    basePath,
    navbarOffset: 61,
    unreveal: true,
    widths: [350, 1500],
    puppeteer: page
  })

  const URL = "file://" + join(__dirname, "../src/index.html");  
  await page.goto(URL);
  console.log("Wait for page load");
  delay(1000);

  await fullscreenshot.save("index");

  await browser.close();
  console.log("ALL DONE!");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});