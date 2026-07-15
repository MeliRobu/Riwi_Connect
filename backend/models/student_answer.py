class StudentAnswer:
    # The option a student picked for a specific question,
    # inside a specific assessment attempt.
    def __init__(self, id_student_answer, assessment_id, question_id, answer_option_id, answered_at):
        self.id_student_answer = id_student_answer
        self.assessment_id = assessment_id
        self.question_id = question_id
        self.answer_option_id = answer_option_id
        self.answered_at = answered_at