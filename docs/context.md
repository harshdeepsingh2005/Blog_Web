# context.md

# Blogging Platform with Auth — Persistent Project Context

> This file acts as the primary handoff and continuity document for all AI agents and developers working on the project.
>
> Every major implementation decision, architectural change, completed milestone, pending task, and integration detail MUST be updated here.
>
> This file exists to:
>
> - eliminate repetitive questioning,
> - reduce context loss,
> - minimize token usage,
> - preserve architectural consistency,
> - support uninterrupted multi-agent collaboration.

---

# PROJECT SUMMARY

## Project Name

Blogging Platform with Auth

## Project Type

Full-Stack Web Application

## Primary Goal

Develop a production-style blogging platform where users can:

- Register and authenticate securely
- Create, edit, delete, and manage blog posts
- Interact via comments and likes
- Access protected resources using JWT authentication
- Consume REST APIs from a React frontend
- Experience a modern responsive UI

---

# CORE TECH STACK

## Frontend

- React.js
- React Router DOM
- Axios
- Context API / Zustand (optional)
- TailwindCSS (preferred)
- Vite

## Backend

- FastAPI
- SQLAlchemy ORM
- Pydantic
- JWT Authentication
- Passlib/Bcrypt

## Database

- SQLite (development)
- PostgreSQL-compatible architecture for future scalability

---

# DEVELOPMENT PHILOSOPHY

The project should prioritize:

- clean architecture,
- scalability,
- modularity,
- production-grade patterns,
- maintainability,
- low technical debt,
- API-first development.

Avoid:

- tightly coupled components,
- monolithic files,
- redundant code,
- unnecessary abstractions,
- premature optimization.

---

# TEAM STRUCTURE

## Member 1 — Authentication & Backend Infrastructure

Responsibilities:

- JWT authentication
- User registration/login
- Password hashing
- Security middleware
- Database initialization
- Dependency injection

---

## Member 2 — Blog & Data Management

Responsibilities:

- Post CRUD
- Database models
- Search/filter APIs
- Category system
- Pagination

---

## Member 3 — Frontend/UI

Responsibilities:

- React application
- Routing
- Layout system
- API integration
- Protected pages
- Responsive UI

---

## Member 4 — Engagement & Deployment

Responsibilities:

- Comments system
- Likes/bookmarks
- Admin dashboard
- Deployment
- Testing
- Documentation

---

# PROJECT MODULES

## Completed Modules

- [x] Authentication (register, login, JWT, protected routes)
- [x] Blog Management (CRUD, search, filter, sort, pagination, view counter)
- [x] Comments System (create, delete, ownership validation)
- [x] Likes System (toggle like, optimistic UI, like count)
- [x] User Profiles (view, edit own profile, public author pages)
- [x] Admin Dashboard (stats, user management, content moderation)
- [x] Categories System (8 default categories, auto-seeded)
- [x] Search & Filtering (by keyword, category, sort latest/popular)
- [x] Dark Mode (toggle, persisted in localStorage)
- [x] Frontend Foundation (React + Vite + TailwindCSS + Axios + AuthContext)

---

## In Progress Modules

- None

---

## Planned Modules (Not Yet Implemented)

### Secondary Modules

- Rich Text Editor (currently plain textarea)
- Bookmarking / Save for later
- Notifications
- Image upload (currently URL-based)

### Advanced Modules (Optional)

- AI Blog Summarization
- Recommendation Engine
- Analytics Dashboard
- Real-Time Updates (WebSocket)

---

# CURRENT ARCHITECTURE DECISIONS

## Backend Style

Architecture Pattern:

- Layered Modular Architecture

Structure:

- routes/
- services/
- schemas/
- models/
- auth/
- database/
- utils/

Reason:

- maintainability,
- testability,
- easier onboarding.

---

## API Design Style

RESTful API architecture.

Naming conventions:

- plural resources,
- predictable endpoints,
- version-ready structure.

Example:

- /api/posts
- /api/users
- /api/comments

---

## Authentication Strategy

Authentication Type:

- JWT Bearer Authentication

Token Flow:

1. User logs in
2. Backend validates credentials
3. JWT token generated
4. Frontend stores token
5. Protected requests include Bearer token

Security Requirements:

- hashed passwords,
- token expiration,
- protected routes,
- ownership validation,
- role-based checks (future).

---

# DATABASE DESIGN OVERVIEW

## Tables

### users

Stores registered users.

Fields:

- id
- username
- email
- hashed_password
- avatar
- bio
- created_at

---

### posts

Stores blog posts.

Fields:

- id
- title
- content
- created_at
- updated_at
- author_id
- category_id

---

### comments

Stores comments.

Fields:

- id
- content
- user_id
- post_id
- created_at

---

### likes

Stores post likes.

Fields:

- id
- user_id
- post_id

---

### categories

Stores blog categories.

Fields:

- id
- name
- slug

---

# FRONTEND STRUCTURE

## Planned Pages

Public:

- Home
- Login
- Register
- Blog Details

Protected:

- Dashboard
- Create Post
- Edit Post
- Profile

Admin:

- Admin Dashboard
- User Management

---

## Planned Components

Shared:

- Navbar
- Sidebar
- Footer
- ProtectedRoute
- BlogCard
- CommentSection
- LoadingSkeleton

---

# UI/UX DIRECTION

Theme Goals:

- modern,
- minimal,
- content-focused,
- clean typography,
- soft shadows,
- responsive design.

Design inspirations:

- Medium
- Hashnode
- Dev.to
- Notion-inspired spacing

---

# CODING STANDARDS

## Backend Standards

