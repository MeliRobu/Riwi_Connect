from flask import Flask
from database.connection import get_connection

# Flask also serves the frontend directly (files in ../frontend),
# so we avoid having to configure CORS between two separate servers.
app = Flask(__name__, static_folder="frontend_dist", static_url_path="")

@app.route("/")
def index():
    # Serves the compiled frontend's entry point.
    # Everything after this is handled client-side by router.js (hash routing),
    # so we only need to serve index.html once, here at the root.
    return app.send_static_file("index.html")

@app.route("/health")
def health():
    """
    Simple check to confirm everything is working: that Flask
    started correctly and can connect to Postgres.

    Not part of any real module yet, just a sanity check that
    the foundation is ready to build on.
    """
    try:
        conn = get_connection()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        # If Postgres doesn't respond, return a 500 instead of "ok",
        # so it's immediately clear the issue is the connection.
        return {"status": "ok", "database": "error", "detail": str(e)}, 500


# Real project routes (login, assessment, teams, etc.) will be
# added below as each module gets built.

if __name__ == "__main__":
    # host="0.0.0.0" is required so the container is reachable
    # from outside. With 127.0.0.1 it would only work internally.
    app.run(host="0.0.0.0", port=5000, debug=True)