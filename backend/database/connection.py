import psycopg2
from config import DATABASE_URL


def get_connection():
    """
    Abre una conexion nueva a la base de datos.

    Los datos de conexion vienen de config.py, que cada quien tiene
    de forma local y nunca se sube al repo (por eso existe config.example.py
    como plantilla).

    Ojo: dentro de Docker, el host se llama "db", no "localhost" —
    es el nombre del servicio de Postgres en el docker-compose.yml.
    """
    return psycopg2.connect(DATABASE_URL)