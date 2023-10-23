document.addEventListener("DOMContentLoaded", function () {
  const board = document.getElementById("board");
  const resetButton = document.getElementById("reset");
  const cells = [];
  const boardState = Array.from({ length: 6 }, () => Array(7).fill(0));
  let currentPlayer = 1;

  // Create the board
  for (let i = 0; i < 6; i++) {
    cells[i] = [];
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.row = i;
      cell.col = j;
      cells[i][j] = cell;
      board.appendChild(cell);
    }
  }

  function dropPiece(col) {
    for (let i = 5; i >= 0; i--) {
      if (boardState[i][col] === 0) {
        boardState[i][col] = currentPlayer;
        cells[i][col].classList.add(`player-${currentPlayer}`);
        return i;
      }
    }
    return -1; // Column is full
  }

  function checkWinner(row, col) {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];
    for (const [dr, dc] of directions) {
      let count = 1;
      count += countDirection(row, col, dr, dc);
      count += countDirection(row, col, -dr, -dc);
      if (count >= 4) return true;
    }
    return false;
  }

  function countDirection(row, col, dr, dc) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 7) {
      if (boardState[r][c] === currentPlayer) {
        count++;
      } else {
        break;
      }
      r += dr;
      c += dc;
    }
    return count;
  }

  function handleClick(event) {
    const col = event.target.col;
    const row = dropPiece(col);
    if (row !== -1) {
      if (checkWinner(row, col)) {
        alert(`Player ${currentPlayer} wins!`);
        resetBoard();
      } else {
        currentPlayer = 3 - currentPlayer; // Switch player
      }
    }
  }

  function resetBoard() {
    boardState.forEach((row) => row.fill(0));
    cells.forEach((row) => row.forEach((cell) => cell.classList.remove("player-1", "player-2")));
    currentPlayer = 1;
  }

  board.addEventListener("click", handleClick);
  resetButton.addEventListener("click", resetBoard);

  // Export necessary functions for later use in minimax algorithm
  window.ConnectFour = {
    dropPiece,
    checkWinner,
    currentPlayer,
  };
});
