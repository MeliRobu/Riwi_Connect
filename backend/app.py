from flask import Flask
from database.connection import get_connection

# Flask tambien sirve el frontend directamente (los archivos de ../frontend),
# asi evitamos tener que configurar CORS entre dos servidores separados.
app = Flask(__name__, static_folder="../frontend", static_url_path="")


@app.route("/health")
def health():
    """
    Endpoint simple para comprobar que todo esta funcionando:
    que Flask arranco bien y que se puede conectar a Postgres.

    No es parte de ningun modulo real todavia, es solo una prueba
    de que la base esta lista para empezar a construir encima.
    """
    try:
        conn = get_connection()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        # Si Postgres no responde, devolvemos error 500 en vez de "ok",
        # para que se note de una que el problema es la conexion.
        return {"status": "ok", "database": "error", "detail": str(e)}, 500


# Aqui abajo se iran agregando las rutas reales del proyecto
# (login, assessment, teams, etc.) a medida que se vayan construyendo.

if __name__ == "__main__":
    # host="0.0.0.0" es obligatorio para que el contenedor sea
    # accesible desde afuera. Con 127.0.0.1 solo funcionaria por dentro.
    app.run(host="0.0.0.0", port=5000, debug=True)