const gm = require("gm");

function stitchImages(images, heights, offsets, outputname) {
  let acc = gm();

  if (images.length != heights.length) {
    throw new Error("Error: images.length != heights.length ");
  }

  let h = 0;
  for (var i = 0; i < images.length; i++) {
    acc = acc.in("-page", `+0+${h - offsets[i]}`).in(images[i]);
    h += heights[i] - offsets[i];
  }

  acc.mosaic().write(outputname, function(err) {
    if (err) console.log(err);
  });
}

module.exports.stitchImages = stitchImages;