from typing import List

from sqlalchemy.orm import Session

from app.models.category import Category


def get_all_categories(db: Session) -> List[Category]:
    return db.query(Category).order_by(Category.name).all()


def seed_categories(db: Session) -> None:
    """Seed default categories if none exist."""
    if db.query(Category).count() > 0:
        return
    defaults = [
        {"name": "Technology", "slug": "technology"},
        {"name": "AI", "slug": "ai"},
        {"name": "Programming", "slug": "programming"},
        {"name": "Lifestyle", "slug": "lifestyle"},
        {"name": "Education", "slug": "education"},
        {"name": "Science", "slug": "science"},
        {"name": "Design", "slug": "design"},
        {"name": "Business", "slug": "business"},
    ]
    for cat in defaults:
        db.add(Category(**cat))
    db.commit()
