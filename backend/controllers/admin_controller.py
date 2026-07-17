from flask import request, jsonify, session
from services import admin_service

"""
    Validates that there is an active session AND that the logged-in user
    has the ADMINISTRATOR role. Returns None if everything is OK,
    or a (response, status_code) tuple if the request should be blocked.
"""
def check_admin_permissions():
    # Check if there's an active session at all (user is logged in)
    if 'user_id' not in session:
        return jsonify({'error': 'No autenticado'}), 401
    # Check if the logged-in user has the ADMINISTRATOR role
    if session.get('role') != 'ADMINISTRATOR':
        return jsonify({'error': 'No autorizado'}), 403
    # No error: the request is allowed to continue
    return None

# HU: US-019 — Consultar Banco de Preguntas
def get_questions():
    #Handles GET /admin/questions
    # Block the request early if the user isn't an authenticated admin
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    # Delegate the actual database work to the service layer
    questions = admin_service.list_questions()
    # Return the list as JSON with a 200 OK status
    return jsonify(questions), 200

# HU: US-019 — Crear Pregunta
def create_question():
    #Handles POST /admin/questions
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    # Parse the JSON body sent by the client
    request_data = request.get_json()
    try:
        new_question = admin_service.create_question(request_data)
        return jsonify(new_question), 201  # 201 = Created
    except ValueError as validation_error:
        # ValueError comes from a business rule check in the service layer
        # (e.g. "must have exactly 4 options")
        return jsonify({'error': str(validation_error)}), 400

# HU: US-020 — Editar Pregunta
def update_question(question_id):
    """Handles PUT /admin/questions/{question_id} - US-020. Updates core fields, and answer_options too if provided."""
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    request_data = request.get_json()
    try:
        updated_question = admin_service.update_question(question_id, request_data)
        # If the service returned None, the question doesn't exist
        if updated_question is None:
            return jsonify({'error': 'Pregunta no encontrada'}), 404
        options = request_data.get('answer_options')
        if options is not None:
            updated_options = admin_service.update_answer_options(question_id, options)
            # update_answer_options can also return None if the question was deleted
            # between the two calls (rare, but possible)
            if updated_options is None:
                return jsonify({'error': 'Pregunta no encontrada'}), 404
            updated_question['answer_options'] = updated_options
        return jsonify(updated_question), 200
    except ValueError as validation_error:
        return jsonify({'error': str(validation_error)}), 400

# HU: US-021 / US-022 — Activar / Desactivar Pregunta
def update_question_status(question_id):
    """Handles PATCH /admin/questions/{question_id}/status"""
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    request_data = request.get_json()
    try:
        new_status = request_data.get('status')
        updated_question = admin_service.update_question_status(question_id, new_status)
        # If the service returned None, the question doesn't exist
        if updated_question is None:
            return jsonify({'error': 'Pregunta no encontrada'}), 404
        return jsonify(updated_question), 200
    except ValueError as validation_error:
        return jsonify({'error': str(validation_error)}), 400

# HU: US-023 — Consultar Configuración del Assessment
def get_assessment_configuration():
    #Handles GET /admin/assessment/configuration
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    configuration = admin_service.get_assessment_configuration()
    return jsonify(configuration), 200

# HU: US-024 — Actualizar Configuración del Assessment
def update_assessment_configuration():
#Handles PUT /admin/assessment/configuration
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    request_data = request.get_json()
    updated_configuration = admin_service.update_assessment_configuration(request_data)
    return jsonify(updated_configuration), 200

# HU: US-026 — Consultar Estadísticas Administrativas
def get_statistics():
 #Handles GET /admin/statistics
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    statistics = admin_service.calculate_statistics()
    return jsonify(statistics), 200

# HU: US-027 — Supervisar Equipos (listado)
def get_teams():
    #Handles GET /admin/teams
    permission_error = check_admin_permissions()
    if permission_error:
        return permission_error
    teams = admin_service.list_teams()
    return jsonify(teams), 200

# HU: US-027 — Supervisar Equipos (detalle)
def get_team_detail(team_id):
    #Handles GET /admin/teams/{team_id}
    permission_error = check_admin_permissions()

    if permission_error:
        return permission_error
    try:
        team = admin_service.get_team_detail(team_id)
    # If the service returned None, the team_id doesn't exist
        if not team:
            return jsonify({'error': 'Equipo no encontrado'}), 404
        return jsonify(team), 200
    except Exception as error:
        # ANY unexpected error in the service layer will be caught here
        return jsonify({'error': 'Error al obtener el equipo'}), 500