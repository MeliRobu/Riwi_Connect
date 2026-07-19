from flask import Blueprint
from controllers.team_controller import create
from controllers.team_controller import send_request
from controllers.team_controller import cancel
from controllers.team_controller import send_invitation
from controllers.team_controller import accept_invitation_route
from controllers.team_controller import reject_invitation_route
from controllers.team_controller import cancel_invitation_route
from controllers.team_controller import accept_request_route
from controllers.team_controller import reject_request_route
from controllers.team_controller import remove_member_route
from controllers.team_controller import leave_team_route
from controllers.team_controller import transfer_leader_route
from controllers.team_controller import dissolve_team_route
from controllers.team_controller import get_recommendations_route
from controllers.team_controller import list_teams_route
from controllers.team_controller import get_my_requests_route
from controllers.team_controller import get_received_requests_route
from controllers.team_controller import get_sent_invitations_route
from controllers.team_controller import get_received_invitations_route
from controllers.team_controller import search_students_route
from controllers.team_controller import search_teams_route
from controllers.team_controller import get_team_detail_route
from controllers.team_controller import get_my_team_route

# HU: US-007 — Create Team (EP-002 - Team Management)
team_routes = Blueprint('team_routes', __name__)

# HU: US-007 — Create Team
team_routes.add_url_rule("/teams",
view_func=create,
methods=["POST"])

# HU: US-008 — Request to Join Team
team_routes.add_url_rule("/teams/<int:team_id>/requests",
view_func=send_request,
methods=["POST"])

# HU: US-009 — Cancel Request
team_routes.add_url_rule("/teams/<int:team_id>/requests/<int:request_id>",
view_func=cancel,
methods=["DELETE"]
)

# HU: US-010 — Send Invitation
team_routes.add_url_rule("/teams/<int:team_id>/invitations",
view_func=send_invitation,
methods=["POST"])

# HU: US-011 — Accept Invitation
team_routes.add_url_rule("/teams/<int:team_id>/invitations/<int:request_id>/accept",
view_func=accept_invitation_route,
methods=["PATCH"])

# HU: US-012 — Reject Invitation
team_routes.add_url_rule("/teams/<int:team_id>/invitations/<int:request_id>/reject",
view_func=reject_invitation_route,
methods=["PATCH"])

# HU: (vacío documental) — Permite al Leader cancelar una invitación PENDING que envió
team_routes.add_url_rule("/teams/<int:team_id>/invitations/<int:request_id>",
view_func=cancel_invitation_route,
methods=["DELETE"])

# HU: US-013 — Accept Join Request
team_routes.add_url_rule(
    "/teams/<int:team_id>/requests/<int:request_id>/accept",
    view_func=accept_request_route,
    methods=["PATCH"]
)

# HU: US-014 — Reject Request
team_routes.add_url_rule("/teams/<int:team_id>/requests/<int:request_id>/reject",
view_func=reject_request_route,
methods=["PATCH"])

# HU: US-015 — Remove Team Member
team_routes.add_url_rule(
    "/teams/<int:team_id>/members/<int:user_id>",
    view_func=remove_member_route,
    methods=["DELETE"]
)

# HU: (vacío documental) — Abandonar equipo voluntariamente
team_routes.add_url_rule(
    "/teams/<int:team_id>/members/me",
    view_func=leave_team_route,
    methods=["DELETE"]
)

# HU: US-016 — Transfer Leadership
team_routes.add_url_rule(
    "/teams/<int:team_id>/leader",
    view_func=transfer_leader_route,
    methods=["PATCH"]
)

# HU: US-017 — Dissolve Team
team_routes.add_url_rule("/teams/<int:team_id>",
view_func=dissolve_team_route,
methods=["DELETE"])
team_routes.add_url_rule("/teams/<int:team_id>",
view_func=get_team_detail_route,
methods=["GET"])

# HU: US-018 — Consultar Compatibilidad (Leader → Estudiantes)
team_routes.add_url_rule("/teams/<int:team_id>/recommendations",
view_func=get_recommendations_route,
methods=["GET"])

# HU: (vacío documental) — Consultar Equipos Disponibles
team_routes.add_url_rule("/teams",
view_func=list_teams_route,
methods=["GET"])

# HU: (vacío documental) — Consultar Mis Solicitudes Enviadas
team_routes.add_url_rule("/users/requests",
view_func=get_my_requests_route,
methods=["GET"])

# HU: (vacío documental) — Consultar Solicitudes Recibidas por mi Equipo
team_routes.add_url_rule("/teams/requests/received",
view_func=get_received_requests_route,
methods=["GET"])

# HU: (vacío documental) — Consultar Invitaciones Enviadas por mi Equipo
team_routes.add_url_rule("/teams/invitations/sent",
view_func=get_sent_invitations_route,
methods=["GET"])

# HU: (vacío documental) — Consultar Mis Invitaciones Recibidas
team_routes.add_url_rule("/users/invitations",
view_func=get_received_invitations_route,
methods=["GET"])

# HU: (vacío documental) — Buscar Estudiantes para Invitar
team_routes.add_url_rule("/teams/students/search",
view_func=search_students_route,
methods=["GET"])

# HU: (vacío documental) — Buscar Equipos Disponibles
team_routes.add_url_rule("/teams/search",
view_func=search_teams_route,
methods=["GET"])

# HU: (vacío documental) — Consultar Mi Equipo
team_routes.add_url_rule("/users/team",
view_func=get_my_team_route,
methods=["GET"])