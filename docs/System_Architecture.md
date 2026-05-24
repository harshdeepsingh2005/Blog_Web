# System_Architecture.md

# Blogging Platform with Auth
# System Architecture Specification

> This document defines the complete technical architecture of the Blogging Platform project.
>
> It acts as the primary engineering reference for:
> - backend architecture,
> - frontend architecture,
> - API structure,
> - database design,
> - authentication flow,
> - deployment strategy,
> - scalability planning,
> - and module integration.
>
> All developers and AI agents MUST follow this architecture unless explicitly updated.

---

# HIGH-LEVEL SYSTEM OVERVIEW

The application follows a classic full-stack client-server architecture.

```text
React Frontend
      ↓
REST API Requests
      ↓
FastAPI Backend
      ↓
SQLAlchemy ORM
      ↓
SQLite Database
```

---

# CORE ARCHITECTURE PRINCIPLES

The system must prioritize:

- modularity,
- scalability,
- maintainability,
- clean separation of concerns,
- production-style organization,
- API-first design.

Avoid:
- tightly coupled systems,
- monolithic files,
- duplicated logic,
- business logic inside routes.

---

# SYSTEM COMPONENTS

# FRONTEND LAYER

## Technology
- React.js
- Vite
- React Router DOM
- Axios
- TailwindCSS

---

## Responsibilities

Frontend responsibilities include:
- rendering UI,
- route management,
- authentication state,
- API communication,
- protected route handling,
- form validation,
- user interaction.

---

# BACKEND LAYER

## Technology
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib/Bcrypt

---

## Responsibilities

Backend responsibilities:
- authentication,
- authorization,
- business logic,
- CRUD operations,
- validation,
- database communication,
- API response management.

---

# DATABASE LAYER

## Technology
- SQLite

Architecture must remain PostgreSQL-compatible.

---

# DATABASE RESPONSIBILITIES

The database manages:
- users,
- posts,
- comments,
- likes,
- categories,
- relationships,
- ownership tracking.

---

# PROJECT DIRECTORY STRUCTURE

# ROOT STRUCTURE

```bash
blogging-platform/
│
├── backend/
├── frontend/
├── docs/
├── README.md
├── .env
├── .gitignore
└── docker-compose.yml
```

---

# BACKEND STRUCTURE

```bash
backend/
│
├── app/
│   ├── main.py
│   ├── config/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   ├── services/
│   ├── auth/
│   ├── middleware/
│   ├── utils/
│   └── dependencies/
│
├── tests/
├── requirements.txt
└── alembic/
```

---

# FRONTEND STRUCTURE

```bash
frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── routes/
│   ├── assets/
│   ├── styles/
│   ├── utils/
│   └── App.jsx
│
├── public/
├── package.json
└── vite.config.js
```

---

# BACKEND ARCHITECTURE

# ARCHITECTURE PATTERN

Pattern:
Layered Modular Architecture

---

# BACKEND LAYERS

# 1. ROUTES LAYER

Purpose:
- define API endpoints,
- validate requests,
- return responses.

Routes should:
- remain lightweight,
- delegate logic to services.

---

## Example

```python
@router.post("/posts")
async def create_post():
    return post_service.create_post()
```

---

# 2. SERVICES LAYER

Purpose:
- business logic,
- processing,
- database coordination.

Services should contain:
- reusable logic,
- ownership validation,
- transformations,
- domain rules.

---

# 3. SCHEMAS LAYER

Purpose:
- request validation,
- response serialization.

Technology:
- Pydantic

---

# 4. MODELS LAYER

Purpose:
- database table definitions,
- relationships,
- ORM mapping.

Technology:
- SQLAlchemy

---

# 5. AUTH LAYER

Purpose:
- JWT generation,
- token validation,
- password hashing,
- current-user dependencies.

---

# API DESIGN

# API BASE PREFIX

```text
/api
```

---

# AUTH ROUTES

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

# USER ROUTES

```http
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

---

# POST ROUTES

```http
GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
```

---

# COMMENT ROUTES

```http
POST   /api/comments
DELETE /api/comments/{id}
GET    /api/posts/{id}/comments
```

---

# LIKE ROUTES

```http
POST   /api/posts/{id}/like
DELETE /api/posts/{id}/like
```

---

# CATEGORY ROUTES

```http
GET /api/categories
```

---

# ADMIN ROUTES

```http
GET    /api/admin/users
DELETE /api/admin/posts/{id}
DELETE /api/admin/users/{id}
```

---

# API RESPONSE STRUCTURE

# SUCCESS RESPONSE

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# ERROR RESPONSE

```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

---

# AUTHENTICATION ARCHITECTURE

# AUTH FLOW

