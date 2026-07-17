from database.connection import get_connection


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