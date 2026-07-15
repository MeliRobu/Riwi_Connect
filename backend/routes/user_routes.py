from flask import Blueprint
from controllers.user_controller import register, login, logout, profile

# All four User Management endpoints from DO-003 Sprint 3
user_routes = Blueprint("user_routes", __name__)

user_routes.add_url_rule("/users/register", view_func=register, methods=["POST"])
user_routes.add_url_rule("/users/login", view_func=login, methods=["POST"])
user_routes.add_url_rule("/users/logout", view_func=logout, methods=["POST"])
user_routes.add_url_rule("/users/profile", view_func=profile, methods=["GET"])