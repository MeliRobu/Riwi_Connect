THIS IS THE DEVELOP BRANCH, HERE WE CAN TASTE EVERYTHING BEFORE MERGING ONTO MAIN BRANCH
PARA VISTA PREVIA:  Ctrl + Shift + v

## 1. DESCRIPTION OF THE PROJECT
Riwi Connect is a web platform that helps RIWI coders form balanced teams for the Integrating Project. Students take a technical Assessment, get an automatically generated Professional Profile, and can create or join teams with classmates who have complementary skills.

## 2. JUSTIFICATION
Team formation is currently done manually, based on personal relationships rather than objective technical data. This leads to unbalanced teams, wasted time, and underused talent. Riwi Connect solves this by evaluating technical competencies and recommending compatible teammates.

## 3. TECNOLOGIES USED

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
| Node | 20 or newer|

## 4. REQUERIMENTS FOR STARTING IT 

You can visualize the project on this link: netlify(try)

Other way is step by step: 

## 4.1. First of all : How to get into the project if (diferent scenarios): 

*4.1.1. SOMEONE SEND YOU THE GITHUB REPOSITORY LINK*

Open a terminal in the folder where you want the project, then run:

```
    git clone <repository-link>
    cd Riwi_Connect
```
*4.1.2. SOMEONE SENDS YOU THE FOLDER OR YOU DOWNLOAD IT*

Just open the folder directly in Visual Studio Code (File → Open Folder).

OR: right-click on it, open a terminal, and type:

```bash
    code .
```
*4.1.3. SOMEONE SENDS YOU THE .ZIP FILE*

Extract the .zip file, then open the extracted folder in Visual Studio Code.

OR, once extracted: right-click on it, open a terminal, and type:

```bash
    code .
```
## 4.3. PROGRAMS YOU NEED TO DOWNLAND

- VISUAL STUDIO CODE: https://code.visualstudio.com/download
- DOCKER: https://www.docker.com/products/docker-desktop
- NODE.JS: https://nodejs.org

## 4.2. COMMANDS NEEDED TO START THE PROJECT

A command is an instrution to raise the project and connect everything so you can vizualice the project

Open the terminal (shortcut: "Ctrl + J"), then run in this order:

```bash
    docker compose up -d
```
Check that both containers are running (riwi_connect_db and riwi_connect_backend). If everything is OK, then:

``` bash
    cd frontend
    npm i
    npm run dev
```
It will show you a link like: http://localhost:5173

Open it.

Backend API runs separately on: http://localhost:5000

## 5. STRUCTURE OF THE PROJECT

missing !!!


## 6.  Common problems and how to solve them
| Problem | Command |
|---|---|
| Port 5433 or 5000 already in use (macOS/Linux) | `lsof -i :5433` then `kill -9 <PID>` |
| Port 5433 or 5000 already in use (Windows) | `netstat -ano \| findstr :5433` then `taskkill /PID <PID> /F` |
| Container name already in use | `docker rm -f riwi_connect_db riwi_connect_backend` then `docker compose up -d` |
| Database has old/broken data, or seed data didn't load | `docker compose down -v` then `docker compose up -d` |
| Backend code changes don't show up | `docker compose restart backend` |
| Changed `requirements.txt` or the `Dockerfile` | `docker compose up -d --build backend` |
| Broken frontend dependencies (macOS/Linux) | `cd frontend && rm -rf node_modules package-lock.json && npm i` |
| Broken frontend dependencies (Windows) | `cd frontend && rmdir /s /q node_modules && del package-lock.json && npm i` |
| Check container status/logs | `docker compose ps` / `docker compose logs backend` / `docker compose logs db` |

`-v` in the second row removes the Postgres volume, so the database gets recreated from scratch using the scripts in `database/`.


## 6. CONTRIBUTORS

- Samuel Esteban Benavides De la Cruz 
- Jose del Carmen Diaz Diaz
- Keiner David Martinez Brochado
- Lians Dylan Paternina Lopez
- Helda Sofia Reyes Ortiz
- Melissa Sofia Rodriguez Buelvas

## 8. LICENSE

This project was built for academic purposes as part of the RIWI Capstone Project. All rights reserved to its authors