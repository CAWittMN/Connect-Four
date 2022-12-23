/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let currPlayer;
let board = [];

/** startingPlayer: chooses which player starts first randomly */
const startingPlayer = () => (currPlayer = Math.floor(Math.random() * 2) + 1);

/** makeBoard: create in-JS board structure: */
const makeBoard = () => {
  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array.from({ length: WIDTH }));
  }
};

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById("board");
  // creates top row for selecting a column to place the piece in
  const top = document.createElement("tr");
  top.classList.add(`player${currPlayer}hover`);
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
  // creates the empty spaces for the game board
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  const piece = document.createElement("div");
  piece.classList.add("piece", "grow");
  piece.classList.add(`player${currPlayer}`);
  const openSpot = document.getElementById(`${y}-${x}`);
  openSpot.append(piece);
  setTimeout(() => piece.classList.remove("grow"), 1);
};

/** endGame: announce game end */
const endGame = (winner) => {
  let winnerColor;
  winner === 1 ? (winnerColor = "RED") : (winnerColor = "YELLOW");
  const winnerText = document.getElementById("winner-color-text");
  const top = document.querySelector("tr");
  const winnerWindow = document.querySelector("#winner");
  top.removeEventListener("click", handleClick);
  setTimeout(() => {
    winnerWindow.classList.remove("nodisplay");
    winnerText.classList.add(`${winnerColor}-win`);
    winnerText.innerText = winnerColor;
  }, 500);
};

/** switchHoverColor: swaps the color of the top row based on current player */
const switchHoverColor = (player) => {
  const top = document.querySelector("tr");
  player === 1
    ? top.classList.toggle("player2hover")
    : top.classList.toggle("player1hover");
  top.classList.add(`player${currPlayer}hover`);
};

/** handleClick: handle click of column top to play piece */
const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  console.log(board);
  console.log(board[y][x]);
  placeInTable(y, x);
  // check for win
  if (checkForWin()) {
    return endGame(currPlayer);
  }
  //if board[y][x].includes('null')// check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  currPlayer == 1 ? (currPlayer = 2) : (currPlayer = 1);
  switchHoverColor(currPlayer);
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */
const _win = (cells) =>
  // Check four cells to see if they're all color of current player
  //  - cells: list of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer
  cells.every(
    ([y, x]) =>
      y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
  );

const checkForWin = () => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

const clearGame = () => {};

startingPlayer();
makeBoard();
makeHtmlBoard();
