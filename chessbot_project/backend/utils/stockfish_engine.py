# utils/stockfish_engine.py
from stockfish import Stockfish

def get_best_move(fen, level='medium'):
    stockfish_path = r"C:\Users\Mukul Ghai\Downloads\stockfish-windows-x86-64-avx2\stockfish\stockfish-windows-x86-64-avx2.exe"
    stockfish = Stockfish(path=stockfish_path)

    if level == 'easy':
        stockfish.set_skill_level(2)
        stockfish.set_depth(8)
    elif level == 'hard':
        stockfish.set_skill_level(15)
        stockfish.set_depth(20)
    else:  # medium
        stockfish.set_skill_level(8)
        stockfish.set_depth(12)

    stockfish.set_fen_position(fen)
    return stockfish.get_best_move()