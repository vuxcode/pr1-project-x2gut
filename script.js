var playerXScore = 0;
var playerOScore = 0;

var currentPlayer = "X";
var gameMode = "twoPlayers";
var gameMode = "twoPlayers";

// prettier-ignore
var board = ["-", "-", "-",
             "-", "-", "-",
             "-", "-", "-"
            ];

var firstRow = document.getElementById("row-1");
var secondRow = document.getElementById("row-2");
var thirdRow = document.getElementById("row-3");

var themeButton = document.getElementById("theme-button");
var gamemodeButton = document.getElementById("gamemode-button");
var gamemodeButton = document.getElementById("gamemode-button");

themeButton.addEventListener("click", () => {
  var innerCircle = document.querySelector(".inner-circle");
  var innerCircle = document.querySelector(".inner-circle");
  if (document.body.className === "dark") {
    document.body.className = "";
    innerCircle.classList.remove("visible");
    innerCircle.classList.remove("visible");
    return;
  }
  innerCircle.classList.add("visible");
  innerCircle.classList.add("visible");
  document.body.className = "dark";
});

gamemodeButton.addEventListener("click", changeGameMode);

function changeGameMode() {
  clearBoard();
  if (gameMode === "twoPlayers") {
    gameMode = "Bot";
    gamemodeButton.innerText = "GameMode: 🤖 Bot";
    return;
  }
  gameMode = "twoPlayers";
  gamemodeButton.innerText = "GameMode: 2 Players";
}

gamemodeButton.addEventListener("click", changeGameMode);

function changeGameMode() {
  clearBoard();
  if (gameMode === "twoPlayers") {
    gameMode = "Bot";
    gamemodeButton.innerText = "GameMode: 🤖 Bot";
    return;
  }
  gameMode = "twoPlayers";
  gamemodeButton.innerText = "GameMode: 2 Players";
}

function clearBoard() {
  console.log("Cleared");
  // prettier-ignore
  board = ["-", "-", "-",
          "-", "-", "-",
          "-", "-", "-"
          ];
  for (let i = 1; i <= 9; i++) {
    var cellElement = document.getElementById(`cell-${i}`);
    cellElement.innerHTML = "";
  }
}

function resetGame() {
  playerOScore = 0;
  playerXScore = 0;
  updateScores();

  console.log("Reseted game");
  clearBoard();
}

var resetGameButton = document
  .getElementById("reset-button")
  .addEventListener("click", resetGame);

function registerEventListeners(row) {
  for (let i = 0; i < 3; i++) {
    let cell = row.children[i];
    cell.addEventListener("click", () => handleClickOnCell(cell.id));
  }
}

function handleClickOnCell(cellId) {
  // Get cell index from cellId for example "cell-1" -> 0
  const cellIndex = Number(cellId.split("-")[1]) - 1;
  // Get cell index from cellId for example "cell-1" -> 0
  const cellIndex = Number(cellId.split("-")[1]) - 1;

  // If cell is already taken we do nothing
  if (board[cellIndex] !== "-") return;

  makeMove(cellIndex, currentPlayer);

  // Here we have a timeout to allow the DOM to update before checking for game end
  setTimeout(() => {
    if (checkGameEnd()) return;

    changeTurn();

    if (gameMode === "Bot") {
      handleBotMove();

      // Same timeout to allow DOM update but after bot move
      setTimeout(() => {
        if (checkGameEnd()) return;
        changeTurn();
      }, 50);
    }
  }, 50);
}

function handleBotMove() {
  // ------Simple bot that makes random moves------

  // Here we collect all cells that look like "-" and pushing it to the array
  let emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "-") {
      emptyCells.push(i);
    }
  }
  // If there is no empty cells we do nothing
  if (emptyCells.length === 0) {
  // If cell is already taken we do nothing
  if (board[cellIndex] !== "-") return;

  makeMove(cellIndex, currentPlayer);

  // Here we have a timeout to allow the DOM to update before checking for game end
  setTimeout(() => {
    if (checkGameEnd()) return;

    changeTurn();

    if (gameMode === "Bot") {
      handleBotMove();

      // Same timeout to allow DOM update but after bot move
      setTimeout(() => {
        if (checkGameEnd()) return;
        changeTurn();
      }, 50);
    }
  }, 50);
}

function handleBotMove() {
  // ------Simple bot that makes random moves------

  // Here we collect all cells that look like "-" and pushing it to the array
  let emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "-") {
      emptyCells.push(i);
    }
  }
  // If there is no empty cells we do nothing
  if (emptyCells.length === 0) {
    return;
  }
  // Getting random index from emptyCells array
  let randomIndex = Math.floor(Math.random() * emptyCells.length);
  let botMove = emptyCells[randomIndex];

  makeMove(botMove, currentPlayer);
}

function makeMove(index, player) {
  // Update the board array and the DOM
  board[index] = player;
  const cellElement = document.getElementById(`cell-${index + 1}`);
  const mark = document.createElement("div");
  mark.className = "mark-" + player.toLowerCase();
  cellElement.appendChild(mark);
}

function checkGameEnd() {
  const winner = checkWinner();
  // Getting random index from emptyCells array
  let randomIndex = Math.floor(Math.random() * emptyCells.length);
  let botMove = emptyCells[randomIndex];

  makeMove(botMove, currentPlayer);
}

function makeMove(index, player) {
  // Update the board array and the DOM
  board[index] = player;
  const cellElement = document.getElementById(`cell-${index + 1}`);
  const mark = document.createElement("div");
  mark.className = "mark-" + player.toLowerCase();
  cellElement.appendChild(mark);
}

function checkGameEnd() {
  const winner = checkWinner();
  if (winner) {
    proccessWinner(winner);
    return true;
    return true;
  }
  if (checkDraw()) {
  if (checkDraw()) {
    proccessDraw();
    return true;
    return true;
  }
  return false;
  return false;
}

function proccessDraw() {
  alert("It is draw!");
  clearBoard();
}

function proccessWinner(winner) {
  if (winner === "X") {j
    playerXScore++;
    alert("Player X wins!");
  } else if (winner === "O") {
    playerOScore++;
    alert("Player O wins!");
  }
  updateScores();
  clearBoard();
}

function changeTurn() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
  } else {
    currentPlayer = "X";
  }
}

function checkDraw() {
  if (!board.includes("-")) {
    return true;
  }
  return false;
}

function checkWinner() {
  var winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (var i = 0; i < winConditions.length; i++) {
    var condition = winConditions[i];
    const [a, b, c] = condition;

    if (board[a] === "-" || board[b] === "-" || board[c] === "-") {
      continue;
    }

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function updateScores() {
  document.getElementById("player-x-score").innerText =
    "Player X: " + playerXScore;
  document.getElementById("player-o-score").innerText =
    "Player O: " + playerOScore;
}

registerEventListeners(firstRow);
registerEventListeners(secondRow);
registerEventListeners(thirdRow);
