import os
import sys
import datetime

# Add the 'backend' directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

<<<<<<< HEAD
from app.database.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.post import Post
from app.models.category import Category
from app.models.comment import Comment
from app.models.like import Like
from app.models.bookmark import Bookmark
from app.auth.hashing import hash_password
=======
from backend.app.database.database import SessionLocal, Base, engine
from backend.app.models.user import User
from backend.app.models.post import Post
from backend.app.models.category import Category
from backend.app.models.comment import Comment
from backend.app.models.like import Like
from backend.app.models.bookmark import Bookmark
from backend.app.auth.hashing import hash_password
>>>>>>> origin/main

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Clearing old data...")
    db.query(Bookmark).delete()
    db.query(Like).delete()
    db.query(Comment).delete()
    db.query(Post).delete()
    db.query(Category).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding Users...")
    users = [
        User(username="admin", email="admin@system.com", hashed_password=hash_password("password"), is_admin=1, bio="System Administrator", avatar="http://localhost:8000/uploads/admin_avatar.jpg"),
        User(username="swiss_designer", email="designer@system.com", hashed_password=hash_password("password"), is_admin=0, bio="Lead Designer at Objective Comm System.", avatar="http://localhost:8000/uploads/designer_avatar.jpg"),
        User(username="josef_m", email="muller@brockmann.com", hashed_password=hash_password("password"), is_admin=0, bio="Grid Systems Enthusiast.", avatar="http://localhost:8000/uploads/josef_avatar.jpg"),
        User(username="massimo", email="massimo@vignelli.com", hashed_password=hash_password("password"), is_admin=0, bio="I like it simple.", avatar="http://localhost:8000/uploads/massimo_avatar.jpg"),
        User(username="dieter_rams", email="dieter@braun.com", hashed_password=hash_password("password"), is_admin=0, bio="Less, but better.", avatar="http://localhost:8000/uploads/dieter_avatar.jpg"),
    ]
    db.add_all(users)
    db.commit()
    
    admin = db.query(User).filter_by(username="admin").first()
    designer = db.query(User).filter_by(username="swiss_designer").first()
    josef = db.query(User).filter_by(username="josef_m").first()
    massimo = db.query(User).filter_by(username="massimo").first()

    print("Seeding Categories...")
    categories = [
        Category(name="TYPOGRAPHY", slug="typography"),
        Category(name="GRID SYSTEMS", slug="grid-systems"),
        Category(name="MINIMALISM", slug="minimalism"),
        Category(name="MODERN WEB", slug="modern-web"),
        Category(name="USER INTERFACE", slug="user-interface")
    ]
    db.add_all(categories)
    db.commit()
    
    typography = db.query(Category).filter_by(slug="typography").first()
    grid = db.query(Category).filter_by(slug="grid-systems").first()
    minimalism = db.query(Category).filter_by(slug="minimalism").first()

    print("Seeding Posts...")
    posts = [
        Post(
            title="OBJECTIVE COMMUNICATION SYSTEM.",
            content="<p>Where great ideas find their voice. Discover thoughtful writing from passionate creators.</p><h2>The Principles of Objectivity</h2><p>In design, objectivity means removing the ego. It is about creating systems that communicate clearly, effectively, and without unnecessary ornamentation. The grid is law. Typography is the interface.</p><p>We rely on pure contrast—black, white, and red—to guide the eye.</p>",
            excerpt="WHERE GREAT IDEAS FIND THEIR VOICE. DISCOVER THOUGHTFUL WRITING.",
            cover_image="http://localhost:8000/uploads/post1_cover.jpg",
            author_id=admin.id,
            category_id=typography.id,
            views=1405
        ),
        Post(
            title="BRUTALISM IN MODERN WEB DESIGN",
            content="<p>Web brutalism is a reaction against the homogeneity of corporate web design.</p><p>It emphasizes raw, unpolished, and functional aesthetics. Thick borders. High contrast. Sharp corners.</p><blockquote>LESS, BUT BETTER.</blockquote><p>We are stripping away the soft shadows and glassmorphism. What remains is pure structure.</p>",
            excerpt="A REACTION AGAINST HOMOGENEITY. RAW, UNPOLISHED FUNCTIONAL AESTHETICS.",
            cover_image="http://localhost:8000/uploads/post2_cover.jpg",
            author_id=designer.id,
            category_id=minimalism.id,
            views=890
        ),
        Post(
            title="THE GRID AS LAW",
            content="<p>The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice.</p>",
            excerpt="THE GRID SYSTEM IS AN AID, NOT A GUARANTEE. IT PERMITS A NUMBER OF POSSIBLE USES.",
            cover_image="http://localhost:8000/uploads/post3_cover.jpg",
            author_id=josef.id,
            category_id=grid.id,
            views=2540
        ),
        Post(
            title="IF YOU CAN DESIGN ONE THING",
            content="<p>If you can design one thing, you can design everything.</p><p>This is the essence of systematic design thinking. A button is a composition of space, color, and typography. A building is exactly the same, only at a different scale.</p>",
            excerpt="IF YOU CAN DESIGN ONE THING, YOU CAN DESIGN EVERYTHING.",
            cover_image="http://localhost:8000/uploads/post4_cover.jpg",
            author_id=massimo.id,
            category_id=minimalism.id,
            views=1230
        )
    ]
    db.add_all(posts)
    db.commit()

    print("Seeding Comments & Likes...")
    # Add comments and likes to the first post
    post1 = db.query(Post).filter_by(title="OBJECTIVE COMMUNICATION SYSTEM.").first()
    post2 = db.query(Post).filter_by(title="BRUTALISM IN MODERN WEB DESIGN").first()

    comments = [
        Comment(content="THIS IS EXACTLY THE AESTHETIC I WAS LOOKING FOR. NO NONSENSE.", post_id=post1.id, user_id=designer.id),
        Comment(content="AGREED. THE GRID IS FLAWLESS.", post_id=post1.id, user_id=josef.id),
        Comment(content="EXCELLENT STRUCTURAL INTEGRITY.", post_id=post2.id, user_id=massimo.id)
    ]
    db.add_all(comments)
    
    likes = [
        Like(post_id=post1.id, user_id=designer.id),
        Like(post_id=post1.id, user_id=josef.id),
        Like(post_id=post1.id, user_id=massimo.id),
        Like(post_id=post2.id, user_id=admin.id),
    ]
    db.add_all(likes)
    db.commit()

    print("Updating post counts...")
    for p in db.query(Post).all():
        p.comments_count = db.query(Comment).filter_by(post_id=p.id).count()
        p.likes_count = db.query(Like).filter_by(post_id=p.id).count()
    db.commit()

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
