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