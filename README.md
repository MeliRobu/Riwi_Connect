THIS IS THE DEVELOP BRANCH, HERE WE CAN TEST EVERYTHING BEFORE MERGING ONTO MAIN BRANCH
PARA VISTA PREVIA: Ctrl + Shift + V

## 1. DESCRIPTION OF THE PROJECT

Riwi Connect is a web platform that helps RIWI coders form balanced teams for the Integrating Project. Students take a technical Assessment, get an automatically generated Professional Profile, and can create or join teams with classmates who have complementary skills.

## 2. JUSTIFICATION

Team formation is currently done manually, based on personal relationships rather than objective technical data. This leads to unbalanced teams, wasted time, and underused talent. Riwi Connect solves this by evaluating technical competencies and recommending compatible teammates.

## 3. TECHNOLOGIES USED

| Technology | Version |
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
| Node | 20 or newer |
| Gemini API | gemini-3.1-flash-lite |

## 4. GETTING THE PROJECT

### 4.1. Different ways to get the code

**If someone sends you the GitHub repository link:**

```bash
git clone <repository-link>
cd Riwi_Connect
```

**If someone sends you the folder, or you download it:**

Open the folder directly in Visual Studio Code (File → Open Folder), or right-click on it, open a terminal, and type:

```bash
code .
```

**If someone sends you a `.zip` file:**

Extract it, then open the extracted folder in Visual Studio Code (same as above).

### 4.2. Programs you need to install

