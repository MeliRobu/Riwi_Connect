# Stage 1: build the Frontend with Vite.
# This stage is temporary — it gets discarded once the build is done,
# so Node never ends up in the final image.
FROM node:20-slim AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: the actual image that runs — just Python, no Node.
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
# Only grab the compiled frontend output from Stage 1, nothing else.
COPY --from=frontend-build /frontend/dist ./frontend_dist

EXPOSE 5000

CMD ["python", "app.py"]