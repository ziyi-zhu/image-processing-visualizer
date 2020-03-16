function cannyEdgeDetector(size, pixels) {
  let lightness = 0;
  let direction = Math.abs(Math.round((pixels[4].hue - 180) / 45));
  if (pixels[4].lightness > 20) {
    switch (direction) {
      case 0:
      case 4:
        if (pixels[4].lightness > pixels[3].lightness && pixels[4].lightness > pixels[5].lightness) {
          lightness = 100;
        }
        break;
      case 1:
        if (pixels[4].lightness > pixels[0].lightness && pixels[4].lightness > pixels[8].lightness) {
          lightness = 100;
        }
        break;
      case 2:
        if (pixels[4].lightness > pixels[1].lightness && pixels[4].lightness > pixels[7].lightness) {
          lightness = 100;
        }
        break;
      case 3:
        if (pixels[4].lightness > pixels[2].lightness && pixels[4].lightness > pixels[6].lightness) {
          lightness = 100;
        }
        break;
    }
  }
  else {
    lightness = 0;
  }
  let output = {
    "hue": 0,
    "saturation": 0,
    "lightness": lightness
  }
  return output;
}

module.exports = cannyEdgeDetector;