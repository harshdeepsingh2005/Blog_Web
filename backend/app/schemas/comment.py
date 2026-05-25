from datetime import datetime

from pydantic import BaseModel

<<<<<<< HEAD
from app.schemas.user import UserResponse
=======
from backend.app.schemas.user import UserResponse
>>>>>>> origin/main


class CommentCreate(BaseModel):
    content: str
    post_id: int


class CommentResponse(BaseModel):
    id: int
    content: str
    user_id: int
    post_id: int
    created_at: datetime
    user: UserResponse

    model_config = {"from_attributes": True}
