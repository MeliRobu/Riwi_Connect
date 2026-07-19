from database.connection import get_connection

# HU: US-007 — Create Team
def create_team(user_id, team_name):
    """
    HU: US-007 — Create Team
    Creates a new team if the user is AVAILABLE and has completed the assessment.
    """

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check if the user exists and is AVAILABLE
        cursor.execute(
            """
            SELECT status
            FROM users
            WHERE id_user = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if user is None:
            cursor.close()
            conn.close()
            return {"error": "User not found"}, 404

        if user[0] != "AVAILABLE":
            cursor.close()
            conn.close()
            return {"error": "User is already in a team"}, 409

        # Check if the assessment has been completed
        cursor.execute(
            """
            SELECT completed_at
            FROM assessments
            WHERE user_id = %s
            """,
            (user_id,)
        )

        assessment = cursor.fetchone()

        if assessment is None or assessment[0] is None:
            cursor.close()
            conn.close()
            return {"error": "Assessment not completed"}, 403

        # Create the team
        cursor.execute(
            """
            INSERT INTO teams (team_name)
            VALUES (%s)
            RETURNING id_team
            """,
            (team_name,)
        )

        team_id = cursor.fetchone()[0]

        # Add the creator as leader
        cursor.execute(
            """
            INSERT INTO team_members (user_id, team_id, is_leader)
            VALUES (%s, %s, TRUE)
            """,
            (user_id, team_id)
        )

        # Update user status
        cursor.execute(
            """
            UPDATE users
            SET status = 'IN_TEAM'
            WHERE id_user = %s
            """,
            (user_id,)
        )

        conn.commit()

        return {
            "message": "Team created successfully",
            "team_id": team_id
        }, 201

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500

    finally:
        cursor.close()
        conn.close()

# HU: US-008 — Request to Join Team
def request_join_team(user_id, team_id):
    """
    HU: US-008 — Request to Join Team
    Allows a user to request to join a team if they are AVAILABLE and have completed the assessment.
    """

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check if the user exists and is AVAILABLE
        cursor.execute(
            """
            SELECT status
            FROM users
            WHERE id_user = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return {"message": "User not found"}, 404

        if user[0] != "AVAILABLE":
            return {"message": "User is already in a team"}, 409

        cursor.execute(
            """
            SELECT completed_at
            FROM assessments
            WHERE user_id = %s
            """,
            (user_id,)
        )

        assessment = cursor.fetchone()

        if not assessment or assessment[0] is None:
            return {"message": "Assessment not completed"}, 403

        # Check if the team exists
        cursor.execute(
            """
            SELECT id_team
            FROM teams
            WHERE id_team = %s
            """,
            (team_id,)
        )

        team = cursor.fetchone()

        if not team :
            return {"message": "Team not found"}, 404

        cursor.execute(
            """SELECT id_team_request
            FROM team_requests
            WHERE sender_user_id = %s
            AND team_id = %s
            AND status = 'PENDING'
            AND type = 'REQUEST'
            """,
            (user_id, team_id)
        )

        request = cursor.fetchone()

        if request:
            return {"message": "Request already sent"}, 409

        cursor.execute(
            """
            INSERT INTO team_requests (sender_user_id, receiver_user_id, team_id, status, type)
            VALUES (%s, %s, %s, 'PENDING', 'REQUEST')
            """,
            (user_id, None, team_id)
        )
        conn.commit()

        return {"message": "Request sent successfully"}, 201

    except Exception as e:
        conn.rollback()
        return {"message": str(e)}, 500

    finally:
        cursor.close()
        conn.close()

# HU: US-009 — Cancel_request
def cancel_request(user_id, request_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT sender_user_id, status
            FROM team_requests
            WHERE id_team_request = %s
            """,
            (request_id,)
        )

        request = cursor.fetchone()

        if not request:
            return {"message": "Request not found"}, 404

        if request[0] != user_id:
            return {"message": "Unauthorized"}, 403
        
        if request[1] != "PENDING":
            return {"message": "Request cannot be cancelled"}, 409
        
        cursor.execute(
            """
            UPDATE team_requests
            SET status = 'CANCELLED'
            WHERE id_team_request = %s
            """,
            (request_id,)
        )

        conn.commit()
        
        return {"message": "Request cancelled successfully"}, 200
    
    except Exception as e:
        conn.rollback()
        return {"message": str(e)}, 500

    finally:
        cursor.close()
        conn.close()


# HU: (vacío documental) — Permite al Leader cancelar una invitación PENDING que envió, análogo a US-009 pero para invitaciones
def cancel_invitation(user_id, request_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT sender_user_id, status, type
            FROM team_requests
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        request = cursor.fetchone()
        if not request:
            return {"message": "Invitation not found"}, 404
        if request[2] != "INVITATION":
            return {"message": "Invitation not found"}, 404
        if request[0] != user_id:
            return {"message": "Unauthorized"}, 403

        if request[1] != "PENDING":
            return {"message": "Invitation cannot be cancelled"}, 409

        cursor.execute(
            """
            UPDATE team_requests
            SET status = 'CANCELLED'
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        conn.commit()

        return {"message": "Invitation cancelled successfully"}, 200

    except Exception as e:
        conn.rollback()
        return {"message": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


# HU: US-010 — Send Invitation
# A team Leader invites an AVAILABLE student to join their team.
def create_invitation(sender_id, team_id, receiver_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Check that the sender is the Leader of this team
        cursor.execute(
            """
            SELECT is_leader
            FROM team_members
            WHERE user_id = %s AND team_id = %s
            """,
            (sender_id, team_id)
        )
        member = cursor.fetchone()
        if member is None or member[0] is not True:
            cursor.close()
            conn.close()
            return {"error": "Only the team Leader can send invitations"}, 403

        # Check that the receiver exists and is AVAILABLE
        cursor.execute(
            """
            SELECT status
            FROM users
            WHERE id_user = %s
            """,
            (receiver_id,)
        )
        receiver = cursor.fetchone()
        if receiver is None:
            cursor.close()
            conn.close()
            return {"error": "User not found"}, 404
        if receiver[0] != "AVAILABLE":
            cursor.close()
            conn.close()
            return {"error": "User is not available"}, 409

        # Check there isn't already a pending invitation to this team
        cursor.execute(
            """
            SELECT id_team_request
            FROM team_requests
            WHERE receiver_user_id = %s AND team_id = %s AND status = 'PENDING'
            """,
            (receiver_id, team_id)
        )
        if cursor.fetchone() is not None:
            cursor.close()
            conn.close()
            return {"error": "Invitation already sent to this user"}, 409

        # Create the invitation
        cursor.execute(
            """
            INSERT INTO team_requests (sender_user_id, receiver_user_id, team_id, status, type)
            VALUES (%s, %s, %s, 'PENDING', 'INVITATION')
            RETURNING id_team_request
            """,
            (sender_id, receiver_id, team_id)
        )
        request_id = cursor.fetchone()[0]

        conn.commit()
        return {
            "message": "Invitation sent successfully",
            "request_id": request_id
        }, 201
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# HU: US-011 — Accept Invitation
# The invited student accepts a PENDING invitation, joining the team.
# Enforces the 3-per-Clan limit (RN-047).
def accept_invitation(user_id, request_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Fetch the invitation
        cursor.execute(
            """
            SELECT receiver_user_id, team_id, status, type
            FROM team_requests
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        request = cursor.fetchone()
        if request is None:
            cursor.close()
            conn.close()
            return {"error": "Invitation not found"}, 404

        receiver_id, team_id, status, req_type = request

        # Only the invited user can accept
        if receiver_id != user_id:
            cursor.close()
            conn.close()
            return {"error": "You can only accept your own invitations"}, 403

        if req_type != "INVITATION":
            cursor.close()
            conn.close()
            return {"error": "This is not an invitation"}, 400

        if status != "PENDING":
            cursor.close()
            conn.close()
            return {"error": "Invitation is no longer pending"}, 409

        # Confirm the user is still AVAILABLE
        cursor.execute(
            """
            SELECT status
            FROM users
            WHERE id_user = %s
            """,
            (user_id,)
        )
        user = cursor.fetchone()
        if user is None or user[0] != "AVAILABLE":
            cursor.close()
            conn.close()
            return {"error": "User is not available"}, 409

        # RN-047: check the 3-per-Clan limit before adding the member
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id_user
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE tm.team_id = %s
              AND s.id_clan = (
                  SELECT s2.id_clan
                  FROM users u2
                  JOIN institutional_sources s2 ON u2.id_institutional_source = s2.id_institutional_source
                  WHERE u2.id_user = %s
              )
            """,
            (team_id, user_id)
        )
        clan_count = cursor.fetchone()[0]
        if clan_count >= 3:
            cursor.close()
            conn.close()
            return {"error": "Clan limit reached for this team"}, 409

        # All checks passed: add the member, update the request, update user status
        cursor.execute(
            """
            INSERT INTO team_members (user_id, team_id, is_leader)
            VALUES (%s, %s, FALSE)
            """,
            (user_id, team_id)
        )
        cursor.execute(
            """
            UPDATE team_requests
            SET status = 'ACCEPTED', response_at = CURRENT_TIMESTAMP
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        cursor.execute(
            """
            UPDATE users
            SET status = 'IN_TEAM'
            WHERE id_user = %s
            """,
            (user_id,)
        )
        conn.commit()
        return {"message": "Invitation accepted successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# HU: US-012 — Reject Invitation
# The invited student rejects a PENDING invitation.
def reject_invitation(user_id, request_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Fetch the invitation
        cursor.execute(
            """
            SELECT receiver_user_id, status, type
            FROM team_requests
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        request = cursor.fetchone()
        if request is None:
            cursor.close()
            conn.close()
            return {"error": "Invitation not found"}, 404

        receiver_id, status, req_type = request

        # Only the invited user can reject
        if receiver_id != user_id:
            cursor.close()
            conn.close()
            return {"error": "You can only reject your own invitations"}, 403

        if req_type != "INVITATION":
            cursor.close()
            conn.close()
            return {"error": "This is not an invitation"}, 400

        if status != "PENDING":
            cursor.close()
            conn.close()
            return {"error": "Invitation is no longer pending"}, 409

        # Reject it
        cursor.execute(
            """
            UPDATE team_requests
            SET status = 'REJECTED', response_at = CURRENT_TIMESTAMP
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        conn.commit()
        return {"message": "Invitation rejected successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
# HU: US-013 Accept_Request
def accept_request(user_id, team_id, request_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT is_leader
            FROM team_members
            WHERE user_id = %s
            AND team_id = %s
            """,
            (user_id, team_id)
        )

        leader = cursor.fetchone()

        if not leader or not leader[0]:
            return {"message": "Only the team leader can accept requests"}, 403
        
        cursor.execute(
            """
            SELECT sender_user_id, status
            FROM team_requests
            WHERE id_team_request = %s
            AND team_id = %s
            AND type = 'REQUEST'
            """,
            (request_id, team_id)
        )

        team_request = cursor.fetchone()

        if not team_request:
            return {"message": "Request not found"}, 404
        
        if team_request[1] != "PENDING":
            return {"message": "Request is not pending"}, 409

        student_id = team_request[0]

        cursor.execute(
            """
            SELECT status
            FROM users
            WHERE id_user = %s
            """,
            (student_id,)
        )

        student = cursor.fetchone()

        if not student:
            return {"message": "Student not found"}, 404

        if student[0] != "AVAILABLE":
            return {"message": "Student is already in a team"}, 409

        cursor.execute(
            """
            SELECT id_clan
            FROM institutional_sources
            WHERE id_institutional_source = (
                SELECT id_institutional_source
                FROM users
                WHERE id_user = %s
            )
            """,
            (student_id,)
        )

        student_clan = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM team_members tm
            JOIN users u
                ON tm.user_id = u.id_user
            JOIN institutional_sources i
                ON u.id_institutional_source = i.id_institutional_source
            WHERE tm.team_id = %s
            AND i.id_clan = %s
            """,
            (team_id, student_clan)
        )

        clan_count = cursor.fetchone()[0]

        if clan_count >= 3:
            return {"message": "Team already has 3 members from this clan"}, 409

        cursor.execute(
            """
            UPDATE team_requests
            SET status = 'ACCEPTED',
                response_at = CURRENT_TIMESTAMP
            WHERE id_team_request = %s
            """,
            (request_id,)
        )

        cursor.execute(
            """
            INSERT INTO team_members (user_id, team_id, is_leader)
            VALUES (%s, %s, FALSE)
            """,
            (student_id, team_id)
        )

        cursor.execute(
            """
            UPDATE users
            SET status = 'IN_TEAM'
            WHERE id_user = %s
            """,
            (student_id,)
        )

        conn.commit()

        return {"message": "Request accepted successfully"}, 200

    except Exception as e:
        conn.rollback()
        return {"message": str(e)}, 500

    finally:
        cursor.close()
        conn.close()        

def is_team_leader(user_id, team_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT is_leader
            FROM team_members
            WHERE user_id = %s
            AND team_id = %s
            """,
            (user_id, team_id)
        )

        leader = cursor.fetchone()

        return leader is not None and leader[0]

    finally:
        cursor.close()
        conn.close()

# HU: US-014 — Reject Request
# The team Leader rejects a PENDING join request from a student.
def reject_team_request(user_id, request_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Fetch the request
        cursor.execute(
            """
            SELECT sender_user_id, team_id, status, type
            FROM team_requests
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        request = cursor.fetchone()
        if request is None:
            cursor.close()
            conn.close()
            return {"error": "Request not found"}, 404

        sender_id, team_id, status, req_type = request

        if req_type != "REQUEST":
            cursor.close()
            conn.close()
            return {"error": "This is not a join request"}, 400

        # Only the team Leader can reject
        cursor.execute(
            """
            SELECT is_leader
            FROM team_members
            WHERE user_id = %s AND team_id = %s
            """,
            (user_id, team_id)
        )
        member = cursor.fetchone()
        if member is None or member[0] is not True:
            cursor.close()
            conn.close()
            return {"error": "Only the team Leader can reject requests"}, 403

        if status != "PENDING":
            cursor.close()
            conn.close()
            return {"error": "Request is no longer pending"}, 409

        # Reject it
        cursor.execute(
            """
            UPDATE team_requests
            SET status = 'REJECTED', response_at = CURRENT_TIMESTAMP
            WHERE id_team_request = %s
            """,
            (request_id,)
        )
        conn.commit()
        return {"message": "Request rejected successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# HU: US-015 — Remove Team Member
def remove_member(team_id, member_id):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT id_team_member
            FROM team_members
            WHERE user_id=%s
            AND team_id=%s
            """,
            (member_id, team_id)
        )

        member = cursor.fetchone()

        if member is None:
            return {
                "success": False,
                "message": "Member not found"
            },404

        cursor.execute(
            """
            DELETE FROM team_members
            WHERE user_id=%s
            AND team_id=%s
            """,
            (member_id, team_id)
        )

        cursor.execute(
            """
            UPDATE users
            SET status='AVAILABLE'
            WHERE id_user=%s
            """,
            (member_id,)
        )

        conn.commit()

        return {
            "success": True,
            "message": "Member removed successfully"
        },200

    except Exception as e:

        conn.rollback()
        return {
            "success": False,
            "message": str(e)
        },500


# HU: (vacío documental) — Permite a un integrante regular abandonar su equipo
# voluntariamente. El Leader no puede abandonar sin transferir liderazgo o
# disolver el equipo primero (ver GP-001, seccion de Reglas de Team Management).
def leave_team(user_id, team_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT is_leader
            FROM team_members
            WHERE user_id = %s AND team_id = %s
            """,
            (user_id, team_id)
        )
        member = cursor.fetchone()
        if member is None:
            return {"success": False, "message": "Member not found"}, 404

        is_leader = member[0]
        if is_leader:
            return {
                "success": False,
                "message": "The Leader cannot leave the team without transferring leadership or dissolving the team first"
            }, 409

        cursor.execute(
            """
            DELETE FROM team_members
            WHERE user_id = %s AND team_id = %s
            """,
            (user_id, team_id)
        )
        cursor.execute(
            """
            UPDATE users
            SET status = 'AVAILABLE'
            WHERE id_user = %s
            """,
            (user_id,)
        )
        conn.commit()
        return {"success": True, "message": "You have left the team successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


def is_team_member(user_id, team_id):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT 1
            FROM team_members
            WHERE user_id = %s
            AND team_id = %s
        """, (user_id, team_id))

        return cursor.fetchone() is not None

    finally:
        cursor.close()
        conn.close()

# HU: US-016 — Transfer Leadership
# Changes which team member holds the Leader role. The Controller has
# already validated that the caller is the current Leader and that the
# new leader belongs to the team.
def transfer_leadership(team_id, leader_id, new_leader_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE team_members
            SET is_leader = FALSE
            WHERE team_id = %s AND user_id = %s
            """,
            (team_id, leader_id)
        )
        cursor.execute(
            """
            UPDATE team_members
            SET is_leader = TRUE
            WHERE team_id = %s AND user_id = %s
            """,
            (team_id, new_leader_id)
        )
        conn.commit()
        return {"success": True, "message": "Leadership transferred successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

# HU: US-017 — Dissolve Team
# The team Leader dissolves the team entirely. All members return to
# AVAILABLE, all PENDING requests/invitations for this team are cancelled,
# and the team is deleted (RN-039).
def dissolve_team(user_id, team_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Confirm the team exists and the user is its Leader
        cursor.execute(
            """
            SELECT is_leader
            FROM team_members
            WHERE user_id = %s AND team_id = %s
            """,
            (user_id, team_id)
        )
        member = cursor.fetchone()
        if member is None:
            cursor.close()
            conn.close()
            return {"error": "Team not found"}, 404
        if member[0] is not True:
            cursor.close()
            conn.close()
            return {"error": "Only the team Leader can dissolve the team"}, 403

        # Get all current member ids, to set them back to AVAILABLE
        cursor.execute(
            """
            SELECT user_id
            FROM team_members
            WHERE team_id = %s
            """,
            (team_id,)
        )
        member_ids = [row[0] for row in cursor.fetchall()]

        # Delete every request/invitation tied to this team (any status)
        cursor.execute(
            """
            DELETE FROM team_requests
            WHERE team_id = %s
            """,
            (team_id,)
        )

        # Return every member to AVAILABLE
        cursor.execute(
            """
            UPDATE users
            SET status = 'AVAILABLE'
            WHERE id_user = ANY(%s)
            """,
            (member_ids,)
        )

        # Remove the members, then the team itself
        cursor.execute(
            """
            DELETE FROM team_members
            WHERE team_id = %s
            """,
            (team_id,)
        )
        cursor.execute(
            """
            DELETE FROM teams
            WHERE id_team = %s
            """,
            (team_id,)
        )

        conn.commit()
        return {"message": "Team dissolved successfully"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()
# HU: (vacío documental) — Consultar Equipos Disponibles (DT-007 8.3, GI-004 Fase 9)
def list_available_teams(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT t.id_team, t.team_name, COUNT(DISTINCT tm.user_id) AS member_count,
                   tr.id_team_request
            FROM teams t
            LEFT JOIN team_members tm ON tm.team_id = t.id_team
            LEFT JOIN team_requests tr ON tr.team_id = t.id_team
                AND tr.sender_user_id = %s
                AND tr.type = 'REQUEST'
                AND tr.status = 'PENDING'
            WHERE t.id_team NOT IN (
                SELECT team_id FROM team_members WHERE user_id = %s
            )
            GROUP BY t.id_team, t.team_name, tr.id_team_request
            HAVING COUNT(DISTINCT tm.user_id) < 6
            ORDER BY t.created_at DESC
            """,
            (user_id, user_id)
        )
        rows = cursor.fetchall()
        return [
            {
                "id_team": id_team,
                "team_name": team_name,
                "member_count": member_count,
                "pending_request_id": pending_request_id
            }
            for id_team, team_name, member_count, pending_request_id in rows
        ]
    finally:
        cursor.close()
        conn.close()


# HU: (vacío documental) — Consultar Mis Solicitudes Enviadas
def list_my_requests(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT tr.id_team_request, t.team_name, tr.status, tr.team_id
            FROM team_requests tr
            JOIN teams t ON tr.team_id = t.id_team
            WHERE tr.sender_user_id = %s AND tr.type = 'REQUEST'
            ORDER BY tr.id_team_request DESC
            """,
            (user_id,)
        )
        rows = cursor.fetchall()
        return [
            {"id_team_request": r[0], "team_name": r[1], "status": r[2], "team_id": r[3]}
            for r in rows
        ]
    finally:
        cursor.close()
        conn.close()

# HU: (vacío documental) — Consultar Solicitudes Recibidas por mi Equipo
def list_received_requests(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Only the Leader of a team can see requests sent to it
        cursor.execute(
            "SELECT team_id FROM team_members WHERE user_id = %s AND is_leader = TRUE",
            (user_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return []
        team_id = row[0]
        cursor.execute(
            """
            SELECT tr.id_team_request, s.full_name, tr.status
            FROM team_requests tr
            JOIN users u ON tr.sender_user_id = u.id_user
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE tr.team_id = %s AND tr.type = 'REQUEST' AND tr.status = 'PENDING'
            ORDER BY tr.id_team_request DESC
            """,
            (team_id,)
        )
        rows = cursor.fetchall()
        return [
            {"id_team_request": r[0], "full_name": r[1], "status": r[2], "team_id": team_id}
            for r in rows
        ]
    finally:
        cursor.close()
        conn.close()

# HU: (vacío documental) — Consultar Invitaciones Enviadas por mi Equipo
def list_sent_invitations(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT team_id FROM team_members WHERE user_id = %s AND is_leader = TRUE",
            (user_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return []
        team_id = row[0]
        cursor.execute(
            """
            SELECT tr.id_team_request, s.full_name, tr.status, tr.receiver_user_id
            FROM team_requests tr
            JOIN users u ON tr.receiver_user_id = u.id_user
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE tr.team_id = %s AND tr.type = 'INVITATION' AND tr.status = 'PENDING'
            ORDER BY tr.id_team_request DESC
            """,
            (team_id,)
        )
        rows = cursor.fetchall()
        return [
            {"id_team_request": r[0], "full_name": r[1], "status": r[2], "team_id": team_id, "receiver_user_id": r[3]}
            for r in rows
        ]
    finally:
        cursor.close()
        conn.close()


# HU: (vacío documental) — Consultar Mis Invitaciones Recibidas
def list_received_invitations(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT tr.id_team_request, t.team_name, tr.status, tr.team_id
            FROM team_requests tr
            JOIN teams t ON tr.team_id = t.id_team
            WHERE tr.receiver_user_id = %s AND tr.type = 'INVITATION' AND tr.status = 'PENDING'
            ORDER BY tr.id_team_request DESC
            """,
            (user_id,)
        )
        rows = cursor.fetchall()
        return [
            {"id_team_request": r[0], "team_name": r[1], "status": r[2], "team_id": r[3]}
            for r in rows
        ]
    finally:
        cursor.close()
        conn.close()

# HU: (vacío documental) — Buscar Estudiantes para Invitar
def search_students_to_invite(user_id, query):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Only the Leader can search candidates to invite
        cursor.execute(
            "SELECT team_id FROM team_members WHERE user_id = %s AND is_leader = TRUE",
            (user_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return []
        team_id = row[0]

        # Team's Campus/Journey come from the Leader, same as elsewhere in this file
        cursor.execute(
            """
            SELECT s.id_campus, s.id_journey
            FROM users u
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE u.id_user = %s
            """,
            (user_id,)
        )
        team_campus, team_journey = cursor.fetchone()

        cursor.execute(
            """
            SELECT u.id_user, s.full_name
            FROM users u
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE u.status = 'AVAILABLE'
              AND s.id_campus = %s
              AND s.id_journey = %s
              AND s.full_name ILIKE %s
            LIMIT 10
            """,
            (team_campus, team_journey, f"%{query}%")
        )
        rows = cursor.fetchall()
        return [{"user_id": r[0], "full_name": r[1]} for r in rows]
    finally:
        cursor.close()
        conn.close()

# HU: (vacío documental) — Consultar Mi Equipo
def get_my_team_detail(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT team_id FROM team_members WHERE user_id = %s",
            (user_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return None
        team_id = row[0]

        cursor.execute("SELECT team_name FROM teams WHERE id_team = %s", (team_id,))
        team_name = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT tm.user_id, s.full_name, tm.is_leader
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id_user
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE tm.team_id = %s
            ORDER BY tm.is_leader DESC, s.full_name
            """,
            (team_id,)
        )
        members = [
            {"user_id": r[0], "full_name": r[1], "is_leader": r[2]}
            for r in cursor.fetchall()
        ]

        # Analisis tecnico del equipo (DT-009 seccion 8-9, GP-000 seccion 7:
        # "Analizar fortalezas del equipo" / "Analizar debilidades del equipo").
        # Se recalcula en cada consulta, asi que se actualiza solo con cada
        # cambio real de integrantes -- no se guarda ningun valor cacheado.
        cursor.execute(
            """
            SELECT ar.python_score, ar.sql_score, ar.javascript_score,
                   ar.html_score, ar.css_score
            FROM team_members tm
            JOIN assessments a ON a.user_id = tm.user_id
            JOIN assessment_results ar ON ar.assessment_id = a.id_assessment
            WHERE tm.team_id = %s
            """,
            (team_id,)
        )
        score_rows = cursor.fetchall()
        tech_keys = ["python", "sql", "javascript", "html", "css"]
        tech_labels = {"python": "Python", "sql": "SQL", "javascript": "JavaScript", "html": "HTML", "css": "CSS"}
        averages = {}
        strengths = []
        weaknesses = []
        interpretation = None
        if score_rows:
            for i, key in enumerate(tech_keys):
                averages[key] = round(sum(float(r[i]) for r in score_rows) / len(score_rows), 1)
            sorted_techs = sorted(averages.items(), key=lambda x: x[1], reverse=True)
            strengths = [tech_labels[t] for t, _ in sorted_techs[:2]]
            weaknesses = [tech_labels[t] for t, _ in sorted_techs[-2:]]
            interpretation = (
                f"El equipo tiene un desempeño sólido en {' y '.join(strengths)}, "
                f"y podría fortalecer {' y '.join(weaknesses)} para lograr un perfil más equilibrado."
            )
        return {
            "team_id": team_id,
            "team_name": team_name,
            "members": members,
            "tech_averages": {tech_labels[k]: v for k, v in averages.items()},
            "strengths": strengths,
            "weaknesses": weaknesses,
            "interpretation": interpretation,
        }
    finally:
        cursor.close()
        conn.close()