from flask import Blueprint, request, jsonify
from utils.stockfish_engine import get_best_move

chess_routes = Blueprint("chess_routes", __name__)

@chess_routes.route("/get-move", methods=["POST"])
def get_move():
    data = request.json
    fen = data.get("fen", "")
    
    if not fen:
        return jsonify({"error": "FEN string is required"}), 400
    
    best_move = get_best_move(fen)
    return jsonify({"best_move": best_move})
