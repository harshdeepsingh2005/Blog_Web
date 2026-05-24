import pytest
from app.models.category import Category
from app.models.post import Post

@pytest.fixture
def test_admin_post(db, test_user):
    cat = Category(name="Admin Cat", slug="admin-cat")
    db.add(cat)
    db.commit()
    
    post = Post(title="Admin Post", content="Content", author_id=test_user.id, category_id=cat.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def test_admin_get_users_success(client, admin_token):
    response = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_admin_get_users_unauthorized(client, user_token):
    response = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403

def test_admin_delete_post(client, admin_token, test_admin_post):
    response = client.delete(
        f"/api/admin/posts/{test_admin_post.id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200

def test_admin_delete_user(client, admin_token, test_user):
    response = client.delete(
        f"/api/admin/users/{test_user.id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
