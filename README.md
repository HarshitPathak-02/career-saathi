# CareerSaathi

CareerSaathi is an AI-assisted career preparation platform. Students define a target role, complete a skill-gap assessment, follow a personalised roadmap, work through weekly missions, and measure readiness for interviews.

The repository is a monorepo containing the Express/MongoDB API and the React frontend.

## Features

- Authentication with JWT access tokens and rotating, revocable refresh tokens.
- Career journey setup and a guided state machine (`DRAFT -> ACTIVE -> READINESS -> READY`).
- AI-generated roadmaps based on target role, current skills, and available study time.
- Seven-day missions (six learning days plus a weekly review) with daily tasks.
- Initial, weekly, and monthly assessments with skill progress tracking.
- Weekly reflections, AI-generated weekly reports, and 28-day monthly reports.
- Adaptive roadmap updates driven by review outcomes.
- Readiness scoring from mock interviews, skill progress, roadmap completion, and assessment performance.
- Resume upload and Cloudinary-backed storage.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js, Express 5, TypeScript, MongoDB, Mongoose |
| Auth | JWT (access + refresh), bcrypt, httpOnly refresh cookie |
| AI | Google Gemini or Groq through a provider factory |
| Frontend | React 19, Vite, TypeScript, Redux Toolkit, RTK Query |
| Styling | Tailwind CSS |
| Infrastructure | Docker, GitHub Actions, AWS EC2, MongoDB Atlas |
| Storage | Cloudinary |

## Repository Structure

```
careersaathi/
├── backend/
│   ├── src/
│   │   ├── config/          # env, database, logger
│   │   ├── core/            # errors, middleware, constants
│   │   ├── master-data/     # seed data (domains, roles, skills)
│   │   ├── modules/         # feature modules (auth, mission, readiness, ...)
│   │   ├── routes/          # API router and health checks
│   │   ├── shared/          # AI, storage, time, utils
│   │   └── server.ts
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── app/             # store, router, providers
│       ├── components/      # shared UI components
│       ├── features/        # feature-sliced modules
│       ├── layouts/
│       └── shared/          # API client, types, helpers
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
└── .github/workflows/
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MongoDB (local or Atlas)
- A Gemini or Groq API key
- A Cloudinary account (resume upload)

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` (see [backend/.env.example](backend/.env.example)). Start the API:

```bash
npm run dev
```

The API is served at `http://localhost:5000/api/v1`. Health probes:

- `GET /api/v1/health` - liveness
- `GET /api/v1/health/ready` - readiness (returns `503` when MongoDB is disconnected)

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api/v1
```

Start the app:

```bash
npm run dev
```

### Seed Data

```bash
cd backend
npm run seed
```

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | Start with hot reload |
| backend | `npm run build` | Compile TypeScript to `dist/` |
| backend | `npm run typecheck` | Type-check without emitting |
| backend | `npm run lint` | ESLint |
| backend | `npm run format` | Prettier |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Type-check and production build |
| frontend | `npm run typecheck` | Type-check |
| frontend | `npm run lint` | ESLint |
| frontend | `npm run preview` | Preview the production build |

## Authentication Model

- Access token: short-lived JWT sent as `Authorization: Bearer <token>`.
- Refresh token: longer-lived JWT stored in an httpOnly cookie and rotated on every refresh.
- Only SHA-256 hashes of active refresh tokens are stored on the user document, so sessions can be revoked on logout, globally, or on token reuse.
- At most five concurrent refresh tokens are kept per user.

## Deployment

The backend is containerised and deployed through GitHub Actions to AWS EC2. MongoDB is hosted on Atlas. The frontend is built with Vite and can be hosted on any static host.

Required production configuration includes `CLIENT_URL` and, optionally, `CORS_ORIGINS` for additional allowed origins.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API reference](docs/API.md)
