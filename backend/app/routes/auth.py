from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.auth import Token, UserLogin, UserRegister
from backend.app.schemas.user import UserResponse
from backend.app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    user = auth_service.register_user(payload, db)
    return user


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    result = auth_service.login_user(payload, db)
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "access_token": result["access_token"],
            "token_type": result["token_type"],
            "user": UserResponse.model_validate(result["user"]),
        },
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
