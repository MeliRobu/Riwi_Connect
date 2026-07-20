-- PYTHON QUESTIONS

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Cuál es el resultado de print(3 + 2 * 2)?', 'PYTHON', 'EASY'),
    ('¿Qué imprime print(len("Python"))?', 'PYTHON', 'EASY'),
    ('¿Cuál es el resultado de print(10 // 3)?', 'PYTHON', 'EASY'),
    ('¿Qué devuelve print(type(5.0))?', 'PYTHON', 'EASY'),
    ('¿Qué imprime print("Hola" + " " + "Mundo")?', 'PYTHON', 'EASY'),
    ('¿Cuál es el resultado de print(5 == 5.0)?', 'PYTHON', 'EASY'),
    ('¿Qué imprime print([1, 2, 3][1])?', 'PYTHON', 'EASY'),
    ('¿Cuál es el resultado de print(bool(0))?', 'PYTHON', 'EASY'),
    ('¿Qué imprime print("abc"[::-1])?', 'PYTHON', 'EASY'),
    ('¿Cuál es el resultado de print(2 ** 3)?', 'PYTHON', 'EASY'),
    ('¿Cuál es la palabra clave para definir una función en Python?', 'PYTHON', 'EASY'),
    ('¿Qué estructura de datos usa corchetes [] y permite elementos duplicados?', 'PYTHON', 'EASY'),
    ('¿Qué palabra clave crea un ciclo que se repite mientras una condición sea verdadera?', 'PYTHON', 'EASY'),
    ('¿Cuál es el tipo de dato inmutable que se define con paréntesis ()?', 'PYTHON', 'EASY'),
    ('¿Qué símbolo se utiliza para comentar una línea en Python?', 'PYTHON', 'EASY'),
    ('¿Qué imprime este código?
def f(x):
    return x * 2
print(f(f(3)))', 'PYTHON', 'MEDIUM'),
    ('¿Qué devuelve [x for x in range(5) if x % 2 == 0]?', 'PYTHON', 'MEDIUM'),
    ('¿Qué imprime este código?
try:
    print(10 / 0)
except ZeroDivisionError:
    print("Error")', 'PYTHON', 'MEDIUM'),
    ('¿Cuál es el resultado de sorted([3, 1, 2], reverse=True)?', 'PYTHON', 'MEDIUM'),
    ('¿Qué imprime print({"a": 1, "b": 2}.get("c", 0))?', 'PYTHON', 'MEDIUM'),
    ('¿Qué devuelve list(map(lambda x: x**2, [1, 2, 3]))?', 'PYTHON', 'MEDIUM'),
    ('¿Qué imprime este código?
def f(*args):
    return sum(args)
print(f(1, 2, 3))', 'PYTHON', 'MEDIUM'),
    ('¿Qué palabra clave se utiliza para capturar una excepción en Python?', 'PYTHON', 'MEDIUM'),
    ('¿Qué es una función lambda en Python?', 'PYTHON', 'MEDIUM'),
    ('¿Qué método se usa para agregar un elemento al final de una lista?', 'PYTHON', 'MEDIUM'),
    ('¿Qué imprime este código?
def gen():
    yield 1
    yield 2
g = gen()
print(next(g), next(g))', 'PYTHON', 'HARD'),
    ('¿Qué imprime este código?
def deco(f):
    def wrapper(*a, **k):
        return f(*a, **k) * 2
    return wrapper

@deco
def val():
    return 5

print(val())', 'PYTHON', 'HARD'),
    ('¿Qué imprime este código?
class A:
    x = 1
class B(A):
    pass
print(B.x)', 'PYTHON', 'HARD'),
    ('¿Qué es el GIL (Global Interpreter Lock) en Python?', 'PYTHON', 'HARD'),
    ('¿Qué es un generador (generator) en Python?', 'PYTHON', 'HARD');


INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 1
(1, '7', TRUE),
(1, '10', FALSE),
(1, '12', FALSE),
(1, '8', FALSE),

-- Question 2
(2, '5', FALSE),
(2, '6', TRUE),
(2, '7', FALSE),
(2, 'Error', FALSE),

-- Question 3
(3, '3.33', FALSE),
(3, '3', TRUE),
(3, '1', FALSE),
(3, '0', FALSE),

-- Question 4
(4, '<class ''int''>', FALSE),
(4, '<class ''str''>', FALSE),
(4, '<class ''float''>', TRUE),
(4, '<class ''bool''>', FALSE),

-- Question 5
(5, 'HolaMundo', FALSE),
(5, 'Hola Mundo', TRUE),
(5, 'Hola  Mundo', FALSE),
(5, 'Error', FALSE),

-- Question 6
(6, 'True', TRUE),
(6, 'False', FALSE),
(6, 'Error', FALSE),
(6, 'None', FALSE),

-- Question 7
(7, '1', FALSE),
(7, '2', TRUE),
(7, '3', FALSE),
(7, 'Error', FALSE),

-- Question 8
(8, 'True', FALSE),
(8, 'False', TRUE),
(8, '0', FALSE),
(8, 'Error', FALSE),

-- Question 9
(9, 'abc', FALSE),
(9, 'cba', TRUE),
(9, 'bac', FALSE),
(9, 'Error', FALSE),

-- Question 10
(10, '6', FALSE),
(10, '8', TRUE),
(10, '9', FALSE),
(10, '5', FALSE),

-- Question 11
(11, 'function', FALSE),
(11, 'def', TRUE),
(11, 'func', FALSE),
(11, 'define', FALSE),

-- Question 12
(12, 'Diccionario', FALSE),
(12, 'Conjunto (set)', FALSE),
(12, 'Lista', TRUE),
(12, 'Tupla', FALSE),

-- Question 13
(13, 'for', FALSE),
(13, 'while', TRUE),
(13, 'loop', FALSE),
(13, 'repeat', FALSE),

-- Question 14
(14, 'Lista', FALSE),
(14, 'Diccionario', FALSE),
(14, 'Tupla', TRUE),
(14, 'Conjunto', FALSE),

-- Question 15
(15, '//', FALSE),
(15, '#', TRUE),
(15, '--', FALSE),
(15, '<!--', FALSE),

-- Question 16
(16, '6', FALSE),
(16, '9', FALSE),
(16, '12', TRUE),
(16, 'Error', FALSE),

-- Question 17
(17, '[1, 3]', FALSE),
(17, '[0, 2, 4]', TRUE),
(17, '[0, 1, 2, 3, 4]', FALSE),
(17, '[2, 4]', FALSE),

-- Question 18
(18, '10', FALSE),
(18, '0', FALSE),
(18, 'Error', TRUE),
(18, 'None', FALSE),

-- Question 19
(19, '[1, 2, 3]', FALSE),
(19, '[3, 2, 1]', TRUE),
(19, '[3, 1, 2]', FALSE),
(19, 'Error', FALSE),

-- Question 20
(20, 'None', FALSE),
(20, '0', TRUE),
(20, 'Error', FALSE),
(20, 'KeyError', FALSE),

-- Question 21
(21, '[1, 2, 3]', FALSE),
(21, '[1, 4, 9]', TRUE),
(21, '[2, 4, 6]', FALSE),
(21, 'Error', FALSE),

-- Question 22
(22, '1', FALSE),
(22, '3', FALSE),
(22, '6', TRUE),
(22, 'Error', FALSE),

-- Question 23
(23, 'catch', FALSE),
(23, 'except', TRUE),
(23, 'rescue', FALSE),
(23, 'error', FALSE),

-- Question 24
(24, 'Una clase especial', FALSE),
(24, 'Una función anónima de una sola expresión', TRUE),
(24, 'Un tipo de bucle', FALSE),
(24, 'Un decorador', FALSE),

-- Question 25
(25, 'add()', FALSE),
(25, 'push()', FALSE),
(25, 'append()', TRUE),
(25, 'insert()', FALSE),

-- Question 26
(26, '1 1', FALSE),
(26, '1 2', TRUE),
(26, '2 2', FALSE),
(26, 'Error', FALSE),

-- Question 27
(27, '5', FALSE),
(27, '10', TRUE),
(27, '25', FALSE),
(27, 'Error', FALSE),

-- Question 28
(28, '0', FALSE),
(28, '1', TRUE),
(28, 'None', FALSE),
(28, 'Error', FALSE),

-- Question 29
(29, 'Un tipo de bucle infinito', FALSE),
(29, 'Un mecanismo que permite que solo un hilo ejecute bytecode de Python a la vez', TRUE),
(29, 'Una librería externa de concurrencia', FALSE),
(29, 'Un tipo de excepción', FALSE),

-- Question 30
(30, 'Una función que usa yield para producir valores de forma perezosa (lazy)', TRUE),
(30, 'Una clase que genera números aleatorios', FALSE),
(30, 'Un decorador que crea funciones', FALSE),
(30, 'Un tipo de diccionario especial', FALSE);


-- HTML QUESTIONS

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué etiqueta se usa para crear un hipervínculo?', 'HTML', 'EASY'),
    ('¿Qué atributo de <img> especifica la ruta de la imagen?', 'HTML', 'EASY'),
    ('¿Qué etiqueta define el título que aparece en la pestaña del navegador?', 'HTML', 'EASY'),
    ('¿Qué etiqueta se usa para crear una lista no ordenada?', 'HTML', 'EASY'),
    ('¿Qué etiqueta representa un párrafo?', 'HTML', 'EASY'),
    ('¿Qué atributo hace que un campo de formulario sea obligatorio?', 'HTML', 'EASY'),
    ('¿Qué etiqueta crea un salto de línea?', 'HTML', 'EASY'),
    ('¿Qué etiqueta se usa para insertar una tabla?', 'HTML', 'EASY'),
    ('¿Qué etiqueta define el encabezado de mayor jerarquía?', 'HTML', 'EASY'),
    ('¿Qué atributo de <a> especifica la URL de destino?', 'HTML', 'EASY'),
    ('¿Qué significa la sigla HTML?', 'HTML', 'EASY'),
    ('¿Qué elemento contiene los metadatos de un documento HTML?', 'HTML', 'EASY'),
    ('¿Cuál es la etiqueta raíz de todo documento HTML?', 'HTML', 'EASY'),
    ('¿Qué es una etiqueta semántica en HTML?', 'HTML', 'EASY'),
    ('¿Qué elemento se usa para agrupar contenido de navegación?', 'HTML', 'EASY'),
    ('¿Qué consecuencia tiene omitir el atributo alt en una imagen respecto a accesibilidad?', 'HTML', 'MEDIUM'),
    ('¿Qué tipo de input se usa para capturar una fecha?', 'HTML', 'MEDIUM'),
    ('¿Qué elemento agrupa opciones relacionadas dentro de un <select>?', 'HTML', 'MEDIUM'),
    ('¿Qué atributo de <form> especifica hacia dónde se envían los datos?', 'HTML', 'MEDIUM'),
    ('¿Qué elemento se usa para insertar contenido de video?', 'HTML', 'MEDIUM'),
    ('¿Qué atributo permite subir múltiples archivos en un input type="file"?', 'HTML', 'MEDIUM'),
    ('¿Qué elemento HTML5 representa contenido independiente y auto-contenido, como un artículo de blog?', 'HTML', 'MEDIUM'),
    ('¿Qué es el DOM?', 'HTML', 'MEDIUM'),
    ('¿Qué diferencia hay entre elementos de bloque y en línea?', 'HTML', 'MEDIUM'),
    ('¿Para qué sirve el atributo aria-label?', 'HTML', 'MEDIUM'),
    ('¿Qué elemento se usa para dibujar gráficos mediante JavaScript en tiempo real?', 'HTML', 'HARD'),
    ('¿Qué atributo permite que un elemento sea editable directamente por el usuario?', 'HTML', 'HARD'),
    ('¿Cómo se define contenido alternativo cuando el navegador no soporta un elemento de video?', 'HTML', 'HARD'),
    ('¿Qué es un Web Component?', 'HTML', 'HARD'),
    ('¿Qué rol cumplen los atributos ARIA en general?', 'HTML', 'HARD');


INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 31
(31, '<link>', FALSE),
(31, '<a>', TRUE),
(31, '<href>', FALSE),
(31, '<nav>', FALSE),

-- Question 32
(32, 'href', FALSE),
(32, 'link', FALSE),
(32, 'src', TRUE),
(32, 'path', FALSE),

-- Question 33
(33, '<head>', FALSE),
(33, '<title>', TRUE),
(33, '<header>', FALSE),
(33, '<meta>', FALSE),

-- Question 34
(34, '<ol>', FALSE),
(34, '<li>', FALSE),
(34, '<ul>', TRUE),
(34, '<list>', FALSE),

-- Question 35
(35, '<p>', TRUE),
(35, '<par>', FALSE),
(35, '<text>', FALSE),
(35, '<span>', FALSE),

-- Question 36
(36, 'mandatory', FALSE),
(36, 'required', TRUE),
(36, 'important', FALSE),
(36, 'must', FALSE),

-- Question 37
(37, '<break>', FALSE),
(37, '<newline>', FALSE),
(37, '<br>', TRUE),
(37, '<lb>', FALSE),

-- Question 38
(38, '<table>', TRUE),
(38, '<grid>', FALSE),
(38, '<tab>', FALSE),
(38, '<tr>', FALSE),

-- Question 39
(39, '<h6>', FALSE),
(39, '<head>', FALSE),
(39, '<h1>', TRUE),
(39, '<header>', FALSE),

-- Question 40
(40, 'src', FALSE),
(40, 'href', TRUE),
(40, 'link', FALSE),
(40, 'target', FALSE),

-- Question 41
(41, 'High Tech Modern Language', FALSE),
(41, 'HyperText Markup Language', TRUE),
(41, 'Hyperlink Text Manager', FALSE),
(41, 'Home Tool Markup Language', FALSE),

-- Question 42
(42, '<body>', FALSE),
(42, '<meta>', FALSE),
(42, '<head>', TRUE),
(42, '<info>', FALSE),

-- Question 43
(43, '<html>', TRUE),
(43, '<root>', FALSE),
(43, '<main>', FALSE),
(43, '<doc>', FALSE),

-- Question 44
(44, 'Una etiqueta que solo aplica estilo visual', FALSE),
(44, 'Una etiqueta que describe el significado del contenido, no solo su apariencia', TRUE),
(44, 'Una etiqueta obsoleta', FALSE),
(44, 'Una etiqueta exclusiva de formularios', FALSE),

-- Question 45
(45, '<menu>', FALSE),
(45, '<nav>', TRUE),
(45, '<section>', FALSE),
(45, '<link>', FALSE),

-- Question 46
(46, 'Ninguna, es puramente decorativo', FALSE),
(46, 'Los lectores de pantalla no podrán describir la imagen', TRUE),
(46, 'La imagen no se cargará', FALSE),
(46, 'El navegador la mostrará en blanco y negro', FALSE),

-- Question 47
(47, 'type="text"', FALSE),
(47, 'type="date"', TRUE),
(47, 'type="time"', FALSE),
(47, 'type="calendar"', FALSE),

-- Question 48
(48, '<group>', FALSE),
(48, '<optgroup>', TRUE),
(48, '<fieldset>', FALSE),
(48, '<optlist>', FALSE),

-- Question 49
(49, 'method', FALSE),
(49, 'action', TRUE),
(49, 'target', FALSE),
(49, 'destination', FALSE),

-- Question 50
(50, '<media>', FALSE),
(50, '<movie>', FALSE),
(50, '<video>', TRUE),
(50, '<embed>', FALSE),

-- Question 51
(51, 'many', FALSE),
(51, 'multiple', TRUE),
(51, 'multi', FALSE),
(51, 'files', FALSE),

-- Question 52
(52, '<section>', FALSE),
(52, '<div>', FALSE),
(52, '<article>', TRUE),
(52, '<content>', FALSE),

-- Question 53
(53, 'Un lenguaje de programación', FALSE),
(53, 'Una representación en árbol de los elementos HTML, manipulable con JavaScript', TRUE),
(53, 'Un tipo de archivo HTML', FALSE),
(53, 'Un protocolo de red', FALSE),

-- Question 54
(54, 'No hay ninguna diferencia real', FALSE),
(54, 'Un elemento de bloque ocupa todo el ancho disponible y comienza en nueva línea; uno en línea no', TRUE),
(54, 'Los elementos en línea siempre son más grandes', FALSE),
(54, 'Los elementos de bloque no pueden contener texto', FALSE),

-- Question 55
(55, 'Define el color del elemento', FALSE),
(55, 'Proporciona una etiqueta accesible para lectores de pantalla', TRUE),
(55, 'Cambia el idioma de la página', FALSE),
(55, 'Define el orden de tabulación', FALSE),

-- Question 56
(56, '<svg>', FALSE),
(56, '<canvas>', TRUE),
(56, '<draw>', FALSE),
(56, '<graphic>', FALSE),

-- Question 57
(57, 'editable', FALSE),
(57, 'contenteditable', TRUE),
(57, 'userinput', FALSE),
(57, 'writable', FALSE),

-- Question 58
(58, 'Con el atributo alt de <video>', FALSE),
(58, 'Colocando texto entre las etiquetas de apertura y cierre de <video>', TRUE),
(58, 'No es posible definir un contenido alternativo', FALSE),
(58, 'Con la etiqueta <fallback>', FALSE),

-- Question 59
(59, 'Un framework de JavaScript', FALSE),
(59, 'Un conjunto de tecnologías para crear elementos HTML personalizados y reutilizables, encapsulados', TRUE),
(59, 'Una extensión del navegador', FALSE),
(59, 'Un tipo de hoja de estilo', FALSE),

-- Question 60
(60, 'Optimizar el rendimiento de carga', FALSE),
(60, 'Mejorar la accesibilidad de contenido dinámico para tecnologías asistivas', TRUE),
(60, 'Definir animaciones CSS', FALSE),
(60, 'Validar formularios automáticamente', FALSE);


-- CSS QUESTIONS

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué propiedad cambia el color del texto?', 'CSS', 'EASY'),
    ('¿Qué propiedad controla el tamaño de la fuente?', 'CSS', 'EASY'),
    ('¿Qué selector aplica estilos a todos los elementos <p>?', 'CSS', 'EASY'),
    ('¿Qué propiedad agrega espacio interno dentro de un elemento?', 'CSS', 'EASY'),
    ('¿Qué propiedad agrega espacio externo alrededor de un elemento?', 'CSS', 'EASY'),
    ('¿Qué selector se usa para seleccionar un elemento por su clase?', 'CSS', 'EASY'),
    ('¿Qué propiedad cambia el color de fondo de un elemento?', 'CSS', 'EASY'),
    ('¿Cuál es el resultado de aplicar display: none; a un elemento?', 'CSS', 'EASY'),
    ('¿Qué propiedad define el ancho de un elemento?', 'CSS', 'EASY'),
    ('¿Qué selector se usa para seleccionar un elemento por su id?', 'CSS', 'EASY'),
    ('¿Qué significa la sigla CSS?', 'CSS', 'EASY'),
    ('¿Qué es el modelo de caja (box model)?', 'CSS', 'EASY'),
    ('¿Cuál es la diferencia entre class e id como selectores?', 'CSS', 'EASY'),
    ('¿Qué propiedad controla la tipografía (fuente) de un texto?', 'CSS', 'EASY'),
    ('¿Qué es una pseudo-clase en CSS?', 'CSS', 'EASY'),
    ('¿Qué propiedad convierte un contenedor en flexbox?', 'CSS', 'MEDIUM'),
    ('¿Qué propiedad de flexbox alinea los elementos en el eje principal?', 'CSS', 'MEDIUM'),
    ('¿Qué propiedad de flexbox alinea los elementos en el eje transversal?', 'CSS', 'MEDIUM'),
    ('¿Qué propiedad convierte un contenedor en grid?', 'CSS', 'MEDIUM'),
    ('¿Qué propiedad define las columnas de un grid?', 'CSS', 'MEDIUM'),
    ('¿Qué hace position: absolute;?', 'CSS', 'MEDIUM'),
    ('¿Qué pseudo-clase selecciona un elemento cuando el mouse pasa sobre él?', 'CSS', 'MEDIUM'),
    ('¿Qué es la especificidad en CSS?', 'CSS', 'MEDIUM'),
    ('¿Qué es el "cascading" (cascada) en CSS?', 'CSS', 'MEDIUM'),
    ('¿Qué diferencia hay entre las unidades em y rem?', 'CSS', 'MEDIUM'),
    ('¿Qué sintaxis se usa para crear una variable CSS personalizada?', 'CSS', 'HARD'),
    ('¿Qué función se usa para leer una variable CSS personalizada?', 'CSS', 'HARD'),
    ('¿Qué propiedad controla la duración de una transición?', 'CSS', 'HARD'),
    ('¿Qué es un "stacking context" en CSS?', 'CSS', 'HARD'),
    ('¿Qué ventaja tienen las variables CSS (custom properties) frente a los preprocesadores como Sass?', 'CSS', 'HARD');


INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 61
(61, 'text-color', FALSE),
(61, 'font-color', FALSE),
(61, 'color', TRUE),
(61, 'background-color', FALSE),

-- Question 62
(62, 'text-size', FALSE),
(62, 'font-size', TRUE),
(62, 'size', FALSE),
(62, 'font-weight', FALSE),

-- Question 63
(63, '.p', FALSE),
(63, '#p', FALSE),
(63, 'p', TRUE),
(63, '*p', FALSE),

-- Question 64
(64, 'margin', FALSE),
(64, 'padding', TRUE),
(64, 'spacing', FALSE),
(64, 'gap', FALSE),

-- Question 65
(65, 'padding', FALSE),
(65, 'border', FALSE),
(65, 'margin', TRUE),
(65, 'outline', FALSE),

-- Question 66
(66, '#clase', FALSE),
(66, '.clase', TRUE),
(66, '*clase', FALSE),
(66, 'clase', FALSE),

-- Question 67
(67, 'color', FALSE),
(67, 'background-color', TRUE),
(67, 'fill', FALSE),
(67, 'bg-color', FALSE),

-- Question 68
(68, 'Se hace transparente pero ocupa espacio', FALSE),
(68, 'El elemento desaparece y no ocupa espacio', TRUE),
(68, 'El elemento se mueve al final de la página', FALSE),
(68, 'No cambia nada visualmente', FALSE),

-- Question 69
(69, 'height', FALSE),
(69, 'width', TRUE),
(69, 'size', FALSE),
(69, 'max-width', FALSE),

-- Question 70
(70, '.id', FALSE),
(70, '#id', TRUE),
(70, '*id', FALSE),
(70, '@id', FALSE),

-- Question 71
(71, 'Computer Style Sheets', FALSE),
(71, 'Cascading Style Sheets', TRUE),
(71, 'Creative Style System', FALSE),
(71, 'Color Style Sheets', FALSE),

-- Question 72
(72, 'Un tipo de layout exclusivo de flexbox', FALSE),
(72, 'El conjunto formado por contenido, padding, border y margin de un elemento', TRUE),
(72, 'Una propiedad para animaciones', FALSE),
(72, 'Un selector especial de CSS', FALSE),

-- Question 73
(73, 'Son exactamente lo mismo', FALSE),
(73, 'class puede reutilizarse en varios elementos, id debe ser único en la página', TRUE),
(73, 'id se usa solo en formularios', FALSE),
(73, 'class solo funciona con JavaScript', FALSE),

-- Question 74
(74, 'font-family', TRUE),
(74, 'text-family', FALSE),
(74, 'font-type', FALSE),
(74, 'typeface', FALSE),

-- Question 75
(75, 'Un tipo de variable', FALSE),
(75, 'Un selector que aplica estilo según un estado especial del elemento, como :hover', TRUE),
(75, 'Una clase reservada del sistema', FALSE),
(75, 'Un archivo CSS externo', FALSE),

-- Question 76
(76, 'display: flexbox', FALSE),
(76, 'display: flex', TRUE),
(76, 'flex: true', FALSE),
(76, 'layout: flex', FALSE),

-- Question 77
(77, 'align-items', FALSE),
(77, 'justify-content', TRUE),
(77, 'flex-direction', FALSE),
(77, 'align-content', FALSE),

-- Question 78
(78, 'justify-content', FALSE),
(78, 'align-items', TRUE),
(78, 'flex-wrap', FALSE),
(78, 'order', FALSE),

-- Question 79
(79, 'display: grid', TRUE),
(79, 'display: table', FALSE),
(79, 'grid: true', FALSE),
(79, 'layout: grid', FALSE),

-- Question 80
(80, 'grid-columns', FALSE),
(80, 'grid-template-columns', TRUE),
(80, 'columns', FALSE),
(80, 'grid-cols', FALSE),

-- Question 81
(81, 'Posiciona el elemento en el flujo normal del documento', FALSE),
(81, 'Posiciona el elemento respecto a su ancestro posicionado más cercano', TRUE),
(81, 'Centra el elemento automáticamente', FALSE),
(81, 'Fija el elemento respecto a la ventana del navegador', FALSE),

-- Question 82
(82, ':focus', FALSE),
(82, ':active', FALSE),
(82, ':hover', TRUE),
(82, ':visited', FALSE),

-- Question 83
(83, 'El orden en que se escriben las propiedades', FALSE),
(83, 'La regla que determina qué estilo se aplica cuando hay conflictos entre selectores', TRUE),
(83, 'Una propiedad para animaciones', FALSE),
(83, 'El tamaño del archivo CSS', FALSE),

-- Question 84
(84, 'Un tipo de animación', FALSE),
(84, 'El orden y prioridad con que se aplican las reglas de estilo', TRUE),
(84, 'Una propiedad de flexbox', FALSE),
(84, 'Un selector de pseudo-elementos', FALSE),

-- Question 85
(85, 'Son exactamente iguales', FALSE),
(85, 'em es relativo al tamaño de fuente del elemento padre, rem es relativo a la raíz (html)', TRUE),
(85, 'rem solo funciona en Firefox', FALSE),
(85, 'em se usa solo para colores', FALSE),

-- Question 86
(86, '$variable: valor;', FALSE),
(86, '--variable: valor;', TRUE),
(86, '@variable: valor;', FALSE),
(86, 'var variable = valor;', FALSE),

-- Question 87
(87, 'get()', FALSE),
(87, 'var()', TRUE),
(87, 'calc()', FALSE),
(87, 'read()', FALSE),

-- Question 88
(88, 'transition-time', FALSE),
(88, 'animation-duration', FALSE),
(88, 'transition-duration', TRUE),
(88, 'duration', FALSE),

-- Question 89
(89, 'Un tipo de selector avanzado', FALSE),
(89, 'Una agrupación jerárquica que determina el orden de apilamiento (z-index) de los elementos', TRUE),
(89, 'Una propiedad de flexbox', FALSE),
(89, 'Un método para animar elementos', FALSE),

-- Question 90
(90, 'Ninguna, Sass siempre es superior', FALSE),
(90, 'Pueden modificarse dinámicamente en tiempo de ejecución con JavaScript', TRUE),
(90, 'Son más rápidas de escribir', FALSE),
(90, 'Solo funcionan en Internet Explorer', FALSE);


-- JAVASCRIPT QUESTIONS

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué imprime console.log(typeof "hola")?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log(3 + "3")?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log(3 == "3")?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log(3 === "3")?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log([1, 2, 3].length)?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué palabra clave declara una variable cuyo valor no puede reasignarse?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log(typeof null)?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log(Boolean(""))?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log("5" - 2)?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime console.log([1, 2, 3].join("-"))?', 'JAVASCRIPT', 'EASY'),
    ('¿Cuál es la diferencia entre let y var respecto a su alcance (scope)?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué es una función flecha (arrow function)?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué método convierte un string a número entero?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué operador se usa para comparar valor y tipo de forma estricta?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué estructura de datos usa {} para almacenar pares clave-valor?', 'JAVASCRIPT', 'EASY'),
    ('¿Qué imprime este código?
function contador() {
  let n = 0;
  return () => ++n;
}
const c = contador();
console.log(c(), c());', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué devuelve [1, 2, 3].map(x => x * 2)?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué devuelve [1, 2, 3, 4].filter(x => x % 2 === 0)?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué devuelve [1, 2, 3].reduce((a, b) => a + b, 0)?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué imprime console.log(typeof (function(){}))?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué método convierte un objeto JavaScript en una cadena JSON?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué imprime este código?
async function f() {
  return 5;
}
f().then(v => console.log(v));', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué es una Promise en JavaScript?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué es una closure (clausura)?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué hace el método addEventListener?', 'JAVASCRIPT', 'MEDIUM'),
    ('¿Qué imprime console.log([1, 2, 3].reduce((acc, val) => acc + val))?', 'JAVASCRIPT', 'HARD'),
    ('¿Qué imprime este código?
async function f() {
  try {
    await Promise.reject("error");
  } catch (e) {
    console.log("capturado:", e);
  }
}
f();', 'JAVASCRIPT', 'HARD'),
    ('¿Qué imprime este código?
function Animal() {}
Animal.prototype.hablar = function() { return "sonido"; };
const a = new Animal();
console.log(a.hablar());', 'JAVASCRIPT', 'HARD'),
    ('¿Qué es la herencia prototípica en JavaScript?', 'JAVASCRIPT', 'HARD'),
    ('¿Qué es el "event loop" en JavaScript?', 'JAVASCRIPT', 'HARD');


INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 91
(91, 'number', FALSE),
(91, 'string', TRUE),
(91, 'object', FALSE),
(91, 'undefined', FALSE),

-- Question 92
(92, '6', FALSE),
(92, '"33"', TRUE),
(92, 'NaN', FALSE),
(92, 'Error', FALSE),

-- Question 93
(93, 'true', TRUE),
(93, 'false', FALSE),
(93, 'undefined', FALSE),
(93, 'Error', FALSE),

-- Question 94
(94, 'true', FALSE),
(94, 'false', TRUE),
(94, 'undefined', FALSE),
(94, 'Error', FALSE),

-- Question 95
(95, '2', FALSE),
(95, '3', TRUE),
(95, '4', FALSE),
(95, 'undefined', FALSE),

-- Question 96
(96, 'let', FALSE),
(96, 'var', FALSE),
(96, 'const', TRUE),
(96, 'static', FALSE),

-- Question 97
(97, '"null"', FALSE),
(97, '"object"', TRUE),
(97, '"undefined"', FALSE),
(97, 'Error', FALSE),

-- Question 98
(98, 'true', FALSE),
(98, 'false', TRUE),
(98, 'undefined', FALSE),
(98, 'Error', FALSE),

-- Question 99
(99, '"52"', FALSE),
(99, '3', TRUE),
(99, 'NaN', FALSE),
(99, 'Error', FALSE),

-- Question 100
(100, '"1,2,3"', FALSE),
(100, '"1-2-3"', TRUE),
(100, '[1,2,3]', FALSE),
(100, 'Error', FALSE),

-- Question 101
(101, 'No hay diferencia', FALSE),
(101, 'let tiene alcance de bloque, var tiene alcance de función', TRUE),
(101, 'var es más moderno que let', FALSE),
(101, 'let no puede reasignarse', FALSE),

-- Question 102
(102, 'Un tipo de bucle', FALSE),
(102, 'Una sintaxis abreviada para escribir funciones anónimas', TRUE),
(102, 'Un operador matemático', FALSE),
(102, 'Una clase especial', FALSE),

-- Question 103
(103, 'toInt()', FALSE),
(103, 'parseInt()', TRUE),
(103, 'Number.int()', FALSE),
(103, 'toNumber()', FALSE),

-- Question 104
(104, '==', FALSE),
(104, '===', TRUE),
(104, '=', FALSE),
(104, '!==', FALSE),

-- Question 105
(105, 'Array', FALSE),
(105, 'Objeto', TRUE),
(105, 'Set', FALSE),
(105, 'Map', FALSE),

-- Question 106
(106, '0 0', FALSE),
(106, '1 1', FALSE),
(106, '1 2', TRUE),
(106, 'Error', FALSE),

-- Question 107
(107, '[1, 2, 3]', FALSE),
(107, '[2, 4, 6]', TRUE),
(107, '[1, 4, 9]', FALSE),
(107, '6', FALSE),

-- Question 108
(108, '[1, 3]', FALSE),
(108, '[2, 4]', TRUE),
(108, '[1, 2, 3, 4]', FALSE),
(108, 'true', FALSE),

-- Question 109
(109, '3', FALSE),
(109, '6', TRUE),
(109, '[1, 2, 3]', FALSE),
(109, 'Error', FALSE),

-- Question 110
(110, '"object"', FALSE),
(110, '"function"', TRUE),
(110, '"undefined"', FALSE),
(110, 'Error', FALSE),

-- Question 111
(111, 'JSON.parse()', FALSE),
(111, 'JSON.stringify()', TRUE),
(111, 'Object.toString()', FALSE),
(111, 'String.parse()', FALSE),

-- Question 112
(112, 'Promise {5}', FALSE),
(112, '5', TRUE),
(112, 'undefined', FALSE),
(112, 'Error', FALSE),

-- Question 113
(113, 'Un tipo de bucle asíncrono', FALSE),
(113, 'Un objeto que representa la eventual finalización (o falla) de una operación asíncrona', TRUE),
(113, 'Una función que siempre retorna true', FALSE),
(113, 'Un método de arrays', FALSE),

-- Question 114
(114, 'Un error de sintaxis común', FALSE),
(114, 'Una función que recuerda el entorno en el que fue creada, incluso fuera de su ámbito original', TRUE),
(114, 'Un método para cerrar conexiones de red', FALSE),
(114, 'Un tipo de bucle infinito', FALSE),

-- Question 115
(115, 'Elimina un evento del DOM', FALSE),
(115, 'Registra una función para que se ejecute cuando ocurre un evento específico', TRUE),
(115, 'Crea un nuevo elemento HTML', FALSE),
(115, 'Cambia el estilo CSS de un elemento', FALSE),

-- Question 116
(116, '3', FALSE),
(116, '6', TRUE),
(116, '[1, 2, 3]', FALSE),
(116, 'Error', FALSE),

-- Question 117
(117, 'error', FALSE),
(117, 'capturado: error', TRUE),
(117, 'undefined', FALSE),
(117, 'Uncaught error sin captura', FALSE),

-- Question 118
(118, 'undefined', FALSE),
(118, 'sonido', TRUE),
(118, 'Error', FALSE),
(118, 'function hablar()', FALSE),

-- Question 119
(119, 'Un patrón exclusivo de TypeScript', FALSE),
(119, 'El mecanismo por el cual los objetos heredan propiedades y métodos a través de la cadena de prototipos', TRUE),
(119, 'Una forma de heredar solo desde clases abstractas', FALSE),
(119, 'Una función nativa para clonar objetos', FALSE),

-- Question 120
(120, 'Un ciclo for especial para eventos', FALSE),
(120, 'El mecanismo que permite ejecutar código asíncrono de forma no bloqueante, gestionando la pila de llamadas y la cola de tareas', TRUE),
(120, 'Una librería externa de eventos', FALSE),
(120, 'Un tipo de bucle que nunca termina', FALSE);


-- SQL QUESTIONS

INSERT INTO questions (statement, category, difficulty_level)
VALUES
    ('¿Qué instrucción se usa para obtener todas las columnas de una tabla?', 'SQL', 'EASY'),
    ('¿Qué cláusula filtra filas según una condición?', 'SQL', 'EASY'),
    ('¿Qué cláusula ordena los resultados de una consulta?', 'SQL', 'EASY'),
    ('¿Qué función cuenta el número de filas de un resultado?', 'SQL', 'EASY'),
    ('¿Qué instrucción inserta una nueva fila en una tabla?', 'SQL', 'EASY'),
    ('¿Qué instrucción actualiza datos existentes en una tabla?', 'SQL', 'EASY'),
    ('¿Qué instrucción elimina filas de una tabla?', 'SQL', 'EASY'),
    ('¿Qué palabra clave limita el número de resultados devueltos?', 'SQL', 'EASY'),
    ('¿Qué operador se usa para buscar un patrón de texto?', 'SQL', 'EASY'),
    ('¿Qué palabra clave elimina filas duplicadas de un resultado?', 'SQL', 'EASY'),
    ('¿Qué significa la sigla SQL?', 'SQL', 'EASY'),
    ('¿Qué es una clave primaria (primary key)?', 'SQL', 'EASY'),
    ('¿Qué es una clave foránea (foreign key)?', 'SQL', 'EASY'),
    ('¿Qué es una tabla en una base de datos relacional?', 'SQL', 'EASY'),
    ('¿Qué tipo de dato se usa comúnmente para almacenar números enteros en SQL?', 'SQL', 'EASY'),
    ('¿Qué cláusula agrupa filas con valores iguales en una columna?', 'SQL', 'MEDIUM'),
    ('¿Qué cláusula filtra grupos después de un GROUP BY?', 'SQL', 'MEDIUM'),
    ('¿Qué tipo de JOIN devuelve solo las filas que coinciden en ambas tablas?', 'SQL', 'MEDIUM'),
    ('¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda aunque no haya coincidencia?', 'SQL', 'MEDIUM'),
    ('¿Qué función agregada calcula el promedio de una columna?', 'SQL', 'MEDIUM'),
    ('¿Qué cláusula permite renombrar una columna o tabla en el resultado?', 'SQL', 'MEDIUM'),
    ('¿Qué es una subconsulta (subquery)?', 'SQL', 'MEDIUM'),
    ('¿Qué es un índice (index) en una base de datos?', 'SQL', 'MEDIUM'),
    ('¿Qué es la normalización de una base de datos?', 'SQL', 'MEDIUM'),
    ('¿Qué significa la propiedad ACID en una transacción?', 'SQL', 'MEDIUM'),
    ('¿Qué función de ventana asigna un número secuencial a cada fila dentro de una partición?', 'SQL', 'HARD'),
    ('¿Qué cláusula se usa para definir particiones en una función de ventana?', 'SQL', 'HARD'),
    ('¿Qué instrucción se usa para deshacer los cambios de una transacción?', 'SQL', 'HARD'),
    ('¿Qué es un plan de ejecución (execution plan) en SQL?', 'SQL', 'HARD'),
    ('¿Qué exige la tercera forma normal (3NF)?', 'SQL', 'HARD');


INSERT INTO answer_options (question_id, content, is_correct)
VALUES
-- Question 121
(121, 'GET * FROM tabla', FALSE),
(121, 'SELECT * FROM tabla', TRUE),
(121, 'FETCH * FROM tabla', FALSE),
(121, 'SHOW * FROM tabla', FALSE),

-- Question 122
(122, 'FILTER', FALSE),
(122, 'WHERE', TRUE),
(122, 'HAVING', FALSE),
(122, 'IF', FALSE),

-- Question 123
(123, 'SORT BY', FALSE),
(123, 'ORDER BY', TRUE),
(123, 'GROUP BY', FALSE),
(123, 'ARRANGE BY', FALSE),

-- Question 124
(124, 'SUM()', FALSE),
(124, 'COUNT()', TRUE),
(124, 'TOTAL()', FALSE),
(124, 'LENGTH()', FALSE),

-- Question 125
(125, 'ADD INTO', FALSE),
(125, 'INSERT INTO', TRUE),
(125, 'CREATE INTO', FALSE),
(125, 'NEW INTO', FALSE),

-- Question 126
(126, 'CHANGE', FALSE),
(126, 'MODIFY', FALSE),
(126, 'UPDATE', TRUE),
(126, 'SET', FALSE),

-- Question 127
(127, 'REMOVE', FALSE),
(127, 'DELETE', TRUE),
(127, 'DROP', FALSE),
(127, 'CLEAR', FALSE),

-- Question 128
(128, 'TOP', FALSE),
(128, 'LIMIT', TRUE),
(128, 'MAX', FALSE),
(128, 'ONLY', FALSE),

-- Question 129
(129, 'MATCH', FALSE),
(129, 'LIKE', TRUE),
(129, 'SEARCH', FALSE),
(129, 'FIND', FALSE),

-- Question 130
(130, 'UNIQUE', FALSE),
(130, 'DISTINCT', TRUE),
(130, 'NODUP', FALSE),
(130, 'ONLY', FALSE),

-- Question 131
(131, 'Simple Query Language', FALSE),
(131, 'Structured Query Language', TRUE),
(131, 'Sequential Query Logic', FALSE),
(131, 'System Query Language', FALSE),

-- Question 132
(132, 'Una columna que puede repetirse en varias filas', FALSE),
(132, 'Una columna que identifica de forma única cada fila de una tabla', TRUE),
(132, 'Un tipo de índice obsoleto', FALSE),
(132, 'Una columna que siempre es de tipo texto', FALSE),

-- Question 133
(133, 'Una columna encriptada', FALSE),
(133, 'Una columna que referencia la clave primaria de otra tabla', TRUE),
(133, 'Una columna que no puede tener valores nulos', FALSE),
(133, 'Un tipo de índice único', FALSE),

-- Question 134
(134, 'Un archivo de texto plano', FALSE),
(134, 'Una estructura organizada en filas y columnas que almacena datos', TRUE),
(134, 'Un tipo de consulta especial', FALSE),
(134, 'Una función agregada', FALSE),

-- Question 135
(135, 'VARCHAR', FALSE),
(135, 'INTEGER', TRUE),
(135, 'BOOLEAN', FALSE),
(135, 'TEXT', FALSE),

-- Question 136
(136, 'GROUP BY', TRUE),
(136, 'ORDER BY', FALSE),
(136, 'PARTITION BY', FALSE),
(136, 'CLUSTER BY', FALSE),

-- Question 137
(137, 'WHERE', FALSE),
(137, 'HAVING', TRUE),
(137, 'FILTER', FALSE),
(137, 'AFTER', FALSE),

-- Question 138
(138, 'LEFT JOIN', FALSE),
(138, 'RIGHT JOIN', FALSE),
(138, 'INNER JOIN', TRUE),
(138, 'FULL JOIN', FALSE),

-- Question 139
(139, 'INNER JOIN', FALSE),
(139, 'LEFT JOIN', TRUE),
(139, 'RIGHT JOIN', FALSE),
(139, 'CROSS JOIN', FALSE),

-- Question 140
(140, 'SUM()', FALSE),
(140, 'AVG()', TRUE),
(140, 'MEAN()', FALSE),
(140, 'TOTAL()', FALSE),

-- Question 141
(141, 'RENAME', FALSE),
(141, 'AS', TRUE),
(141, 'ALIAS', FALSE),
(141, 'LABEL', FALSE),

-- Question 142
(142, 'Un tipo de índice', FALSE),
(142, 'Una consulta anidada dentro de otra consulta SQL', TRUE),
(142, 'Una tabla temporal física', FALSE),
(142, 'Un tipo de JOIN especial', FALSE),

-- Question 143
(143, 'Una copia de seguridad de la tabla', FALSE),
(143, 'Una estructura que acelera la búsqueda de filas en una tabla', TRUE),
(143, 'Una restricción de integridad obligatoria', FALSE),
(143, 'Un tipo de columna calculada', FALSE),

-- Question 144
(144, 'El proceso de encriptar los datos', FALSE),
(144, 'El proceso de organizar datos para reducir redundancia y mejorar la integridad', TRUE),
(144, 'El proceso de crear copias de seguridad', FALSE),
(144, 'El proceso de indexar todas las columnas', FALSE),

-- Question 145
(145, 'Access, Control, Identity, Data', FALSE),
(145, 'Atomicidad, Consistencia, Aislamiento y Durabilidad', TRUE),
(145, 'Authentication, Consistency, Integrity, Data', FALSE),
(145, 'Atomic, Cached, Indexed, Distributed', FALSE),

-- Question 146
(146, 'RANK()', FALSE),
(146, 'ROW_NUMBER()', TRUE),
(146, 'DENSE_RANK()', FALSE),
(146, 'NTILE()', FALSE),

-- Question 147
(147, 'GROUP BY', FALSE),
(147, 'PARTITION BY', TRUE),
(147, 'ORDER BY', FALSE),
(147, 'OVER BY', FALSE),

-- Question 148
(148, 'COMMIT', FALSE),
(148, 'ROLLBACK', TRUE),
(148, 'UNDO', FALSE),
(148, 'REVERT', FALSE),

-- Question 149
(149, 'Un diagrama de la base de datos', FALSE),
(149, 'Una representación de cómo el motor de base de datos ejecutará una consulta, usada para optimización', TRUE),
(149, 'Un tipo de trigger automático', FALSE),
(149, 'Una copia de seguridad programada', FALSE),

-- Question 150
(150, 'Que todas las columnas sean de tipo texto', FALSE),
(150, 'Que todos los atributos dependan únicamente de la clave primaria, sin dependencias transitivas', TRUE),
(150, 'Que la tabla no tenga clave primaria', FALSE),
(150, 'Que existan al menos dos claves foráneas', FALSE);
