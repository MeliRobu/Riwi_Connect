class InstitutionalSource:
    # Mirrors the institutional_sources table — the whitelist of people
    # authorized to register (students and admins alike, see DT-003 5.4)
    def __init__(self, id_institutional_source, document_number, full_name, email, id_campus, id_journey, id_clan):
        self.id_institutional_source = id_institutional_source
        self.document_number = document_number
        self.full_name = full_name
        self.email = email
        self.id_campus = id_campus
        self.id_journey = id_journey
        self.id_clan = id_clan  # None for administrators, they don't belong to a clan