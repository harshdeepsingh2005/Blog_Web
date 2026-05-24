# Blogging Platform with Auth

A production-style blogging platform inspired by Medium, Hashnode, and Dev.to.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS + Axios |
| Backend | FastAPI + SQLAlchemy + Pydantic |
| Auth | JWT (Passlib/Bcrypt) |
| Database | SQLite (dev) → PostgreSQL (prod) |

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn app.main:app --reload
```

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```

Frontend available at: http://localhost:5173

## Project Structure

```
blogging-platform/
├── backend/          # FastAPI application
├── frontend/         # React + Vite application
├── docs/             # Project documentation
└── .env.example      # Environment variable template
```

## Features

- JWT authentication (register, login, protected routes)
- Full blog CRUD (create, read, update, delete)
- Comments & likes system
- User profiles & dashboard
- Admin moderation panel
- Categories & search/filter
- Responsive warm editorial UI
- Dark mode support

## Documentation

See `/docs` for full architecture, design, and API specifications.
