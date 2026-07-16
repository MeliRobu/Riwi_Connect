import psycopg2
from werkzeug.security import generate_password_hash
from database.connection import get_connection

# HU: US-001 — Registro de Usuario (EP-001 — User Management)

def register_user(document_number, password):
    # Open a connection to PostgreSQL
    conn = get_connection()
    cursor = conn.cursor()

    # Step 1: check if the document exists in institutional_sources (whitelist)
    cursor.execute(
        "SELECT id_institutional_source FROM institutional_sources WHERE document_number = %s",
        (document_number,)
    )
    institutional_source = cursor.fetchone()

    # If no matching row was found, the document is not authorized to register
    if institutional_source is None:
        cursor.close()
        conn.close()
        return {"error": "Document not authorized"}, 403

    id_institutional_source = institutional_source[0]

    # Step 2: check if a user with this institutional_source is already registered
    cursor.execute(
        "SELECT id_user FROM users WHERE id_institutional_source = %s",
        (id_institutional_source,)
    )
    existing_user = cursor.fetchone()

    # If a row was found, this person already has an account
    if existing_user is not None:
        cursor.close()
        conn.close()
        return {"error": "User already registered"}, 409

    # Step 3: hash the password before storing it (never store plain text, RN-037)
    hashed_password = generate_password_hash(password)

    # Step 4: insert the new user into the database
    cursor.execute(
        "INSERT INTO users (password_hash, id_institutional_source) VALUES (%s, %s)",
        (hashed_password, id_institutional_source)
    )

    # Commit saves the changes permanently to the database
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "User registered successfully"}, 201


# HU: US-003 — Consultar mi Perfil (EP-001 — User Management)

def get_user_by_id(id_user):
    # Open a connection to PostgreSQL
    conn = get_connection()
    cursor = conn.cursor()

    # Fetch the user row that matches this id, joining institutional_sources
    # to also get full_name (needed to display the profile)
    cursor.execute(
        """
        SELECT u.id_user, u.role, u.status, u.profile_image,
            s.full_name, s.document_number, s.email
        FROM users u
        JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
        WHERE u.id_user = %s
        """,
        (id_user,)
    )
    user_row = cursor.fetchone()

    cursor.close()
    conn.close()

    # If no row was found, the user doesn't exist
    if user_row is None:
        return None

    # Build a dictionary with readable keys, easier to convert to JSON later
    return {
        "id_user": user_row[0],
        "role": user_row[1],
        "status": user_row[2],
        "profile_image": user_row[3],
        "full_name": user_row[4],
        "document_number": user_row[5],
        "email": user_row[6]
    }