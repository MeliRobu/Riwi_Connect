from flask import Flask
import os
from database.connection import get_connection
from config import SECRET_KEY
from routes.user_routes import user_routes
from routes.assessment_routes import assessment_routes
from routes.team_routes import team_routes
from routes.admin_routes import admin_bp

# Flask also serves the frontend directly (static files in frontend_dist),
# so we don't need to deal with CORS between two separate servers
app = Flask(__name__, static_folder="frontend_dist", static_url_path="")
app.secret_key = SECRET_KEY  # required for session to work (login/logout)
app.register_blueprint(user_routes)
app.register_blueprint(assessment_routes)
app.register_blueprint(team_routes)
app.register_blueprint(admin_bp)

@app.route("/")
def index():
    # index.html handles everything else client-side via hash routing
    return app.send_static_file("index.html")

@app.route("/health")
def health():
    # just a sanity check that Flask is up and can reach Postgres,
    # not tied to any real module
    try:
        conn = get_connection()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": "error", "detail": str(e)}, 500


if __name__ == "__main__":
    # 0.0.0.0 so the container is reachable from outside;
    # 127.0.0.1 would only work internally
    # HU: (vacío documental) — debug=True estaba escrito directamente en
    # el código, dejando el depurador interactivo de Werkzeug expuesto
    # públicamente incluso en producción (Render) -- riesgo de seguridad
    # real, ya que ese depurador permite ejecutar código arbitrario si se
    # desbloquea. Ahora depende de una variable de entorno, en falso por
    # defecto en cualquier entorno donde no se active explícitamente.
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)