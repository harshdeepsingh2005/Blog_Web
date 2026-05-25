# team_tasks.md

# Team Task Division
# Blogging Platform with Auth — Phase 2 Work Distribution

> This document divides all remaining work across 4 team members.
>
> It aligns with the team structure defined in `context.md`.
>
> The core platform (Phase 1) is complete. This document covers everything needed to reach **production-ready** status.

---

# PROJECT STATUS SNAPSHOT

| Layer | Status |
|-------|--------|
| Backend API | ✅ Complete |
| Frontend Pages | ✅ Complete |
| Auth System | ✅ Complete |
| Dark Mode | ✅ Complete |
| Categories + Search | ✅ Complete |
| Tests | ❌ Not started |
| Rich Text Editor | ❌ Not started |
| Image Upload | ❌ Not started |
| Alembic Migrations | ❌ Not started |
| PostgreSQL Support | ❌ Not started |
| Deployment | ❌ Not started |
| Bookmarks | ❌ Not started |
| Notifications | ❌ Not started |

---

# MEMBER 1 — Authentication & Backend Infrastructure

**Focus**: Security hardening, migrations, database upgrade, backend testing

---

## Tasks

### 1. Alembic Migration Setup

Set up Alembic for database schema versioning.

Files to work on:
```
backend/alembic/
backend/alembic.ini
```

Steps:
- Initialize Alembic if not already done: `alembic init alembic`
- Configure `alembic/env.py` to import `Base` and `DATABASE_URL` from app settings
- Generate initial migration: `alembic revision --autogenerate -m "initial"`
- Apply: `alembic upgrade head`

---

### 2. PostgreSQL Migration Support

Make the backend production-ready with PostgreSQL.

Files to work on:
```
backend/app/config/settings.py
backend/requirements.txt
backend/.env
```

Steps:
- Add `psycopg2-binary` to `requirements.txt`
- Update `DATABASE_URL` in `.env` to support both SQLite (dev) and PostgreSQL (prod)
- Remove `connect_args={"check_same_thread": False}` when PostgreSQL is used
- Test full stack with PostgreSQL locally

---

### 3. Backend Test Suite

Write pytest tests for all critical flows.

Files to create:
```
backend/tests/
  conftest.py         ← test DB setup, test client
  test_auth.py        ← register, login, invalid creds, token expiry
  test_posts.py       ← CRUD, ownership, search
  test_comments.py    ← create, delete, ownership
  test_likes.py       ← toggle, duplicate check
  test_admin.py       ← admin-only route protection
```

Coverage requirements:
- Register with duplicate email/username → 400
- Login with wrong password → 401
- Access protected route without token → 401/403
- Edit another user's post → 403
- Admin delete any post → 200

---

### 4. Token Refresh (Optional)

Implement refresh token flow if needed before deployment.

---

## Branch

```
git checkout -b auth-infra-phase2
```

---

# MEMBER 2 — Blog & Data Management

**Focus**: Rich text editor, image upload, advanced post features

---

## Tasks

### 1. Rich Text Editor Integration

Replace the plain textarea in CreatePost and EditPost with **TipTap**.

Install:
```bash
cd frontend
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```

Files to modify:
```
frontend/src/pages/CreatePost.jsx
frontend/src/pages/EditPost.jsx
```

Files to create:
```
frontend/src/components/RichTextEditor.jsx
frontend/src/styles/editor.css   ← TipTap prose styling
```

Requirements:
- Bold, italic, headers, lists, blockquote, code block
- Link insertion
- Image embedding via URL
- Word count display
- Placeholder text

Backend change:
- Content is already stored as `Text` — no model change needed
- Render HTML on `BlogDetail.jsx` (replace `dangerouslySetInnerHTML` with sanitized render)

---

### 2. Image Upload (Cover Images)

Replace URL-based cover images with actual file upload.

Backend files to create:
```
backend/app/routes/uploads.py
backend/app/services/upload_service.py
backend/uploads/             ← serve as static
```

Steps:
- Add `POST /api/uploads` endpoint accepting `multipart/form-data`
- Save to `backend/uploads/` with unique filename (UUID)
- Serve via FastAPI `StaticFiles`
- Return public URL to frontend

Frontend files to modify:
```
frontend/src/components/ImageUploader.jsx   ← new component
frontend/src/pages/CreatePost.jsx
frontend/src/pages/EditPost.jsx
frontend/src/pages/Profile.jsx              ← avatar upload
```

---

### 3. Post Tags (Optional)

Add a `tags` field to posts for finer filtering.

Backend:
- Add `tags` column (comma-separated string or new `PostTag` model)
- Expose in schemas and routes

Frontend:
- Tag input on Create/Edit
- Tag filter on Home

---

## Branch

```
git checkout -b blog-features-phase2
```

---

# MEMBER 3 — Frontend / UI Polish

**Focus**: UX improvements, responsiveness, animations, profile enhancements

---

## Tasks

### 1. Reading Experience Polish

