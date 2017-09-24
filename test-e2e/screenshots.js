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

async function makeScreenshot(nightmare, name, width) {
  // const initialHeight = 1; // this should not be important
  // await nightmare.viewport(width, initialHeight);
  // await nightmare.wait(1000);

  // const realHeight = await getRealHeight(nightmare);
  // console.log("real height: ", realHeight);
  // await nightmare.viewport(width, realHeight);
  // await nightmare.wait(1000);

  const scrollWidth = await getScrollbarWidth(nightmare);
  console.log("Scrollbar width: ", scrollWidth);

  await nightmare.viewport(width, 20);

  await nightmare.screenshot(`./screenshots/${name}-${width}.png`);
}

module.exports.screenshots = async function screenshots(nightmare, name) {
  console.log("Iphone 6 screenshot");
  await makeScreenshot(nightmare, name, 375); // iphone 6
  console.log("Desktop screenshot");
  await makeScreenshot(nightmare, name, 1500); // desktop
};
