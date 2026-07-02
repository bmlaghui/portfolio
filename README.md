# Fullstack Portfolio (Dockerized)

A modern portfolio website built with Angular 21, NestJS, and PostgreSQL.

## Features
- **Ultra-Modern UI/UX**: Custom design system with glassmorphism and animations.
- **Full Stack**: NestJS + Prisma + PostgreSQL.
- **Admin Dashboard**: Manage your projects and content via a dedicated IHM.
- **Dockerized**: Easy setup for both development and production.

## Prerequisites
- Docker & Docker Compose
- Node.js (v22+)

## Getting Started

### 1. Development Environment
```bash
docker-compose up --build
```
- Frontend: [http://localhost:4000](http://localhost:4000)
- Backend API: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:4000/admin](http://localhost:4000/admin)

### 2. Production Environment
```bash
docker-compose -f docker-compose.prod.yml up --build
```

### 3. Database Management
To sync your database schema:
```bash
cd backend
npx prisma migrate dev --name init
```

To load the portfolio demo content:
```bash
docker compose exec backend npx prisma db seed
```

The local seed creates `admin@portfolio.com` with password `Admin123!`. Change
these credentials and the JWT secrets before deploying publicly.

## Structure
- `/frontend`: Angular application
- `/backend`: NestJS application
- `/docker-compose.yml`: Development config
- `/docker-compose.prod.yml`: Production config
