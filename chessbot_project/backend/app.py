# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.stockfish_engine import get_best_move

app = Flask(__name__)
CORS(app)

@app.route("/chess/get-move", methods=["POST"])
def get_move():
    data = request.json
    fen = data.get("fen")
    level = data.get("level", "medium").lower()
    move = get_best_move(fen, level)
    return jsonify({"best_move": move})

if __name__ == "__main__":
    app.run(debug=True)
