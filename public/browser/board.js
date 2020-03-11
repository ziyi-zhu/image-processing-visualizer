var filterWeights = {
  "none": [0, 0, 0, 0, 1, 0, 0, 0, 0],
  "sobelVertical": [1, 0, -1, 2, 0, -2, 1, 0, -1],
  "sobelHorizontal": [1, 2, 1, 0, 0, 0, -1, -2, -1],
  "box": [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
  "gaussian": [1/16, 1/8, 1/16, 1/8, 1/4, 1/8, 1/16, 1/8, 1/16],
}

function Pixel(id, status) {
  this.id = id;
  this.status = status;
  this.lightness = 0;
}

function Filter(height, width, type) {
  this.height = height;
  this.width = width;
  this.type = type;
  this.weights = filterWeights[type];
  this.pixels = [];
  this.output = 0;
}

Filter.prototype.apply = function() {
  let output = 0;
  let size = this.height * this.width;
  for (let i = 0; i < size; i++) {
    output += this.weights[i] * this.pixels[i].lightness;
  }
  if (this.type == "sobelVertical" || this.type == "sobelHorizontal") {
    this.output = (output + 512) / 4;
  }
  else {
    this.output = output;
  }
  
}

function Board(height, width) {
  this.height = height;
  this.width = width;
  this.boardArray = [];
  this.pixels = {};
  this.mouseDown = false;
  this.buttonsOn = true;
  this.filter = null;
}

Board.prototype.initialise = function() {
  this.createGrid();
  this.createFilter();
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

Board.prototype.createFilter = function() {
  let newFilter = new Filter(3, 3, "none");
  let tableHTML = "";
  for (let r = 0; r < 3; r++) {
    let currentHTMLRow = `<tr>`;
    for (let c = 0; c < 3; c++) {
      let newPixelId = 3 * r + c;

      newPixelClass = "empty";
      newPixel = new Pixel(newPixelId, newPixelClass);
      currentHTMLRow += `<td id="${newPixelId}"></td>`;
      newFilter.pixels[3 * r + c] = newPixel;
    }
    tableHTML += `${currentHTMLRow}</tr>`;
    this.filter = newFilter;
  }

  let filter = document.getElementById("input");
  filter.innerHTML += tableHTML;
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
          let lightness = this.filter.output;
          $(`#${currentId}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");
        }
      }
      currentElement.onmouseup = () => {
        if (this.buttonsOn) {
          board.mouseDown = false;
        }
      }
      currentElement.onmouseenter = () => {
        board.updateFilter(r, c);
        $(`#${currentId}`).removeClass("normal");
        $(`#${currentId}`).addClass("current");
        if (this.buttonsOn) {
          if (board.mouseDown) {
            let lightness = this.filter.output;
            $(`#${currentId}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");
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

Board.prototype.updateFilter = function(row, col) {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let r = row + x - 1;
      let c = col + y - 1;
      let lightness = 0;
      let pixelId = 3 * x + y;
      if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
        lightness = this.pixels[`${r}-${c}`].lightness;
      }
      $(`#${pixelId}`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");
      this.filter.pixels[pixelId].lightness = lightness;
    }
  }
  this.filter.apply();
  let lightness = this.filter.output;
  $(`#output`).css("background-color", "rgb(" + lightness + "," + lightness + "," + lightness + ")");
};