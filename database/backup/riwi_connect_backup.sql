--Here goes the database backup
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

INSERT INTO clan (clan_name)
VALUES
    ('Micaela'),
    ('Garabato'),
    ('Mulata'),
    ('Cayena'),
    ('Malecón'),
    ('Cumbia'),
    ('Cortizzos'),
    ('Puerta de Oro'),
    ('Esthercita'),
    ('Centurión'),
    ('Nutibara'),
    ('Arvi'),
    ('La Comuna'),
    ('Poblado'),
    ('Guayabal'),
    ('Laureles'),
    ('Medellin Rio'),
    ('Silletero'),
    ('Feria de las Flores'),
    ('Botero');
INSERT INTO campus (campus_name)
VALUES
    ('Barranquilla'),
    ('Medellín');

INSERT INTO journeys (journey_time)
VALUES
    ('06:00 - 11:00'),
    ('11:00 - 16:00'),
    ('16:00 - 21:00'),
    ('ALL');


INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (1032547812, 'Juan David Pérez Gómez', 'juan.perez@riwi.io', 1, 1, 1),
    (1045873215, 'María Fernanda Rojas Díaz', 'maria.rojas@riwi.io', 1, 2, 1),
    (1019654873, 'Santiago Herrera Ruiz', 'santiago.herrera@riwi.io', 1, 3, 1),

    (1008456321, 'Laura Sofía Martínez Castro', 'laura.martinez@riwi.io', 1, 1, 2),
    (1052147896, 'Carlos Andrés Moreno López', 'carlos.moreno@riwi.io', 1, 2, 2),
    (1098745632, 'Valentina Gómez Ortega', 'valentina.gomez@riwi.io', 1, 3, 2),

    (1023654789, 'Miguel Ángel Navarro Pérez', 'miguel.navarro@riwi.io', 1, 1, 3),
    (1078456324, 'Sara Jiménez Rodríguez', 'sara.jimenez@riwi.io', 1, 2, 3),
    (1069874521, 'Felipe Acosta Hernández', 'felipe.acosta@riwi.io', 1, 3, 3),

    (1087452369, 'Camila Torres Sánchez', 'camila.torres@riwi.io', 1, 1, 4),
    (1012456987, 'Andrés Felipe Vargas Ruiz', 'andres.vargas@riwi.io', 1, 2, 4),
    (1036987452, 'Natalia Mendoza Castillo', 'natalia.mendoza@riwi.io', 1, 3, 4),

    (1054789632, 'Kevin Suárez Pineda', 'kevin.suarez@riwi.io', 1, 1, 5),
    (1041236587, 'Daniela Cárdenas Rojas', 'daniela.cardenas@riwi.io', 1, 2, 5),
    (1096321458, 'Cristian Gutiérrez Molina', 'cristian.gutierrez@riwi.io', 1, 3, 5),

    (1074123698, 'Isabella León Díaz', 'isabella.leon@riwi.io', 1, 1, 6),
    (1021478963, 'David Ramírez Herrera', 'david.ramirez@riwi.io', 1, 2, 6),

    (1089632147, 'Paula Andrea Ortiz Castro', 'paula.ortiz@riwi.io', 1, 3, 7),
    (1063214789, 'Mateo Acosta Gómez', 'mateo.acosta@riwi.io', 1, 1, 7),

    (1014785236, 'Luisa Fernanda Molina Pérez', 'luisa.molina@riwi.io', 1, 2, 8),
    (1047852361, 'Julián Sánchez Ríos', 'julian.sanchez@riwi.io', 1, 3, 8),

    (1093214785, 'Gabriela Ospina Martínez', 'gabriela.ospina@riwi.io', 1, 1, 9),
    (1058963214, 'Sebastián Arrieta López', 'sebastian.arrieta@riwi.io', 1, 2, 9),

    (1029631478, 'Valeria Restrepo Díaz', 'valeria.restrepo@riwi.io', 1, 3, 10),
    (1037412589, 'Juan Esteban Pardo Gómez', 'juan.pardo@riwi.io', 1, 1, 10),

    (1048523697, 'Camilo Restrepo Álvarez', 'camilo.restrepo@riwi.io', 2, 1, 11),
    (1014789652, 'Valentina Ospina Gómez', 'valentina.ospina@riwi.io', 2, 2, 11),
    (1096328741, 'Juan José Castaño Ruiz', 'juan.castano@riwi.io', 2, 3, 11),

    (1023659874, 'Laura Vélez Ramírez', 'laura.velez@riwi.io', 2, 1, 12),
    (1069852147, 'Mateo Giraldo Sánchez', 'mateo.giraldo@riwi.io', 2, 2, 12),
    (1032147856, 'Sara Henao Moreno', 'sara.henao@riwi.io', 2, 3, 12),

    (1085479632, 'Andrés Montoya Pérez', 'andres.montoya@riwi.io', 2, 1, 13),
    (1078963214, 'Isabella Londoño García', 'isabella.londono@riwi.io', 2, 2, 13),
    (1012458963, 'Sebastián Correa López', 'sebastian.correa@riwi.io', 2, 3, 13),

    (1047896325, 'Mariana Jaramillo Díaz', 'mariana.jaramillo@riwi.io', 2, 1, 14),
    (1026987451, 'Felipe Agudelo Herrera', 'felipe.agudelo@riwi.io', 2, 2, 14),
    (1058741236, 'Natalia Bedoya Castro', 'natalia.bedoya@riwi.io', 2, 3, 14),

    (1098745213, 'Juan Pablo Salazar Gómez', 'juan.salazar@riwi.io', 2, 1, 15),
    (1036985214, 'Daniela Cardona Ruiz', 'daniela.cardona@riwi.io', 2, 2, 15),
    (1087459631, 'David Echeverri Molina', 'david.echeverri@riwi.io', 2, 3, 15),

    (1012365478, 'María José Toro Álvarez', 'maria.toro@riwi.io', 2, 1, 16),
    (1078541236, 'Cristian Duque Pérez', 'cristian.duque@riwi.io', 2, 2, 16),

    (1041237896, 'Juliana Arango Restrepo', 'juliana.arango@riwi.io', 2, 3, 17),
    (1063258741, 'Samuel Vásquez Gómez', 'samuel.vasquez@riwi.io', 2, 1, 17),

    (1098563214, 'Laura Cifuentes Hernández', 'laura.cifuentes@riwi.io', 2, 2, 18),
    (1025478963, 'Miguel Franco Ríos', 'miguel.franco@riwi.io', 2, 3, 18),

    (1089652147, 'Paula Andrea Yepes Ruiz', 'paula.yepes@riwi.io', 2, 1, 19),
    (1014785239, 'Esteban Marín Ocampo', 'esteban.marin@riwi.io', 2, 2, 19),

    (1056321478, 'Valeria Gallego Castaño', 'valeria.gallego@riwi.io', 2, 3, 20),
    (1074125896, 'Santiago Uribe Montoya', 'santiago.uribe@riwi.io', 2, 1, 20);

