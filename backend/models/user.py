class User:
    # Mirrors the users table. Note there's no document_number here on purpose:
    # the team decided not to duplicate it from institutional_sources, so login
    # has to join both tables instead of querying users alone (see auth_service.py)
    def __init__(self, id_user, password_hash, id_institutional_source, status, role, profile_image):
        self.id_user = id_user
        self.password_hash = password_hash
        self.id_institutional_source = id_institutional_source
        self.status = status
        self.role = role
        self.profile_image = profile_image