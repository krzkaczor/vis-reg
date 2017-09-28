const { finalize } = require('./images')
const { join } = require('path');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-then');

async function getRealHeight(nightmare) {
  return nightmare.evaluate(() => document.body.scrollHeight);
}

async function getScrollbarWidth(nightmare) {
  return nightmare.evaluate(() => {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  });
}

async function getWindowSize(nightmare) {
  return nightmare.evaluate(() => ({
    width: window.outerWidth,
    height: window.outerHeight,
  }));
}

async function getVieportSize(nightmare) {
  return nightmare.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
}

async function scrollTo(nightmare, y) {
  return nightmare.evaluate((y) => window.scrollTo(0, y), y);
}
// put everything to dir first and remove it after finish
// add more logging to backend
async function makeScreenshot(nightmare, name, width) {
  const scrollWidth = await getScrollbarWidth(nightmare);
  console.log("Scrollbar width: ", scrollWidth);

  const actualSize = await getWindowSize(nightmare);
  console.log("actualSize: ", JSON.stringify(actualSize));

  const viewportSize = await getVieportSize(nightmare);
  console.log("viewportSize: ", JSON.stringify(viewportSize));

  console.log(`Resizing to ${width}x${actualSize.height}`);

  await nightmare.viewport(width, actualSize.height);
  await nightmare.wait(200);

  const documentHeight = await getRealHeight(nightmare);
  console.log("Real height: ", documentHeight);

  const baseDir = join(__dirname, '../screenshots', `${name}-${width}`);
  await mkdirp(baseDir);

  const images = [];
  const heights = [];
  const offsets = [];
  let currentHeight = 0;
  let i = 0;
  while (currentHeight < documentHeight) {
    console.log(`Screenshot ${i} at ${currentHeight}`)
    await scrollTo(nightmare, currentHeight);
    const imagePath = join(baseDir, `${name}-${width}-${i++}.png`);
    await nightmare.wait(800);
    await nightmare.screenshot(imagePath);
    currentHeight += viewportSize.height;
    images.push(imagePath);
    heights.push(viewportSize.height);
    offsets.push(currentHeight < documentHeight ? 0 : currentHeight - documentHeight)
  }

  const desiredDimensions = {
    width,
    height: viewportSize.height
  }

  await finalize(images, desiredDimensions, offsets[offsets.length - 1], `./screenshots/${name}-${width}.png`);

  await rimraf(baseDir);

  console.log("DONE")
} 

module.exports.screenshots = async function screenshots(nightmare, name) {
  console.log("Iphone 6 screenshot");
  await makeScreenshot(nightmare, name, 375); // iphone 6
  console.log("Desktop screenshot");
  await makeScreenshot(nightmare, name, 1500); // desktop
};
