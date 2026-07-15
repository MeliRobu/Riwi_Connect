class AnswerOption:
    # One of the four possible answers for a given question.
    def __init__(self, id_answer_option, question_id, content, is_correct):
        self.id_answer_option = id_answer_option
        self.question_id = question_id
        self.content = content
        self.is_correct = is_correct