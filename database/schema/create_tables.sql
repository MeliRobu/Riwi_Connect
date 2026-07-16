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
    id_campus INT,
    id_journey INT,
    id_clan INT,

    CONSTRAINT FK_campus FOREIGN KEY (id_campus) REFERENCES campus(id_campus),
    CONSTRAINT FK_journey FOREIGN KEY (id_journey) REFERENCES journeys(id_journey),
    CONSTRAINT FK_clan FOREIGN KEY (id_clan) REFERENCES clan(id_clan)
);
--5. Users
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    password_hash VARCHAR(250) NOT NULL,
    id_institutional_source INT,
    CONSTRAINT FK_id_institutional_source FOREIGN KEY (id_institutional_source) REFERENCES institutional_sources(id_institutional_source),
    
    status VARCHAR(20) NOT NULL  DEFAULT 'AVAILABLE'
        CHECK (status IN ('AVAILABLE','IN_TEAM')),
    role VARCHAR(20)
        NOT NULL
        DEFAULT 'STUDENT'
        CHECK (role IN ('STUDENT','ADMINISTRATOR')),
    profile_image VARCHAR(255) NOT NULL DEFAULT 'assets/default_avatar.png'
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
    user_id INT,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(id_user),
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
--8. Assessment results
CREATE TABLE assessment_results(
    id_assessment_result SERIAL PRIMARY KEY,
    assessment_id INT,
    CONSTRAINT FK_assessment_id FOREIGN KEY (assessment_id) REFERENCES assessments(id_assessment),

    overall_score DECIMAL (5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    python_score DECIMAL (5,2) NOT NULL,
    sql_score DECIMAL (5,2) NOT NULL,
    javascript_score DECIMAL (5,2) NOT NULL,
    html_score DECIMAL (5,2) NOT NULL,
    css_score DECIMAL (5,2) NOT NULL,
    strengths TEXT ,
    improvement_opportunities TEXT,
    profile_description TEXT

);
--9. Questions
CREATE TABLE questions (
    id_question SERIAL PRIMARY KEY,
    statement VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL
        CHECK (difficulty_level IN ('EASY','MEDIUM','HARD')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','INACTIVE'))
);
--10. Answer options
CREATE TABLE answer_options (
    id_answer_option SERIAL PRIMARY KEY,
    question_id INT,
    CONSTRAINT FK_question_id FOREIGN KEY (question_id) REFERENCES questions(id_question),
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);
--11. Student answers
CREATE TABLE student_answers (
    id_student_answer SERIAL PRIMARY KEY,
    assessment_id INT,
    CONSTRAINT FK_assessment_id FOREIGN KEY (assessment_id) REFERENCES assessments(id_assessment),
    question_id INT,
    CONSTRAINT FK_question_id FOREIGN KEY (question_id) REFERENCES questions(id_question),
    answer_option_id INT,
    CONSTRAINT FK_answer_option_id FOREIGN KEY (answer_option_id) REFERENCES answer_options(id_answer_option),
    answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_assessment_question UNIQUE (assessment_id, question_id)
);
--12. Team 
CREATE TABLE teams (
    id_team SERIAL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--13. Team members
CREATE TABLE team_members (
    id_team_member SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(id_user),
    team_id INT,
    CONSTRAINT FK_team_id FOREIGN KEY (team_id) REFERENCES teams(id_team),
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_leader BOOLEAN NOT NULL DEFAULT FALSE
);
--14. Team requests
CREATE TABLE team_requests (
    id_team_request SERIAL PRIMARY KEY,
    sender_user_id INT,
    receiver_user_id INT,
    team_id INT,
    status VARCHAR(20)
        DEFAULT 'PENDING'
        CHECK (status IN ('PENDING','ACCEPTED','REJECTED', 'CANCELLED')),
    type VARCHAR (20) NOT NULL
        CHECK ( type IN('REQUEST', 'INVITATION')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_at TIMESTAMP,

    CONSTRAINT fk_sender FOREIGN KEY (sender_user_id) REFERENCES users(id_user),
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_user_id) REFERENCES users(id_user),
    CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES teams(id_team),
--This constraint ensures that a user cannot send a request to themselves or invite themselves to a team.
    CONSTRAINT chk_sender_receiver CHECK (sender_user_id <> receiver_user_id)
);


