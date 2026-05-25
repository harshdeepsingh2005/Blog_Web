import os
import requests

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

images = {
    "admin_avatar.jpg": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    "designer_avatar.jpg": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    "josef_avatar.jpg": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    "massimo_avatar.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "dieter_avatar.jpg": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "post1_cover.jpg": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    "post2_cover.jpg": "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
    "post3_cover.jpg": "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    "post4_cover.jpg": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
}

def download_images():
    print(f"Downloading {len(images)} images to {UPLOAD_DIR}...")
    for filename, url in images.items():
        filepath = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(filepath):
            try:
                print(f"Downloading {filename}...")
                response = requests.get(url, stream=True)
                response.raise_for_status()
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
            except Exception as e:
                print(f"Failed to download {filename}: {e}")
        else:
            print(f"Skipping {filename}, already exists.")
    print("Done downloading images.")

if __name__ == "__main__":
    download_images()
