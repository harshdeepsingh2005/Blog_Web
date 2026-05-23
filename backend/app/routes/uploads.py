from fastapi import APIRouter, UploadFile, File, Depends
from app.auth.dependencies import get_current_user
from app.services.upload_service import handle_upload
from app.config.settings import settings

router = APIRouter(prefix="/uploads", tags=["Uploads"])

@router.post("")
def upload_image(file: UploadFile = File(...), current_user = Depends(get_current_user)):
    url = handle_upload(file)
    # the server runs on 8000. Returning relative URL so the frontend can prefix it or the browser can resolve it if it's pointing to the API URL.
    # Actually, settings.API_URL or similar could be used. But returning just the path is fine if frontend prepends it, 
    # but the frontend api base is /api. The uploads folder is at root /uploads. So returning relative path /uploads/... is fine.
    # The frontend needs to point to the backend domain for these images.
    return {"success": True, "data": {"url": f"{settings.BASE_URL.rstrip('/')}{url}"}}
