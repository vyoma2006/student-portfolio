# Practical 11 — Docker & Docker Compose

## Run the full stack (one command)
```bash
docker compose up --build
```
(`docker-compose up --build` on older installs.) Then open **http://localhost:5173**, register an account and use the app.
Stop with `Ctrl+C`, or `docker compose down` (add `-v` to also delete the database volume).

## Services
| Service | Image / build | Host port → container port | Notes |
|---|---|---|---|
| frontend | multi-stage: Node build → nginx | 5173 → 80 | static React build served by nginx |
| backend | `./task-manager-api/Dockerfile` | 5050 → 5050 | Express + JWT + cache + events |
| mongodb | `mongo:7` | 27017 → 27017 | data in named volume `mongo-data` |

Network: `app-network` (bridge). Flow: browser → frontend (5173) · browser → backend (5050) · backend → mongodb (service name).

## Files
- `Dockerfile` (project root) — frontend, multi-stage
- `task-manager-api/Dockerfile` — backend
- `nginx.conf` — serves the SPA, falls back to `index.html` for React Router routes
- `docker-compose.yml` — orchestrates the 3 services
- `.dockerignore` (root and backend) — excludes `node_modules`, `.env`, etc.

## Evidence checklist
1. `docker compose version` output
2. `docker compose up --build` finishing, showing all three services starting
3. `docker ps` showing 3 containers (screenshot)
4. App working in the browser at localhost:5173 (register, create a task)
5. Persistence: `docker compose down` then `docker compose up`, tasks are still there (named volume)
6. Image sizes: `docker images` (shows the small nginx-based frontend image)

## Key questions
**Why reference MongoDB by service name, not localhost?**
Each container has its own network namespace, so `localhost` inside the backend container means the backend container
itself, where no MongoDB is running. Compose puts all services on `app-network` with built-in DNS, so the name `mongodb`
resolves to the MongoDB container's address.

**EXPOSE vs ports?**
`EXPOSE` in a Dockerfile only documents which port the app listens on inside the container; it publishes nothing.
`ports: "host:container"` in docker-compose.yml actually publishes the container port on the host so the browser can reach it.

**Why not copy node_modules into the image?**
It's huge and slows builds. It may contain packages compiled for the host OS (macOS) that don't work in Linux containers,
and it bypasses Docker layer caching. Running `npm install` inside the build gives correct Linux binaries and a cacheable layer.

## Deviations from the lab sheet (and why)
- **Node 22 instead of Node 18:** the project's Vite version needs a newer Node than 18 to build.
- **nginx for the frontend (multi-stage build):** this is the supplementary multi-stage task; it gives a much smaller final image
  than running `npm run preview` in a Node image.
- **Backend on port 5050, not 5000:** port 5000 is used by macOS AirPlay Receiver, so this project already used 5050.
- **mongo healthcheck + `depends_on: service_healthy`:** `depends_on` alone only waits for the container to *start*; the backend
  exits if MongoDB isn't ready yet.

## Errors I hit and how I fixed them
- ___