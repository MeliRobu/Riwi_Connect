class AssessmentResult:
    # Final scores for one assessment, one score per technology
    # plus the overall average. The last three fields start as None
    # because they're filled in later by Gemini API.
    def __init__(self, id_assessment_result, assessment_id, overall_score,
                python_score, sql_score, javascript_score, html_score, css_score,
                strengths=None, improvement_opportunities=None, profile_description=None):
        self.id_assessment_result = id_assessment_result
        self.assessment_id = assessment_id
        self.overall_score = overall_score
        self.python_score = python_score
        self.sql_score = sql_score
        self.javascript_score = javascript_score
        self.html_score = html_score
        self.css_score = css_score
        self.strengths = strengths
        self.improvement_opportunities = improvement_opportunities
        self.profile_description = profile_description