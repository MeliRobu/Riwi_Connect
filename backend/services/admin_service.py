import psycopg2
from database.connection import get_connection

# HU: US-019 — Consultar Banco de Preguntas
def list_questions():
    """GET /admin/questions - Lists all questions in the question bank, including their answer options."""

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor: the object used to run SQL commands and read results
        read_sql_questions = connection.cursor()

        # Run the SELECT query against the questions table
        read_sql_questions.execute("""
            SELECT id_question, statement, category, difficulty_level, status
            FROM questions
            ORDER BY id_question
        """)

        # Fetch ALL rows returned by the query as a list of tuples
        rows_fetched = read_sql_questions.fetchall()

        # Empty list where we'll collect the converted dictionaries
        question_list = []

        # Loop through each row (tuple) returned from the database
        for row in rows_fetched:
            # Save the question_id so we can use it in the next query below
            question_id = row[0]

            # For this question, fetch its 4 answer options
            read_sql_questions.execute("""
                SELECT id_answer_option, content, is_correct
                FROM answer_options
                WHERE question_id = %s
                ORDER BY id_answer_option
            """, (question_id,))

            options_rows = read_sql_questions.fetchall()

            # Convert each option tuple into a dictionary
            options_list = []
            for opt_row in options_rows:
                option = {
                    'id_answer_option': opt_row[0],
                    'content': opt_row[1],
                    'is_correct': opt_row[2]
                }
                options_list.append(option)

            # Convert the question tuple into a dictionary, now including its options
            question = {
                'id_question': question_id,       # 1st column -> id_question
                'statement': row[1],               # 2nd column -> statement
                'category': row[2],                # 3rd column -> category
                'difficulty_level': row[3],        # 4th column -> difficulty_level
                'status': row[4],                  # 5th column -> status
                'answer_options': options_list     # options fetched separately above
            }
            # Add this dictionary to the results list
            question_list.append(question)

        # Return the list of dictionaries (jsonify can convert this to JSON)
        return question_list

    finally:
        # Always close the connection, whether the query succeeded or failed
        connection.close()

# HU: US-019 — Crear Pregunta
def create_question(data):
    """POST /admin/questions - Creates a new question along with its 4 answer options."""

    options = data.get('answer_options', [])

    if len(options) != 4:
        raise ValueError('Cada pregunta debe tener exactamente 4 opciones')

    correct_count = 0
    for opt in options:
        if opt.get('is_correct'):
            correct_count += 1

    if correct_count != 1:
        raise ValueError('Debe haber exactamente 1 opción marcada como correcta')

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor to run SQL commands
        insert_question_sql = connection.cursor()

        # HU: (vacío documental) — Límite máximo de 500 preguntas en el banco
        insert_question_sql.execute("SELECT COUNT(*) FROM questions")
        total_questions = insert_question_sql.fetchone()[0]
        if total_questions >= 500:
            raise ValueError("El banco de preguntas alcanzó el límite máximo de 500 preguntas")

        insert_question_sql.execute("""
            INSERT INTO questions (statement, category, difficulty_level, status)
            VALUES (%s, %s, %s, 'ACTIVE')
            RETURNING id_question
        """, (data['statement'], data['category'], data['difficulty_level']))

        question_id = insert_question_sql.fetchone()[0]

        for opt in options:
            insert_question_sql.execute("""
                INSERT INTO answer_options (question_id, content, is_correct)
                VALUES (%s, %s, %s)
            """, (question_id, opt['content'], opt['is_correct']))

        # commit() belongs to the CONNECTION, not the cursor
        connection.commit()

        return {
            'id_question': question_id,
            'statement': data['statement'],
            'category': data['category'],
            'difficulty_level': data['difficulty_level'],
            'status': 'ACTIVE'
        }

    except Exception:
        # rollback() also belongs to the CONNECTION, not the cursor
        connection.rollback()
        raise

    finally:
        # close the CONNECTION (this closes the cursor along with it)
        connection.close()

