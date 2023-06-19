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

# MongoDB configuration
# MONGO_CONNECTION_STRING = 'mongodb://localhost:27017'  
MONGO_CONNECTION_STRING = 'mongodb+srv://pratyushparida18:password%4018@cluster0.gewdlyg.mongodb.net/'
MONGO_DATABASE_NAME = 'spotdraft'
MONGO_COLLECTION_NAME = 'users'

def get_database():
    client = MongoClient(MONGO_CONNECTION_STRING)
    return client[MONGO_DATABASE_NAME]

# Get the users_collection reference from the MongoDB connection
database = get_database()
fs = GridFS(database)
users_collection = database[MONGO_COLLECTION_NAME]


# File validation function
def is_pdf(filename):
    _, ext = os.path.splitext(filename)
    return ext.lower() == ".pdf"

# File upload controller
async def upload_file(email: str, file: UploadFile = File(...)):
    if not is_pdf(file.filename):
        return {"error": "Invalid file format. Only PDF files are allowed."}

    # Save the file to GridFS
    file_id = fs.put(file.file, filename=file.filename, metadata={"email": email})

    # Create a document for the file information
    file_document = {
        "file_id": str(file_id),
        "filename": file.filename
    }

    # Update the user document with the file information
    users_collection.update_one(
        {"email": email},
        {"$push": {"files": file_document}}
    )
    
    return {"file_id": str(file_id)}



async def get_files(email: str):
    files = users_collection.find({"email": email}, {"_id": 0, "files": 1})
    results = []
    for doc in files:
        if "files" in doc:
            for file in doc["files"]:
                file_id = file.get("file_id")
                filename = file.get("filename")
                comments = file.get("comments", [])
                result = {
                    "file_id": file_id,
                    "filename": filename,
                    "comments": comments
                }
                results.append(result)
    return JSONResponse(content={"files": results})



async def singleFileData(filename: str, email: str):
    filename = filename + ".pdf"
    file_document = users_collection.find_one(
        {"files.filename": filename, "email": email},
        {"_id": 0, "files.$": 1}
    )
    if file_document and "files" in file_document:
        comments = file_document["files"][0].get("comments", [])
        return JSONResponse(content={"comments": comments})
    else:
        return JSONResponse(content={"comments": []})




async def get_file_preview(file_id: str):
    try:
        # Retrieve the file from GridFS using the file ID
        file_object = fs.get(ObjectId(file_id))
        
        # Access the file content
        file_content = file_object.read()
        
        # Create a streaming response with the file content as a PDF
        return StreamingResponse(io.BytesIO(file_content), media_type="application/pdf")
    
    except Exception as e:
        # Handle any errors
        print(f"Error fetching file: {str(e)}")
        return None



async def update_invitations(inviteEmail: str, inviteURL: str, filename: str,sender_email: str,file_id: str):
    # Check if inviteEmail exists in the database
    print("inviteURL=",inviteURL)
    existing_record = users_collection.find_one({"email": inviteEmail})

    if existing_record:
        # Get the current Invitations field from the record
        current_invitations = existing_record.get("Invitations", {})

        # Check if the filename already exists in the Invitations field
        if filename not in current_invitations:
            # Construct the invitation in the desired format
            invitation = {filename: {"inviteURL": inviteURL, "sender_email": sender_email, "file_id": file_id}}

            # Update the Invitations field by merging the new invitation
            updated_invitations = {**current_invitations, **invitation}

            # Update the record with the updated Invitations field
            users_collection.update_one(
                {"email": inviteEmail},
                {"$set": {"Invitations": updated_invitations}}
            )

            print(users_collection.find_one({"email": inviteEmail}))

            return {"message": "Invitations field updated successfully."}
        else:
            return {"message": f"Filename '{filename}' already exists in the Invitations field."}
    else:
        return {"message": "Record not found for the given inviteEmail."}
    


async def uniqueIdCheck(inviteEmail: str, inviteURL: str):
    # parsed_url = urlparse(inviteURL)
    # query_params = parse_qs(parsed_url.query)
    # unique_id = query_params.get("invite", [None])[0]
    unique_id = inviteURL.split("=")[-1]
    print(unique_id)
    if unique_id:
        # Construct the record in the desired format
        collection = database["Invitations"]
        result = collection.find_one({"inviteEmail": inviteEmail})
        if result:
            # If the record already exists, update the list
            unique_ids = result.get(inviteEmail, [])
            unique_ids.append(unique_id)
            collection.update_one(
                {"inviteEmail": inviteEmail},
                {"$set": {inviteEmail: unique_ids}}
            )
        else:
            # If the record doesn't exist, create a new one
            collection.insert_one({inviteEmail: [unique_id]})

        return {"message": "Record created successfully."}
    else:
        return {"message": "Invalid inviteURL. Unable to extract unique ID."}



async def get_invitations(email: str):
    record = users_collection.find_one({"email": email})
    if record is None:
        return {"message": "No invitations found for the given email."}
    
    invitations = record.get("Invitations", {})
    result = []
    for filename, invitation in invitations.items():
        inviteURL = invitation.get("inviteURL")
        file_id = invitation.get("file_id")
        result.append({"filename": filename, "inviteURL": inviteURL, "file_id": file_id })
    
    return result



async def save_comment(email: str, comment: str, filename: str):
    # Find the record containing the email
    record = users_collection.find_one({"email": email})
    if record is None:
        return {"message": "Record not found for the given email."}
    
    # Find the record containing the sender_email
    sender_email = record["Invitations"][filename]["sender_email"]
    sender_record = users_collection.find_one({"email": sender_email})
    if sender_record is None:
        return {"message": "Sender record not found."}
    
    # Find the file record in the files array
    file_record = next((file for file in sender_record["files"] if file["filename"] == filename), None)
    if file_record is None:
        return {"message": "File record not found."}
    
    # Save the comment in the specified format
    file_record["comments"].append({email: comment})
    
    # Update the record in the collection
    users_collection.update_one({"email": sender_email}, {"$set": sender_record})
    
    return {"message": "Comment saved successfully."}