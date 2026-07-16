/*Institutional Sources*/

/* Search by document number */
CREATE INDEX idx_institutional_document
ON institutional_sources(document_number);

/* Search by campus */
CREATE INDEX idx_institutional_campus
ON institutional_sources(id_campus);

/* Search by journey */
CREATE INDEX idx_institutional_journey
ON institutional_sources(id_journey);

/* Search by clan */
CREATE INDEX idx_institutional_clan
ON institutional_sources(id_clan);



/* Users */

/* Relationship with institutional source */
CREATE INDEX idx_users_institutional_source
ON users(id_institutional_source);

/* Filter users by status */
CREATE INDEX idx_users_status
ON users(status);

/* Filter users by role */
CREATE INDEX idx_users_role
ON users(role);



/*Assessments*/

/* Search assessments by user */
CREATE INDEX idx_assessments_user
ON assessments(user_id);

/* Sort assessments by date */
CREATE INDEX idx_assessments_started_at
ON assessments(started_at);



/*Assessment Results*/

/* Relationship with assessment */
CREATE INDEX idx_results_assessment
ON assessment_results(assessment_id);

/* Ranking by score */
CREATE INDEX idx_results_score
ON assessment_results(overall_score);



/*Questions*/

/* Filter by category */
CREATE INDEX idx_questions_category
ON questions(category);

/* Filter by difficulty */
CREATE INDEX idx_questions_difficulty
ON questions(difficulty_level);



/*Answer Options*/

/* Relationship with question */
CREATE INDEX idx_answer_options_question
ON answer_options(question_id);



/*Student Answer*/

/* Search answers of an assessment */
CREATE INDEX idx_student_answers_assessment
ON student_answers(assessment_id);

/* Search answers of a question */
CREATE INDEX idx_student_answers_question
ON student_answers(question_id);

/* Search selected option */
CREATE INDEX idx_student_answers_option
ON student_answers(answer_option_id);



/*Team Members*/

/* Search members of a team */
CREATE INDEX idx_team_members_team
ON team_members(team_id);

/* Search by leader */
CREATE INDEX idx_team_members_leader
ON team_members(is_leader);



/*Team Requests*/

/* Requests sent by a user */
CREATE INDEX idx_requests_sender
ON team_requests(sender_user_id);

/* Requests received by a user */
CREATE INDEX idx_requests_receiver
ON team_requests(receiver_user_id);

/* Requests of a team */
CREATE INDEX idx_requests_team
ON team_requests(team_id);

/* Filter by request status */
CREATE INDEX idx_requests_status
ON team_requests(status);

/* Filter by request type */
CREATE INDEX idx_requests_type
ON team_requests(type);