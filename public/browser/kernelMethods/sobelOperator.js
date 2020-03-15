function sobelOperator(size, pixels) {
  let outputX = 0;
  let outputY = 0;
  let weightsX = [1/4, 0, -1/4, 1/2, 0, -1/2, 1/4, 0, -1/4];
  let weightsY = [1/4, 1/2, 1/4, 0, 0, 0, -1/4, -1/2, -1/4];
  for (let i = 0; i < size; i++) {
    outputX += weightsX[i] * pixels[i].lightness;
    outputY += weightsY[i] * pixels[i].lightness;
  }
  return 2 * Math.sqrt(outputX * outputX + outputY * outputY);
}

module.exports = sobelOperator;