import os
from datetime import timedelta
import string
import random

class Config:
    # Secret key for session management and security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_default_secret_key')

    # SQLAlchemy database URI
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 
                                             'mysql+pymysql://root:admin@localhost:3306/contact')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Email server settings
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))  # Use the appropriate port (e.g., 587 for TLS, 465 for SSL)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'spinnaker.contact@gmail.com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'qmwy lqty nhpa qsvo')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'  # Convert string to boolean
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'false').lower() == 'true'  # Convert string to boolean
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'spinnaker.contact@gmail.com')
    
    secret = 'vdfieuhioerghriojeiorj23oi4y298rhfrwe89ryosbfisuhvfeiugheiuvhbfn'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', secret)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
