import psycopg2
from werkzeug.security import generate_password_hash
from database.connection import get_connection
from services.assessment_service import get_assessment_result

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
            s.full_name, s.document_number, s.email,
            tm.team_id, tm.is_leader,
            c.campus_name, j.journey_time, cl.clan_name
        FROM users u
        JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
        LEFT JOIN team_members tm ON tm.user_id = u.id_user
        LEFT JOIN campus c ON s.id_campus = c.id_campus
        LEFT JOIN journeys j ON s.id_journey = j.id_journey
        LEFT JOIN clan cl ON s.id_clan = cl.id_clan
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
    # Build a dictionary with readable keys, easier to convert to JSON later.
    # team_id/is_leader come from a LEFT JOIN, so they're None if the user
    # isn't in any team yet (Frontend uses this to render the Teams page).
    # clan_name is None for administrators, who don't belong to a clan.
    return {
        "id_user": user_row[0],
        "role": user_row[1],
        "status": user_row[2],
        "profile_image": user_row[3],
        "full_name": user_row[4],
        "document_number": user_row[5],
        "email": user_row[6],
        "team_id": user_row[7],
        "is_leader": user_row[8] if user_row[8] is not None else False,
        "campus_name": user_row[9],
        "journey_time": user_row[10],
        "clan_name": user_row[11]
    }


# HU: (vacío documental) — Consultar el perfil público de cualquier estudiante
# (nombre, Campus/Journey/Clan, puntajes y fortalezas/debilidades del Assessment),
# usado para la tarjeta flotante al hacer clic en un integrante de un equipo.
def get_public_profile(id_user):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT s.full_name, u.profile_image, c.campus_name, j.journey_time, cl.clan_name
        FROM users u
        JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
        LEFT JOIN campus c ON s.id_campus = c.id_campus
        LEFT JOIN journeys j ON s.id_journey = j.id_journey
        LEFT JOIN clan cl ON s.id_clan = cl.id_clan
        WHERE u.id_user = %s
        """,
        (id_user,)
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row is None:
        return None
    full_name, profile_image, campus_name, journey_time, clan_name = row
    assessment = get_assessment_result(id_user)
    if assessment is None:
        return {
            "full_name": full_name,
            "profile_image": profile_image,
            "campus_name": campus_name,
            "journey_time": journey_time,
            "clan_name": clan_name,
            "assessment_completed": False,
        }
    overall, python_s, sql_s, js_s, html_s, css_s, strengths, improvements, profile = assessment
    return {
        "full_name": full_name,
        "profile_image": profile_image,
        "campus_name": campus_name,
        "journey_time": journey_time,
        "clan_name": clan_name,
        "assessment_completed": True,
        "overall_score": float(overall),
        "python_score": float(python_s),
        "sql_score": float(sql_s),
        "javascript_score": float(js_s),
        "html_score": float(html_s),
        "css_score": float(css_s),
        "strengths": strengths,
        "improvement_opportunities": improvements,
        "profile_description": profile,
    }

# HU: (vacío documental) — Consultar combinaciones válidas de sede/jornada/clan
# para el formulario público de "crear perfil de prueba" (demo publica).
def get_institutional_options():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT DISTINCT c.id_campus, c.campus_name, j.id_journey, j.journey_time,
                   cl.id_clan, cl.clan_name
            FROM institutional_sources isrc
            JOIN campus c ON c.id_campus = isrc.id_campus
            JOIN journeys j ON j.id_journey = isrc.id_journey
            JOIN clan cl ON cl.id_clan = isrc.id_clan
            WHERE isrc.id_clan IS NOT NULL
            ORDER BY c.id_campus, j.id_journey, cl.id_clan
            """
        )
        rows = cursor.fetchall()
        campuses = {}
        for id_campus, campus_name, id_journey, journey_time, id_clan, clan_name in rows:
            campus = campuses.setdefault(id_campus, {"id_campus": id_campus, "campus_name": campus_name, "journeys": {}})
            journey = campus["journeys"].setdefault(id_journey, {"id_journey": id_journey, "journey_time": journey_time, "clans": []})
            journey["clans"].append({"id_clan": id_clan, "clan_name": clan_name})
        result = []
        for campus in campuses.values():
            campus["journeys"] = list(campus["journeys"].values())
            result.append(campus)
        return {"campuses": result}, 200
    finally:
        cursor.close()
        conn.close()


# HU: (vacío documental) — Permite a cualquier visitante crear un registro
# simulado en institutional_sources (lista blanca), para poder probar el
# flujo completo de registro sin depender de los estudiantes ya sembrados.
def create_demo_institutional_source(document_number, full_name, email, id_campus, id_journey, id_clan):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        if not document_number or not full_name or not email or not id_campus or not id_journey or not id_clan:
            return {"error": "Todos los campos son obligatorios"}, 400
        # document_number es INTEGER en la base de datos (max ~2147483647);
        # validar el rango aqui evita un error crudo de PostgreSQL si alguien
        # ingresa un numero fuera de rango en este formulario publico.
        try:
            document_number_int = int(document_number)
        except (ValueError, TypeError):
            return {"error": "El documento debe ser un número válido"}, 400
        if document_number_int <= 0 or document_number_int > 2147483647:
            return {"error": "El documento debe ser un número positivo de hasta 10 dígitos"}, 400
        cursor.execute(
            """
            SELECT 1 FROM institutional_sources
            WHERE id_campus = %s AND id_journey = %s AND id_clan = %s
            LIMIT 1
            """,
            (id_campus, id_journey, id_clan)
        )
        if cursor.fetchone() is None:
            return {"error": "La combinación de sede, jornada y clan no es válida"}, 400
        cursor.execute(
            "SELECT 1 FROM institutional_sources WHERE document_number = %s",
            (document_number,)
        )
        if cursor.fetchone() is not None:
            return {"error": "Ese número de documento ya está en la lista"}, 409
        cursor.execute(
            "SELECT 1 FROM institutional_sources WHERE email = %s",
            (email,)
        )
        if cursor.fetchone() is not None:
            return {"error": "Ese correo ya está en la lista"}, 409
        cursor.execute(
            """
            INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id_institutional_source
            """,
            (document_number, full_name, email, id_campus, id_journey, id_clan)
        )
        new_id = cursor.fetchone()[0]
        conn.commit()
        return {"id_institutional_source": new_id, "document_number": document_number}, 201
    finally:
        cursor.close()
        conn.close()