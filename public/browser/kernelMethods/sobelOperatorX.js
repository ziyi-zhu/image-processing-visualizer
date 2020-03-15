function sobelOperatorX(size, pixels) {
  let output = 0;
  let weights = [1/4, 0, -1/4, 1/2, 0, -1/2, 1/4, 0, -1/4];
  for (let i = 0; i < size; i++) {
    output += weights[i] * pixels[i].lightness;
  }
  return output + 50;
}

module.exports = sobelOperatorX;