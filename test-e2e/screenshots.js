async function getRealHeight(nightmare) {
  return nightmare.evaluate(() => document.body.scrollHeight);
}

async function makeScreenshot(nightmare, name, width) {
  const initialHeight = 1; // this should not be important
  await nightmare.viewport(width, initialHeight);
  await nightmare.wait(1000);

  const realHeight = await getRealHeight(nightmare);
  console.log("real height: ", realHeight);
  await nightmare.viewport(width, realHeight);
  await nightmare.wait(1000);

  await nightmare.screenshot(`./screenshots/${name}-${width}.png`);
}

module.exports.screenshots = async function screenshots(nightmare, name) {
  console.log("Iphone 6 screenshot");
  await makeScreenshot(nightmare, name, 375); // iphone 6
  console.log("Desktop screenshot");
  await makeScreenshot(nightmare, name, 1500); // desktop
}
