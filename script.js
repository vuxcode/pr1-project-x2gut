var playerXScore = 0;
var playerOScore = 0;

var currentPlayer = "X";

// prettier-ignore
var board = ["-", "-", "-",
             "-", "-", "-",
             "-", "-", "-"
            ];

var firstRow = document.getElementById("row-1");
var secondRow = document.getElementById("row-2");
var thirdRow = document.getElementById("row-3");

var themeButton = document.getElementById("theme-button");

themeButton.addEventListener("click", () => {
  if (document.body.className === "dark") {
    document.body.className = "";
    return;
  }
  document.body.className = "dark";
});

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
  var cellId = Number(cellId.split("-")[1]) - 1;

  if (board[cellId] !== "-") {
    return;
  }

  board[cellId] = currentPlayer;
  console.log(board);
  var cellElement = document.getElementById(`cell-${cellId + 1}`);
  var playerMoveElement = document.createElement("div");
  playerMoveElement.className = "mark-" + currentPlayer.toLowerCase();
  cellElement.appendChild(playerMoveElement);

  changeTurn();
  var winner = checkWinner();
  if (winner) {
    proccessWinner(winner);
  }
  var isDraw = checkDraw();
  if (isDraw) {
    proccessDraw();
  }
}

function proccessDraw() {
  alert("It is draw!");
  clearBoard();
}

function proccessWinner(winner) {
  if (winner === "X") {
    playerXScore++;
    alert("Player X wins!");
  } else if (winner === "O") {
    playerOScore++;
    alert("Player O wins!");
  }
  updateScores();
  console.log("proccess winner");
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
