// var canvas = document.getElementById('canvas');
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var img = new Image();
var imageData;

let navbarHeight = $("#navbarDiv").height();
// let textHeight = $("#mainText").height();
let height = Math.floor(($(document).height() - navbarHeight) / 28);
let width = Math.floor($(document).width() / 38);
let newBoard = new Board(height, width);
newBoard.initialise();


$("#gaussian").click(function(event){
  $("#about-algorithm").text('In electronics and signal processing, a Gaussian filter is a filter whose impulse response is a Gaussian function (or an approximation to it, since a true Gaussian response is physically unrealizable).');
});

$("#clear").click(function(event){
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      $(`#${r}-${c}`).css("background-color", "white");
      $(`#${r}-${c}`).addClass("empty");
    }
  }
});

$("#myFile").change(function(event){
  var tgt = event.target || window.event.srcElement,
    files = tgt.files;

  // FileReader support
  if (FileReader && files && files.length) {
    var fr = new FileReader();
    fr.onload = () => showImage(fr);
    fr.readAsDataURL(files[0]);
  }
});

function showImage(fileReader) {
  img.crossOrigin="anonymous";
  img.src = fileReader.result;

  img.onload = function() {
    w = img.width;
    h = img.height;

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0);

    var pixelArr = ctx.getImageData(0, 0, w, h).data;
    let sample_size = parseInt(w / width);
    // newBoard.displayImage(pixelArr);

    var delayInMilliseconds = 2000;

    for (var y = 0; y < h; y += sample_size) {
      for (var x = 0; x < w; x += sample_size) {
        var p = (x + (y * w)) * 4;
        let lightness = parseInt(pixelArr[p]*.299 + pixelArr[p + 1]*.587 + pixelArr[p + 2]*.114);

        let r = parseInt(y/sample_size);
        let c = parseInt(x/sample_size);

        $(`#${r}-${c}`).removeClass("empty");
        $(`#${r}-${c}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");

        // if (x < width && y < height) {$(`#${x}-${y}`).css("background-color", "rgb(208,208,208)");}
      }
    }
  };
};