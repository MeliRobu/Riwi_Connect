import os 
import psycopg2

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_connection():
    """
    Opens a new connection to the database.

    Connection details come from config.py, which each team member
    keeps locally and never commits (that's why config.example.py
    exists as a template).

    Note: inside Docker, the host is "db", not "localhost" —
    it's the name of the Postgres service in docker-compose.yml.
    """
    return psycopg2.connect(DATABASE_URL)