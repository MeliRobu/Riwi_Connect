import psycopg2
from config import DATABASE_URL


def get_connection():
    """
    Abre y retorna una nueva conexión a PostgreSQL, usando la cadena
    definida en config.py (ver GI-001, seccion 8).
    """
    return psycopg2.connect(DATABASE_URL)