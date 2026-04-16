# Fullstack Portfolio (Dockerized)

A modern portfolio website built with Angular 19, NestJS, and PostgreSQL.

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
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend API: [http://localhost:3000](http://localhost:3000)

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

## Structure
- `/frontend`: Angular application
- `/backend`: NestJS application
- `/docker-compose.yml`: Development config
- `/docker-compose.prod.yml`: Production config
