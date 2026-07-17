from flask import Blueprint
from controllers.team_controller import create
from controllers.team_controller import send_invitation
from controllers.team_controller import send_request
from controllers.team_controller import accept_invitation_route
from controllers.team_controller import reject_invitation_route
from controllers.team_controller import remove_member_route
from controllers.team_controller import reject_request_route

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

# HU: US-015 — Remove Team Member
team_routes.add_url_rule(
    "/teams/<int:team_id>/members/<int:user_id>",
    view_func=remove_member_route,
    methods=["DELETE"]
)

# HU: US-014 — Reject Request
team_routes.add_url_rule("/teams/<int:team_id>/requests/<int:request_id>/reject",
view_func=reject_request_route,
methods=["PATCH"])