- type hints required,
- modular routes,
- service separation,
- reusable utilities,
- schema validation,
- no business logic in routes.

---

## Frontend Standards

- reusable components,
- consistent folder structure,
- avoid prop drilling,
- semantic naming,
- responsive-first styling.

---

# GIT WORKFLOW

## Main Branches

- main
- develop

## Feature Branches

- auth-feature
- blog-feature
- frontend-feature
- comments-feature
- admin-feature

---

# API STATUS TRACKER

All routes prefixed with `/api`.

## Authentication APIs

- [x] POST /api/auth/register
- [x] POST /api/auth/login
- [x] GET  /api/auth/me

---

## Blog APIs

- [x] GET    /api/posts  (supports ?search, ?category_id, ?sort_by, ?skip, ?limit)
- [x] GET    /api/posts/{id}  (increments view counter)
- [x] POST   /api/posts
- [x] PUT    /api/posts/{id}  (owner or admin only)
- [x] DELETE /api/posts/{id}  (owner or admin only)

---

## Comment APIs

- [x] GET    /api/posts/{id}/comments
- [x] POST   /api/comments
- [x] DELETE /api/comments/{id}

---

## Like APIs

- [x] POST /api/posts/{id}/like  (toggle — like or unlike)
- [x] GET  /api/posts/{id}/like-status

---

## User APIs

- [x] GET    /api/users/{id}
- [x] GET    /api/users/{id}/posts
- [x] PUT    /api/users/{id}  (own profile only)
- [x] DELETE /api/users/{id}  (own account or admin)

---

## Category APIs

- [x] GET /api/categories

---

## Admin APIs

- [x] GET    /api/admin/users
- [x] GET    /api/admin/stats
- [x] DELETE /api/admin/users/{id}
- [x] DELETE /api/admin/posts/{id}

---

# FRONTEND STATUS TRACKER

## Pages

- [x] Home  (hero, categories, search/sort, featured post, paginated grid)
- [x] Login
- [x] Register
- [x] Blog Detail  (reading layout 760px, likes, share, comments)
- [x] Dashboard  (stats cards, user posts grid)
- [x] Create Post  (title, excerpt, cover image, category, content)
- [x] Edit Post
- [x] Profile  (view/edit own, public author pages)
- [x] Admin Dashboard
- [x] User Management

## Components

- [x] Navbar  (sticky, glassmorphism, dark mode toggle, mobile drawer)
- [x] Footer
- [x] BlogCard  (cover image, category badge, read time, hover animation)
- [x] CommentSection  (fetch, post, delete, auth-aware)
- [x] LikeButton  (optimistic update, heart animation)
- [x] LoadingSkeleton  (card / post / profile variants)
- [x] ProtectedRoute + AdminRoute guards

---

# DEPLOYMENT PLAN

## Frontend

Preferred:

- Vercel

Fallback:

- Netlify

---

## Backend

Preferred:

- Render

Fallback:

- Railway

---

# TESTING STRATEGY

## Backend Testing

- pytest
- API endpoint testing
- auth testing
- validation testing

## Frontend Testing

- component rendering
- route protection
- API integration
- form validation

---

# KNOWN RISKS

- JWT expiration handling
- frontend/backend integration mismatch
- improper route protection
- inconsistent response schemas
- state management complexity

---

# HANDOFF INSTRUCTIONS

Whenever an agent or developer finishes work:

1. Update completed modules.
2. Update architecture changes.
3. Add new dependencies.
4. Document unfinished work.
5. Add blockers/issues.
6. Record database changes.
7. Update API tracker.
8. Update frontend tracker.

Never leave implementation state undocumented.

---

# DEPENDENCIES INTRODUCED

## Backend (requirements.txt)

- fastapi==0.111.0
- uvicorn[standard]==0.29.0
- sqlalchemy==2.0.30
- pydantic==2.7.1
- pydantic-settings==2.2.1
- python-jose[cryptography]==3.3.0
- passlib[bcrypt]==1.7.4
- bcrypt==5.0.0  ← used directly (passlib incompatibility fix)
- python-multipart==0.0.9
- alembic==1.13.1
- pytest==8.2.0
- httpx==0.27.0
- python-dotenv==1.0.1

## Frontend (package.json)

- react + react-dom
- vite
- react-router-dom
- axios
- tailwindcss@3 + postcss + autoprefixer
- framer-motion
- lucide-react
- react-hot-toast

---

# KNOWN BUGS / FIXES APPLIED

- passlib + bcrypt 5.0 incompatibility: `auth/hashing.py` uses `bcrypt` library directly instead of `passlib.CryptContext`.

---

# CURRENT PROJECT STATE

Status:
PHASE 1 COMPLETE — FULL IMPLEMENTATION

Last updated: 2026-05-24

What's done:

- Backend: all models, schemas, services, routes, auth, admin fully implemented
- Frontend: all pages, components, routing, dark mode, design system implemented
- Both servers verified running and all APIs tested and passing
- Database auto-creates tables on startup
- 8 categories auto-seeded on first run

Next steps:

- Add rich text editor (e.g., React Quill or TipTap)
- Add image upload support (currently URL-based)
- Write pytest test suite for backend
- Deploy: frontend → Vercel, backend → Render
- Migrate database to PostgreSQL for production

---

# IMPORTANT CONTEXT RULES

All future contributors and AI agents MUST:

- read this file first,
- preserve architecture consistency,
- avoid unnecessary rewrites,
- avoid repeated clarification questions,
- continue from latest documented state,
- prioritize project completion over excessive discussion,
- document all meaningful decisions.

This file is the single source of continuity for the project.
