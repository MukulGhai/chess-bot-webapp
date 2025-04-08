from utils.stockfish_engine import get_best_move

fen = "r1bqkbnr/pppppppp/n7/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
move = get_best_move(fen)
print("Best move:", move)
