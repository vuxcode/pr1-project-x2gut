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

// First to third row of a board
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
  // If mode is already dark then we remove class "dark" from body and makes sun out of moon
  // by removing class "visible"
  if (document.body.className === "dark") {
    document.body.className = "";
    innerCircle.classList.remove("visible");
    return;
  }
  // Almsot the same but here we are adding classes instead of removing them
  innerCircle.classList.add("visible");
  document.body.className = "dark";
});

gamemodeButton.addEventListener("click", changeGameMode);
difficultyButton.addEventListener("click", changeDifficulty);

// Function that handles difficulty changes
function changeDifficulty() {
  // If player not in bot mode then we are not changing the difficulty
  if (gameMode === "twoPlayers") {
    alert("You can change difficulty only in Bot mode!");
    return;
  }

  // Otherwise we are changing it and buttons text changes too depends on current difficulty
  if (botDifficulty === "Hard") {
    botDifficulty = "Easy";
    difficultyButton.innerText = "Difficulty: 🟢 Easy";
    return;
  }
  botDifficulty = "Hard";
  difficultyButton.innerText = "Difficulty: 🔴 Hard";
}

// Well the name of the function describes it pretty much clear I think :)
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
  // In this function we are referring to the global variable board and simply make it the same
  // as it was in the beginning. Then we create a loop from 1 to 9 and clear the innerHTML of every cell
  // In my case innerHTML can contain a div with an image of "O" or "X" if it's occupied.
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
  // Simply referring to the global variables of players score, reseting it and clear the board.
  playerOScore = 0;
  playerXScore = 0;
  updateScores();

  clearBoard();
}

var resetGameButton = document
  .getElementById("reset-button")
  .addEventListener("click", resetGame);

function registerEventListeners(row) {
  // This function takes a row element and iterates through its child cells
  // to register a click callback for every one
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
    // If the game is actually end then we are not going to change turn and proccess bot move, the function will just do nothing
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
  // Function for the bot. It allows the bot to find the best possible move on the board.
  // It takes playerMark as argument because 
  // our bot can be either "X" or "O", so we can find a move that can blocks player from win or
  // find two bot's marks and win the game 

  //Firstly we are going to iterate through all win condtitions
  for (let i = 0; i < winConditions.length; i++) {
    //for example if winCondition[i] is [0, 1, 2]
    // then condition = [0, 1, 2] 
    const condition = winConditions[i];

    // Here we destructure the condition array into three indexes. 
    // If condition is [0, 1, 2] then [a, b, c] = [0, 1, 2]
    const [a, b, c] = condition;

    // As we remember above we had [a, b, c] === [0, 1, 2] as an example. 
    // That means now we are going to take every cell with such indexes
    // on the board
    const marks = [board[a], board[b], board[c]];
    // filter function is kinda simple, it iterates through every element of an array and applies a function
    // to all of them. In our case we check that mark is equal to playerMark that we provided as an argument
    const playerMarksCount = marks.filter((mark) => mark === playerMark).length;
    //If we have exatly two marks that means we found a move that can either block player or win
    if (playerMarksCount === 2) {
      // and if that's so we are returning index of this cell using function "find". In our case it simply iterates through
      // the conditions that we defined earlier, gets value of the board and if it's equals "-" returns index of this value
      return condition.find((index) => board[index] === "-");
    }
  }
  // Otherwise there is no good move here
  return false;
}

function handleBotMove() {
  // ------Simple bot that makes random moves (or trying to prevent player's winning, depends on difficulty)------

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
    // In this case player's mark is opposite to current
    // To define it I use ternary operator.
    // It has the following syntax ->
    // const variablie = (condition) ? (do something if true) : (do something if false)
    // --------------
    // let playerMark;
    // if (currentPlayer === "X") {playerMark = "O"}
    // else {playerMark === "X"}
    // --------------

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
  // In this function we update both our board array and the cell on the page.
  // First we put the player's mark ("X" or "O") into the board at the given index.
  board[index] = player;

  // Then we need to find the HTML element that represents this cell.
  // For example if index is 0 we get element with id="cell-1".
  const cellElement = document.getElementById(`cell-${index + 1}`);

  // After that we create a new div that will visually show the player's mark.
  // Its class name depends on the player, so "X" becomes "mark-x" and "O" becomes "mark-o".
  const mark = document.createElement("div");
  mark.className = "mark-" + player.toLowerCase();

  cellElement.appendChild(mark);
}


function checkGameEnd() {
  // Simple function that calls another functions inside self to check if there is a winner or a draw and proccessing it.
  // Returns true if there is a winner ot its a draw, otherwise false.
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
  // Because of the timeouts we are using, user have a 300 ms to put a mark on the board while its proccesing a winner or a draw.
  // Thats why we need to check if input is blocked and if that's so we are doing nothing.
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
    // Realsing user's input in the end of the function
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
  // In this function we go through every win condition and check
  // if any of them is currently completed on the board.

  for (var i = 0; i < winConditions.length; i++) {
    // Here we take one win condition. For example: [0, 1, 2].
    var condition = winConditions[i];

    // We destructure it into three indexes: a, b and c.
    const [a, b, c] = condition;

    // If any of these cells is empty ("-"), then this line can't be a win,
    // so we simply skip it and continue with the next condition.
    if (board[a] === "-" || board[b] === "-" || board[c] === "-") {
      continue;
    }

    // If all three cells contain the same mark, then we found a winner.
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // In this case we highlight these cells on the board
      // by adding the "active" class to everyone of them.
      for (let i = 0; i < condition.length; i++) {
        let cellIndex = condition[i];
        let cellElement = document.getElementById(`cell-${cellIndex + 1}`);
        cellElement.classList.add("active");
      }

      // And we return the mark of the winner ("X" or "O").
      return board[a];
    }
  }

  // If no win condition was matched, we return null.
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
