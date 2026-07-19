from database.connection import get_connection

TECHS = ["python_score", "sql_score", "javascript_score", "html_score", "css_score"]


def _weakness_weights(team_averages):
    # Converts team averages into normalized weakness weights (DT-009 section 9).
    # Weaker tech -> higher weight -> candidates strong there get prioritized.
    team_averages = {k: float(v) for k, v in team_averages.items()}
    weaknesses = {tech: 100 - avg for tech, avg in team_averages.items()}
    total = sum(weaknesses.values())
    if total == 0:
        # Team is maxed out (100) in every tech, split weight evenly
        return {tech: 100 / len(weaknesses) for tech in weaknesses}
    return {tech: (w / total) * 100 for tech, w in weaknesses.items()}


def _four_factor_score(candidate_scores, weights):
    # Shared four-factor model (DT-009 sections 11-12). Reused by both
    # directions (Leader -> Students and Student -> Teams, section 20.8)
    # so the formulas are never duplicated.
    candidate_scores = {k: float(v) for k, v in candidate_scores.items()}
    factor_1 = sum(weights[tech] * candidate_scores[tech] / 100 for tech in weights)
    factor_2 = candidate_scores["overall_score"]

    # Factor 3: how balanced the candidate's profile is (std dev across techs)
    mean = sum(candidate_scores[t] for t in TECHS) / len(TECHS)
    variance = sum((candidate_scores[t] - mean) ** 2 for t in TECHS) / len(TECHS)
    std_dev = float(variance) ** 0.5
    factor_3 = max(0, 100 - (std_dev * 2))

    factor_4 = 100  # Campus/Journey already enforced as an eligibility filter

    compatibility = (factor_1 * 0.50) + (factor_2 * 0.20) + (factor_3 * 0.20) + (factor_4 * 0.10)

    return {
        "factor_1": factor_1,
        "factor_2": factor_2,
        "compatibility": round(compatibility, 1),
    }


