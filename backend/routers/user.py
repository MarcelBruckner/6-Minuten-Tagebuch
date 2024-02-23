from enum import Enum
from fastapi import APIRouter, HTTPException, Response, status
import database.user as user_db
from models.user import User, UserIn, UserInDB
from typing import Annotated

from fastapi import Depends
from routers import auth

# to get a string like this run:
# openssl rand -hex 32


router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

USER_EXISTS_ALREADY = "User exists already!"


@router.get("/", response_model=User)
async def get_current_active_user(current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    return current_user


@router.post("/", status_code=201)
async def create_user(new_user: UserIn):
    if user_db.exists_user(new_user.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=USER_EXISTS_ALREADY)

    db_user = UserInDB(username=new_user.username,
                       email=new_user.email,
                       full_name=new_user.full_name,
                       hashed_password=auth.get_password_hash(
                           new_user.password),
                       disabled=False)

    user_db.write_user(db_user)


@router.delete("/", status_code=status.HTTP_202_ACCEPTED)
async def delete_user(current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    user_db.delete_user(username=current_user.username)
    return current_user
