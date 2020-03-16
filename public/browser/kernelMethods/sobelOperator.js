function sobelOperator(size, pixels) {
  let gradientX = 0;
  let gradientY = 0;
  let weightsX = [1/4, 0, -1/4, 1/2, 0, -1/2, 1/4, 0, -1/4];
  let weightsY = [1/4, 1/2, 1/4, 0, 0, 0, -1/4, -1/2, -1/4];
  for (let i = 0; i < size; i++) {
    gradientX += weightsX[i] * pixels[i].lightness;
    gradientY += weightsY[i] * pixels[i].lightness;
  }
  let output = {
  	"hue": parseInt(Math.atan2(gradientY, gradientX) * 180 / Math.PI) + 180,
  	"saturation": 100,
  	"lightness": 2 * Math.sqrt(gradientX * gradientX + gradientY * gradientY)
  }
  return output;
}

module.exports = sobelOperator;