INSERT INTO assessment_configurations  (question_count, selection_method, time_limit)
VALUES (15,'RANDOM',30 );

-- PYTHON QUESTIONS

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué palabra reservada se utiliza para definir una función en Python?', 'PYTHON', 'EASY'),
    ('¿Qué estructura de datos almacena elementos entre corchetes []?', 'PYTHON', 'EASY'),
    ('¿Cuál es la salida de print(type(10))?', 'PYTHON', 'EASY'),
    ('¿Cuál método agrega un elemento al final de una lista?', 'PYTHON', 'MEDIUM'),
    ('¿Qué hace la función len()?', 'PYTHON', 'MEDIUM'),
    ('¿Cuál es la diferencia entre una lista y una tupla?', 'PYTHON', 'MEDIUM'),
    ('¿Qué palabra clave se utiliza para manejar excepciones?', 'PYTHON', 'HARD'),
    ('¿Cuál es el resultado de 2 ** 3?', 'PYTHON', 'HARD');


INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 1
(1, 'function', FALSE),
(1, 'func', FALSE),
(1, 'def', TRUE),
(1, 'define', FALSE),

-- Question 2
(2, 'Lista', TRUE),
(2, 'Tupla', FALSE),
(2, 'Diccionario', FALSE),
(2, 'Conjunto', FALSE),

