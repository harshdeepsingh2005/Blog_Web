from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.user import UserResponse
from app.services import post_service, user_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.delete("/users/{user_id}", status_code=200)
def remove_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user_service.delete_user(user_id, current_admin, db)
    return {"success": True, "message": "User removed"}


@router.delete("/posts/{post_id}", status_code=200)
def remove_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    post_service.delete_post(post_id, current_admin, db)
    return {"success": True, "message": "Post removed"}


@router.get("/stats")
def platform_stats(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return {
        "success": True,
        "data": {
            "total_users": db.query(User).count(),
            "total_posts": db.query(Post).count(),
            "total_comments": db.query(Comment).count(),
        },
    }
