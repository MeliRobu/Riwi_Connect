import threading
from database.connection import get_connection
import json
import requests
from config import GEMINI_API_KEY

# HU: US-004 — Presentar Assessment (EP-002 — Assessment Management)
# Covers: question selection per AssessmentConfiguration, answer registration,
# score calculation per technology and overall

CATEGORIES = ['PYTHON', 'SQL', 'JAVASCRIPT', 'HTML', 'CSS']


def get_active_configuration():
    # There's only one row in this table, so we just grab it.
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT question_count, selection_method FROM assessment_configurations LIMIT 1;")
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row


def get_active_questions(limit):
    # Random selection, only active questions, capped at the configured count.
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id_question, statement, category, difficulty_level, status
        FROM questions
        WHERE status = 'ACTIVE'
        ORDER BY RANDOM()
        LIMIT %s;
        """,
        (limit,)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def get_answer_options(question_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id_answer_option, content
        FROM answer_options
        WHERE question_id = %s;
        """,
        (question_id,)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


def get_assessment_by_user(user_id):
    # Used to check if this student already has one (RN-006).
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id_assessment, completed_at FROM assessments WHERE user_id = %s;",
        (user_id,)
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row


def create_assessment(user_id):
    # UNIQUE constraint on user_id blocks a second attempt automatically.
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO assessments (user_id) VALUES (%s) RETURNING id_assessment;",
        (user_id,)
    )
    new_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    conn.close()
    return new_id


def save_student_answer(assessment_id, question_id, answer_option_id):
    # Upsert: lets the student change their answer before submitting.
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO student_answers (assessment_id, question_id, answer_option_id)
        VALUES (%s, %s, %s)
        ON CONFLICT (assessment_id, question_id)
        DO UPDATE SET answer_option_id = EXCLUDED.answer_option_id,
                    answered_at = CURRENT_TIMESTAMP;
        """,
        (assessment_id, question_id, answer_option_id)
    )
    conn.commit()
    cursor.close()
    conn.close()


def complete_assessment(assessment_id):
    # Marks the attempt as finished, no going back after this (RN-046).
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE assessments SET completed_at = CURRENT_TIMESTAMP WHERE id_assessment = %s;",
        (assessment_id,)
    )
    conn.commit()
    cursor.close()
    conn.close()


def calculate_scores(assessment_id):
    # Pull each answer along with its category and whether it was correct.
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT q.category, ao.is_correct
        FROM student_answers sa
        JOIN questions q ON sa.question_id = q.id_question
        JOIN answer_options ao ON sa.answer_option_id = ao.id_answer_option
        WHERE sa.assessment_id = %s;
        """,
        (assessment_id,)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Count answered questions and correct ones, per category.
    totals = {c: 0 for c in CATEGORIES}
    corrects = {c: 0 for c in CATEGORIES}

    for category, is_correct in rows:
        if category in totals:
            totals[category] += 1
            if is_correct:
                corrects[category] += 1

    # Turn counts into percentages, category by category.
    scores = {}
    for c in CATEGORIES:
        scores[c] = round((corrects[c] / totals[c] * 100), 2) if totals[c] > 0 else 0

    # Overall score across all categories combined.
    total_questions = sum(totals.values())
    total_correct = sum(corrects.values())
    overall_score = round((total_correct / total_questions * 100), 2) if total_questions > 0 else 0

    return {
        'overall_score': overall_score,
        'python_score': scores['PYTHON'],
        'sql_score': scores['SQL'],
        'javascript_score': scores['JAVASCRIPT'],
        'html_score': scores['HTML'],
        'css_score': scores['CSS'],
    }


