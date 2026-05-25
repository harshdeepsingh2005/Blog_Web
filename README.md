<<<<<<< HEAD
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
=======
# BlogFlow - Full-Stack Blogging Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

A production-style, modern blogging platform inspired by Medium, Hashnode, and Dev.to. It is a full-stack web application designed with a robust, scalable architecture, featuring secure JWT authentication, complete blog CRUD functionality, and interactive community features like comments and likes.

---

## 🌟 Key Features

*   **Authentication & Security**: Secure JWT-based authentication with Bcrypt password hashing. Protected routes and ownership validation for content modification.
*   **Content Management**: Full CRUD (Create, Read, Update, Delete) capabilities for blog posts. Rich text editor support (Tiptap) and image integrations.
*   **User Engagement**: Community interaction via comments and likes on blog posts.
*   **Personalization**: User dashboards and profile management (avatars, bios).
*   **Categorization**: Organize blogs by categories (Technology, AI, Programming, etc.) with search and filtering capabilities.
*   **Modern UI/UX**: Responsive, warm editorial UI built with TailwindCSS and Framer Motion for micro-animations. Supports Dark Mode.
*   **Administrative Control**: Admin dashboard for user and content moderation.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 18 + Vite
*   **Styling**: TailwindCSS
*   **Routing**: React Router DOM v7
*   **State Management/API**: Context API + Axios
*   **Editor**: Tiptap (Rich Text Editor)
*   **Animations**: Framer Motion

### Backend
*   **Framework**: FastAPI
*   **Database**: SQLite (Development) / PostgreSQL (Production ready)
*   **ORM**: SQLAlchemy 2.0
*   **Data Validation**: Pydantic
*   **Authentication**: Passlib + Python-Jose (JWT)
*   **Migrations**: Alembic

---

## 📁 Project Structure

```text
blogging-platform/
├── backend/               # FastAPI application
│   ├── app/               # Main application code (routes, models, schemas, auth)
│   ├── tests/             # Pytest test cases
│   ├── alembic/           # Database migrations
│   └── requirements.txt   # Python dependencies
├── frontend/              # React + Vite application
│   ├── src/               # React source code (components, pages, context, hooks)
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
├── docs/                  # Comprehensive project documentation (Architecture, Design)
├── .env.example           # Environment variables template
└── README.md              # Project overview
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd blogging-platform
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp ../.env.example .env
# Edit .env and configure your secret keys and database URLs

# Run Database Migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload
```
**API Documentation** (Swagger UI) will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend

# Install dependencies
npm install

# Environment Setup
cp ../.env.example .env.local
# Ensure VITE_API_URL is pointing to your backend (e.g., http://localhost:8000)

# Start the development server
npm run dev
```
**Frontend Application** will be available at: `http://localhost:5173`

---

## 🔌 API Endpoints Overview

The backend exposes a structured RESTful API under the `/api` prefix:

*   **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
*   **Users**: `GET /api/users/{id}`, `PUT /api/users/{id}`
*   **Posts**: `GET /api/posts`, `POST /api/posts`, `GET /api/posts/{id}`, `PUT /api/posts/{id}`, `DELETE /api/posts/{id}`
*   **Comments**: `POST /api/comments`, `GET /api/posts/{id}/comments`
*   **Likes**: `POST /api/posts/{id}/like`
*   **Categories**: `GET /api/categories`

For detailed request/response schemas, refer to the auto-generated Swagger UI (`/docs`) when the backend is running.

---

## 📚 Documentation

For in-depth understanding of the system, refer to the markdown files in the `/docs` directory:
*   `System_Architecture.md`: Detailed backend/frontend structure, database schema, and request flows.
*   `project_overview.md`: Target users, core functionalities, and project goals.
*   `design.md`: UI/UX guidelines and component breakdown.

---

## 🛡️ License

This project is licensed under the terms of the license found in the `LICENSE` file.
>>>>>>> origin/main
