from fastapi import APIRouter, Request , File , UploadFile
from app.controllers.app_controllers import upload_file,get_files,singleFileData,get_file_preview,update_invitations,uniqueIdCheck,get_invitations,save_comment

router = APIRouter()

@router.post("/upload/{email}")
async def upload(email: str, file: UploadFile = File(...)):
    return await upload_file(email, file)


@router.get("/getfiles")
async def get_files_router(email: str):
    return await get_files(email)


@router.get("/singleFileData")
async def singleFileData_router(filename: str,email: str):
    return await singleFileData(filename,email)


@router.get("/preview")
async def get_file_preview_router(file_id: str):
    return await get_file_preview(file_id)


@router.put("/invitations")
async def update_invitations_router(inviteEmail: str, inviteURL: str, filename: str,sender_email: str,file_id: str):
    return await update_invitations(inviteEmail, inviteURL, filename,sender_email,file_id)


@router.put("/uniqueIdCheck")
async def uniqueIdCheck_router(inviteEmail: str, inviteURL: str):
    return await uniqueIdCheck(inviteEmail,inviteURL)

@router.get("/getInvitations/{email}")
async def get_invitations_router(email: str):
    return await get_invitations(email)


@router.post("/save_comment")
async def save_comment_router(email: str, comment: str, filename: str):
    return await save_comment(email, comment, filename)

