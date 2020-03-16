const Pixel = require("./pixel");
const Kernel = require("./kernel");
const methodDescription = require("./kernelMethods/methodDescription");
const boxBlur = require("./kernelMethods/boxBlur");
const gaussianBlur = require("./kernelMethods/gaussianBlur");
const prewittOperator = require("./kernelMethods/prewittOperator");
const sobelOperatorX = require("./kernelMethods/sobelOperatorX");
const sobelOperatorY = require("./kernelMethods/sobelOperatorY");
const sobelOperator = require("./kernelMethods/sobelOperator");
const cannyEdgeDetector = require("./kernelMethods/cannyEdgeDetector");

function Board(height, width) {
  this.height = height;
  this.width = width;
  this.boardArray = [];
  this.pixels = {};
  this.newPixels = {};
  this.mouseDown = false;
  this.buttonsOn = false;
  this.kernel = null;
}

Board.prototype.initialise = function() {
  this.createGrid();
  this.addEventListeners();
};

Board.prototype.createGrid = function() {
  let tableHTML = "";
  for (let r = 0; r < this.height; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      let newPixelId = `${r}-${c}`, newPixelClass, newPixel;
      
      newPixelClass = "empty";
      newPixel = new Pixel(newPixelId, newPixelClass);
      currentArrayRow.push(newPixel);
      currentHTMLRow += `<td id="${newPixelId}" class="${newPixelClass}"></td>`;
      this.pixels[`${newPixelId}`] = newPixel;
    }
    this.boardArray.push(currentArrayRow);
    tableHTML += `${currentHTMLRow}</tr>`;
  }

  let board = document.getElementById("board");
  board.innerHTML = tableHTML;
};

Board.prototype.createKernel = function() {
  let tableHTML = "<caption>Kernel Input</caption>";
  for (let r = 0; r < 3; r++) {
    let currentHTMLRow = `<tr>`;
    for (let c = 0; c < 3; c++) {
      let newPixelId = 3 * r + c;

      newPixelClass = "empty";
      newPixel = new Pixel(newPixelId, newPixelClass);
      currentHTMLRow += `<td id="${newPixelId}"></td>`;
      this.kernel.pixels[3 * r + c] = newPixel;
    }
    tableHTML += `${currentHTMLRow}</tr>`;
  }

  let input = document.getElementById("input");
  input.innerHTML = tableHTML;
};

Board.prototype.addEventListeners = function() {
  let board = this;
  for (let r = 0; r < board.height; r++) {
    for (let c = 0; c < board.width; c++) {
      let currentId = `${r}-${c}`;
      // let currentPixel = board.getPixel(currentId);
      let currentElement = document.getElementById(currentId);
      currentElement.onmousedown = (e) => {
        e.preventDefault();
        if (this.buttonsOn) {
          board.mouseDown = true;
          let hue = this.kernel.output["hue"];
          let saturation = this.kernel.output["saturation"];
          let lightness = this.kernel.output["lightness"];
          $(`#${currentId}`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");
        }
      }
      currentElement.onmouseup = () => {
        if (this.buttonsOn) {
          board.mouseDown = false;
        }
      }
      currentElement.onmouseenter = () => {
        $(`#${currentId}`).removeClass("normal");
        $(`#${currentId}`).addClass("current");
        if (this.buttonsOn) {
          board.updateKernel(r, c);
          if (board.mouseDown) {
            let hue = this.kernel.output["hue"];
            let saturation = this.kernel.output["saturation"];
            let lightness = this.kernel.output["lightness"];
            $(`#${currentId}`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");
          }
        }
      }
      currentElement.onmouseleave = () => {
        $(`#${currentId}`).removeClass("current");
        $(`#${currentId}`).addClass("normal");
      }
    }
  }
};

Board.prototype.updateKernel = function(row, col) {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let r = row + x - 1;
      let c = col + y - 1;
      let hue = 0;
      let saturation = 0;
      let lightness = 0;
      let pixelId = 3 * x + y;
      if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
        hue = this.pixels[`${r}-${c}`].hue;
        saturation = this.pixels[`${r}-${c}`].saturation;
        lightness = this.pixels[`${r}-${c}`].lightness;
      }
      $(`#${pixelId}`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");
      this.kernel.pixels[pixelId].hue = hue;
      this.kernel.pixels[pixelId].saturation = saturation;
      this.kernel.pixels[pixelId].lightness = lightness;
    }
  }
  this.kernel.applyMethod();
  let hue = this.kernel.output["hue"];
  let saturation = this.kernel.output["saturation"];
  let lightness = this.kernel.output["lightness"];
  $(`#out`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");
};

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

let row, col;
let speed = 1;

let currentId;
let previousId;

$(".method").click(function(event){
  let methodId = event.target.id;
  let methodName = "";
  let method = null;
  switch (methodId) {
    case "box":
      methodName = "Box Blur";
      method = boxBlur;
      break;
    case "gaussian":
      methodName = "Gaussian Blur";
      method = gaussianBlur;
      break;
    case "prewitt":
      methodName = "Prewitt Operator";
      method = prewittOperator;
      break;
    case "sobelX":
      methodName = "Sobel Operator (X Gradient)";
      method = sobelOperatorX;
      break;
    case "sobelY":
      methodName = "Sobel Operator (Y Gradient)";
      method = sobelOperatorY;
      break;
    case "sobel":
      methodName = "Sobel Operator";
      method = sobelOperator;
      break;
    case "canny":
      methodName = "Canny Edge Detector";
      method = cannyEdgeDetector;
      break;
  }
  newBoard.kernel = new Kernel(3, 3, methodId, method);
  newBoard.createKernel();
  newBoard.buttonsOn = true;

  $("#visualize").removeClass("disabled");
  $("#about").css("display", "none");
  $("#tutorial").css("display", "none");
  $("#kernelName").css("display", "block");
  $("#kernelDescription").css("display", "block");
  $("#input").css("display", "block");
  $("#output").css("display", "block");

  $("#kernelName").text(methodName);
  $("#kernelDescription").text(methodDescription[methodId]);
  MathJax.typeset();
});

$("#clearBoard").click(function(event){
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      newBoard.pixels[`${r}-${c}`].lightness = 0;
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
      let hue = newBoard.pixels[`${r}-${c}`].hue;
      let saturation = newBoard.pixels[`${r}-${c}`].saturation;
      let lightness = newBoard.pixels[`${r}-${c}`].lightness;
      $(`#${r}-${c}`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");
    }
  }
});

