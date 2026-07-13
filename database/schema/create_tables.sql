--1. Clan 
CREATE TABLE clan (
    id_clan SERIAL PRIMARY KEY,
    clan_name VARCHAR(50) NOT NULL UNIQUE
);
--2. Journeys
CREATE TABLE journeys (
    id_journey SERIAL PRIMARY KEY,
    journey_time VARCHAR(50) NOT NULL UNIQUE
);
--3. Campus
CREATE TABLE campus (
    id_campus SERIAL PRIMARY KEY,
    campus_name VARCHAR(50) NOT NULL UNIQUE
);
--4. Institutional sources 
CREATE TABLE institutional_sources (
    id_institutional_source SERIAL PRIMARY KEY,
    document_number INT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    id_campus INT NOT NULL,
    id_journey INT NOT NULL,
    id_clan INT NOT NULL,

    CONSTRAINT FK_campus FOREIGN KEY (id_campus) REFERENCES campus(id_campus),
    CONSTRAINT FK_journey FOREIGN KEY (id_journey) REFERENCES journeys(id_journey),
    CONSTRAINT FK_clan FOREIGN KEY (id_clan) REFERENCES clan(id_clan)
);
--5. Users
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    id_institutional_source INT NOT NULL UNIQUE,
    CONSTRAINT FK_id_institutional_source FOREIGN KEY (id_institutional_source) REFERENCES institutional_sources(id_institutional_source),
    
    status VARCHAR(20) NOT NULL  DEFAULT 'active'
        CHECK (status IN ('active','inactive')),
    role VARCHAR(20)
        NOT NULL
        DEFAULT 'student'
        CHECK (role IN ('student','admin')),
    profile_image VARCHAR(255)
);
--6. Assessments configuration
CREATE TABLE assessment_configurations (
    id_assessment_configuration SERIAL PRIMARY KEY,
    question_count INT NOT NULL,
    selection_method VARCHAR(50) NOT NULL,
    time_limit INT NOT NULL
);
--7. Assessment 
CREATE TABLE assessments (
    id_assessment SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(id_user),
    description VARCHAR(100) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20)
        DEFAULT 'pending'
        CHECK (status IN ('pending','in_progress','completed','abandoned'))
);
--8. Assessment results
CREATE TABLE assessment_results(
    id_assessment_result SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL UNIQUE,
    CONSTRAINT FK_assessment_id FOREIGN KEY (assessment_id) REFERENCES assessments(id_assessment),
    
    overall_score DECIMAL (5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    python_score DECIMAL (5,2) NOT NULL,
    sql_score DECIMAL (5,2) NOT NULL,
    javascript_score DECIMAL (5,2) NOT NULL,
    html_score DECIMAL (5,2) NOT NULL,
    css_score DECIMAL (5,2) NOT NULL,
    strengths VARCHAR(100) NOT NULL,
    improvement_opportunities VARCHAR(100) NOT NULL,
    profile_description VARCHAR(100) NOT NULL

);
--9. Questions
CREATE TABLE questions (
    id_question SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL,
    CONSTRAINT FK_assessment_id FOREIGN KEY (assessment_id) REFERENCES assessments(id_assessment),
    
    statement VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL
        CHECK (difficulty_level IN ('easy','medium','hard'))
    
);
--10. Answer options
CREATE TABLE answer_options (
    id_answer_option SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    CONSTRAINT FK_question_id FOREIGN KEY (question_id) REFERENCES questions(id_question),
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);
--11. Student answers
CREATE TABLE student_answers (
    id_student_answer SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL,
    CONSTRAINT FK_assessment_id FOREIGN KEY (assessment_id) REFERENCES assessments(id_assessment),
    question_id INT NOT NULL,
    CONSTRAINT FK_question_id FOREIGN KEY (question_id) REFERENCES questions(id_question),
    answer_option_id INT NOT NULL,
    CONSTRAINT FK_answer_option_id FOREIGN KEY (answer_option_id) REFERENCES answer_options(id_answer_option),
    answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--12. Team 
CREATE TABLE teams (
    id_team SERIAL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    team_description VARCHAR(100) NOT NULL,
    max_members INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--13. Team members
CREATE TABLE team_members (
    id_team_member SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(id_user),
    team_id INT NOT NULL,
    CONSTRAINT FK_team_id FOREIGN KEY (team_id) REFERENCES teams(id_team),
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_leader BOOLEAN NOT NULL DEFAULT FALSE
);
--14. Team requests
CREATE TABLE team_requests (
    id_team_request SERIAL PRIMARY KEY,
    sender_user_id INT NOT NULL,
    receiver_user_id INT NOT NULL,
    team_id INT NOT NULL,
        status VARCHAR(20)
        DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','rejected')),
    CONSTRAINT fk_sender FOREIGN KEY (sender_user_id) REFERENCES users(id_user),
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_user_id) REFERENCES users(id_user),
    CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES teams(id_team),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_at TIMESTAMP
);