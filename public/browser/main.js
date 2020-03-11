// var canvas = document.getElementById('canvas');
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

let img = new Image();
let imageData;

let navbarHeight = $("#navbarDiv").height();
// let textHeight = $("#mainText").height();
let height = Math.floor(($(document).height() - navbarHeight) / 28);
let width = Math.floor($(document).width() / 38);
let newBoard = new Board(height, width);
newBoard.initialise();

var row, col;
var speed = 1;
let currentId;
let previousId;

$("#gaussian").click(function(event){
  newBoard.filter.type = "gaussian";
  newBoard.filter.weights = filterWeights["gaussian"];

  $("#filterName").text("Gaussian Blur");
  $("#filterDescription").text(`Mathematically, applying a Gaussian blur to an image is the same as convolving the image with a Gaussian function. This is also known as a two-dimensional Weierstrass transform. $$G(x,y) = \\frac{1}{2\\pi\\sigma^2} e^{-\\frac{x^2+y^2}{2\\sigma^2}}$$`);
  MathJax.typeset();
});

$("#box").click(function(event){
  newBoard.filter.type = "box";
  newBoard.filter.weights = filterWeights["box"];

  $("#filterName").text("Box Blur");
  $("#filterDescription").text(`A box blur (also known as a box linear filter) is a spatial domain linear filter in which each pixel in the resulting image has a value equal to the average value of its neighboring pixels in the input image. It is a form of low-pass ("blurring") filter. $$\\mathbf{G} = \\frac{1}{9} \\begin{bmatrix}1 & 1 & 1\\\\1 & 1 & 1\\\\1 & 1 & 1\\end{bmatrix} * \\mathbf{A}$$`);
  MathJax.typeset();
});

$("#sobelVertical").click(function(event){
  newBoard.filter.type = "sobelVertical";
  newBoard.filter.weights = filterWeights["sobelVertical"];

  $("#filterName").text("Sobel Operator");
  $("#filterDescription").text(`The operator uses two 3×3 kernels which are convolved with the original image to calculate approximations of the derivatives – one for horizontal changes, and one for vertical. $$\\mathbf{G}_x = \\begin{bmatrix}+1 & 0 & -1\\\\+2 & 0 & -2\\\\+1 & 0 & -1\\end{bmatrix} * \\mathbf{A}$$`);
  MathJax.typeset();
});

$("#sobelHorizontal").click(function(event){
  newBoard.filter.type = "sobelHorizontal";
  newBoard.filter.weights = filterWeights["sobelHorizontal"];

  $("#filterName").text("Sobel Operator");
  $("#filterDescription").text(`The operator uses two 3×3 kernels which are convolved with the original image to calculate approximations of the derivatives – one for horizontal changes, and one for vertical. $$\\mathbf{G}_y = \\begin{bmatrix}+1 & +2 & +1\\\\0 & 0 & 0\\\\-1 & -2 & -1\\end{bmatrix} * \\mathbf{A}$$`);
  MathJax.typeset();
});

$("#clear").click(function(event){
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      $(`#${r}-${c}`).css("background-color", "white");
      $(`#${r}-${c}`).removeClass("normal");
      $(`#${r}-${c}`).addClass("empty");
    }
  }
  $("#myFile").val(null);
});

$("#clearFilter").click(function(event){
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let lightness = newBoard.pixels[`${r}-${c}`].lightness;
      $(`#${r}-${c}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");
    }
  }
});

$("#visualize").click(function(event){
  row = 0, col = 0;
  let timer = setInterval(function() {
    if (row == height) {
      $(`#${previousId}`).removeClass("current");
      $(`#${previousId}`).addClass("normal");
      clearInterval(timer);
      return;
    }
    newBoard.updateFilter(row, col);

    currentId = `${row}-${col}`;
    let lightness = newBoard.filter.output;
    $(`#${currentId}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");
    $(`#${currentId}`).removeClass("normal");
    $(`#${currentId}`).addClass("current");
    $(`#${previousId}`).removeClass("current");
    $(`#${previousId}`).addClass("normal");
    previousId = currentId;

    col++;
    if (col == width) {
      col = 0, row++;
    }
  }, speed * 10);
});

$("#fast").click(function(event){
  speed = 1;
  $("#speedText").text("Speed: Fast");
});

$("#average").click(function(event){
  speed = 5;
  $("#speedText").text("Speed: Average");
});

$("#slow").click(function(event){
  speed = 10;
  $("#speedText").text("Speed: Slow");
});

$("#myFile").change(function(event){
  let tgt = event.target || window.event.srcElement,
    files = tgt.files;

  // FileReader support
  if (FileReader && files && files.length) {
    let fr = new FileReader();
    fr.onload = () => showImage(fr);
    fr.readAsDataURL(files[0]);
  }
});

function showImage(fileReader) {
  img.crossOrigin = "anonymous";
  img.src = fileReader.result;

  img.onload = function() {
    w = img.width;
    h = img.height;

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0);

    let pixelArr = ctx.getImageData(0, 0, w, h).data;
    let sample_size = parseInt(w / width);

    let delayInMilliseconds = 2000;

    for (let y = 0; y < height*sample_size; y += sample_size) {
      for (let x = 0; x < width*sample_size; x += sample_size) {
        let p = (x + (y * w)) * 4;
        let lightness = parseInt(pixelArr[p]*.299 + pixelArr[p + 1]*.587 + pixelArr[p + 2]*.114);

        let r = parseInt(y/sample_size);
        let c = parseInt(x/sample_size);

        $(`#${r}-${c}`).removeClass("empty");
        $(`#${r}-${c}`).addClass("normal");
        $(`#${r}-${c}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");

        newBoard.pixels[`${r}-${c}`].lightness = lightness;
      }
    }
  }
};