$("#visualize").click(function(event){
  $(".nav-link").addClass("disabled");
  row = 0, col = 0;
  let timer = setInterval(function() {
    if (row == height) {
      $(".nav-link").removeClass("disabled");
      $(`#${previousId}`).removeClass("current");
      $(`#${previousId}`).addClass("normal");
      $(`#progress`).css("width", "0%");
      $('#myModal').modal('show');

      clearInterval(timer);
      return;
    }
    newBoard.updateKernel(row, col);

    currentId = `${row}-${col}`;

    let newPixel = new Pixel(currentId, "normal");
    let hue = newBoard.kernel.output["hue"];
    let saturation = newBoard.kernel.output["saturation"];
    let lightness = newBoard.kernel.output["lightness"];
    let progress = parseInt(row / (height - 1) * 100);

    newPixel.hue = hue;
    newPixel.saturation = saturation;
    newPixel.lightness = lightness;
    newBoard.newPixels[`${currentId}`] = newPixel;

    $(`#${currentId}`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");
    $(`#${currentId}`).removeClass("normal");
    $(`#${currentId}`).addClass("current");
    $(`#${previousId}`).removeClass("current");
    $(`#${previousId}`).addClass("normal");
    $(`#progress`).css("width", `${progress}%`)
    previousId = currentId;

    col++;
    if (col == width) {
      col = 0, row++;
    }
  }, speed * 10);
});

$("#save").click(function(event){
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      newBoard.pixels[`${r}-${c}`].hue = newBoard.newPixels[`${r}-${c}`].hue;
      newBoard.pixels[`${r}-${c}`].saturation = newBoard.newPixels[`${r}-${c}`].saturation;
      newBoard.pixels[`${r}-${c}`].lightness = newBoard.newPixels[`${r}-${c}`].lightness;
    }
  }
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
        let hue = 0;
        let saturation = 0;
        let lightness = parseInt(pixelArr[p]*.117 + pixelArr[p + 1]*.230 + pixelArr[p + 2]*.045);

        let r = parseInt(y/sample_size);
        let c = parseInt(x/sample_size);

        $(`#${r}-${c}`).removeClass("empty");
        $(`#${r}-${c}`).addClass("normal");
        $(`#${r}-${c}`).css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness + "%)");

        newBoard.pixels[`${r}-${c}`].hue = hue;
        newBoard.pixels[`${r}-${c}`].saturation = saturation;
        newBoard.pixels[`${r}-${c}`].lightness = lightness;
      }
    }
  }
};