class Question:
    def __init__(self, id_question, statement, category, difficulty_level, status='ACTIVE'):
        self.id_question = id_question
        self.statement = statement
        self.category = category
        self.difficulty_level = difficulty_level
        self.status = status