-- Question 3
(3, '<class ''str''>', FALSE),
(3, '<class ''float''>', FALSE),
(3, '<class ''int''>', TRUE),
(3, 'int', FALSE),

-- Question 4
(4, 'insert()', FALSE),
(4, 'push()', FALSE),
(4, 'append()', TRUE),
(4, 'add()', FALSE),

-- Question 5
(5, 'Calcula la suma de los elementos', FALSE),
(5, 'Retorna la longitud de un objeto', TRUE),
(5, 'Ordena una lista', FALSE),
(5, 'Elimina elementos duplicados', FALSE),

-- Question 6
(6, 'Las listas son inmutables y las tuplas mutables', FALSE),
(6, 'Las listas permiten solo números', FALSE),
(6, 'Las listas son mutables y las tuplas inmutables', TRUE),
(6, 'No existe ninguna diferencia', FALSE),

-- Question 7
(7, 'exception', FALSE),
(7, 'catch', FALSE),
(7, 'try', TRUE),
(7, 'handle', FALSE),

-- Question 8
(8, '6', FALSE),
(8, '8', TRUE),
(8, '9', FALSE),
(8, '5', FALSE);

-- SQL QUESTIONS 

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué comando se utiliza para consultar información de una tabla?', 'SQL', 'EASY'),
    ('¿Qué cláusula se utiliza para filtrar registros en una consulta?', 'SQL', 'EASY'),
    ('¿Cuál de las siguientes instrucciones agrega un nuevo registro a una tabla?', 'SQL', 'EASY'),
    ('¿Qué función devuelve el número total de registros de una consulta?', 'SQL', 'MEDIUM'),
    ('¿Qué tipo de JOIN devuelve únicamente los registros que tienen coincidencias en ambas tablas?', 'SQL', 'MEDIUM'),
    ('¿Qué cláusula se utiliza para ordenar los resultados de una consulta?', 'SQL', 'MEDIUM'),
    ('¿Cuál es la diferencia entre DELETE y TRUNCATE?', 'SQL', 'HARD'),
    ('¿Qué restricción garantiza que una columna no contenga valores repetidos?', 'SQL', 'HARD');

INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 9
(9, 'SELECT', TRUE),
(9, 'INSERT', FALSE),
(9, 'UPDATE', FALSE),
(9, 'DELETE', FALSE),

-- Question 10
(10, 'ORDER BY', FALSE),
(10, 'GROUP BY', FALSE),
(10, 'WHERE', TRUE),
(10, 'HAVING', FALSE),

-- Question 11
(11, 'UPDATE', FALSE),
(11, 'INSERT INTO', TRUE),
(11, 'CREATE TABLE', FALSE),
(11, 'ALTER TABLE', FALSE),

-- Question 12
(12, 'SUM()', FALSE),
(12, 'AVG()', FALSE),
(12, 'COUNT()', TRUE),
(12, 'MAX()', FALSE),

-- Question 13
(13, 'LEFT JOIN', FALSE),
(13, 'RIGHT JOIN', FALSE),
(13, 'INNER JOIN', TRUE),
(13, 'FULL JOIN', FALSE),

-- Question 14
(14, 'WHERE', FALSE),
(14, 'GROUP BY', FALSE),
(14, 'ORDER BY', TRUE),
(14, 'HAVING', FALSE),

-- Question 15
(15, 'DELETE elimina filas una a una y TRUNCATE vacía toda la tabla', TRUE),
(15, 'No existe diferencia', FALSE),
(15, 'TRUNCATE elimina solo una fila', FALSE),
(15, 'DELETE elimina la tabla completa', FALSE),

-- Question 16
(16, 'PRIMARY KEY', FALSE),
(16, 'FOREIGN KEY', FALSE),
(16, 'UNIQUE', TRUE),
(16, 'CHECK', FALSE);

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Cuál de las siguientes palabras clave se utiliza para declarar una constante en JavaScript?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué función se utiliza para mostrar un mensaje en la consola del navegador?', 'JAVASCRIPT', 'EASY'),
    ('¿Cuál de los siguientes tipos de datos representa un valor verdadero o falso?', 'JAVASCRIPT', 'EASY'),
    ('¿Cuál es la diferencia principal entre let y var?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué método convierte un objeto JavaScript en una cadena JSON?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué operador compara tanto el valor como el tipo de dato?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué es una función flecha (Arrow Function)?', 'JAVASCRIPT', 'HARD'),
    ('¿Qué método permite recorrer un arreglo ejecutando una función sobre cada elemento?', 'JAVASCRIPT', 'HARD');

INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 17
(17, 'let', FALSE),
(17, 'const', TRUE),
(17, 'var', FALSE),
(17, 'constant', FALSE),

-- Question 18
(18, 'console.log()', TRUE),
(18, 'print()', FALSE),
(18, 'echo()', FALSE),
(18, 'document.write()', FALSE),

-- Question 19
(19, 'String', FALSE),
(19, 'Boolean', TRUE),
(19, 'Number', FALSE),
(19, 'Object', FALSE),

-- Question 20
(20, 'let tiene alcance de bloque y var alcance de función', TRUE),
(20, 'No existe diferencia entre ellos', FALSE),
(20, 'var solo puede utilizarse dentro de funciones', FALSE),
(20, 'let no permite almacenar valores numéricos', FALSE),

-- Question 21
(21, 'JSON.stringify()', TRUE),
(21, 'JSON.parse()', FALSE),
(21, 'toJSON()', FALSE),
(21, 'parseJSON()', FALSE),

-- Question 22
(22, '==', FALSE),
(22, '=', FALSE),
(22, '===', TRUE),
(22, '!=', FALSE),

-- Question 23
(23, 'Una sintaxis abreviada para declarar funciones introducida en ES6', TRUE),
(23, 'Una función que solo trabaja con objetos', FALSE),
(23, 'Una función utilizada exclusivamente para eventos', FALSE),
(23, 'Una función que únicamente retorna números', FALSE),

-- Question 24
(24, 'find()', FALSE),
(24, 'forEach()', TRUE),
(24, 'filter()', FALSE),
(24, 'includes()', FALSE);


INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué propiedad CSS se utiliza para cambiar el color del texto?', 'CSS', 'EASY'),
    ('¿Qué propiedad CSS permite cambiar el color de fondo de un elemento?', 'CSS', 'EASY'),
    ('¿Qué selector se utiliza para seleccionar un elemento por su id?', 'CSS', 'EASY'),
    ('¿Qué propiedad se utiliza para agregar espacio interno a un elemento?', 'CSS', 'MEDIUM'),
    ('¿Cuál es la diferencia entre margin y padding?', 'CSS', 'MEDIUM'),
    ('¿Qué propiedad permite convertir un contenedor en un Flexbox?', 'CSS', 'MEDIUM'),
    ('¿Qué propiedad se utiliza para controlar el orden de apilamiento de los elementos?', 'CSS', 'HARD'),
    ('¿Qué propiedad permite definir la distribución de columnas y filas en CSS Grid?', 'CSS', 'HARD');

INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 25
(25, 'font-color', FALSE),
(25, 'text-color', FALSE),
(25, 'color', TRUE),
(25, 'foreground-color', FALSE),

-- Question 26
(26, 'background-color', TRUE),
(26, 'background', FALSE),
(26, 'bg-color', FALSE),
(26, 'fill-color', FALSE),

-- Question 27
(27, '.', FALSE),
(27, '#', TRUE),
(27, '*', FALSE),
(27, '@', FALSE),

-- Question 28
(28, 'margin', FALSE),
(28, 'padding', TRUE),
(28, 'spacing', FALSE),
(28, 'border', FALSE),

-- Question 29
(29, 'No existe diferencia', FALSE),
(29, 'Margin agrega espacio interno y padding externo', FALSE),
(29, 'Margin agrega espacio externo y padding interno', TRUE),
(29, 'Ambos modifican únicamente el tamaño del texto', FALSE),

-- Question 30
(30, 'display: flex', TRUE),
(30, 'position: flex', FALSE),
(30, 'flex: display', FALSE),
(30, 'layout: flex', FALSE),

-- Question 31
(31, 'position', FALSE),
(31, 'z-index', TRUE),
(31, 'display', FALSE),
(31, 'overflow', FALSE),

