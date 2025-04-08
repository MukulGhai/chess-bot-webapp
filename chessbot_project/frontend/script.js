const game = new Chess();

function removeGreySquares() {
  $('#board .square-55d63').css('background', '');
}

function greySquare(square) {
  const squareEl = $('#board .square-' + square);
  let background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }
  squareEl.css('background', background);
}

const config = {
  draggable: true,
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  onDragStart: function (source, piece, position, orientation) {
    if (game.game_over()) return false;

    removeGreySquares();

    const moves = game.moves({
      square: source,
      verbose: true
    });

    if (moves.length === 0) return;

    for (let i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  },

  onDrop: function (source, target) {
    removeGreySquares();

    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) return 'snapback';

    setTimeout(makeAIMove, 250);
  },

  onSnapEnd: function () {
    board.position(game.fen());
  }
};

const board = Chessboard('board', config);

function makeAIMove() {
    const fen = game.fen();
  
    fetch('http://127.0.0.1:5000/chess/get-move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fen })
    })
    .then(response => response.json())
    .then(data => {
      const move = data.best_move;
      if (move) {
        game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: 'q' });
        board.position(game.fen());
      }
    })
    .catch(error => console.error('Error getting AI move:', error));
  }
  
