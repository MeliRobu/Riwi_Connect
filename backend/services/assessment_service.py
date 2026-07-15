from database.connection import get_connection

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


def get_assessment_result(user_id):
    # strengths, improvement_opportunities and profile_description
    # may still be NULL here if Gemini hasn't generated them yet.
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT ar.overall_score, ar.python_score, ar.sql_score,
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
    return row