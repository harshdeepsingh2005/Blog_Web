from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config.settings import settings
from backend.app.database.database import Base, SessionLocal, engine
from backend.app.models import *  # noqa: F401,F403 — ensure all models registered before create_all
from backend.app.routes import admin, auth, categories, comments, likes, posts, users, uploads, bookmarks, notifications
from backend.app.services.category_service import seed_categories

# ── Create tables ──────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Seed default data ──────────────────────────────────────────────────────────
_db = SessionLocal()
try:
    seed_categories(_db)
finally:
    _db.close()

# ── FastAPI application ────────────────────────────────────────────────────────
app = FastAPI(
    title="Blogging Platform API",
    description="Production-style REST API for a blogging platform with JWT auth.",
    version="1.0.0",
)

# ── CORS middleware ────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ───────────────────────────────────────────────────────────
API_PREFIX = "/api"
from fastapi.staticfiles import StaticFiles

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(posts.router, prefix=API_PREFIX)
app.include_router(comments.router, prefix=API_PREFIX)
app.include_router(likes.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(categories.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)
app.include_router(uploads.router, prefix=API_PREFIX)
app.include_router(bookmarks.router, prefix=API_PREFIX)
app.include_router(notifications.router, prefix=API_PREFIX)

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Blogging Platform API is running"}
