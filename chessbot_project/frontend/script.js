const game = new Chess();
let board;
let whiteTime = 300, blackTime = 300;
let whiteInterval, blackInterval;
let paused = false;
let whiteStarted = false;

function updateTimerDisplay() {
  document.getElementById("white-timer").textContent = formatTime(whiteTime);
  document.getElementById("black-timer").textContent = formatTime(blackTime);
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function startWhiteTimer() {
  clearInterval(blackInterval);
  clearInterval(whiteInterval);
  whiteInterval = setInterval(() => {
    if (!paused) {
      whiteTime--;
      updateTimerDisplay();
      if (whiteTime <= 0) endGame("Black (AI) wins! White ran out of time.");
    }
  }, 1000);
}

function startBlackTimer() {
  clearInterval(whiteInterval);
  clearInterval(blackInterval);
  blackInterval = setInterval(() => {
    if (!paused) {
      blackTime--;
      updateTimerDisplay();
      if (blackTime <= 0) endGame("White (You) wins! Black ran out of time.");
    }
  }, 1000);
}

function pauseTimers() {
  paused = true;
}

function resumeTimers() {
  paused = false;
}

function resetGame() {
  game.reset();
  board.position('start');
  whiteTime = blackTime = 300;
  updateTimerDisplay();
  paused = false;
  clearInterval(whiteInterval);
  clearInterval(blackInterval);
  whiteStarted = false;
  document.getElementById("board").classList.remove("glow-red");
  document.getElementById("status").textContent = "";
  document.getElementById("gameResultModal").classList.remove("show");
}

function removeGreySquares() {
  $('#board .square-55d63').css('background', '');
}

function greySquare(square) {
  const squareEl = $('#board .square-' + square);
  let background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d')) background = '#696969';
  squareEl.css('background', background);
}

function endGame(message) {
  pauseTimers();
  document.getElementById("status").textContent = message;
  document.getElementById("gameResultText").textContent = message;
  document.getElementById("gameResultModal").classList.add("show");
  document.getElementById("board").classList.add("glow-red");
}

function checkGameStatus() {
  if (game.in_checkmate()) {
    const winner = game.turn() === 'w' ? "Black (AI)" : "White (You)";
    endGame(`Checkmate! ${winner} wins!`);
  } else if (game.in_draw()) {
    endGame("Draw!");
  } else if (game.in_check()) {
    document.getElementById("status").textContent = `${game.turn() === 'w' ? "White" : "Black"} is in check!`;
  } else {
    document.getElementById("status").textContent = `${game.turn() === 'w' ? "White" : "Black"}'s move`;
  }
}

board = Chessboard('board', {
  draggable: true,
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',

  onDragStart: function (source, piece) {
    if (game.game_over() || paused) return false;

    if (!whiteStarted && piece.search(/^w/) !== -1) {
      whiteStarted = true;
      startWhiteTimer();
    }

    removeGreySquares();
    const moves = game.moves({ square: source, verbose: true });
    if (moves.length === 0) return;
    for (let move of moves) greySquare(move.to);
  },

  onDrop: function (source, target) {
    if (paused) return 'snapback';

    removeGreySquares();
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    checkGameStatus();
    startBlackTimer();
    setTimeout(makeAIMove, 1000 + Math.random() * 1000);
  },

  onSnapEnd: function () {
    board.position(game.fen());
  }
});

function makeAIMove() {
  if (paused) return;
  const difficulty = document.getElementById('difficulty').value;
  fetch('http://127.0.0.1:5000/chess/get-move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen: game.fen(), level: difficulty })
  })
    .then(res => res.json())
    .then(data => {
      const move = data.best_move;
      if (move) {
        game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: 'q' });
        board.position(game.fen());
        checkGameStatus();
        startWhiteTimer();
      }
    })
    .catch(err => console.error(err));
}

document.getElementById("modeToggle").addEventListener("change", function () {
  document.body.classList.toggle("light-mode");
});