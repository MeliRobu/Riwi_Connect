from flask import request, session
from services.team_service import create_team
from services.team_service import request_join_team
from services.team_service import cancel_request
from services.team_service import create_invitation
from services.team_service import accept_invitation
from services.team_service import reject_invitation
from services.team_service import cancel_invitation
from services.team_service import accept_request
from services.team_service import reject_team_request
from services.team_service import is_team_leader
from services.team_service import remove_member
from services.team_service import leave_team
from services.team_service import is_team_member
from services.team_service import transfer_leadership
from services.team_service import dissolve_team
from services.compatibility_service import get_student_recommendations
from services.team_service import list_available_teams
from services.team_service import list_my_requests
from services.team_service import list_received_requests
from services.team_service import list_sent_invitations
from services.team_service import list_received_invitations
from services.team_service import search_students_to_invite
from services.team_service import search_teams_by_name
from services.team_service import get_team_public_detail
from services.team_service import get_my_team_detail

# HU: US-007 — Create Team (EP-002 - Team Management)
def create():
    #Verify that the user has an  active session
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    # RN-043: Administrators cannot create teams
    if session.get("role") != "STUDENT":
        return {"error": "Only Students can create teams"}, 403
    data = request.get_json()
    team_name = data.get("team_name")
    if not team_name:
        return {"error": "Team name is required"}, 400
    result, status_code = create_team(session["user_id"], team_name)
    return result, status_code

# HU: US-008 — Request to Join Team
def send_request(team_id):
    # Verify that the user has an active session
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    # RN-043: Administrators cannot request to join teams
    if session.get("role") != "STUDENT":
        return {"error": "Only Students can request to join teams"}, 403
    result, status_code = request_join_team(session["user_id"], team_id)
    return result, status_code

# HU: US-009 — Cancel Request
def cancel(team_id, request_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = cancel_request(session["user_id"], request_id)
    return result, status_code

# HU: US-010 — Send Invitation (EP-004 - Team Management)
def send_invitation(team_id):
    # Verify that the user has an active session
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    data = request.get_json()
    receiver_id = data.get("receiver_id")
    if not receiver_id:
        return {"error": "receiver_id is required"}, 400
    result, status_code = create_invitation(session["user_id"], team_id, receiver_id)
    return result, status_code

# HU: US-011 — Accept Invitation
def accept_invitation_route(team_id, request_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = accept_invitation(session["user_id"], request_id)
    return result, status_code

# HU: US-012 — Reject Invitation
def reject_invitation_route(team_id, request_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = reject_invitation(session["user_id"], request_id)
    return result, status_code

# HU: (vacío documental) — Permite al Leader cancelar una invitación PENDING que envió, análogo a cancel() pero para invitaciones
def cancel_invitation_route(team_id, request_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = cancel_invitation(session["user_id"], request_id)
    return result, status_code

# HU: US-013 — Accept Join Request
def accept_request_route(team_id, request_id):
    # Verify that the user has an active session
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = accept_request(
        session["user_id"],
        team_id,
        request_id
    )
    return result, status_code

# HU: US-014 — Reject Request
def reject_request_route(team_id, request_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = reject_team_request(session["user_id"], request_id)
    return result, status_code

# HU: US-015 — Remove Team Member
def remove_member_route(team_id, user_id):
    if "user_id" not in session:
        return {
            "success": False,
            "message": "Unauthorized"
        },401
    leader_id = session["user_id"]
    # RN-036
    if leader_id == user_id:
        return {
            "success": False,
            "message": "The leader cannot remove themselves."
        },403
    if not is_team_leader(leader_id, team_id):
        return {
            "success": False,
            "message": "Only the team leader can remove members."
        },403
    return remove_member(team_id, user_id)

# HU: (vacío documental) — Permite a un integrante abandonar su equipo voluntariamente
def leave_team_route(team_id):
    if "user_id" not in session:
        return {"success": False, "message": "Unauthorized"}, 401
    return leave_team(session["user_id"], team_id)

# HU: US-016 — Transfer Leadership
def transfer_leader_route(team_id):
    if "user_id" not in session:
        return {
            "success": False,
            "message": "Unauthorized"
        }, 401
    leader_id = session["user_id"]
    if not is_team_leader(leader_id, team_id):
        return {
            "success": False,
            "message": "Only the team leader can transfer leadership."
        }, 403
    data = request.get_json()
    new_leader_id = data.get("new_leader_id")
    if not new_leader_id:
        return {
            "success": False,
            "message": "new_leader_id is required."
        }, 400
    if not is_team_member(new_leader_id, team_id):
        return {
            "success": False,
            "message": "The selected user does not belong to this team."
        }, 404
    return transfer_leadership(
        team_id,
        leader_id,
        new_leader_id
    )

# HU: US-017 — Dissolve Team
def dissolve_team_route(team_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = dissolve_team(session["user_id"], team_id)
    return result, status_code

# HU: (vacío documental) — Consultar perfil público de un equipo
def get_team_detail_route(team_id):
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    team = get_team_public_detail(team_id)
    if team is None:
        return {"error": "Team not found"}, 404
    return team, 200

# HU: US-018 — Consultar Compatibilidad (Leader → Estudiantes)
def get_recommendations_route(team_id):
    # Verify that the user has an active session
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    result, status_code = get_student_recommendations(session["user_id"], team_id)
    return result, status_code

# HU: (vacío documental) — Consultar Equipos Disponibles
def list_teams_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    # RN-011/RN-012: restricted until the Assessment is completed
    if session.get("role") != "STUDENT":
        return {"error": "Only Students can view available teams"}, 403
    from services.assessment_service import get_assessment_by_user
    assessment = get_assessment_by_user(session["user_id"])
    if assessment is None or assessment[1] is None:
        return {"error": "Assessment not completed"}, 403
    return list_available_teams(session["user_id"]), 200

# HU: (vacío documental) — Consultar Mis Solicitudes Enviadas
def get_my_requests_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    return list_my_requests(session["user_id"]), 200

# HU: (vacío documental) — Consultar Solicitudes Recibidas por mi Equipo
def get_received_requests_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    return list_received_requests(session["user_id"]), 200

# HU: (vacío documental) — Consultar Invitaciones Enviadas por mi Equipo
def get_sent_invitations_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    return list_sent_invitations(session["user_id"]), 200


# HU: (vacío documental) — Consultar Mis Invitaciones Recibidas
def get_received_invitations_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    return list_received_invitations(session["user_id"]), 200

# HU: (vacío documental) — Buscar Estudiantes para Invitar
def search_students_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    query = request.args.get("q", "").strip()
    if len(query) < 2:
        return {"error": "Escribe al menos 2 caracteres para buscar"}, 400
    return search_students_to_invite(session["user_id"], query), 200

# HU: (vacío documental) — Buscar equipos disponibles por nombre
def search_teams_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    query = request.args.get("q", "").strip()
    if len(query) < 2:
        return {"error": "Escribe al menos 2 caracteres para buscar"}, 400
    return search_teams_by_name(session["user_id"], query), 200

# HU: (vacío documental) — Consultar Mi Equipo
def get_my_team_route():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    team = get_my_team_detail(session["user_id"])
    if team is None:
        return {"error": "No perteneces a ningún equipo"}, 404
    return team, 200