const gm = require("gm");

function preprocess(path, desiredDimensions) {
  return new Promise((resolve, reject) => {
    gm(path)
      .resize(desiredDimensions.width, desiredDimensions.height)
      .crop(0,0)
      .write(path, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
  })
}

function stitchImages(images, height, lastOffset, outputName) {
  return new Promise((resolve, reject) => {
    let acc = gm();
    
    let currentHeight = 0;
    for (var i = 0; i < images.length; i++) {
      const isLast = i === images.length - 1;
      acc = acc.in("-page", `+0+${isLast? currentHeight-lastOffset: currentHeight}`).in(images[i]);
      currentHeight += height;
    }
  
    acc.mosaic().write(outputName, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  })
}

// crop sidebar
// crop navbar
async function finalize(images, desiredDimensions, lastOffset, outputName) {
  for(const image of images) {
    await preprocess(image, desiredDimensions);
  }

  await stitchImages(images, desiredDimensions.height, lastOffset, outputName)
}

module.exports.stitchImages = stitchImages;
module.exports.finalize = finalize;