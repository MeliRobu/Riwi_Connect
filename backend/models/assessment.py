class Assessment:
    # A single attempt at the technical test, tied to one user.
    # There's no "status" field on purpose: we check completed_at
    # instead. If it's None, the assessment is still in progress.
    def __init__(self, id_assessment, user_id, started_at, completed_at=None):
        self.id_assessment = id_assessment
        self.user_id = user_id
        self.started_at = started_at
        self.completed_at = completed_at