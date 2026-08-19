FORME — Gym / Coaching SaaS Booking Dashboard

    Production-ready SaaS dashboard for gyms & coaching centers to manage bookings, clients, and payments.

Live Demo: https://himanshu-project.shamaacademy.online
GitHub Packages: forme-frontend, forme-backend on GHCR

React
Node
Postgres
Docker
AWS
Nginx
📸 Architecture


Full deployment: BigRock DNS → AWS EC2 → Host Nginx (SSL) → Docker Compose (Frontend + Backend + Postgres) | CI/CD via GitHub Actions → GHCR
🚀 Key Highlights for Interview

I didn't just build a React app — I shipped a complete DevOps pipeline:

    Dockerized Microservices: Frontend (React + Nginx), Backend (Express), DB (Postgres) in one docker-compose.yml
    CI/CD Pipeline: GitHub Actions builds images on every push to main 
    Cloud Deployment: AWS EC2 Ubuntu instance, host Nginx as reverse proxy, Let's Encrypt SSL via Certbot
    Custom Domain & DNS: BigRock DNS management with A records, multiple subdomains (himanshu-project, dashboard) pointing to same EC2 IP
    Production Grade: SSL termination, proxy headers, SPA routing (try_files $uri /index.html), API proxy /api/ → backend:5000

🛠️ Tech Stack
Layer	Technology
Frontend	React 18, Vite, TailwindCSS, Nginx (for serving SPA)
Backend	Node.js, Express.js, REST APIs, JWT Auth
Database	PostgreSQL 15
DevOps	Docker, Docker Compose, GitHub Actions
Infra	AWS EC2 (Ubuntu 22.04), Nginx Host Reverse Proxy, BigRock DNS, Let's Encrypt Certbot
Other	.env management, Security.md
✨ Features

    Gym member booking & scheduling
    Admin dashboard with analytics
    Authentication & role-based access
    RESTful API with /api proxy
    Fully responsive SPA with client-side routing
    Persistent Postgres data with Docker volumes

📁 Project Structure

forme-dashboard/
├── .github/workflows/   
├── backend/             
├── frontend/            
│   └── nginx.conf       
|try_files for React Router
├── infrastructure/      
├── public/              
├── .env.example
└── README.md

🔄 CI/CD Flow (How it auto-deploys)

Git Push to main
   ↓
GitHub Actions ( .github/workflows )
   ↓
Build Docker Images: forme-frontend, forme-backend
   ↓
Push to GHCR.io (ghcr.io/SAMPLETPPIO/forme-frontend:latest)
   ↓
SSH to EC2 → docker compose pull → docker compose up -d

On EC2:
bash

cd /home/ubuntu/forme-dashboard-old-backup
docker compose pull
docker compose down
docker compose up -d
sudo systemctl reload nginx

🌐 Deployment Architecture Explained (Interview Talking Point)

Request Flow:
User Browser (himanshu-project.shamaacademy.online) → BigRock DNS A record (3.109.196.216) → AWS EC2 Host Nginx (80/443 SSL) → proxy_pass http://localhost:3000 → Docker Frontend Container (React Nginx on port 80)

API call: Frontend /api/ → proxy_pass http://backend:5000 (inside Docker network) → Backend Container → Postgres Container

This setup allows multiple subdomains on same EC2 by changing server_name in /etc/nginx/sites-enabled/default.
💻 Run Locally

    Clone:

bash

git clone https://github.com/SAMPLETPPIO/forme-dashboard.git
cd forme-dashboard

    Env setup:

bash

cp .env.example .env


    Run with Docker:

bash

docker compose up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# DB: localhost:5432

🔐 Nginx Configs (Important)

Frontend container frontend/nginx.conf (SPA):
nginx

server {
  listen 80;
  root /usr/share/nginx/html;
  location /api/ {
    proxy_pass http://backend:5000;
  }
  location / {
    try_files $uri $uri/ /index.html;
  }
}

Host Nginx /etc/nginx/sites-enabled/default:
nginx

server {
  listen 80;
  server_name himanshu-project.shamaacademy.online;
  location / {
    proxy_pass http://localhost:3000;
  }
}

Add SSL:
bash

sudo certbot --nginx -d himanshu-project.shamaacademy.online

📈 What I Learned

    How to manage DNS A records and debug NXDOMAIN with nslookup/dig
    Difference between container Nginx and host Nginx reverse proxy
    Why SPA needs try_files and why API needs proxy inside Docker network
    Automating deployments with GHCR instead of manual SCP

👨‍💻 Author

Himanshu Balyan - DevOps

    Live: https://himanshu-project.shamaacademy.online
    GitHub: @himanshu-devops2007

    Looking for Full-Stack / DevOps roles - This project shows end-to-end ownership from code to cloud.

