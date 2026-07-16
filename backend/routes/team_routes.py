from flask import Blueprint
from controllers.team_controller import create

# HU: US-007 — Create Team (EP-002 - Team Management)

team_routes = Blueprint('team_routes', __name__)

#HU: US-007 — Create Team
team_routes.add_url_rule("/teams",
view_func=create,
methods=["POST"])