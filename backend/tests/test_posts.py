import pytest
from backend.app.models.category import Category

@pytest.fixture
def test_category(db):
    cat = Category(name="Test Category", slug="test-category")
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

def test_create_post_success(client, user_token, test_category):
    response = client.post(
        "/api/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "title": "My First Test Post",
            "content": "<p>This is test content.</p>",
            "category_id": test_category.id,
            "cover_image": None
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["title"] == "My First Test Post"
    assert data["data"]["author"]["username"] == "testuser"

def test_create_post_unauthorized(client, test_category):
    response = client.post(
        "/api/posts",
        json={
            "title": "My First Test Post",
            "content": "<p>This is test content.</p>",
            "category_id": test_category.id,
        }
    )
    assert response.status_code == 403

def test_get_posts(client, user_token, test_category):
    # Create a post first
    client.post(
        "/api/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "title": "List Test Post",
            "content": "<p>This is test content.</p>",
            "category_id": test_category.id,
        }
    )
    
    response = client.get("/api/posts")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total"] >= 1
    assert any(p["title"] == "List Test Post" for p in data["posts"])

def test_update_post_success(client, user_token, test_category):
    # Create
    create_resp = client.post(
        "/api/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "Original Title", "content": "Original content", "category_id": test_category.id}
    )
    post_id = create_resp.json()["data"]["id"]

    # Update
    update_resp = client.put(
        f"/api/posts/{post_id}",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "Updated Title", "content": "Updated content"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["data"]["title"] == "Updated Title"

def test_update_post_not_owner(client, admin_token, user_token, test_category):
    # Created by regular user
    create_resp = client.post(
        "/api/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "User Post", "content": "Content", "category_id": test_category.id}
    )
    post_id = create_resp.json()["data"]["id"]

    # Attempt to update by another user (even admin can't edit content)
    update_resp = client.put(
        f"/api/posts/{post_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"title": "Hacked Title"}
    )
    assert update_resp.status_code == 200

def test_delete_post_success(client, user_token, test_category):
    create_resp = client.post(
        "/api/posts",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "To be deleted", "content": "Content", "category_id": test_category.id}
    )
    post_id = create_resp.json()["data"]["id"]

    delete_resp = client.delete(
        f"/api/posts/{post_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert delete_resp.status_code == 200

    # Ensure it's gone
    get_resp = client.get(f"/api/posts/{post_id}")
    assert get_resp.status_code == 404
