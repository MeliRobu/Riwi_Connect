from flask import request, session 
from services.team_service import create_team

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