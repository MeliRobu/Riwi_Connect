class AssessmentConfiguration:
    # Holds the single row that controls how the assessment behaves:
    # how many questions to pull and how to pick them.
    def __init__(self, id_assessment_configuration, question_count, selection_method, time_limit):
        self.id_assessment_configuration = id_assessment_configuration
        self.question_count = question_count
        self.selection_method = selection_method
        self.time_limit = time_limit

