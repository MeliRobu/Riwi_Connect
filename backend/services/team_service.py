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