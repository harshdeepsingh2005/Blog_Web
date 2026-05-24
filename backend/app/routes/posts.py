from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.post import PostCreate, PostResponse, PostUpdate
from backend.app.services import post_service

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("")
def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    sort_by: str = Query("latest", pattern="^(latest|popular)$"),
    db: Session = Depends(get_db),
):
    result = post_service.get_posts(db, skip=skip, limit=limit, search=search,
                                     category_id=category_id, sort_by=sort_by)
    posts = [PostResponse.model_validate(p) for p in result["posts"]]
    return {
        "success": True,
        "data": {"posts": posts, "total": result["total"], "skip": skip, "limit": limit},
    }


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    return post_service.get_post_by_id(post_id, db)


@router.post("", status_code=201)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = post_service.create_post(payload, current_user, db)
    return {"success": True, "message": "Post created", "data": PostResponse.model_validate(post)}


@router.put("/{post_id}")
def update_post(
    post_id: int,
    payload: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = post_service.update_post(post_id, payload, current_user, db)
    return {"success": True, "message": "Post updated", "data": PostResponse.model_validate(post)}


@router.delete("/{post_id}", status_code=200)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post_service.delete_post(post_id, current_user, db)
    return {"success": True, "message": "Post deleted"}
