import os
import zipfile
import glob

member_files = {
    "member1": [
        "backend/alembic",
        "backend/alembic.ini",
        "backend/app/config/settings.py",
        "backend/requirements.txt",
        "backend/.env",
        "backend/tests"
    ],
    "member2": [
        "frontend/src/pages/CreatePost.jsx",
        "frontend/src/pages/EditPost.jsx",
        "frontend/src/components/RichTextEditor.jsx",
        "frontend/src/styles/editor.css",
        "backend/app/routes/uploads.py",
        "backend/app/services/upload_service.py",
        "backend/uploads",
        "frontend/src/components/ImageUploader.jsx",
        "frontend/src/pages/Profile.jsx"
    ],
    "member3": [
        "frontend/src/pages/BlogDetail.jsx",
        "frontend/src/index.css",
        "frontend/src/pages/Home.jsx",
        "frontend/src/components/LoadingSkeleton.jsx",
        "frontend/src/components/CommentSection.jsx",
        "frontend/src/components/LikeButton.jsx",
        "frontend/src/components/BlogCard.jsx",
        "frontend/src/App.jsx",
        "frontend/src/main.jsx",
        "frontend/src/index.html"
    ],
    "member4": [
        "backend/app/models/bookmark.py",
        "backend/app/schemas/bookmark.py",
        "backend/app/services/bookmark_service.py",
        "backend/app/routes/bookmarks.py",
        "frontend/src/components/BookmarkButton.jsx",
        "frontend/src/pages/Bookmarks.jsx",
        "backend/app/models/notification.py",
        "backend/app/services/notification_service.py",
        "backend/app/routes/notifications.py",
        "frontend/src/components/NotificationBell.jsx",
        "frontend/src/pages/Notifications.jsx",
        ".github/workflows/ci.yml",
        ".github"
    ]
}

def add_to_zip(zipf, path):
    if os.path.isfile(path):
        zipf.write(path, path)
    elif os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                # avoid zipping __pycache__ etc if we want, but let's just zip everything in the dir
                if '__pycache__' not in file_path:
                    zipf.write(file_path, file_path)

if __name__ == '__main__':
    for member, paths in member_files.items():
        zip_name = f"{member}.zip"
        print(f"Creating {zip_name}...")
        with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for p in paths:
                if os.path.exists(p):
                    add_to_zip(zipf, p)
                else:
                    # try resolving glob if needed, but we mostly used exact paths
                    matched = glob.glob(p)
                    for m in matched:
                        add_to_zip(zipf, m)
        print(f"Created {zip_name} successfully.")