```text
User Login
    ↓
Credentials Validated
    ↓
JWT Generated
    ↓
Frontend Stores Token
    ↓
Protected Requests Use Bearer Token
```

---

# JWT REQUIREMENTS

Mandatory:
- expiration time,
- secure secret key,
- Bearer token support,
- protected dependencies.

---

# PASSWORD SECURITY

Passwords must:
- be hashed using bcrypt,
- never be stored in plaintext.

---

# AUTHORIZATION RULES

Users may:
- edit only their own posts,
- delete only their own comments.

Admins may:
- override ownership restrictions.

---

# DATABASE ARCHITECTURE

# ENTITY RELATIONSHIPS

```text
User
 ├── Posts
 ├── Comments
 └── Likes

Post
 ├── Author
 ├── Comments
 ├── Likes
 └── Category
```

---

# DATABASE TABLES

# USERS TABLE

```text
id
username
email
hashed_password
bio
avatar
created_at
```

---

# POSTS TABLE

```text
id
title
content
author_id
category_id
created_at
updated_at
```

---

# COMMENTS TABLE

```text
id
content
user_id
post_id
created_at
```

---

# LIKES TABLE

```text
id
user_id
post_id
```

---

# CATEGORIES TABLE

```text
id
name
slug
```

---

# FRONTEND ARCHITECTURE

# FRONTEND PRINCIPLES

Frontend should:
- remain component-driven,
- use reusable UI blocks,
- separate concerns properly,
- centralize API communication.

---

# PAGE STRUCTURE

# PUBLIC PAGES

```text
/
 /login
 /register
 /posts/:id
```

---

# PROTECTED PAGES

```text
/dashboard
/create-post
/edit-post/:id
/profile
```

---

# ADMIN PAGES

```text
/admin
/admin/users
```

---

# COMPONENT STRUCTURE

# SHARED COMPONENTS

```text
Navbar
Footer
Sidebar
BlogCard
CommentSection
ProtectedRoute
```

---

# STATE MANAGEMENT

Initial recommendation:
- Context API

Optional scaling:
- Zustand
- Redux Toolkit

---

# API COMMUNICATION

## HTTP CLIENT

Preferred:
- Axios

Centralized inside:
```bash
services/api.js
```

---

# REQUEST FLOW

```text
React Component
      ↓
Axios Service
      ↓
FastAPI Endpoint
      ↓
Service Layer
      ↓
Database
```

---

# ERROR HANDLING

# BACKEND ERROR HANDLING

Use:
- HTTPException,
- global exception handlers,
- validation responses.

---

# FRONTEND ERROR HANDLING

Show:
- toast notifications,
- inline form errors,
- fallback UI.

Never:
- fail silently.

---

# SECURITY ARCHITECTURE

Mandatory protections:
- JWT authentication,
- protected routes,
- ownership validation,
- input validation,
- environment variable secrets.

---

# ENVIRONMENT VARIABLES

# BACKEND

```env
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
DATABASE_URL=
```

---

# FRONTEND

```env
VITE_API_URL=
```

---

# DEPLOYMENT ARCHITECTURE

# FRONTEND DEPLOYMENT

Preferred:
- Vercel

---

# BACKEND DEPLOYMENT

Preferred:
- Render

---

# DATABASE DEPLOYMENT

Development:
- SQLite

Production Recommendation:
- PostgreSQL

---

# CI/CD STRATEGY

Future support:
- GitHub Actions
- automated testing
- lint checks
- deployment pipelines

---

# TESTING ARCHITECTURE

# BACKEND TESTING

Tools:
- pytest
- FastAPI TestClient

Tests:
- authentication,
- CRUD operations,
- permissions,
- validation.

---

# FRONTEND TESTING

Tools:
- React Testing Library
- Vitest

Tests:
- components,
- protected routes,
- forms,
- API interactions.

---

# SCALABILITY STRATEGY

Future scalability goals:
- PostgreSQL migration,
- Redis caching,
- websocket notifications,
- cloud storage,
- CDN support,
- microservices migration if necessary.

---

# FUTURE ARCHITECTURE EXPANSIONS

Potential additions:
- AI services,
- recommendation engine,
- analytics,
- notifications,
- collaborative editing,
- markdown rendering,
- image upload system.

---

# ENGINEERING STANDARDS

Mandatory:
- modular files,
- reusable services,
- consistent naming,
- RESTful APIs,
- typed validation,
- clean imports.

Avoid:
- giant components,
- duplicated logic,
- inline business logic,
- inconsistent response structures.

---

# FINAL ARCHITECTURE DIRECTIVE

This project should resemble a production-oriented full-stack application.

Every implementation decision should optimize for:
- maintainability,
- scalability,
- readability,
- security,
- and long-term extensibility.

The architecture should support future growth without major rewrites.
