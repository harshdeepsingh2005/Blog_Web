from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.services import like_service

router = APIRouter(prefix="/posts", tags=["Likes"])


@router.post("/{post_id}/like")
def toggle_like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = like_service.toggle_like(post_id, current_user, db)
    return {"success": True, "data": result}


@router.get("/{post_id}/like-status")
def like_status(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = like_service.get_like_status(post_id, current_user.id, db)
    return {"success": True, "data": result}
