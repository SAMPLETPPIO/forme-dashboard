# FORME — Booking Dashboard

Gym/coaching booking dashboard for a single client. React + Tailwind (frontend),
Express + Postgres (backend), fully Dockerized with an automated CI/CD pipeline
via GitHub Actions.

> See [SECURITY.md](./SECURITY.md) for a note on this repo's commit history.

## Run

docker compose up --build

Frontend: http://localhost:3000
API: http://localhost:5000/api/health

## Stack

- Frontend: React + Vite + Tailwind, multi-stage Nginx
- Backend: Node Express, pg
- DB: Postgres 16
- Infrastructure: AWS EC2, Terraform, Nginx reverse proxy with SSL/TLS
- CI/CD: GitHub Actions (build verification, Compose syntax checks, automated deploy)
