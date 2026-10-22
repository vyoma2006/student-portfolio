# Practical 12 — CI Pipeline with GitHub Actions

## What I built
- `.github/workflows/ci.yml` — runs on every push to `main`: checkout → setup Node 22 → `npm install` → `npm test`
- `task-manager-api/tests/api.test.js` — 6 automated tests (Jest + Supertest) with the database mocked, so CI needs no MongoDB
- `app.js` split out of `server.js` so tests can import the Express app without starting a server or connecting to MongoDB

## Pipeline runs (evidence)
| Run | Commit message | Result | Screenshot |
|---|---|---|---|
| 1 | Add CI workflow and tests | ✅ pass | `docs/ci-pass-1.png` |
| 2 | Break test on purpose | ❌ fail | `docs/ci-fail.png` (+ failed log `docs/ci-fail-log.png`) |
| 3 | Fix test | ✅ pass | `docs/ci-pass-2.png` |

Failed log shows: `Expected: 500  Received: 200` in "GET /tasks › returns 200 and the task list when logged in" at the "Run tests" step.

## Status badge
Add to the top of README.md (replace USERNAME and REPO):
```
![CI Pipeline](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)
```

## Key questions
**CI vs CD — which does this demonstrate?**
Continuous Integration: every push is automatically built and tested so integration problems show up immediately.
Continuous Deployment would go one step further and automatically release/deploy a passing build (e.g. push the Docker
image or publish to a server). This pipeline stops after the tests, so it demonstrates CI only.

**Why does testing on every push catch problems earlier than manual testing?**
Each change is checked within minutes, while the author still remembers it and the change is small, so the broken commit is
easy to find. Manual pre-release testing batches many changes together, finds problems late, and depends on someone remembering to run it.

**What if the test file path were wrong?**
The workflow still fails at the same "Run tests" step, because Jest exits with code 1 when it finds no tests
("No tests found, exiting with code 1"). The difference is in the log: a genuine failure shows a failed assertion with
Expected/Received values, a wrong path shows "No tests found". (A wrong `npm install` or checkout would fail at an earlier step.)

## Errors I hit and how I fixed them
- ___

## Optional extras (supplementary)
Run only on pull requests to main:
```yaml
on:
  pull_request:
    branches: [main]
```