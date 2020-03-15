function gaussianBlur(size, pixels) {
  let output = 0;
  let weights = [1/16, 1/8, 1/16, 1/8, 1/4, 1/8, 1/16, 1/8, 1/16];
  for (let i = 0; i < size; i++) {
    output += weights[i] * pixels[i].lightness;
  }
  return output;
}

module.exports = gaussianBlur;