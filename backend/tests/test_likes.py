import pytest
from backend.app.models.category import Category
from backend.app.models.post import Post

@pytest.fixture
def test_post_like(db, test_user):
    cat = Category(name="Like Cat", slug="like-cat")
    db.add(cat)
    db.commit()
    
    post = Post(title="Like this post", content="Content", author_id=test_user.id, category_id=cat.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def test_toggle_like(client, user_token, test_post_like):
    # Like the post
    response = client.post(
        f"/api/posts/{test_post_like.id}/like",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["liked"] is True

    # Unlike the post
    response2 = client.post(
        f"/api/posts/{test_post_like.id}/like",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response2.status_code == 200
    assert response2.json()["data"]["liked"] is False
