from stockfish import Stockfish

# Give correct path to your Stockfish executable
stockfish = Stockfish(path=r"C:\Users\Mukul Ghai\Downloads\stockfish-windows-x86-64-avx2\stockfish\stockfish-windows-x86-64-avx2.exe")

def get_best_move(fen: str) -> str:
    stockfish.set_fen_position(fen)
    return stockfish.get_best_move()
