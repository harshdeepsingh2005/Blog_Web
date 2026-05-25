from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

<<<<<<< HEAD
from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.post import PostListResponse
from app.schemas.user import UserResponse, UserUpdate
from app.services import post_service, user_service
=======
from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.post import PostListResponse
from backend.app.schemas.user import UserResponse, UserUpdate
from backend.app.services import post_service, user_service
>>>>>>> origin/main

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return user_service.get_user_by_id(user_id, db)


@router.get("/{user_id}/posts")
def get_user_posts(user_id: int, db: Session = Depends(get_db)):
    posts = post_service.get_user_posts(user_id, db)
    return {
        "success": True,
        "data": [PostListResponse.model_validate(p) for p in posts],
    }


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return user_service.update_user(user_id, payload, current_user, db)


@router.delete("/{user_id}", status_code=200)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_service.delete_user(user_id, current_user, db)
    return {"success": True, "message": "User deleted"}
