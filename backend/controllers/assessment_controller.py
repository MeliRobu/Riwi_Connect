# controllers/assessment_controller.py
from flask import session, jsonify, request
from services import assessment_service

# HU: US-004 — Presentar Assessment (EP-002 — Assessment Management)
# Handles GET/POST /assessments and GET /assessments/result, all requiring an active session.

def get_assessment():
    # No active session, no access.
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    user_id = session['user_id']

    # One attempt per student, reject if it already exists.
    existing = assessment_service.get_assessment_by_user(user_id)
    if existing is not None:
        return jsonify({'error': 'Assessment already exists for this user'}), 400

    config = assessment_service.get_active_configuration()
    question_count, selection_method = config

    questions = assessment_service.get_active_questions(question_count)

    # Attach the answer options to each question before sending it back.
    result = []
    for id_question, statement, category, difficulty_level, status in questions:
        options = assessment_service.get_answer_options(id_question)
        result.append({
            'id_question': id_question,
            'statement': statement,
            'category': category,
            'options': [{'id_answer_option': o[0], 'content': o[1]} for o in options]
        })

    return jsonify(result), 200


def submit_assessment():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    user_id = session['user_id']
    data = request.get_json()
    answers = data.get('answers')  # [{question_id, answer_option_id}, ...]

    if not answers:
        return jsonify({'error': 'No answers provided'}), 400

    # One attempt per student, no second attempt, no resuming an old one.
    existing = assessment_service.get_assessment_by_user(user_id)
    if existing is not None:
        return jsonify({'error': 'Assessment already submitted'}), 400

    assessment_id = assessment_service.create_assessment(user_id)

    # Save each answer, then lock the attempt as completed.
    for answer in answers:
        assessment_service.save_student_answer(
            assessment_id,
            answer['question_id'],
            answer['answer_option_id']
        )

    assessment_service.complete_assessment(assessment_id)

    # Score it right away and store the result.
    scores = assessment_service.calculate_scores(assessment_id)
    assessment_service.save_assessment_result(assessment_id, scores)

    return jsonify({'message': 'Assessment submitted', 'scores': scores}), 201


def get_result():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    user_id = session['user_id']
    result = assessment_service.get_assessment_result(user_id)

    if result is None:
        return jsonify({'error': 'No result found for this user'}), 404

    overall, python_s, sql_s, js_s, html_s, css_s, strengths, improvements, profile = result

    # Decimal values from Postgres need to become floats for JSON.
    return jsonify({
        'overall_score': float(overall),
        'python_score': float(python_s),
        'sql_score': float(sql_s),
        'javascript_score': float(js_s),
        'html_score': float(html_s),
        'css_score': float(css_s),
        'strengths': strengths,
        'improvement_opportunities': improvements,
        'profile_description': profile
    }), 200