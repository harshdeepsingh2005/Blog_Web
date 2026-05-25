from datetime import datetime

from pydantic import BaseModel

from app.schemas.user import UserResponse


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