-- Question 32
(32, 'grid-template', TRUE),
(32, 'grid-layout', FALSE),
(32, 'grid-system', FALSE),
(32, 'template-grid', FALSE);
INSERT INTO questions (statement, category, difficulty_level)
VALUES
('¿Cuál es la etiqueta principal que define un documento HTML?', 'HTML', 'EASY'),
('¿Qué etiqueta se utiliza para crear un hipervínculo?', 'HTML', 'EASY'),
('¿Qué etiqueta se utiliza para insertar una imagen en una página web?', 'HTML', 'EASY'),
('¿Cuál atributo se utiliza para especificar la dirección de una imagen?', 'HTML', 'MEDIUM'),
('¿Qué etiqueta se utiliza para crear una lista desordenada?', 'HTML', 'MEDIUM'),
('¿Cuál es la función de la etiqueta <head>?', 'HTML', 'MEDIUM'),
('¿Qué atributo permite abrir un enlace en una nueva pestaña?', 'HTML', 'HARD'),
('¿Cuál es la diferencia principal entre las etiquetas <div> y <span>?', 'HTML', 'HARD');

INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 33
(33, '<body>', FALSE),
(33, '<html>', TRUE),
(33, '<head>', FALSE),
(33, '<main>', FALSE),

-- Question 34
(34, '<link>', FALSE),
(34, '<a>', TRUE),
(34, '<href>', FALSE),
(34, '<url>', FALSE),

-- Question 35
(35, '<picture>', FALSE),
(35, '<image>', FALSE),
(35, '<img>', TRUE),
(35, '<src>', FALSE),

-- Question 36
(36, 'href', FALSE),
(36, 'src', TRUE),
(36, 'link', FALSE),
(36, 'path', FALSE),

-- Question 37
(37, '<ol>', FALSE),
(37, '<ul>', TRUE),
(37, '<li>', FALSE),
(37, '<list>', FALSE),

-- Question 38
(38, 'Mostrar el contenido principal de la página', FALSE),
(38, 'Almacenar metadatos e información de configuración del documento', TRUE),
(38, 'Crear tablas', FALSE),
(38, 'Insertar imágenes', FALSE),

-- Question 39
(39, 'target="_blank"', TRUE),
(39, 'newtab="true"', FALSE),
(39, 'blank', FALSE),
(39, 'window="new"', FALSE),

-- Question 40
(40, '<div> es un elemento de bloque y <span> es un elemento en línea', TRUE),
(40, '<span> reemplaza a <div>', FALSE),
(40, 'No existe diferencia entre ambas etiquetas', FALSE),
(40, '<div> solo puede contener texto', FALSE);

--ADMINISTRATORS/MANAGERS:
INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (900000001,'Riwi Connect Administrator Barranquilla','admin.baq@riwi.io',1,4, null),
    (900000002,'Riwi Connect Administrator Medellin','admin.med@riwi.io',2,4,  null);
-- ADMINISTRATOR - BARRANQUILLA
-- Initial password: admin1234, hashed with werkzeug generate_password_hash()
INSERT INTO users (password_hash, id_institutional_source, status, role)
SELECT
    'scrypt:32768:8:1$7JX74ufoYDWqGTj0$cb409fd13248a75b3d6e9f1fcd3447903957ccaf4648c6a5685e9d4531583247758aaafc8a1ac95ceedaad544403f3c0f7401c51386b3714e0264494e00fb8cc',
    id_institutional_source,
    'AVAILABLE',
    'ADMINISTRATOR'
FROM institutional_sources
WHERE email = 'admin.baq@riwi.io';
-- ADMINISTRATOR - MEDELLIN , ANOTHER WAY TO DO IT
INSERT INTO users
(password_hash, id_institutional_source, status, role)
VALUES
(
    'scrypt:32768:8:1$7JX74ufoYDWqGTj0$cb409fd13248a75b3d6e9f1fcd3447903957ccaf4648c6a5685e9d4531583247758aaafc8a1ac95ceedaad544403f3c0f7401c51386b3714e0264494e00fb8cc',
    (
        SELECT id_institutional_source
        FROM institutional_sources
        WHERE email = 'admin.med@riwi.io'
    ),
    'AVAILABLE',
    'ADMINISTRATOR'
);

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

/* Search by users*/
CREATE INDEX idx_team_members_user 
ON team_members(user_id);


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