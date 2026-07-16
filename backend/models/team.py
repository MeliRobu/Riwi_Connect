class Team:
    # Mirrors the teams table
    def __init__(self, id_team, team_name, created_at):
        self.id_team = id_team
        self.team_name = team_name
        self.created_at = created_at