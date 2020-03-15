function boxBlur(size, pixels) {
  let output = 0;
  let weights = [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];
  for (let i = 0; i < size; i++) {
    output += weights[i] * pixels[i].lightness;
  }
  return output;
}

module.exports = boxBlur;