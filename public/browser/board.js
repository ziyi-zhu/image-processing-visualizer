function Pixel(id, status) {
  this.id = id;
  this.status = status;
  this.lightness = 0;
}

function Board(height, width) {
  this.height = height;
  this.width = width;
  this.boardArray = [];
  this.pixels = {};
  this.mouseDown = false;
  this.buttonsOn = true;
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
          $(`#${currentId}`).css("background-color", "white");
        }
      }
      currentElement.onmouseup = () => {
        if (this.buttonsOn) {
          board.mouseDown = false;
        }
      }
      currentElement.onmouseenter = () => {
        if (this.buttonsOn) {
          if (board.mouseDown) {
            $(`#${currentId}`).css("background-color", "white");
          }
        }
      }
      currentElement.onmouseleave = () => {
        if (this.buttonsOn) {

        }
      }
    }
  }
};