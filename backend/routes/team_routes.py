from flask import Blueprint
from controllers.team_controller import create
from controllers.team_controller import send_invitation
from controllers.team_controller import accept_invitation_route

# HU: US-007 — Create Team (EP-002 - Team Management)
team_routes = Blueprint('team_routes', __name__)

# HU: US-007 — Create Team
team_routes.add_url_rule("/teams",
view_func=create,
methods=["POST"])

# HU: US-010 — Send Invitation
team_routes.add_url_rule("/teams/<int:team_id>/invitations",
view_func=send_invitation,
methods=["POST"])

# HU: US-011 — Accept Invitation
team_routes.add_url_rule("/teams/<int:team_id>/invitations/<int:request_id>/accept",
view_func=accept_invitation_route,
methods=["PATCH"])
