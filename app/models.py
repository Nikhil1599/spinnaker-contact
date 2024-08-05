from app import db

class User(db.Model):
    __tablename__ = 'user'  # Explicit table name
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    contacts = db.relationship('Contact', backref='owner', lazy=True)

class Contact(db.Model):
    __tablename__ = 'contact'  # Explicit table name
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class GlobalContact(db.Model):
    __tablename__ = 'global_contact'  # Explicit table name
    
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    spam_likelihood = db.Column(db.Integer, default=0)

class SpamMarking(db.Model):
    __tablename__ = 'spam_marking'  # Explicit table name
    
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), db.ForeignKey('global_contact.phone'), nullable=False)
    marked_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
