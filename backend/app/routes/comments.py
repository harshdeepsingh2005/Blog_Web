from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

<<<<<<< HEAD
from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.services import comment_service
=======
from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.comment import CommentCreate, CommentResponse
from backend.app.services import comment_service
>>>>>>> origin/main

router = APIRouter(tags=["Comments"])


@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return comment_service.get_post_comments(post_id, db)


@router.post("/comments", status_code=201)
def add_comment(
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = comment_service.create_comment(payload, current_user, db)
    return {"success": True, "message": "Comment added", "data": CommentResponse.model_validate(comment)}


@router.delete("/comments/{comment_id}", status_code=200)
def remove_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment_service.delete_comment(comment_id, current_user, db)
    return {"success": True, "message": "Comment deleted"}
