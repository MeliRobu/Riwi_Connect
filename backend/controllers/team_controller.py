from flask import request, session 
from services.team_service import (
    create_team,
    request_join_team,
    cancel_request,
    create_invitation,
    accept_invitation,
    reject_invitation
)

# HU: US-007 — Create Team (EP-002 - Team Management)

def create():
    #Verify that the user has an  active session

    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    
    data = request.get_json()

    team_name = data.get("team_name")

    if not team_name:
        return {"error": "Team name is required"}, 400

    result, status_code = create_team(session["user_id"], team_name)
    return result, status_code

def send_request(team_id):
    # Verify that the user has an active session
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
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