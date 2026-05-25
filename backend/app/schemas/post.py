from datetime import datetime
from typing import Optional

from pydantic import BaseModel

<<<<<<< HEAD
from app.schemas.user import UserResponse
=======
from backend.app.schemas.user import UserResponse
>>>>>>> origin/main


class CategoryInfo(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {"from_attributes": True}


class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category_id: Optional[int] = None


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category_id: Optional[int] = None


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    author_id: int
    category_id: Optional[int] = None
    views: int = 0
    created_at: datetime
    updated_at: datetime
    author: UserResponse
    category: Optional[CategoryInfo] = None
    likes_count: int = 0
    comments_count: int = 0

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    id: int
    title: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    author_id: int
    views: int = 0
    created_at: datetime
    author: UserResponse
    category: Optional[CategoryInfo] = None
    likes_count: int = 0
    comments_count: int = 0

    model_config = {"from_attributes": True}
