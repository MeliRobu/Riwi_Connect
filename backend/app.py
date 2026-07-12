from flask import Flask
from database.connection import get_connection

app = Flask(__name__, static_folder="../frontend", static_url_path="")


@app.route("/health")
def health():
    try:
        conn = get_connection()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": "error", "detail": str(e)}, 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)