from flask import Blueprint
from controllers.admin_controller import (
    get_questions, create_question, update_question, update_question_status,
    get_assessment_configuration, update_assessment_configuration,
    get_teams, get_team_detail, get_statistics
)

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Question Bank
admin_bp.route('/questions', methods=['GET'])(get_questions)
admin_bp.route('/questions', methods=['POST'])(create_question)
admin_bp.route('/questions/<int:question_id>', methods=['PUT'])(update_question)
admin_bp.route('/questions/<int:question_id>/status', methods=['PATCH'])(update_question_status)

# Assessment Configuration
admin_bp.route('/assessment/configuration', methods=['GET'])(get_assessment_configuration)
admin_bp.route('/assessment/configuration', methods=['PUT'])(update_assessment_configuration)

# Teams , thisis only for read.
admin_bp.route('/teams', methods=['GET'])(get_teams)
admin_bp.route('/teams/<int:team_id>', methods=['GET'])(get_team_detail)

# Statistics
admin_bp.route('/statistics', methods=['GET'])(get_statistics)