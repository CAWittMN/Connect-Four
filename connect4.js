/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor() {
    this.board = [];
    this.players = [];
    this.width = 7;
    this.height = 6;
    this.currPlayer = 0;
    this.startGame();
  }

  startGame() {
    this.getPlayerNames();
    this.makeBoard();
    this.makeHtmlBoard();
    this.startingPlayer();
  }

  getPlayerNames() {
    this.players.push(document.getElementById("player1").value);
    this.players.push(document.getElementById("player2").value);
  }

  startingPlayer() {
    this.currPlayer = Math.floor(Math.random() * 2 + 1);
    this.updateCurrentPlayer();
  }

  makeBoard() {
    for (let i = 0; i < this.height; i++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    document.getElementById("current-player").classList.remove("no-display");
    document.getElementById("start-instructions").classList.add("no-display");
    const gameBox = document.getElementById("game-box");
    const htmlBoard = document.createElement("table");
    htmlBoard.setAttribute("id", "board");
    gameBox.append(htmlBoard);
    const top = document.createElement("tr");
    this.handleBoundClick = this.handleClick.bind(this);
    top.classList.add(`player${this.currPlayer}hover`);
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleBoundClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  switchPlayer() {
    this.currPlayer === 1 ? (this.currPlayer = 2) : (this.currPlayer = 1);
  }

  updateCurrentPlayer() {
    const top = document.querySelector("tr");
    const playerDot = document.getElementById("player-dot");
    document.getElementById("current-player-name").innerText =
      this.players[this.currPlayer - 1];
    playerDot.classList.remove("player1");
    playerDot.classList.remove("player2");
    playerDot.classList.add(`player${this.currPlayer}`);
    top.classList.remove("player2hover");
    top.classList.remove("player1hover");
    top.classList.add(`player${this.currPlayer}hover`);
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame(this.currPlayer, 1);
    }
    if (this.checkForWin()) {
      return this.endGame(this.currPlayer, 0);
    }

    this.switchPlayer();
    this.updateCurrentPlayer();
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece", "grow");
    piece.classList.add(`player${this.currPlayer}`);
    const openSpot = document.getElementById(`${y}-${x}`);
    openSpot.append(piece);
    setTimeout(() => piece.classList.remove("grow"), 1);
  }

  checkForWin() {
    const winCondition = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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

        if (
          winCondition(horiz) ||
          winCondition(vert) ||
          winCondition(diagDR) ||
          winCondition(diagDL)
        ) {
          return true;
        }
      }
    }
  }

  updateWinnerText(winner, tie) {
    console.log(winner);
    const winnerText = document.getElementById("winner-name");
    winnerText.classList.remove("RED");
    winnerText.classList.remove("YELLOW");
    winnerText.classList.remove("tie");
    if (tie === 0) {
      let winnerColor = "";
      winner === 1 ? (winnerColor = "RED") : (winnerColor = "YELLOW");
      winnerText.innerText = `${this.players[winner - 1]}`;
      winnerText.classList.add(`${winnerColor}`);
    }
    if (tie === 1) {
      winnerText.classList.add("tie");
      winnerText.innerText = "NOBODY";
    }
  }

  endGame(winner, tieStatus) {
    console.log(winner);
    document
      .querySelector("tr")
      .removeEventListener("click", this.handleBoundClick);
    const winnerWindow = document.getElementById("winner");
    this.updateWinnerText(winner, tieStatus);

    setTimeout(() => {
      winnerWindow.classList.remove("no-display");
    }, 500);
  }
  /*clearGame() {
    const htmlBoard = document.getElementById("game-box");
    htmlBoard.removeChild(htmlBoard.firstChild);
    document.querySelector("#winner").classList.add("no-display");
    new Game();
  }*/
}

document.getElementById("rules-toggle").addEventListener("click", () => {
  document.getElementById("arrow").classList.toggle("arrow-down");
  document.getElementById("rules-text").classList.toggle("no-display");
});

document.getElementById("new-game").addEventListener("click", () => {
  const htmlBoard = document.getElementById("game-box");
  htmlBoard.removeChild(htmlBoard.firstChild);
  document.getElementById("start-instructions").classList.remove("no-display");
  document.getElementById("winner").classList.add("no-display");
  document.getElementById("start-button").classList.remove("no-display");
  document.getElementById("current-player").classList.add("no-display");
});

document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("player1").value == "" ||
  document.getElementById("player2").value == ""
    ? alert("Please enter player names")
    : new Game() &&
      document.getElementById("start-button").classList.add("no-display");
});
