import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploads"

def save_upload_file(upload_file: UploadFile, destination: str) -> None:
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()

def handle_upload(file: UploadFile) -> str:
    # Ensure directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else ""
    if not ext or ext.lower() not in ["png", "jpg", "jpeg", "gif", "webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images allowed.")
        
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    save_upload_file(file, file_path)
    
    # Return the URL path
    return f"/uploads/{unique_filename}"
