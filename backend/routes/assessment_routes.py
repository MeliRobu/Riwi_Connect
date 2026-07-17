from flask import Blueprint
from controllers import assessment_controller

# HU: US-004 — Presentar Assessment (EP-002 — Assessment Management)
# Groups all assessment-related endpoints under one blueprint,
# same pattern as user_routes.py
assessment_routes = Blueprint('assessment_routes', __name__)

# HU: US-004 — Fetch the questions for a new attempt.
assessment_routes.route('/assessments', methods=['GET'])(assessment_controller.get_assessment)

# HU: US-004 / US-005 — Submit all answers, get scored, and trigger Gemini in the background.
assessment_routes.route('/assessments', methods=['POST'])(assessment_controller.submit_assessment)

# HU: US-006 — Check the stored result for the logged-in student.
assessment_routes.route('/assessments/result', methods=['GET'])(assessment_controller.get_result)