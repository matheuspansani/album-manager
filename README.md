# FIFA World Cup 2026 - Sticker Album Manager

A full-stack application to manage your Panini FIFA World Cup 2026 sticker collection. Track which stickers you own, find missing ones, manage duplicates, and organize trades.

Built with **FastAPI** (Python), **React** (TypeScript), **PostgreSQL**, and fully containerized with **Docker**.

## Features

- **Complete album**: All 980 official Panini stickers across 48 national teams and 12 groups
- **Track collection**: Click to add stickers, right-click to remove
- **Quick add**: Bulk add stickers by typing codes (e.g. `BRA1, ARG5, FWC3`)
- **Progress tracking**: Real-time stats with completion percentage per team and overall
- **Filter & search**: Filter by owned, missing, or duplicates; search by code, player, or country
- **Trade list**: View all duplicate stickers available for trading
- **Persistent storage**: PostgreSQL database keeps your collection safe

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| Infrastructure | Docker, Docker Compose, Nginx |

## Architecture

```
├── backend/            # FastAPI REST API
│   └── app/
│       ├── models/         # SQLAlchemy models
│       ├── schemas/        # Pydantic schemas
│       ├── repositories/   # Data access layer
│       ├── services/       # Business logic
│       ├── routers/        # API endpoints
│       └── data/           # Sticker dataset (JSON)
├── frontend/           # React SPA
│   └── src/
│       ├── components/     # UI components
│       └── hooks/          # Custom hooks
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)

### Setup

```bash
# Clone the repository
git clone https://github.com/matheuspansani/album-manager.git
cd album-manager

# Copy environment file
cp .env.example .env

# Build and start all services
make build
make up

# Seed the database with all 980 stickers
make seed
```

The application will be available at:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

### Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make install` | Install Docker (macOS via Homebrew) |
| `make build` | Build Docker images |
| `make up` | Start all containers |
| `make down` | Stop all containers |
| `make restart` | Restart all containers |
| `make logs` | Follow container logs |
| `make seed` | Seed the database with stickers |
| `make status` | Show container status |
| `make reset` | Reset database and reseed |
| `make clean` | Remove containers, volumes, and images |

### Database Connection (DBeaver / pgAdmin)

| Field | Value |
|-------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `album` |
| User | `album` |
| Password | `album` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stickers/` | List all stickers |
| GET | `/api/stickers/stats` | Album statistics |
| GET | `/api/stickers/progress` | Progress by country |
| GET | `/api/stickers/owned` | List owned stickers |
| GET | `/api/stickers/missing` | List missing stickers |
| GET | `/api/stickers/duplicates` | List duplicates |
| GET | `/api/stickers/country/{name}` | Stickers by country |
| POST | `/api/stickers/toggle/{code}` | Add a sticker |
| POST | `/api/stickers/remove/{code}` | Remove one copy |
| POST | `/api/stickers/seed` | Seed the database |

## License

MIT
