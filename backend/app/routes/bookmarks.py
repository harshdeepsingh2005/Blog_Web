from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
<<<<<<< HEAD
from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.bookmark import Bookmark
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostResponse
=======
from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.bookmark import Bookmark
from backend.app.models.post import Post
from backend.app.models.user import User
from backend.app.schemas.post import PostResponse
>>>>>>> origin/main

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])

@router.get("", response_model=dict)
def get_bookmarks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bookmarks = db.query(Bookmark).filter(Bookmark.user_id == current_user.id).order_by(Bookmark.created_at.desc()).all()
    posts = [PostResponse.model_validate(b.post) for b in bookmarks]
    return {"success": True, "data": posts}

@router.post("/{post_id}", response_model=dict)
def toggle_bookmark(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    existing = db.query(Bookmark).filter(Bookmark.user_id == current_user.id, Bookmark.post_id == post_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"success": True, "data": {"bookmarked": False}}
    else:
        new_bookmark = Bookmark(user_id=current_user.id, post_id=post_id)
        db.add(new_bookmark)
        db.commit()
        return {"success": True, "data": {"bookmarked": True}}

@router.get("/{post_id}/status", response_model=dict)
def get_bookmark_status(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Bookmark).filter(Bookmark.user_id == current_user.id, Bookmark.post_id == post_id).first()
    return {"success": True, "data": {"bookmarked": existing is not None}}
