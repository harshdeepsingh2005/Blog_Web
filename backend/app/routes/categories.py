from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

<<<<<<< HEAD
from app.database.database import get_db
from app.schemas.category import CategoryResponse
from app.services import category_service
=======
from backend.app.database.database import get_db
from backend.app.schemas.category import CategoryResponse
from backend.app.services import category_service
>>>>>>> origin/main

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return category_service.get_all_categories(db)
