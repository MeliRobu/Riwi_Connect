class TeamMember:
    # Mirrors the team_members table
    def __init__(self, id_team_member, user_id, team_id, joined_at, is_leader):
        self.id_team_member = id_team_member
        self.user_id = user_id
        self.team_id = team_id
        self.joined_at = joined_at
        self.is_leader = is_leader