def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "hashed_password" not in data

def test_register_duplicate_email(client, test_user):
    response = client.post("/api/auth/register", json={
        "username": "anotheruser",
        "email": test_user.email,
        "password": "password123"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_register_duplicate_username(client, test_user):
    response = client.post("/api/auth/register", json={
        "username": test_user.username,
        "email": "another@example.com",
        "password": "password123"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already taken"

def test_login_success(client, test_user):
    response = client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["email"] == test_user.email

def test_login_invalid_password(client, test_user):
    response = client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_login_unregistered_email(client):
    response = client.post("/api/auth/login", json={
        "email": "nobody@example.com",
        "password": "password123"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_get_me_success(client, user_token, test_user):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == test_user.email

def test_get_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authenticated"