# HU: US-020 — Editar Pregunta
def update_question(question_id, data):
    """PUT /admin/questions/{question_id} - Edits an existing question's statement, category and difficulty."""

    connection = get_connection()

    try:
        update_question_sql = connection.cursor()

        update_question_sql.execute(
            "SELECT id_question FROM questions WHERE id_question = %s",
            (question_id,)
        )

        existing_question = update_question_sql.fetchone()
        if not existing_question:
            # Question doesn't exist: return None so the controller can respond 404
            return None

        update_question_sql.execute("""
            UPDATE questions
            SET statement = %s, category = %s, difficulty_level = %s
            WHERE id_question = %s
        """, (data['statement'], data['category'], data['difficulty_level'], question_id))

        connection.commit()

        return {
            'id_question': question_id,
            'statement': data['statement'],
            'category': data['category'],
            'difficulty_level': data['difficulty_level']
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

# HU: US-020 — Editar Pregunta (opciones de respuesta)
def update_answer_options(question_id, options):
    """
    PUT /admin/questions/{question_id} - Updates the 4 answer options of an existing question.
    Called from the controller only when 'answer_options' is present in the request body.
    """

    if len(options) != 4:
        raise ValueError('Cada pregunta debe tener exactamente 4 opciones')

    correct_count = 0
    for opt in options:
        if opt.get('is_correct'):
            correct_count += 1

    if correct_count != 1:
        raise ValueError('Debe haber exactamente 1 opción marcada como correcta')

    connection = get_connection()

    try:
        update_options_sql = connection.cursor()

        update_options_sql.execute(
            "SELECT id_question FROM questions WHERE id_question = %s",
            (question_id,)
        )

        existing_question = update_options_sql.fetchone()
        if not existing_question:
            # Question doesn't exist: return None so the controller can respond 404
            return None

        for opt in options:
            update_options_sql.execute("""
                UPDATE answer_options
                SET content = %s, is_correct = %s
                WHERE id_answer_option = %s AND question_id = %s
            """, (opt['content'], opt['is_correct'], opt['id_answer_option'], question_id))

        connection.commit()

        return options

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

# HU: US-021 / US-022 — Activar / Desactivar Pregunta
def update_question_status(question_id, status):
    """PATCH /admin/questions/{question_id}/status - Activates or deactivates a question."""

    if status not in ('ACTIVE', 'INACTIVE'):
        raise ValueError("status debe ser 'ACTIVE' o 'INACTIVE'")

    connection = get_connection()

    try:
        update_status_sql = connection.cursor()

        update_status_sql.execute(
            "SELECT id_question FROM questions WHERE id_question = %s",
            (question_id,)
        )

        existing_question = update_status_sql.fetchone()
        if not existing_question:
            # Question doesn't exist: return None so the controller can respond 404
            return None

        update_status_sql.execute(
            "UPDATE questions SET status = %s WHERE id_question = %s",
            (status, question_id)
        )

        connection.commit()

        return {'id_question': question_id, 'status': status}

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


# HU: (vacío documental) — Eliminar Pregunta obsoleta y nunca respondida.
# Solo se permite eliminar preguntas ya DESACTIVADAS. Si la pregunta (o
# alguna de sus 4 opciones) ya fue respondida por algun estudiante, la
# base de datos rechaza el borrado automaticamente (sin ON DELETE CASCADE
# en student_answers -> questions/answer_options), protegiendo el
# historial de resultados ya calculados sin necesidad de logica extra aqui.
def delete_question(question_id):
    """DELETE /admin/questions/{question_id} - Elimina una pregunta desactivada y sin historial."""
    connection = get_connection()
    try:
        delete_sql = connection.cursor()
        delete_sql.execute(
            "SELECT status FROM questions WHERE id_question = %s",
            (question_id,)
        )
        existing_question = delete_sql.fetchone()
        if not existing_question:
            return None
        if existing_question[0] != 'INACTIVE':
            raise ValueError("Solo se pueden eliminar preguntas desactivadas")
        try:
            delete_sql.execute(
                "DELETE FROM answer_options WHERE question_id = %s",
                (question_id,)
            )
            delete_sql.execute(
                "DELETE FROM questions WHERE id_question = %s",
                (question_id,)
            )
        except psycopg2.errors.ForeignKeyViolation:
            connection.rollback()
            raise ValueError(
                "No se puede eliminar: esta pregunta ya tiene respuestas registradas de estudiantes"
            )
        connection.commit()
        return {'id_question': question_id, 'deleted': True}
    except ValueError:
        raise
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
# HU: US-023 — Consultar Configuración del Assessment
def get_assessment_configuration():
    """GET /admin/assessment/configuration - Reads the single configuration row."""

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor to run SQL commands
        read_config_sql = connection.cursor()

        # This table always has exactly ONE row (Singleton Row pattern)
        read_config_sql.execute("""
            SELECT id_assessment_configuration, question_count, selection_method, time_limit
            FROM assessment_configurations
            LIMIT 1
        """)

        # Read that single row
        config_row = read_config_sql.fetchone()

        # If somehow the table is empty, return None so the controller can handle it
        if not config_row:
            return None

        # Convert the tuple into a dictionary with named keys
        return {
            'id_assessment_configuration': config_row[0],
            'question_count': config_row[1],
            'selection_method': config_row[2],
            'time_limit': config_row[3]
        }

    finally:
        # Always close the connection
        connection.close()

# HU: US-024 — Actualizar Configuración del Assessment
def update_assessment_configuration(data):
    """PUT /admin/assessment/configuration - Updates the single existing configuration row."""

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor to run SQL commands
        update_config_sql = connection.cursor()

        # HU: (vacío documental) — El número de preguntas por prueba no puede ser mayor
        # a la cantidad de preguntas activas disponibles, ni ser 0 o negativo
        update_config_sql.execute("SELECT COUNT(*) FROM questions WHERE status = 'ACTIVE'")
        active_questions_count = update_config_sql.fetchone()[0]

        if data['question_count'] <= 0:
            raise ValueError("El número de preguntas por prueba debe ser mayor a 0")

        if data['question_count'] > active_questions_count:
            raise ValueError(
                f"El número de preguntas por prueba ({data['question_count']}) no puede superar "
                f"la cantidad de preguntas activas disponibles ({active_questions_count})"
            )

        # No WHERE clause needed: there's only ever one row in this table
        update_config_sql.execute("""
            UPDATE assessment_configurations
            SET question_count = %s, selection_method = %s, time_limit = %s
            """, (data['question_count'], data['selection_method'], data['time_limit']))

        # commit() belongs to the CONNECTION, not the cursor
        connection.commit()

        # Return the same data back as confirmation
        return data

    except Exception:
        # Undo any partial changes if something failed
        connection.rollback()
        raise

    finally:
        # Always close the connection
        connection.close()

# HU: US-026 — Consultar Estadísticas Administrativas
def calculate_statistics():
    """GET /admin/statistics - Calculates administrative statistics (RN-042)."""

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor to run SQL commands
        stats_sql = connection.cursor()

        # 1. Total people authorized to register (whitelist)
        stats_sql.execute("SELECT COUNT(*) FROM institutional_sources")
        total_authorized = stats_sql.fetchone()[0]

        # 2. Total people who actually registered
        stats_sql.execute("SELECT COUNT(*) FROM users")
        total_registered = stats_sql.fetchone()[0]

        # 3. Authorized people who have NOT registered yet.
        # LEFT JOIN + "u.id_user IS NULL" finds institutional_sources rows
        # that have no matching row in users.
        stats_sql.execute("""
            SELECT COUNT(*)
            FROM institutional_sources isrc
            LEFT JOIN users u ON u.id_institutional_source = isrc.id_institutional_source
            WHERE u.id_user IS NULL
        """)
        not_registered_yet = stats_sql.fetchone()[0]

        # 4. How many students are AVAILABLE vs IN_TEAM
        stats_sql.execute("""
            SELECT status, COUNT(*)
            FROM users
            WHERE role = 'STUDENT'
            GROUP BY status
        """)
        status_rows = stats_sql.fetchall()

        # Convert the rows into a dictionary like {'AVAILABLE': 5, 'IN_TEAM': 3}
        status_distribution = {}
        for row in status_rows:
            status_distribution[row[0]] = row[1]

        # 5. Total number of teams created
        stats_sql.execute("SELECT COUNT(*) FROM teams")
        total_teams = stats_sql.fetchone()[0]

        # 6. Average score per technology, across ALL completed assessments
        stats_sql.execute("""
            SELECT
                AVG(python_score), AVG(sql_score), AVG(javascript_score),
                AVG(html_score), AVG(css_score)
            FROM assessment_results
        """)
        avg_row = stats_sql.fetchone()

        # Build a dictionary of averages, defaulting to 0 if there's no data yet
        averages = {
            'python': float(avg_row[0]) if avg_row[0] is not None else 0,
            'sql': float(avg_row[1]) if avg_row[1] is not None else 0,
            'javascript': float(avg_row[2]) if avg_row[2] is not None else 0,
            'html': float(avg_row[3]) if avg_row[3] is not None else 0,
            'css': float(avg_row[4]) if avg_row[4] is not None else 0,
        }

        # Find which technology has the highest and lowest average score.
        # max()/min() with key=averages.get compares by dictionary VALUE, not by key name.
        highest = max(averages, key=averages.get)
        lowest = min(averages, key=averages.get)

        # Build and return the final statistics dictionary
        return {
            'total_authorized': total_authorized,
            'total_registered': total_registered,
            'not_registered_yet': not_registered_yet,
            'status_distribution': {
                'AVAILABLE': status_distribution.get('AVAILABLE', 0),
                'IN_TEAM': status_distribution.get('IN_TEAM', 0)
            },
            'total_teams': total_teams,
            'averages_by_technology': averages,
            'highest_average_technology': highest,
            'lowest_average_technology': lowest
        }

    finally:
        # Always close the connection
        connection.close()

# HU: US-027 — Supervisar Equipos (listado)
def list_teams():
    """GET /admin/teams - Lists all teams with their member count."""

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor to run SQL commands
        read_teams_sql = connection.cursor()

        # LEFT JOIN so teams with 0 members still show up (with count = 0)
        # GROUP BY is required because we're using COUNT()
        read_teams_sql.execute("""
            SELECT t.id_team, t.team_name, t.created_at, COUNT(tm.id_team_member) AS member_count
            FROM teams t
            LEFT JOIN team_members tm ON tm.team_id = t.id_team
            GROUP BY t.id_team, t.team_name, t.created_at
            ORDER BY t.id_team
        """)

        # Fetch all team rows
        rows_fetched = read_teams_sql.fetchall()

        # Empty list where we'll collect the converted dictionaries
        team_list = []

        # Loop through each row and convert it to a dictionary
        for row in rows_fetched:
            team = {
                'id_team': row[0],
                'team_name': row[1],
                # created_at comes back as a Python datetime object,
                # so we convert it to a string with isoformat() for JSON
                'created_at': row[2].isoformat(),
                'member_count': row[3]
            }
            team_list.append(team)

        return team_list

    finally:
        # Always close the connection
        connection.close()

# HU: US-027 — Supervisar Equipos (detalle)
def get_team_detail(team_id):
    """GET /admin/teams/{team_id} - Returns one team plus its members' scores and Gemini interpretation."""

    # Open a new connection to PostgreSQL
    connection = get_connection()

    try:
        # Create a cursor to run SQL commands
        read_team_sql = connection.cursor()

        # Step 1: check the team exists and get its basic info
        read_team_sql.execute(
            "SELECT id_team, team_name, created_at FROM teams WHERE id_team = %s",
            (team_id,)
        )
        team_row = read_team_sql.fetchone()

        # If the team doesn't exist, return None so the controller can respond 404
        if not team_row:
            return None

        # Step 2: get every member of this team, joined with their user info,
        # their institutional full_name, and their latest assessment scores.
        # LEFT JOIN on assessments/assessment_results because a member might
        # not have completed the assessment yet (scores would be NULL).
        read_team_sql.execute("""
            SELECT
                u.id_user, isrc.full_name, u.status, tm.is_leader,
                ar.overall_score, ar.python_score, ar.sql_score,
                ar.javascript_score, ar.html_score, ar.css_score,
                ar.profile_description
            FROM team_members tm
            JOIN users u ON u.id_user = tm.user_id
            JOIN institutional_sources isrc ON isrc.id_institutional_source = u.id_institutional_source
            LEFT JOIN assessments a ON a.user_id = u.id_user
            LEFT JOIN assessment_results ar ON ar.assessment_id = a.id_assessment
            WHERE tm.team_id = %s
            ORDER BY tm.is_leader DESC
        """, (team_id,))

        members_rows = read_team_sql.fetchall()

        # Build the list of member dictionaries
        member_list = []
        for row in members_rows:
            member = {
                'id_user': row[0],
                'full_name': row[1],
                'status': row[2],
                'is_leader': row[3],
                # Scores might be None if the student hasn't finished the assessment
                'overall_score': float(row[4]) if row[4] is not None else None,
                'scores_by_technology': {
                    'python': float(row[5]) if row[5] is not None else None,
                    'sql': float(row[6]) if row[6] is not None else None,
                    'javascript': float(row[7]) if row[7] is not None else None,
                    'html': float(row[8]) if row[8] is not None else None,
                    'css': float(row[9]) if row[9] is not None else None,
                },
                'profile_description': row[10]
            }
            member_list.append(member)

        # Build and return the final team detail dictionary
        return {
            'id_team': team_row[0],
            'team_name': team_row[1],
            'created_at': team_row[2].isoformat(),
            'members': member_list
        }

    finally:
        # Always close the connection
        connection.close()