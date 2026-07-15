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

ALTER TABLE questions
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'INACTIVE'));