Improve the blog reading page to feel like Medium.

File:
```
frontend/src/pages/BlogDetail.jsx
frontend/src/index.css   ← prose-editorial styles
```

Improvements:
- Render rich HTML content (from TipTap) safely using `DOMPurify`
  ```bash
  npm install dompurify
  ```
- Add reading progress bar at top of page
- Add sticky author card in sidebar on desktop
- Add "More from this author" section at bottom
- Smooth scroll to comments on click

---

### 2. Home Page Enhancement

File:
```
frontend/src/pages/Home.jsx
```

Improvements:
- Add "Trending" section (top 3 most liked posts)
- Add "Recommended creators" strip (top authors by post count)
- Add category browse grid with icons and post counts
- Improve search UX — debounce search input instead of Enter-only

---

### 3. Toast & Error States

Ensure all error/success flows give clear feedback.

Files:
```
frontend/src/pages/*.jsx
frontend/src/components/*.jsx
```

Requirements:
- Every API error shows a user-friendly toast
- Form validation errors shown inline (not just toasts)
- Empty states for all pages (no posts, no comments, user not found)
- 404 page with styled layout

---

### 4. Loading & Skeleton Improvements

File:
```
frontend/src/components/LoadingSkeleton.jsx
```

Add:
- Skeleton for admin table rows
- Skeleton for profile header
- Page-level loading spinner for route transitions

---

### 5. Mobile Responsiveness Audit

Go through every page on a 375px viewport and fix:
- Navbar mobile drawer polish
- Card grid stacking
- Form layout on small screens
- BlogDetail reading margins on mobile

---

## Branch

```
git checkout -b frontend-polish-phase2
```

---

# MEMBER 4 — Engagement Features & Deployment

**Focus**: Bookmarks, notifications, deployment pipeline

---

## Tasks

### 1. Bookmarks System

Allow users to save posts.

Backend files to create:
```
backend/app/models/bookmark.py        ← user_id, post_id, unique constraint
backend/app/schemas/bookmark.py
backend/app/services/bookmark_service.py
backend/app/routes/bookmarks.py       ← POST/DELETE /api/posts/{id}/bookmark
                                         GET /api/users/{id}/bookmarks
```

Frontend files to create:
```
frontend/src/components/BookmarkButton.jsx
frontend/src/pages/Bookmarks.jsx
```

Route to add:
```
/bookmarks   ← protected page showing saved posts
```

---

### 2. Simple Notifications

Notify users when someone comments on or likes their post.

Backend files to create:
```
backend/app/models/notification.py    ← type, from_user_id, to_user_id, post_id, read, created_at
backend/app/services/notification_service.py
backend/app/routes/notifications.py   ← GET /api/notifications
                                         PUT /api/notifications/{id}/read
```

Trigger notifications from:
- `comment_service.create_comment` → notify post author
- `like_service.toggle_like` → notify post author on like

Frontend files to create:
```
frontend/src/components/NotificationBell.jsx   ← in Navbar
frontend/src/pages/Notifications.jsx
```

---

### 3. Deployment — Frontend (Vercel)

Steps:
1. Push `frontend/` code to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

---

### 4. Deployment — Backend (Render)

Steps:
1. Create new Web Service on [render.com](https://render.com)
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables from `.env`:
   - `SECRET_KEY`
   - `ALGORITHM`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`
   - `DATABASE_URL` (PostgreSQL connection string from Render DB)
5. Add Render PostgreSQL database and link

---

### 5. GitHub Actions CI (Optional)

File to create:
```
.github/workflows/ci.yml
```

Pipeline:
- On pull request to `main` or `develop`:
  - Install backend deps
  - Run `pytest`
  - Install frontend deps
  - Run `npm run build`

---

## Branch

```
git checkout -b engagement-deployment-phase2
```

---

# SHARED RESPONSIBILITIES

All 4 members must:

- Follow branch naming from `context.md`
- Write conventional commit messages (`feat:`, `fix:`, `refactor:`)
- Update `context.md` when their module is complete
- Never commit directly to `main`
- Open PRs to `develop` branch

---

# INTEGRATION CHECKPOINTS

| Checkpoint | Who | When |
|------------|-----|-------|
| Backend tests passing | Member 1 | Before any deployment |
| Rich text content rendering correctly | Member 2 + 3 | After editor + BlogDetail update |
| Image upload URL returned correctly | Member 2 | Before Member 3 integrates uploader UI |
| Backend on Render live | Member 4 | Before frontend production deploy |
| All env vars set on Vercel | Member 4 | Final deployment step |

---

# PRIORITY ORDER

If bandwidth is limited, deliver in this sequence:

1. **Tests** (Member 1) — validates everything already built
2. **Rich text editor** (Member 2) — core product experience
3. **Deployment** (Member 4) — makes the project publicly accessible
4. **UI polish** (Member 3) — ongoing, can ship incrementally
5. **Bookmarks + Notifications** (Member 4) — nice-to-have features
