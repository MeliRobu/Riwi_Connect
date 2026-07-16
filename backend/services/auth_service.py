from werkzeug.security import check_password_hash
from database.connection import get_connection


# HU: US-002 — Inicio de Sesión (EP-001 — User Management)

def login_user(document_number, password):
    # Open a connection to PostgreSQL
    conn = get_connection()
    cursor = conn.cursor()

    # Find the user by document_number, going through institutional_sources
    # since users no longer stores document_number directly
    cursor.execute(
        """
        SELECT u.id_user, u.password_hash, u.role
        FROM users u
        JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
        WHERE s.document_number = %s
        """,
        (document_number,)
    )
    user_row = cursor.fetchone()

    cursor.close()
    conn.close()

    # If no user found, reject login without revealing whether the document exists
    if user_row is None:
        return {"error": "Invalid credentials"}, 401

    id_user, password_hash, role = user_row

    # Compare the given password against the stored hash
    if not check_password_hash(password_hash, password):
        return {"error": "Invalid credentials"}, 401

    # Return the data needed to build the session
    return {"id_user": id_user, "role": role}, 200


# HU: US-002 — Inicio de Sesión (session teardown counterpart to login_user)

def logout_user(session):
    # Clear all session data (RN-038)
    session.clear()
    return {"message": "Logged out successfully"}, 200