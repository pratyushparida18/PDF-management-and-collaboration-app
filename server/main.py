from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import uvicorn
from auth.routers.auth  import  router as auth_router
from app.routers.app_routers import router as app_router

#i want to import router


app = FastAPI()

# Set up CORS
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["https://pdf-management-and-collaboration-app.vercel.app"],  # Replace with your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB configuration
MONGO_CONNECTION_STRING = 'mongodb://localhost:27017'  # Replace with your MongoDB connection string
MONGO_DATABASE_NAME = 'spotdraft'
MONGO_COLLECTION_NAME = 'users'

# JWT configuration
SECRET_KEY = 'spotdraft'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_database():
    client = MongoClient(MONGO_CONNECTION_STRING)
    return client[MONGO_DATABASE_NAME]

# Include the routers
app.include_router(auth_router,tags=["auth routes"])
app.include_router(app_router,tags=["app routes"])

# Start the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
