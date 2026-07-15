from flask import Blueprint
from controllers.user_controller import register, login, logout, profile

# HU: US-001, US-002, US-003 (EP-001 — User Management)
# All four User Management endpoints from DO-003 Sprint 3

user_routes = Blueprint("user_routes", __name__)

# HU: US-001 — Registro de Usuario
user_routes.add_url_rule("/users/register", view_func=register, methods=["POST"])

# HU: US-002 — Inicio de Sesión
user_routes.add_url_rule("/users/login", view_func=login, methods=["POST"])

# HU: US-002 — Inicio de Sesión (logout is part of the same session flow, no dedicated HU)
user_routes.add_url_rule("/users/logout", view_func=logout, methods=["POST"])

# HU: US-003 — Consultar mi Perfil
user_routes.add_url_rule("/users/profile", view_func=profile, methods=["GET"])