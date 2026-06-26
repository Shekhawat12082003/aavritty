# AAVRITTY Business Solutions

India's trusted **B2B + B2C electrical wholesale platform** — built with React 19, Node.js, Express, PostgreSQL, and Prisma.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, Framer Motion |
| Backend | Node.js, Express 5, Prisma ORM, PostgreSQL, JWT, Winston, Swagger |
| DevOps | Docker Compose, ESLint, Prettier |

## Quick Start

### Prerequisites
- Node.js 22+
- Docker Desktop (for PostgreSQL)

### 1. Start Database
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # if .env doesn't exist
npm install
npx prisma db push
npm run dev
```
API: http://localhost:5000  
Swagger: http://localhost:5000/api/docs  
Health: http://localhost:5000/api/v1/health

### 3. Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
App: http://localhost:5173

## Project Structure

```
aavritty/
├── frontend/          # React 19 + Vite + Tailwind
├── backend/           # Express API + Prisma
├── database/          # Database docs & migrations
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── docker-compose.yml # PostgreSQL for local dev
└── README.md
```

## Features (Day 1)

- Professional B2B UI with 20+ pages
- Product catalog with live API (sample data)
- Cart, Wishlist, Checkout flow (client-side)
- Auth pages with demo login
- Vendor, Admin, Delivery dashboards
- REST API scaffolding with Swagger
- Health check endpoint
- Winston logging
- Prisma schema with 20+ models
- JWT auth architecture

## Scripts

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | Run ESLint |

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm run start` | Production start |
| `npm run build` | Generate Prisma client |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to DB |

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

## Day 2 Roadmap

- Full authentication with database
- User management CRUD
- Product & category management
- File uploads (Cloudinary)
- Admin panel APIs

## License

Proprietary — AAVRITTY Business Solutions
