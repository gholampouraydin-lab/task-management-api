# Task Management API

A small Express.js backend for the Users and Tasks resources, containerized with Docker.

## Requirements

- Docker Desktop (or Docker Engine) with Docker Compose
- No local Node.js installation is needed when using Docker

## Build the image

From the repository root:

```bash
docker build -t task-management-api .
```

## Run the container (port mapping)

```bash
docker run --name task-management-api -p 3000:3000 task-management-api
```

The API listens on port **3000 inside the container** and is available on port **3000 on your computer**.

Check that it is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok"}
```

Open [http://localhost:3000/health](http://localhost:3000/health) in a browser to verify it.

Stop and remove the container:

```bash
docker stop task-management-api
docker rm task-management-api
```

## Run with Docker Compose

```bash
docker compose up --build
```

Stop it:

```bash
docker compose down
```

## API endpoints

Base path: `/api/v1`

### Users
- `POST /users` — create a user
- `GET /users` — list users
- `GET /users/:userId` — get a user
- `PATCH /users/:userId` — update a user
- `DELETE /users/:userId` — delete a user

### Tasks
- `POST /tasks` — create a task (send `userId` and `title`)
- `GET /tasks` — list tasks; optionally filter with `?userId=1`
- `GET /tasks/:taskId` — get a task
- `PATCH /tasks/:taskId` — update a task
- `DELETE /tasks/:taskId` — delete a task

### Example

Create a user:

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Sara Ahmadi","email":"sara@example.com","password":"demo-password"}'
```

Create a task (use the returned user ID):

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"title":"Finish Docker assignment","status":"todo"}'
```

## Container files

- `Dockerfile` — builds a production-mode Node.js image using Node 20 Alpine.
- `.dockerignore` — excludes Git metadata, local dependencies, environment files, and other unnecessary files from the build context.
- `docker-compose.yml` — starts the API and maps host port 3000 to container port 3000.
- `.github/workflows/docker-smoke-test.yml` — builds the image and runs a health-endpoint smoke test on pushes and pull requests.

## Important notes

- This is an educational starter backend. Data is stored in memory and is reset when the container is recreated.
- The current sample does not yet implement production authentication, persistent database storage, or production-grade password hashing. Do not use real passwords or deploy it with real user data.
- See `API_CONTRACT.md` for the initial endpoint contract and `architecture.md` for the architecture diagram.
