document.addEventListener("DOMContentLoaded", function () {
  const board = document.getElementById("board");
  const resetButton = document.getElementById("reset");
  const getBestMoveButton = document.getElementById("bestMove");
  const cells = [];
  const boardState = Array.from({ length: 6 }, () => Array(7).fill(0));
  let currentPlayer = 1;

  // Create the board
  for (let i = 0; i < 6; i++) {
    cells[i] = [];
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i; // Set the data-row attribute
      cell.dataset.col = j; // Set the data-col attribute
      cell.row = i;
      cell.col = j;
      cells[i][j] = cell;
      board.appendChild(cell);
    }
  }

  function dropPiece(board, col, simulated) {
    for (let i = 5; i >= 0; i--) {
      if (board[i][col] === 0) {
        board[i][col] = currentPlayer;
        if (!simulated) {
          cells[i][col].classList.add(`player-${currentPlayer}`);
        }
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
    removeRecommendation();
    const col = event.target.col;
    const row = dropPiece(boardState, col, false);
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

  function getBestMove() {
    removeRecommendation();
    let bestMove = null;
    let bestEval = -Infinity;

    for (let col = 0; col < 7; col++) {
      if (boardState[0][col] === 0) {
        const newBoard = boardState.map((row) => row.slice());
        const eval = minimax(newBoard, 5, -Infinity, Infinity, false);
        if (eval > bestEval) {
          bestEval = eval;
          bestMove = col;
        }
      }
    }
    console.log(bestMove);
    highlightRecommendation(bestMove);
    return bestMove;
  }

  function minimax(board, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || isGameOver(board)) {
      return evaluateBoard(board);
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let col = 0; col < 7; col++) {
        if (board[0][col] === 0) {
          const row = dropPiece(board, col, true); // Pass the board to dropPiece
          const eval = minimax(board, depth - 1, alpha, beta, false);
          maxEval = Math.max(maxEval, eval);
          alpha = Math.max(alpha, eval);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let col = 0; col < 7; col++) {
        if (board[0][col] === 0) {
          const row = dropPiece(board, col, true); // Pass the board to dropPiece
          const eval = minimax(board, depth - 1, alpha, beta, true);
          minEval = Math.min(minEval, eval);
          beta = Math.min(beta, eval);
          if (beta <= alpha) break; // Alpha-beta pruning
        }
      }
      return minEval;
    }
  }

  function isGameOver(board) {
    return checkWinner(0, 0) || board.flat().every((cell) => cell !== 0);
  }

  function evaluateBoard(board) {
    if (checkWinner(0, 0)) {
      return -1; // Player 2 wins
    } else if (checkWinner(0, 1)) {
      return 1; // Player 1 wins
    } else {
      return 0; // Draw
    }
  }

  function highlightRecommendation(col) {
    for (let i = 0; i < 6; i++) {
      const cell = document.querySelector(`[data-col='${col}'][data-row='${i}']`);
      if (cell) {
        cell.classList.add("recommendation");
      }
    }
  }

  function removeRecommendation() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.classList.remove("recommendation"));
  }

  board.addEventListener("click", handleClick);
  resetButton.addEventListener("click", resetBoard);
  getBestMoveButton.addEventListener("click", getBestMove);
});
