from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

<<<<<<< HEAD
from app.models.like import Like
from app.models.user import User
=======
from backend.app.models.like import Like
from backend.app.models.user import User
>>>>>>> origin/main


def toggle_like(post_id: int, current_user: User, db: Session) -> dict:
    """Toggle like on a post. Returns liked=True/False and new count."""
    existing = db.query(Like).filter(
        Like.post_id == post_id, Like.user_id == current_user.id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        liked = False
    else:
        like = Like(post_id=post_id, user_id=current_user.id)
        db.add(like)
        try:
            db.commit()
            
<<<<<<< HEAD
            from app.models.post import Post
            from app.models.notification import Notification
=======
            from backend.app.models.post import Post
            from backend.app.models.notification import Notification
>>>>>>> origin/main
            
            post = db.query(Post).filter(Post.id == post_id).first()
            if post and post.author_id != current_user.id:
                notif = Notification(
                    user_id=post.author_id,
                    type="like",
                    message=f"{current_user.username} liked your post",
                    post_id=post.id,
                    actor_id=current_user.id
                )
                db.add(notif)
                db.commit()
                
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already liked")
        liked = True

    count = db.query(Like).filter(Like.post_id == post_id).count()
    return {"liked": liked, "likes_count": count}


def get_like_status(post_id: int, user_id: int, db: Session) -> dict:
    """Check if user has liked a post."""
    liked = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user_id).first()
    count = db.query(Like).filter(Like.post_id == post_id).count()
    return {"liked": bool(liked), "likes_count": count}
