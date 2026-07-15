from flask import request, session
from services.user_service import register_user, get_user_by_id
from services.auth_service import login_user, logout_user


def register():
    data = request.get_json()
    document_number = data.get("document_number")
    password = data.get("password")

    # RN-045: password length is checked here, before it ever reaches
    # the service layer, so we never bother hashing something we're
    # going to reject anyway
    if not password or len(password) < 8:
        return {"error": "Password must be at least 8 characters"}, 400

    result, status_code = register_user(document_number, password)
    return result, status_code


def login():
    data = request.get_json()
    document_number = data.get("document_number")
    password = data.get("password")

    result, status_code = login_user(document_number, password)

    # session only gets created when the credentials actually check out,
    # otherwise we'd be logging in a user that failed authentication
    if status_code == 200:
        session["user_id"] = result["id_user"]
        session["role"] = result["role"]

    return result, status_code


def logout():
    # nothing to clear if the request never had a session to begin with
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401

    result, status_code = logout_user(session)
    return result, status_code


def profile():
    # same guard as logout: no session, no access to protected data
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401

    user = get_user_by_id(session["user_id"])
    if user is None:
        return {"error": "User not found"}, 404

    return user, 200