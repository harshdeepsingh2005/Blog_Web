from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

<<<<<<< HEAD
from app.config.settings import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
=======
from backend.app.config.settings import settings

# SQLAlchemy 1.4+ removed support for the 'postgres://' scheme
# Render and Heroku still sometimes inject 'postgres://', so we must normalize it
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url,
>>>>>>> origin/main
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that provides a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
