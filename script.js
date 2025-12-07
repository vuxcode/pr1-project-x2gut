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
// This variable neends to block input when we have a winner to prevent further moves
var blockInput = false;
//Easy || Hard
var botDifficulty = "Easy";

var firstRow = document.getElementById("row-1");
var secondRow = document.getElementById("row-2");
var thirdRow = document.getElementById("row-3");

var themeButton = document.getElementById("theme-button");
var gamemodeButton = document.getElementById("gamemode-button");
var difficultyButton = document.getElementById("difficulty-button");

// Theme toggle button
themeButton.addEventListener("click", () => {
  // Toggle dark mode and makes inner circle visible/invisible for moon animation
  var innerCircle = document.querySelector(".inner-circle");
  if (document.body.className === "dark") {
    document.body.className = "";
    innerCircle.classList.remove("visible");
    return;
  }
  innerCircle.classList.add("visible");
  document.body.className = "dark";
});

gamemodeButton.addEventListener("click", changeGameMode);
difficultyButton.addEventListener("click", changeDifficulty);

function changeDifficulty() {
  if (gameMode === "twoPlayers") {
    alert("You can change difficulty only in Bot mode!");
    return;
  }

  if (botDifficulty === "Hard") {
    botDifficulty = "Easy";
    difficultyButton.innerText = "Difficulty: 🟢 Easy";
    return;
  }
  botDifficulty = "Hard";
  difficultyButton.innerText = "Difficulty: 🔴 Hard";
}

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
    cellElement.classList.remove("active");
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
  if (blockInput) return;
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

function getBestMove(playerMark) {
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const [a, b, c] = condition;
    const marks = [board[a], board[b], board[c]];
    const playerMarksCount = marks.filter((mark) => mark === playerMark).length;
    if (playerMarksCount === 2) {
      return condition.find((index) => board[index] === "-");
    }
  }
  return false;
}

function handleBotMove() {
  // ------Simple bot that makes random moves (or trying to prevent player's win, depends on difficulty)------

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

  // ------Hard bot that blocks player from winning------
  if (botDifficulty === "Hard") {
    const playerMark = currentPlayer === "X" ? "O" : "X";
    const possiblePlayerWinIndex = getBestMove(playerMark);
    if (possiblePlayerWinIndex) {
      botMove = possiblePlayerWinIndex;
    } else {
      const possibleBotWinIndex = getBestMove(currentPlayer);
      if (possibleBotWinIndex) {
        botMove = possibleBotWinIndex;
      }
    }
  }

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
  }
  if (checkDraw()) {
    proccessDraw();
    return true;
  }
  return false;
}

function proccessDraw() {
  alert("It is draw!");
  clearBoard();
}

function proccessWinner(winner) {
  blockInput = true;
  setTimeout(() => {
    if (winner === "X") {
      playerXScore++;
      alert("Player X wins!");
    } else if (winner === "O") {
      playerOScore++;
      alert("Player O wins!");
    }
    updateScores();
    clearBoard();
    blockInput = false;
  }, 300);
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
  for (var i = 0; i < winConditions.length; i++) {
    var condition = winConditions[i];
    const [a, b, c] = condition;

    if (board[a] === "-" || board[b] === "-" || board[c] === "-") {
      continue;
    }

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      for (let i = 0; i < condition.length; i++) {
        let cellIndex = condition[i];
        let cellElement = document.getElementById(`cell-${cellIndex + 1}`);
        cellElement.classList.add("active");
      }
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