def save_assessment_result(assessment_id, scores):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO assessment_results (
            assessment_id, overall_score, python_score, sql_score,
            javascript_score, html_score, css_score
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """,
        (
            assessment_id,
            scores['overall_score'],
            scores['python_score'],
            scores['sql_score'],
            scores['javascript_score'],
            scores['html_score'],
            scores['css_score'],
        )
    )
    conn.commit()
    cursor.close()
    conn.close()



# HU: US-005 — Generar Smart Professional Profile (EP-003)
# Builds the Gemini prompt from scores only (no personal data), calls the
# API, and stores the interpretation. Any failure (connection, auth,
# invalid response, timeout) leaves profile_description as NULL for a
# later retry (RN-041) — it never raises, so it never blocks the caller.
def generate_smart_profile(assessment_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT overall_score, python_score, sql_score, javascript_score, html_score, css_score
            FROM assessment_results
            WHERE assessment_id = %s
            """,
            (assessment_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return
        overall, python_s, sql_s, js_s, html_s, css_s = row

        prompt = (
            "Eres un analista de talento tecnológico.\n"
            "Analiza los resultados obtenidos por el siguiente estudiante.\n"
            f"Puntaje General: {overall}\n"
            "Resultados por tecnología:\n"
            f"Python: {python_s}\n"
            f"HTML: {html_s}\n"
            f"CSS: {css_s}\n"
            f"JavaScript: {js_s}\n"
            f"SQL: {sql_s}\n"
            "Genera únicamente:\n"
            "1. Tres fortalezas técnicas del estudiante, basadas en los puntajes más altos, "
            "redactadas en prosa (una o dos oraciones completas), NUNCA como lista ni con numeración "
            "ni con los puntajes entre paréntesis.\n"
            "2. Tres oportunidades de mejora, basadas en los puntajes más bajos, con el mismo formato "
            "de prosa descrita arriba.\n"
            "3. Una interpretación profesional breve (máximo un párrafo) que resuma el desempeño general.\n"
            "No incluyas información que no haya sido solicitada. No emitas juicios de valor "
            "ni recomendaciones sobre la conformación de equipos. Los tres campos deben ser texto "
            "narrativo natural, como si un analista humano los estuviera redactando.\n"
            "Responde únicamente con un JSON exacto, sin texto adicional, con esta forma:\n"
            '{"strengths": "...", "improvement_opportunities": "...", "profile_description": "..."}'
        )

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"gemini-flash-lite-latest:generateContent?key={GEMINI_API_KEY}"
        )

        try:
            response = requests.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=10
            )
            if response.status_code != 200:
                # Auth error, quota, or any non-2xx: leave NULL for retry
                return
            data = response.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            strengths = parsed.get("strengths")
            improvement = parsed.get("improvement_opportunities")
            description = parsed.get("profile_description")
        except (requests.RequestException, ValueError, KeyError, json.JSONDecodeError):
            # Connection error, timeout, or malformed response: leave NULL for retry
            return

        if not strengths or not improvement or not description:
            return

        cursor.execute(
            """
            UPDATE assessment_results
            SET strengths = %s, improvement_opportunities = %s, profile_description = %s
            WHERE assessment_id = %s
            """,
            (strengths, improvement, description, assessment_id)
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

# HU: US-005 — Retry helper (RN-041)
# Shared by login and get_assessment_result: checks if this user has a
# completed assessment with profile_description still NULL, and if so,
# dispatches the retry in a background thread without blocking the caller.
def retry_smart_profile_if_needed(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT a.id_assessment, ar.profile_description
        FROM assessment_results ar
        JOIN assessments a ON ar.assessment_id = a.id_assessment
        WHERE a.user_id = %s;
        """,
        (user_id,)
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row is None:
        return
    assessment_id, profile_description = row
    if profile_description is None:
        threading.Thread(target=generate_smart_profile, args=(assessment_id,)).start()    


# HU: US-006 — Consultar Smart Professional Profile
# strengths, improvement_opportunities and profile_description
# may still be NULL here if Gemini hasn't generated them yet (RN-041).
def get_assessment_result(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT a.id_assessment, ar.overall_score, ar.python_score, ar.sql_score,
            ar.javascript_score, ar.html_score, ar.css_score,
            ar.strengths, ar.improvement_opportunities, ar.profile_description
        FROM assessment_results ar
        JOIN assessments a ON ar.assessment_id = a.id_assessment
        WHERE a.user_id = %s;
        """,
        (user_id,)
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row is None:
        return None
    assessment_id = row[0]
    profile_description = row[9]
    if profile_description is None:
        # RN-041: non-blocking retry, doesn't delay this response
        threading.Thread(target=generate_smart_profile, args=(assessment_id,)).start()
    return row[1:]
