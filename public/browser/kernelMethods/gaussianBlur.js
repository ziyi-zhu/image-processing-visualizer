function gaussianBlur(size, pixels) {
  let lightness = 0;
  let weights = [1/16, 1/8, 1/16, 1/8, 1/4, 1/8, 1/16, 1/8, 1/16];
  for (let i = 0; i < size; i++) {
    lightness += weights[i] * pixels[i].lightness;
  }
  let output = {
    "hue": pixels[4].hue,
    "saturation": pixels[4].saturation,
    "lightness": lightness
  }
  return output;
}

module.exports = gaussianBlur;