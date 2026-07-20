ESTA ES LA RAMA DEVELOP, AQUÍ PROBAMOS TODO ANTES DE FUSIONAR A LA RAMA MAIN
PARA VISTA PREVIA: Ctrl + Shift + V

## 1. DESCRIPCIÓN DEL PROYECTO

Riwi Connect es una plataforma web que ayuda a los coders de RIWI a conformar equipos balanceados para el Proyecto Integrador. Los estudiantes realizan un Assessment técnico, obtienen un Perfil Profesional generado automáticamente, y pueden crear o unirse a equipos con compañeros que tengan habilidades complementarias.

## 2. JUSTIFICACIÓN

Actualmente la conformación de equipos se hace de forma manual, basada en relaciones personales en vez de datos técnicos objetivos. Esto genera equipos desbalanceados, tiempo perdido, y talento subutilizado. Riwi Connect resuelve esto evaluando competencias técnicas y recomendando compañeros de equipo compatibles.

## 3. TECNOLOGÍAS UTILIZADAS

| Tecnología | Versión |
|---|---|
| Python | 3.11 |
| Flask | — |
| PostgreSQL | 17 |
| Docker | — |
| CSS | — |
| Tailwind | ^4.3.2 |
| Vite | ^8.1.1 |
| JavaScript | — |
| HTML | — |
| Node | 20 o superior |
| Gemini API | gemini-3.1-flash-lite |

## 4. OBTENER EL PROYECTO

### 4.1. Diferentes formas de obtener el código

**Si alguien te envía el enlace del repositorio de GitHub:**

```bash
git clone <enlace-del-repositorio>
cd Riwi_Connect
```

**Si alguien te envía la carpeta, o la descargas:**

Abre la carpeta directamente en Visual Studio Code (Archivo → Abrir Carpeta), o haz clic derecho sobre ella, abre una terminal, y escribe:

```bash
code .
```

**Si alguien te envía un archivo `.zip`:**

Descomprímelo, y luego abre la carpeta extraída en Visual Studio Code (igual que arriba).

### 4.2. Programas que necesitas instalar

