from flask import Flask, jsonify, request
from flask_cors import CORS

from routes.chess_routes import chess_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(chess_routes, url_prefix="/chess")

@app.route("/")
def home():
    return jsonify({"message": "Chess Bot Backend is running!"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
