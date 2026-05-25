from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

<<<<<<< HEAD
from app.models.comment import Comment
from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate
=======
from backend.app.models.comment import Comment
from backend.app.models.like import Like
from backend.app.models.post import Post
from backend.app.models.user import User
from backend.app.schemas.post import PostCreate, PostUpdate
>>>>>>> origin/main


def get_posts(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    sort_by: str = "latest",
) -> dict:
    """Fetch paginated posts with optional search and filter."""
    query = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.category))
    )

    if search:
        query = query.filter(
            or_(
                Post.title.ilike(f"%{search}%"),
                Post.content.ilike(f"%{search}%"),
            )
        )

    if category_id:
        query = query.filter(Post.category_id == category_id)

    if sort_by == "popular":
<<<<<<< HEAD
        query = query.outerjoin(Like).group_by(Post.id).order_by(func.count(Like.id).desc())
=======
        likes_subq = (
            db.query(func.count(Like.id))
            .filter(Like.post_id == Post.id)
            .correlate(Post)
            .scalar_subquery()
        )
        query = query.order_by(likes_subq.desc(), Post.created_at.desc())
>>>>>>> origin/main
    else:
        query = query.order_by(Post.created_at.desc())

    total = query.count()
    posts = query.offset(skip).limit(limit).all()

    # Attach counts
    result = []
    for post in posts:
        likes_count = db.query(Like).filter(Like.post_id == post.id).count()
        comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
        post.likes_count = likes_count
        post.comments_count = comments_count
        result.append(post)

    return {"posts": result, "total": total}


def get_post_by_id(post_id: int, db: Session) -> Post:
    """Fetch single post by id. Increments view count."""
    post = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.category))
        .filter(Post.id == post_id)
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    post.views += 1
    db.commit()
    db.refresh(post)

    post.likes_count = db.query(Like).filter(Like.post_id == post.id).count()
    post.comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    return post


def create_post(payload: PostCreate, author: User, db: Session) -> Post:
    """Create a new blog post."""
    post = Post(
        title=payload.title,
        content=payload.content,
        excerpt=payload.excerpt,
        cover_image=payload.cover_image,
        category_id=payload.category_id,
        author_id=author.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return get_post_by_id(post.id, db)


def update_post(post_id: int, payload: PostUpdate, current_user: User, db: Session) -> Post:
    """Update post. Only owner or admin can update."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return get_post_by_id(post.id, db)


def delete_post(post_id: int, current_user: User, db: Session) -> None:
    """Delete post. Only owner or admin can delete."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.delete(post)
    db.commit()


def get_user_posts(user_id: int, db: Session) -> List[Post]:
    """Get all posts by a specific user."""
    posts = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.category))
        .filter(Post.author_id == user_id)
        .order_by(Post.created_at.desc())
        .all()
    )
    for post in posts:
        post.likes_count = db.query(Like).filter(Like.post_id == post.id).count()
        post.comments_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    return posts
