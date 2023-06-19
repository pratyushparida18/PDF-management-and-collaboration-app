import base64
import io
import bcrypt
from fastapi import File, HTTPException, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from datetime import datetime, timedelta
from pymongo import MongoClient
from jose import jwt
import os
from gridfs import GridFS
from bson.objectid import ObjectId
import secrets
from urllib.parse import urlparse, parse_qs



# from server.main import SECRET_KEY, ALGORITHM, MONGO_COLLECTION_NAME, ACCESS_TOKEN_EXPIRE_MINUTES, get_database

# MongoDB configuration
# MONGO_CONNECTION_STRING = 'mongodb://localhost:27017'  # Replace with your MongoDB connection string
MONGO_CONNECTION_STRING = 'mongodb+srv://pratyushparida18:password%4018@cluster0.gewdlyg.mongodb.net/'
MONGO_DATABASE_NAME = 'spotdraft'
MONGO_COLLECTION_NAME = 'users'


# JWT configuration
SECRET_KEY = 'spotdraft'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_database():
    client = MongoClient(MONGO_CONNECTION_STRING)
    return client[MONGO_DATABASE_NAME]

# Get the users_collection reference from the MongoDB connection
database = get_database()
fs = GridFS(database)
users_collection = database[MONGO_COLLECTION_NAME]


def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(minutes=expires_delta)})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token



# Signup controller
def signup(email: str, password: str):
    # Check if email already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Save user to database
    user_data = {"email": email, "password": hashed_password.decode('utf-8')}
    users_collection.insert_one(user_data)

    # Generate access token
    access_token = create_access_token({"email": email}, ACCESS_TOKEN_EXPIRE_MINUTES)

    return {"access_token": access_token, "token_type": "bearer"}



def login(email: str, password: str):
    # Find user by email
    existing_user = users_collection.find_one({"email": email})
    if not existing_user or not bcrypt.checkpw(password.encode('utf-8'), existing_user["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Generate access token
    access_token = create_access_token({"email": email}, ACCESS_TOKEN_EXPIRE_MINUTES)

    return {"access_token": access_token, "token_type": "bearer"}



async def reset_password(email: str, password: str):
    # Find user by email
    existing_user = users_collection.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Update user's password in the database
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_password.decode('utf-8')}})

    return {"message": "Password reset successful"}


