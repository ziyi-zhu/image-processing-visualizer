function sobelOperatorY(size, pixels) {
  let gradient = 0;
  let weights = [1/4, 1/2, 1/4, 0, 0, 0, -1/4, -1/2, -1/4];
  for (let i = 0; i < size; i++) {
    gradient += weights[i] * pixels[i].lightness;
  }
  let output = {
  	"hue": 0,
    "saturation": 0,
  	"lightness": gradient + 50
  }
  return output;
}

module.exports = sobelOperatorY;