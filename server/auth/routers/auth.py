from fastapi import APIRouter, Request , File , UploadFile
from auth.controllers.auth import signup, login,reset_password


router = APIRouter()


@router.post("/signup", response_model=None)
def signup_route(email: str, password: str):
    return signup(email, password)


@router.post("/login", response_model=None)
async def login_route(email: str, password: str):  
    return login(email, password)


@router.post("/resetpassword", response_model=None)
async def reset_password_router(email: str, password: str):
    return await reset_password(email, password)

@router.get("/")
async def test():
    return {"message":"Hello World"}


