from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from app import db, mail
from app.models import User, Contact, GlobalContact, SpamMarking
import random
import string

api_bp = Blueprint('api', __name__)

# Temporary storage for OTPs
otp_storage = {}

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

@api_bp.route('/otpsent', methods=['POST'])
def otp_sent():
    otp_storage.clear() 
    data = request.get_json()
    otp = generate_otp()
    otp_storage[data['email']] = otp  # Store OTP temporarily
    msg = Message('Your OTP Code', recipients=[data['email']])
    msg.body = f'Your OTP code is {otp}'
    mail.send(msg)
    return jsonify({'message': 'OTP sent to email'}), 200

@api_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    otp = data.get('otp')
    email = data.get('email')
    
    # Verify OTP
    if otp_storage.get(email) != otp:
        return jsonify({'message': 'Invalid OTP'}), 400

    # OTP is valid; register the user
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    new_user = User(
        name=data['name'],
        phone=data['phone'],
        email=email,
        password=hashed_password.decode('utf-8'),
        city=data.get('city'),
        country=data.get('country')
    )
    db.session.add(new_user)
    db.session.commit()
    
    # Clean up OTP storage
    del otp_storage[email]

    return jsonify({'message': 'User registered successfully'}), 201

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    otp = data.get('otp')

    if otp:
        # Verify OTP
        if otp_storage.get(email) == otp:
            user = User.query.filter_by(email=email).first()
            if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                token = create_access_token(identity=user.id)
                del otp_storage[email]  # Clean up OTP storage
                return jsonify({'token': token}), 200
            return jsonify({'message': 'Invalid credentials'}), 401
        return jsonify({'message': 'Invalid OTP'}), 400
    
    return jsonify({'message': 'OTP required for login'}), 400

@api_bp.route('/add_contact', methods=['POST'])
@jwt_required()
def add_contact():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Add contact to the user's contact list
    new_contact = Contact(name=data['name'], phone=data['phone'], user_id=user_id)
    db.session.add(new_contact)
    
    # Check if the contact is already in the global contact list
    global_contact = GlobalContact.query.filter_by(phone=data['phone']).first()
    
    if not global_contact:
        # Add to GlobalContact if not present
        global_contact = GlobalContact(phone=data['phone'], spam_likelihood=0)  # Set default spam likelihood
        db.session.add(global_contact)
    
    db.session.commit()
    
    return jsonify({'message': 'Contact added'}), 201

@api_bp.route('/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(user_id=user_id).all()
    return jsonify([{'name': c.name, 'phone': c.phone} for c in contacts]), 200

@api_bp.route('/search', methods=['GET'])
def search():
    phone = request.args.get('phone')
    
    # Validate that the query is a phone number
    if not phone or not phone.isdigit():
        return jsonify({'message': 'Invalid phone number'}), 400

    # Search for the user in the User table
    user = User.query.filter_by(phone=phone).first()

    if user:
        # Get spam details from GlobalContact
        global_contact = GlobalContact.query.filter_by(phone=phone).first()
        contact_details = {
            'name': user.name,
            'phone': user.phone,
            'email': user.email,
            'city': user.city,
            'country': user.country,
            'spam_likelihood': global_contact.spam_likelihood if global_contact else 'Not Available'
        }
        return jsonify(contact_details), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@api_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            return jsonify({
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'city': user.city,
                'country': user.country
            }), 200
        else:
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        print(f"Error fetching user details: {str(e)}")
        return jsonify({'message': 'An error occurred'}), 500
    
@api_bp.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Update user details
    user.name = data.get('name', user.name)
    user.phone = data.get('phone', user.phone)
    user.email = data.get('email', user.email)
    user.city = data.get('city', user.city)
    user.country = data.get('country', user.country)
    
    try:
        db.session.commit()
        return jsonify({'message': 'User profile updated successfully'}), 200
    except Exception as e:
        print(f"Error updating user details: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'An error occurred while updating profile'}), 500

@api_bp.route('/user/contacts', methods=['GET'])
@jwt_required()
def get_all_contacts():
    user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(user_id=user_id).all()
    contacts_data = []
    
    for contact in contacts:
        global_contact = GlobalContact.query.filter_by(phone=contact.phone).first()
        spam_status = global_contact.spam_likelihood if global_contact else "Not Checked"
        
        contacts_data.append({
            'id': contact.id,
            'name': contact.name,
            'phone': contact.phone,
            'spam_status': spam_status
        })
    
    return jsonify(contacts_data), 200

@api_bp.route('/contacts/mark_spam/<int:contact_id>', methods=['POST'])
@jwt_required()
def mark_contact_as_spam(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.get(contact_id)
    
    if not contact or contact.user_id != user_id:
        return jsonify({'message': 'Contact not found or not authorized'}), 404
    
    global_contact = GlobalContact.query.filter_by(phone=contact.phone).first()
    
    if not global_contact:
        global_contact = GlobalContact(phone=contact.phone, spam_likelihood=100)  # Set default spam likelihood
        db.session.add(global_contact)
    else:
        global_contact.spam_likelihood = 100  # Mark as spam
    
    db.session.commit()
    
    return jsonify({'message': 'Contact marked as spam'}), 200

@api_bp.route('/contacts/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.get(contact_id)
    
    if not contact or contact.user_id != user_id:
        return jsonify({'message': 'Contact not found or not authorized'}), 404
    
    db.session.delete(contact)
    db.session.commit()
    
    return jsonify({'message': 'Contact removed'}), 200

@api_bp.route('/contacts/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    contact = Contact.query.get(contact_id)
    
    if not contact or contact.user_id != user_id:
        return jsonify({'message': 'Contact not found or not authorized'}), 404
    
    contact.name = data.get('name', contact.name)
    contact.phone = data.get('phone', contact.phone)
    
    db.session.commit()
    
    return jsonify({'message': 'Contact updated successfully'}), 200
