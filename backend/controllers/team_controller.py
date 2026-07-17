from flask import request, session 
from services.team_service import create_team
from services.team_service import request_join_team
from services.team_service import create_invitation
from services.team_service import request_join_team
from services.team_service import accept_invitation
from services.team_service import reject_invitation
from services.team_service import is_team_leader
from services.team_service import remove_member
from services.team_service import transfer_leadership
from services.team_service import is_team_member

from services.team_service import reject_team_request

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
