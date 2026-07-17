from flask import Blueprint
from controllers.admin_controller import (
    get_questions, create_question, update_question, update_question_status,
    get_assessment_configuration, update_assessment_configuration,
    get_teams, get_team_detail, get_statistics
)

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# HU: US-019 — Consultar Banco de Preguntas
admin_bp.route('/questions', methods=['GET'])(get_questions)
# HU: US-019 — Crear Pregunta
admin_bp.route('/questions', methods=['POST'])(create_question)
# HU: US-020 — Editar Pregunta
admin_bp.route('/questions/<int:question_id>', methods=['PUT'])(update_question)
# HU: US-021 / US-022 — Activar / Desactivar Pregunta
admin_bp.route('/questions/<int:question_id>/status', methods=['PATCH'])(update_question_status)

# HU: US-023 — Consultar Configuración del Assessment
admin_bp.route('/assessment/configuration', methods=['GET'])(get_assessment_configuration)
# HU: US-024 — Actualizar Configuración del Assessment
admin_bp.route('/assessment/configuration', methods=['PUT'])(update_assessment_configuration)

# HU: US-026 — Consultar Estadísticas Administrativas
admin_bp.route('/statistics', methods=['GET'])(get_statistics)

# HU: US-027 — Supervisar Equipos (listado, solo lectura)
admin_bp.route('/teams', methods=['GET'])(get_teams)
# HU: US-027 — Supervisar Equipos (detalle, solo lectura)
admin_bp.route('/teams/<int:team_id>', methods=['GET'])(get_team_detail)