# HU: US-018 — Consultar Compatibilidad (Leader → Estudiantes)
def get_student_recommendations(user_id, team_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Only the team Leader can request recommendations (DT-009 section 15)
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
            return {"error": "Only the team Leader can request recommendations"}, 403

        # Equipo Completo (DT-009 section 15): no recommendations past 6 members
        cursor.execute("SELECT COUNT(*) FROM team_members WHERE team_id = %s", (team_id,))
        member_count = cursor.fetchone()[0]
        if member_count >= 6:
            return {"message": "Team is already full", "recommendations": []}, 200

        # teams doesn't store its own Campus/Journey, so we take it from the Leader
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

        # Clans already at their 3-member limit in this team (RN-047)
        cursor.execute(
            """
            SELECT s.id_clan, COUNT(*)
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id_user
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE tm.team_id = %s
            GROUP BY s.id_clan
            """,
            (team_id,)
        )
        full_clans = [clan for clan, count in cursor.fetchall() if count >= 3]

        # Current members' scores, used to build the team's weakness profile
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
        member_rows = cursor.fetchall()

        weights = None
        if member_rows:
            team_averages = {
                tech: sum(row[i] for row in member_rows) / len(member_rows)
                for i, tech in enumerate(TECHS)
            }
            weights = _weakness_weights(team_averages)
        # Equipo Vacío (DT-009 section 15): weights stays None, we rank by
        # overall score only, further down

        # Available candidates in the same Campus/Journey as the team
        cursor.execute(
            """
            SELECT u.id_user, s.full_name, s.id_clan, u.profile_image,
                   ar.overall_score, ar.python_score, ar.sql_score,
                   ar.javascript_score, ar.html_score, ar.css_score
            FROM users u
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            JOIN assessments a ON a.user_id = u.id_user
            JOIN assessment_results ar ON ar.assessment_id = a.id_assessment
            WHERE u.status = 'AVAILABLE'
              AND a.completed_at IS NOT NULL
              AND s.id_campus = %s
              AND s.id_journey = %s
            """,
            (team_campus, team_journey)
        )
        candidates = cursor.fetchall()

        recommendations = []
        for cand_id, full_name, clan, profile_image, overall, python_s, sql_s, js_s, html_s, css_s in candidates:
            if clan in full_clans:
                continue  # RN-047: this Clan is already at its limit in the team

            scores = {
                "overall_score": overall,
                "python_score": python_s,
                "sql_score": sql_s,
                "javascript_score": js_s,
                "html_score": html_s,
                "css_score": css_s,
            }

            if weights is None:
                factor_1, compatibility, top_techs = 0, overall, []
            else:
                result = _four_factor_score(scores, weights)
                factor_1, compatibility = result["factor_1"], result["compatibility"]
                top_techs = _top_weak_techs(weights)

            if top_techs:
                justification = (
                    f"Este candidato fortalece principalmente {' y '.join(top_techs)}, "
                    f"tecnologías donde tu equipo presenta el menor rendimiento."
                )
            else:
                justification = "Recomendado según su puntaje general, ya que el equipo aún no tiene integrantes."

            recommendations.append({
                "user_id": cand_id,
                "profile_image": profile_image,
                "full_name": full_name,
                "compatibility": compatibility,
                "strengthens": top_techs,
                "justification": justification,
                "_factor_1": factor_1,   # used only to break ties below, then removed
                "_factor_2": overall,
            })

        # Sin Candidatos (DT-009 section 15)
        if not recommendations:
            return {"message": "No available candidates found", "recommendations": []}, 200

        # Empate (DT-009 section 15): sort by compatibility, then Factor 1, then Factor 2
        recommendations.sort(key=lambda r: (r["compatibility"], r["_factor_1"], r["_factor_2"]), reverse=True)
        for r in recommendations:
            del r["_factor_1"]
            del r["_factor_2"]

        return {"recommendations": recommendations}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

TECH_LABELS = {
    "python_score": "Python",
    "sql_score": "SQL",
    "javascript_score": "JavaScript",
    "html_score": "HTML",
    "css_score": "CSS",
}


def _top_weak_techs(weights, n=2):
    # Names the technologies with the highest weakness weight, only for the
    # justification text shown to the student (DT-009 section 20.6) — this
    # does not affect the compatibility score itself.
    sorted_techs = sorted(weights.items(), key=lambda x: x[1], reverse=True)
    return [TECH_LABELS[tech] for tech, _ in sorted_techs[:n]]


# HU: US-025 — Consultar Compatibilidad (Estudiante → Equipos)
def get_team_recommendations(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Eligibility (DT-009 section 20.2): AVAILABLE + Assessment completed
        cursor.execute(
            """
            SELECT u.status, a.completed_at
            FROM users u
            LEFT JOIN assessments a ON a.user_id = u.id_user
            WHERE u.id_user = %s
            """,
            (user_id,)
        )
        row = cursor.fetchone()
        if row is None:
            return {"error": "User not found"}, 404
        status, completed_at = row
        if status != "AVAILABLE" or completed_at is None:
            return {"error": "Only an available Student with a completed Assessment can request recommendations"}, 403

        # Eligibility (DT-009 section 20.2): must not belong to any team
        cursor.execute("SELECT 1 FROM team_members WHERE user_id = %s", (user_id,))
        if cursor.fetchone() is not None:
            return {"error": "Only a Student without a team can request recommendations"}, 403

        # The student's own scores -- plays the role of "candidate" in this direction
        cursor.execute(
            """
            SELECT ar.overall_score, ar.python_score, ar.sql_score,
                   ar.javascript_score, ar.html_score, ar.css_score
            FROM assessments a
            JOIN assessment_results ar ON ar.assessment_id = a.id_assessment
            WHERE a.user_id = %s
            """,
            (user_id,)
        )
        overall, python_s, sql_s, js_s, html_s, css_s = cursor.fetchone()
        student_scores = {
            "overall_score": overall,
            "python_score": python_s,
            "sql_score": sql_s,
            "javascript_score": js_s,
            "html_score": html_s,
            "css_score": css_s,
        }

        cursor.execute(
            """
            SELECT s.id_campus, s.id_journey, s.id_clan
            FROM users u
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE u.id_user = %s
            """,
            (user_id,)
        )
        student_campus, student_journey, student_clan = cursor.fetchone()

        # Candidate teams (DT-009 section 20.3): same Campus/Journey, not full
        cursor.execute(
            """
            SELECT t.id_team, t.team_name
            FROM teams t
            JOIN team_members tm ON tm.team_id = t.id_team
            JOIN users u ON tm.user_id = u.id_user
            JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
            WHERE s.id_campus = %s AND s.id_journey = %s
            GROUP BY t.id_team, t.team_name
            HAVING COUNT(*) < 6
            """,
            (student_campus, student_journey)
        )
        candidate_teams = cursor.fetchall()

        recommendations = []
        for team_id, team_name in candidate_teams:
            # This candidate team's members and their scores -- plays the
            # role of "the Leader's team" in this direction
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
            member_rows = cursor.fetchall()
            if not member_rows:
                # Every team has at least the Leader with a completed
                # Assessment (RN-017), so this should not happen -- skip
                # safely instead of crashing on bad data
                continue

            # RN-026/RN-047: would adding the student break the Clan limit?
            cursor.execute(
                """
                SELECT COUNT(*)
                FROM team_members tm
                JOIN users u ON tm.user_id = u.id_user
                JOIN institutional_sources s ON u.id_institutional_source = s.id_institutional_source
                WHERE tm.team_id = %s AND s.id_clan = %s
                """,
                (team_id, student_clan)
            )
            clan_count = cursor.fetchone()[0]
            if clan_count >= 3:
                continue

            team_averages = {
                tech: sum(row[i] for row in member_rows) / len(member_rows)
                for i, tech in enumerate(TECHS)
            }
            weights = _weakness_weights(team_averages)
            result = _four_factor_score(student_scores, weights)
            top_techs = _top_weak_techs(weights)

            # Integrantes del equipo candidato, para la tarjeta de vista
            # previa en Sugerencias (mismo detalle que Equipos disponibles).
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

            labeled_averages = {TECH_LABELS[tech]: round(avg, 1) for tech, avg in team_averages.items()}
            sorted_labeled = sorted(labeled_averages.items(), key=lambda x: x[1], reverse=True)
            team_strengths = [label for label, _ in sorted_labeled[:2]]
            team_weaknesses = [label for label, _ in sorted_labeled[-2:]]
            interpretation = (
                f"El equipo tiene un desempeño sólido en {' y '.join(team_strengths)}, "
                f"y podría fortalecer {' y '.join(team_weaknesses)} para lograr un perfil más equilibrado."
            )

            recommendations.append({
                "team_id": team_id,
                "team_name": team_name,
                "member_count": len(member_rows),
                "members": members,
                "tech_averages": labeled_averages,
                "strengths": team_strengths,
                "weaknesses": team_weaknesses,
                "interpretation": interpretation,
                "compatibility": result["compatibility"],
                "strengthens": top_techs,
                "justification": (
                    f"Este equipo necesita fortalecer {' y '.join(top_techs)}, "
                    f"tecnologías en las que tuviste buen desempeño."
                ),
                "_factor_1": result["factor_1"],
                "_factor_2": result["factor_2"],
            })

        if not recommendations:
            return {"message": "No available teams found", "recommendations": []}, 200

        # Same tie-break rule as the Leader -> Students direction (DT-009 section 15/20.5)
        recommendations.sort(key=lambda r: (r["compatibility"], r["_factor_1"], r["_factor_2"]), reverse=True)
        for r in recommendations:
            del r["_factor_1"]
            del r["_factor_2"]

        # HU: (vacío documental) — indica si ya existe una solicitud PENDING
        # del estudiante a cada equipo recomendado, para que el Frontend
        # pueda mostrar "Pendiente" en vez de "Solicitar ingreso" de nuevo.
        cursor.execute(
            """
            SELECT team_id, id_team_request
            FROM team_requests
            WHERE sender_user_id = %s AND type = 'REQUEST' AND status = 'PENDING'
            """,
            (user_id,)
        )
        pending_by_team = {row[0]: row[1] for row in cursor.fetchall()}
        for r in recommendations:
            r["pending_request_id"] = pending_by_team.get(r["team_id"])

        return {"recommendations": recommendations}, 200
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()