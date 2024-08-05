# run_db_init.py
from app import create_app, db

app = create_app()

with app.app_context():
    app.app_context().push()
    db.create_all()