- **Visual Studio Code:** https://code.visualstudio.com/download
- **Docker (Docker Desktop, incluye Docker Compose):** https://www.docker.com/products/docker-desktop
- **Git**
- **Node.js 20+** (https://nodejs.org) — solo necesario si vas a correr el frontend fuera de Docker para tener recarga automática durante desarrollo activo (ver [sección 9](#9-opcional-recarga-automática-del-frontend-para-desarrollo-activo)). **No** es necesario solo para ejecutar la plataforma.

Para confirmar que todo está instalado, ejecuta:

```bash
docker --version
docker compose version
git --version
```

## 5. CONFIGURACIÓN (`backend/config.py`)

El backend necesita un archivo `backend/config.py` con valores sensibles (cadena de conexión a la base de datos, clave secreta de sesión, clave de la API de Gemini). **Este archivo nunca se sube a git** (está en `.gitignore`) — hay que crearlo manualmente en cada máquina donde se configure el proyecto.

Copia la plantilla que sí está incluida en el repositorio:

```bash
cp backend/config.example.py backend/config.py
```

Abre `backend/config.py`. Debe verse así:

```python
DATABASE_URL = "dbname=riwi_connect user=postgres password=postgres host=db"
SECRET_KEY = "replace_with_a_random_secret_key"
GEMINI_API_KEY = "replace_with_your_gemini_api_key"
```

- **`DATABASE_URL`**: déjalo tal cual — ya coincide con la configuración de Docker Compose.
- **`SECRET_KEY`**: reemplázalo por cualquier texto aleatorio (se usa para firmar las sesiones de los usuarios).
- **`GEMINI_API_KEY`**: ver a continuación.

### 5.1. Generar una clave de la API de Gemini

La plataforma usa la API de Gemini para generar la interpretación del perfil profesional de cada estudiante al completar su Assessment.

1. Ve a https://aistudio.google.com e inicia sesión con una cuenta de Google.
2. Genera una nueva clave de API ("Get API Key" / "API Keys").
3. Pégala en `backend/config.py`, reemplazando `replace_with_your_gemini_api_key`.

**Genera una clave nueva para cada entorno/presentación** — nunca reutilices ni compartas la misma clave entre distintas personas o máquinas. Si en algún momento una clave se expone accidentalmente (por ejemplo, pegada en un chat), revócala y genera una nueva.

**Sobre el modelo:** el proyecto usa actualmente `gemini-3.1-flash-lite`. Google descontinúa o renombra modelos con frecuencia — si en algún momento aparece un error de "modelo no encontrado" al completar un Assessment, consulta qué modelos acepta tu clave actual:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=TU_CLAVE_AQUI" | grep -o '"name": "[^"]*"' | grep -i flash
```

y actualiza el nombre del modelo en `backend/services/assessment_service.py`. Esto es un tema de configuración/operación, no algo que requiera arreglar en el código en general — si la generación del perfil falla, el sistema degrada sin romperse (el resultado del assessment se sigue guardando correctamente; solo la interpretación de IA queda vacía y se reintenta automáticamente en el siguiente inicio de sesión del estudiante).

## 6. LEVANTAR EL PROYECTO

Con `backend/config.py` ya configurado, desde la raíz del proyecto ejecuta:

```bash
docker compose up -d --build
```

Este único comando construye **tanto** el backend como el frontend y levanta todo — el frontend se compila a archivos estáticos durante la construcción de Docker y lo sirve directamente el backend de Flask. No hay ningún servidor de desarrollo de frontend separado en el flujo normal.

La primera vez puede tardar varios minutos (descarga de imágenes, instalación de dependencias). Las siguientes veces será mucho más rápido.

### 6.1. Verificar que inició correctamente

```bash
docker compose ps
```

Deberías ver dos contenedores en estado `Up`:

```
NAME                   STATUS
riwi_connect_backend   Up
riwi_connect_db        Up (healthy)
```

Si algo no aparece como `Up`, revisa los logs:

```bash
docker compose logs backend
docker compose logs db
```

### 6.2. Acceder a la plataforma

Abre el navegador en:

```
http://localhost:5000
```

Así de simple — un solo puerto, sin URL de frontend separada.

## 7. DATOS DE DEMOSTRACIÓN (OPCIONAL)

`database/seed/06_demo_students_teams.sql` registra automáticamente **345 estudiantes** con su Assessment completado, y conforma **40 equipos** — pensado para que la plataforma se vea "viva" en demostraciones/presentaciones, en vez de completamente vacía.

- **Para conservarlo (recomendado para presentaciones):** no hagas nada, se ejecuta automáticamente la primera vez que se crea la base de datos.
- **Para empezar con una base de datos completamente limpia** (solo el banco de preguntas y la lista de estudiantes autorizados, sin estudiantes registrados ni equipos): elimina el archivo **antes** del primer `docker compose up`:

```bash
rm database/seed/06_demo_students_teams.sql
```

Este archivo (como todos los de semilla) solo se ejecuta una vez, cuando el volumen de Postgres se crea vacío. Borrarlo después de haber corrido el proyecto una vez no hace nada por sí solo — también sería necesario reiniciar la base de datos (ver [sección 8](#8-reiniciar-todo-desde-cero)).

## 8. CREDENCIALES DISPONIBLES

### Administradores

| Sede | Número de documento | Contraseña |
|---|---|---|
| Barranquilla | `900000001` | `Prueba1234` |
| Medellín | `900000002` | `Prueba1234` |

### Coders ya registrados (datos de demostración)

Todos los estudiantes de demostración comparten la misma contraseña: **`Prueba1234`**.

Para encontrar el número de documento de un estudiante específico (por ejemplo, para mostrar un perfil de alto rendimiento):

```bash
docker exec -it riwi_connect_db psql -U postgres -d riwi_connect -c "
SELECT isrc.document_number, isrc.full_name, ar.overall_score
FROM assessment_results ar
JOIN assessments a ON a.id_assessment = ar.assessment_id
JOIN users u ON u.id_user = a.user_id
JOIN institutional_sources isrc ON isrc.id_institutional_source = u.id_institutional_source
ORDER BY ar.overall_score DESC
LIMIT 10;
"
```

### Estudiantes aún no registrados

Los otros 60 estudiantes de la lista institucional (405 en total − 345 ya registrados) pueden registrarse por su cuenta desde la pantalla de "Registro", usando su número de documento y cualquier contraseña de al menos 8 caracteres. Para encontrar uno:

```bash
docker exec -it riwi_connect_db psql -U postgres -d riwi_connect -c "
SELECT isrc.document_number, isrc.full_name
FROM institutional_sources isrc
LEFT JOIN users u ON u.id_institutional_source = isrc.id_institutional_source
WHERE u.id_user IS NULL AND isrc.id_clan IS NOT NULL
LIMIT 10;
"
```

## 9. (OPCIONAL) RECARGA AUTOMÁTICA DEL FRONTEND PARA DESARROLLO ACTIVO

Si estás editando archivos del frontend activamente y quieres recarga instantánea en vez de reconstruir la imagen de Docker cada vez, puedes correr el servidor de desarrollo de Vite por separado (requiere Node.js):

```bash
cd frontend
npm i
npm run dev
```

Esto levanta un servidor de desarrollo (normalmente `http://localhost:5173`), mientras el backend sigue corriendo por separado desde Docker en `http://localhost:5000`. Esto es puramente una comodidad para desarrollo — **no** es necesario para ejecutar ni presentar la plataforma, y **no** es como corre la app en Docker (ahí, el frontend ya compilado lo sirve directamente el backend en el puerto 5000, ver sección 6).

## 10. ESTRUCTURA DEL PROYECTO

```
Riwi_Connect/
├── backend/
│   ├── app.py                     # Punto de entrada de la app Flask
│   ├── config.example.py          # Plantilla — segura de subir a git, sin claves reales
│   ├── config.py                  # Claves reales — NUNCA se sube (.gitignore)
│   ├── Dockerfile                 # Build multi-etapa: primero el frontend, luego el backend
│   ├── requirements.txt
│   ├── controllers/                # Manejan la petición/respuesta HTTP de cada ruta
│   │   ├── admin_controller.py
│   │   ├── assessment_controller.py
│   │   ├── team_controller.py
│   │   └── user_controller.py
│   ├── database/
│   │   └── connection.py           # Helper de conexión a PostgreSQL
│   ├── models/                     # Definiciones de los modelos de datos
│   │   ├── answer_option.py
│   │   ├── assessment.py
│   │   ├── assessment_configuration.py
│   │   ├── assessment_result.py
│   │   ├── institutional_source.py
│   │   ├── question.py
│   │   ├── student_answer.py
│   │   ├── team.py
│   │   ├── team_member.py
│   │   └── user.py
│   ├── routes/                     # Mapeo de URL → controlador
│   │   ├── admin_routes.py
│   │   ├── assessment_routes.py
│   │   ├── team_routes.py
│   │   └── user_routes.py
│   └── services/                   # Lógica de negocio + las consultas SQL reales
│       ├── admin_service.py
│       ├── assessment_service.py
│       ├── auth_service.py
│       ├── compatibility_service.py
│       ├── team_service.py
│       └── user_service.py
│
├── database/
│   ├── 00-init.sh                  # Puente entre docker-entrypoint-initdb.d y las subcarpetas schema/ y seed/
│   ├── backup/
│   │   └── riwi_connect_backup.sql
│   ├── schema/                     # Se ejecuta primero: crea tablas e índices
│   │   ├── create_tables.sql
│   │   └── indexes.sql
│   └── seed/                       # Se ejecuta después, en orden numérico
│       ├── 01_initial_data.sql            # Clanes, campus, jornadas
│       ├── 02_institutional_source.sql    # 405 estudiantes autorizados (lista blanca)
│       ├── 03_administrators.sql          # 2 cuentas de administrador
│       ├── 04_assesment_configuration.sql # Configuración del Assessment
│       ├── 05_questions.sql               # 150 preguntas + opciones de respuesta
│       └── 06_demo_students_teams.sql     # (opcional) 345 estudiantes registrados + 40 equipos
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── components/                 # Piezas de interfaz reutilizables
│   │   ├── button.js
│   │   ├── card.js
│   │   ├── forms.js
│   │   ├── navbar.js
│   │   ├── progress_bar.js
│   │   └── table.js
│   ├── css/
│   ├── js/
│   │   ├── app.js                  # Arranque de la SPA: renderiza el navbar, carga el perfil
│   │   ├── api.js
│   │   ├── utils.js
│   │   └── router/
│   │       ├── router.js
│   │       └── routes.js
│   ├── pages/                      # Un archivo por pantalla
│   │   ├── home.js
│   │   ├── login-register.js
│   │   ├── dashboard.js
│   │   ├── assessment.js
│   │   ├── assessment_results.js
│   │   ├── smart_profile.js
│   │   ├── teams.js
│   │   ├── recomendation.js
│   │   ├── 404.js
│   │   └── admin/                  # Pantallas exclusivas de Administrador
│   │       ├── admin_home.js
│   │       ├── admin_teams.js
│   │       ├── questions.js
│   │       └── statistics.js
│   └── public/assets/              # Imágenes, íconos
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

**Capas del backend, en el orden en que viaja una petición:** `routes/` (define la URL) → `controllers/` (interpreta la petición, llama al servicio, formatea la respuesta) → `services/` (lógica de negocio + el SQL real) → PostgreSQL.

**Frontend:** una SPA hecha a mano (sin framework) — `router/router.js` lee el hash de la URL y llama a la función correspondiente de `pages/`, que devuelve un string de HTML que se inyecta en la página. `app.js` renderiza el menú lateral persistente (`navbar.js`) una vez, y lo mantiene sincronizado con el rol del usuario logueado en cada navegación.

## 11. DETENER LA PLATAFORMA

```bash
docker compose down
```

Esto detiene y elimina los contenedores, pero **conserva los datos** (el volumen de la base de datos no se borra).

## 12. REINICIAR TODO DESDE CERO

Para volver a un estado completamente limpio (por ejemplo, para probar el proceso de semillas de nuevo, o para quitar los datos de demostración después de haberlos cargado):

```bash
docker compose down
docker volume rm riwi_connect_pgdata
docker volume rm riwi_connect_frontend_dist
docker compose up -d --build
```

*(Ejecuta primero `docker volume ls` si los nombres exactos de los volúmenes son distintos en tu máquina.)*

## 13. PROBLEMAS COMUNES Y CÓMO SOLUCIONARLOS

| Problema | Solución |
|---|---|
| Puerto 5433 o 5000 ya en uso (macOS/Linux) | `lsof -i :5433` y luego `kill -9 <PID>` |
| Puerto 5433 o 5000 ya en uso (Windows) | `netstat -ano \| findstr :5433` y luego `taskkill /PID <PID> /F` |
| Nombre de contenedor ya en uso | `docker rm -f riwi_connect_db riwi_connect_backend` y luego `docker compose up -d --build` |
| La base de datos tiene datos viejos/rotos, o las semillas no cargaron | `docker compose down -v` y luego `docker compose up -d --build` (`-v` elimina el volumen de Postgres, así se recrea la base desde cero usando los scripts de `database/`) |
| **Los cambios de código del frontend no se reflejan al reconstruir** | El frontend usa un volumen de Docker con nombre (`frontend_dist`) que puede conservar una versión vieja. Ejecuta `docker compose down`, luego `docker volume rm riwi_connect_frontend_dist`, luego `docker compose up -d --build` |
| Los cambios de código del backend no se reflejan | `docker compose restart backend`, o si no funciona: `docker compose up -d --build backend` |
| Cambiaste `requirements.txt` o el `Dockerfile` | `docker compose up -d --build backend` |
| Falta `backend/config.py` o tiene un error de formato | El contenedor del backend no arrancará — cópialo de nuevo desde `backend/config.example.py` (ver [sección 5](#5-configuración-backendconfigpy)) |
| **"Modelo no encontrado" al completar un Assessment** | Google probablemente descontinuó el modelo de Gemini configurado — ver [sección 5.1](#51-generar-una-clave-de-la-api-de-gemini) |
| **Error 401 "No autenticado" al usar la API directamente (curl/Postman)** | La sesión expiró o nunca iniciaste sesión — inicia sesión primero y reutiliza la cookie de sesión |
| Dependencias del frontend rotas (macOS/Linux) | `cd frontend && rm -rf node_modules package-lock.json && npm i` |
| Dependencias del frontend rotas (Windows) | `cd frontend && rmdir /s /q node_modules && del package-lock.json && npm i` |
| Revisar estado/logs de los contenedores | `docker compose ps` / `docker compose logs backend` / `docker compose logs db` |
| **Quiero confirmar cuántos datos hay cargados** | ```docker exec -it riwi_connect_db psql -U postgres -d riwi_connect -c "SELECT (SELECT COUNT(*) FROM questions) AS preguntas, (SELECT COUNT(*) FROM institutional_sources) AS lista_blanca, (SELECT COUNT(*) FROM users WHERE role='STUDENT') AS estudiantes_registrados, (SELECT COUNT(*) FROM teams) AS equipos;"``` Con los datos de demostración completos, se espera: 150 preguntas, 407 en la lista blanca (405 estudiantes + 2 administradores), 345 estudiantes registrados, 40 equipos. |

## 14. CONTRIBUIDORES

- Samuel Esteban Benavides De la Cruz
- Jose del Carmen Diaz Diaz
- Keiner David Martinez Brochado
- Lians Dylan Paternina Lopez
- Helda Sofia Reyes Ortiz
- Melissa Sofia Rodriguez Buelvas

## 15. LICENCIA

Este proyecto fue construido con fines académicos como parte del Proyecto Capstone de RIWI. Todos los derechos reservados a sus autores.
