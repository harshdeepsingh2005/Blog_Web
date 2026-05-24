from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from backend.app.models.comment import Comment
from backend.app.models.user import User
from backend.app.schemas.comment import CommentCreate


def get_post_comments(post_id: int, db: Session) -> List[Comment]:
    """Fetch all comments for a post."""
    return (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )


def create_comment(payload: CommentCreate, current_user: User, db: Session) -> Comment:
    """Add a comment to a post."""
    comment = Comment(
        content=payload.content,
        post_id=payload.post_id,
        user_id=current_user.id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    from backend.app.models.post import Post
    from backend.app.models.notification import Notification
    
    post = db.query(Post).filter(Post.id == payload.post_id).first()
    if post and post.author_id != current_user.id:
        notif = Notification(
            user_id=post.author_id,
            type="comment",
            message=f"{current_user.username} commented on your post",
            post_id=post.id,
            actor_id=current_user.id
        )
        db.add(notif)
        db.commit()

    return db.query(Comment).options(joinedload(Comment.user)).filter(Comment.id == comment.id).first()


def delete_comment(comment_id: int, current_user: User, db: Session) -> None:
    """Delete comment. Only owner or admin."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(comment)
    db.commit()