- **Visual Studio Code:** https://code.visualstudio.com/download
- **Docker (Docker Desktop, includes Docker Compose):** https://www.docker.com/products/docker-desktop
- **Git**
- **Node.js 20+** (https://nodejs.org) — only required if you plan to run the frontend outside Docker for hot-reload during active development (see [section 9](#9-optional-frontend-hot-reload-for-active-development)). It is **not** required just to run the platform.

To confirm everything is installed, run:

```bash
docker --version
docker compose version
git --version
```

## 5. CONFIGURATION (`backend/config.py`)

The backend needs a `backend/config.py` file with sensitive values (database connection string, session secret key, Gemini API key). **This file is never committed to git** (it's listed in `.gitignore`) — you have to create it yourself on every machine where you set up the project.

Copy the template that *is* tracked in the repo:

```bash
cp backend/config.example.py backend/config.py
```

Open `backend/config.py`. It should look like this:

```python
DATABASE_URL = "dbname=riwi_connect user=postgres password=postgres host=db"
SECRET_KEY = "replace_with_a_random_secret_key"
GEMINI_API_KEY = "replace_with_your_gemini_api_key"
```

- **`DATABASE_URL`**: leave it as is — it already matches the Docker Compose setup.
- **`SECRET_KEY`**: replace with any random string (used to sign user sessions).
- **`GEMINI_API_KEY`**: see below.

### 5.1. Generating a Gemini API key

The platform calls the Gemini API to generate each student's professional profile interpretation after they complete their Assessment.

1. Go to https://aistudio.google.com and sign in with a Google account.
2. Generate a new API key ("Get API Key" / "API Keys").
3. Paste it into `backend/config.py`, replacing `replace_with_your_gemini_api_key`.

**Generate a fresh key for each new environment/presentation** — never reuse or share the same key across people or machines. If a key is ever exposed accidentally (e.g. pasted in a chat), revoke it and generate a new one.

**About the model:** the project currently uses `gemini-3.1-flash-lite`. Google frequently retires or renames models — if you ever get a "model not found" error when completing an Assessment, check which models your key currently supports:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY_HERE" | grep -o '"name": "[^"]*"' | grep -i flash
```

and update the model name in `backend/services/assessment_service.py` accordingly. This is a config/operational issue, not something you need to fix in code otherwise — a failed profile generation degrades gracefully (the assessment result still saves correctly; the AI interpretation just stays empty and retries automatically on the student's next login).

## 6. RUNNING THE PROJECT

With `backend/config.py` already set up, from the project root run:

```bash
docker compose up -d --build
```

This single command builds **both** the backend and the frontend and starts everything — the frontend is built into static files during the Docker build and served directly by the Flask backend. There is no separate frontend dev server involved in the normal flow.

The first run can take a few minutes (downloading images, installing dependencies). Later runs are much faster.

### 6.1. Verify it started correctly

```bash
docker compose ps
```

You should see two containers `Up`:

```
NAME                   STATUS
riwi_connect_backend   Up
riwi_connect_db        Up (healthy)
```

If something isn't `Up`, check the logs:

```bash
docker compose logs backend
docker compose logs db
```

### 6.2. Access the platform

Open your browser at:

```
http://localhost:5000
```

That's it — one port, no separate frontend URL.

## 7. DEMO DATA (OPTIONAL)

`database/seed/06_demo_students_teams.sql` automatically registers **345 students** with a completed Assessment, and conforms **40 teams** — meant to make the platform look "alive" for demos/presentations instead of completely empty.

- **To keep it (recommended for presentations):** do nothing, it runs automatically the first time the database is created.
- **To start with a clean database instead** (only the question bank and the authorized student list, no registered students or teams): delete the file **before** the first `docker compose up`:

```bash
rm database/seed/06_demo_students_teams.sql
```

This file (like all seed files) only runs once, when the Postgres volume is created empty. Deleting it after you've already run the project once does nothing by itself — you'd also need to reset the database (see [section 8](#8-resetting-everything-from-scratch)).

## 8. CREDENTIALS AVAILABLE

### Administrators

| Campus | Document number | Password |
|---|---|---|
| Barranquilla | `900000001` | `Prueba1234` |
| Medellín | `900000002` | `Prueba1234` |

### Registered Coders (demo data)

All demo students share the same password: **`Prueba1234`**.

To find the document number of a specific student (e.g. to demo a high-performing profile):

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

### Not-yet-registered students

The other 60 students in the institutional whitelist (405 total − 345 already registered) can self-register from the "Registro" screen with their document number and any password of at least 8 characters. To find one:

```bash
docker exec -it riwi_connect_db psql -U postgres -d riwi_connect -c "
SELECT isrc.document_number, isrc.full_name
FROM institutional_sources isrc
LEFT JOIN users u ON u.id_institutional_source = isrc.id_institutional_source
WHERE u.id_user IS NULL AND isrc.id_clan IS NOT NULL
LIMIT 10;
"
```

## 9. (OPTIONAL) FRONTEND HOT-RELOAD FOR ACTIVE DEVELOPMENT

If you're actively editing frontend files and want instant reload instead of rebuilding the Docker image every time, you can run Vite's dev server separately (Node.js required):

```bash
cd frontend
npm i
npm run dev
```

This starts a dev server (usually `http://localhost:5173`), while the backend API keeps running separately from Docker on `http://localhost:5000`. This is purely a development convenience — it is **not** required to run or demo the platform, and it is **not** how the app runs in Docker (there, the built frontend is served directly by the backend on port 5000, see section 6).

## 10. PROJECT STRUCTURE

```
Riwi_Connect/
├── backend/
│   ├── app.py                     # Flask app entry point
│   ├── config.example.py          # Template — safe to commit, no real secrets
│   ├── config.py                  # Real secrets — NEVER committed (.gitignore)
│   ├── Dockerfile                 # Multi-stage build: builds frontend, then backend
│   ├── requirements.txt
│   ├── controllers/                # Handle HTTP request/response for each route
│   │   ├── admin_controller.py
│   │   ├── assessment_controller.py
│   │   ├── team_controller.py
│   │   └── user_controller.py
│   ├── database/
│   │   └── connection.py           # PostgreSQL connection helper
│   ├── models/                     # Data model definitions
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
│   ├── routes/                     # URL → controller mapping
│   │   ├── admin_routes.py
│   │   ├── assessment_routes.py
│   │   ├── team_routes.py
│   │   └── user_routes.py
│   └── services/                   # Business logic + SQL queries
│       ├── admin_service.py
│       ├── assessment_service.py
│       ├── auth_service.py
│       ├── compatibility_service.py
│       ├── team_service.py
│       └── user_service.py
│
├── database/
│   ├── 00-init.sh                  # Bridges docker-entrypoint-initdb.d with schema/ and seed/ subfolders
│   ├── backup/
│   │   └── riwi_connect_backup.sql
│   ├── schema/                     # Runs first: creates tables and indexes
│   │   ├── create_tables.sql
│   │   └── indexes.sql
│   └── seed/                       # Runs second, in numeric order
│       ├── 01_initial_data.sql            # Clans, campus, journeys
│       ├── 02_institutional_source.sql    # 405 authorized students (whitelist)
│       ├── 03_administrators.sql          # 2 administrator accounts
│       ├── 04_assesment_configuration.sql # Assessment settings (question count, etc.)
│       ├── 05_questions.sql               # 150 questions + answer options
│       └── 06_demo_students_teams.sql     # (optional) 345 registered students + 40 teams
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── components/                 # Reusable UI pieces
│   │   ├── button.js
│   │   ├── card.js
│   │   ├── forms.js
│   │   ├── navbar.js
│   │   ├── progress_bar.js
│   │   └── table.js
│   ├── css/
│   ├── js/
│   │   ├── app.js                  # SPA bootstrap: renders navbar, loads profile
│   │   ├── api.js
│   │   ├── utils.js
│   │   └── router/
│   │       ├── router.js
│   │       └── routes.js
│   ├── pages/                      # One file per screen
│   │   ├── home.js
│   │   ├── login-register.js
│   │   ├── dashboard.js
│   │   ├── assessment.js
│   │   ├── assessment_results.js
│   │   ├── smart_profile.js
│   │   ├── teams.js
│   │   ├── recomendation.js
│   │   ├── 404.js
│   │   └── admin/                  # Administrator-only screens
│   │       ├── admin_home.js
│   │       ├── admin_teams.js
│   │       ├── questions.js
│   │       └── statistics.js
│   └── public/assets/              # Images, icons
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

**Backend layers, in order of a request:** `routes/` (defines the URL) → `controllers/` (parses the request, calls the service, formats the response) → `services/` (business logic + the actual SQL) → PostgreSQL.

**Frontend:** a hand-rolled SPA (no framework) — `router/router.js` reads the URL hash and calls the matching function from `pages/`, which returns an HTML string that gets injected into the page. `app.js` renders the persistent sidebar (`navbar.js`) once and keeps it in sync with the logged-in user's role on every navigation.

## 11. STOPPING THE PLATFORM

```bash
docker compose down
```

This stops and removes the containers, but **keeps your data** (the database volume is not deleted).

## 12. RESETTING EVERYTHING FROM SCRATCH

To go back to a completely clean state (e.g. to test the seed process again, or to drop the demo data after already having loaded it):

```bash
docker compose down
docker volume rm riwi_connect_pgdata
docker volume rm riwi_connect_frontend_dist
docker compose up -d --build
```

*(Run `docker volume ls` first if the exact volume names differ on your machine.)*

## 13. COMMON PROBLEMS AND HOW TO SOLVE THEM

| Problem | Solution |
|---|---|
| Port 5433 or 5000 already in use (macOS/Linux) | `lsof -i :5433` then `kill -9 <PID>` |
| Port 5433 or 5000 already in use (Windows) | `netstat -ano \| findstr :5433` then `taskkill /PID <PID> /F` |
| Container name already in use | `docker rm -f riwi_connect_db riwi_connect_backend` then `docker compose up -d --build` |
| Database has old/broken data, or seed data didn't load | `docker compose down -v` then `docker compose up -d --build` (`-v` removes the Postgres volume, so the database gets recreated from scratch using the scripts in `database/`) |
| **Frontend code changes don't show up after rebuilding** | The frontend uses a named Docker volume (`frontend_dist`) that can persist an old build. Run `docker compose down`, then `docker volume rm riwi_connect_frontend_dist`, then `docker compose up -d --build` |
| Backend code changes don't show up | `docker compose restart backend`, or if that doesn't help: `docker compose up -d --build backend` |
| Changed `requirements.txt` or the `Dockerfile` | `docker compose up -d --build backend` |
| `backend/config.py` missing or malformed | Backend container won't start — copy it again from `backend/config.example.py` (see [section 5](#5-configuration-backendconfigpy)) |
| **"Model not found" when completing an Assessment** | The configured Gemini model was likely deprecated by Google — see [section 5.1](#51-generating-a-gemini-api-key) |
| **401 "Not authenticated" calling the API directly (curl/Postman)** | Your session expired or you never logged in — log in first and reuse the session cookie |
| Broken frontend dependencies (macOS/Linux) | `cd frontend && rm -rf node_modules package-lock.json && npm i` |
| Broken frontend dependencies (Windows) | `cd frontend && rmdir /s /q node_modules && del package-lock.json && npm i` |
| Check container status/logs | `docker compose ps` / `docker compose logs backend` / `docker compose logs db` |
| **Want to confirm how much data is loaded** | ```docker exec -it riwi_connect_db psql -U postgres -d riwi_connect -c "SELECT (SELECT COUNT(*) FROM questions) AS questions, (SELECT COUNT(*) FROM institutional_sources) AS whitelist, (SELECT COUNT(*) FROM users WHERE role='STUDENT') AS registered_students, (SELECT COUNT(*) FROM teams) AS teams;"``` Expected with full demo data: 150 questions, 407 whitelist entries (405 students + 2 admins), 345 registered students, 40 teams. |

## 14. CONTRIBUTORS

- Samuel Esteban Benavides De la Cruz
- Jose del Carmen Diaz Diaz
- Keiner David Martinez Brochado
- Lians Dylan Paternina Lopez
- Helda Sofia Reyes Ortiz
- Melissa Sofia Rodriguez Buelvas

## 15. LICENSE

This project was built for academic purposes as part of the RIWI Capstone Project. All rights reserved to its authors.
