from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.auth.hashing import hash_password, verify_password
from backend.app.auth.jwt import create_access_token
from backend.app.models.user import User
from backend.app.schemas.auth import UserLogin, UserRegister


def register_user(payload: UserRegister, db: Session) -> User:
    """Register a new user. Raises 400 if email/username taken."""
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )

    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(payload: UserLogin, db: Session) -> dict:
    """Authenticate credentials and return a JWT token dict."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}
