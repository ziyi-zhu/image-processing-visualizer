function prewittOperator(size, pixels) {
  let outputX = 0;
  let outputY = 0;
  let weightsX = [1/3, 0, -1/3, 1/3, 0, -1/3, 1/3, 0, -1/3];
  let weightsY = [1/3, 1/3, 1/3, 0, 0, 0, -1/3, -1/3, -1/3];
  for (let i = 0; i < size; i++) {
    outputX += weightsX[i] * pixels[i].lightness;
    outputY += weightsY[i] * pixels[i].lightness;
  }
  return 2 * Math.sqrt(outputX * outputX + outputY * outputY);
}

module.exports = prewittOperator;