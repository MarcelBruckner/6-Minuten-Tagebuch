from enum import Enum
from fastapi import APIRouter, Response, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
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


class UserServiceResponse(BaseModel):
    status_code: int
    message: str


class UserCreationResponse(Enum):
    CONFLICT = UserServiceResponse(
        status_code=status.HTTP_409_CONFLICT, message="User already exists")
    CREATED = UserServiceResponse(
        status_code=status.HTTP_201_CREATED, message="Created")


class UserDeletionResponse(Enum):
    DELETED = UserServiceResponse(
        status_code=status.HTTP_202_ACCEPTED, message="Deleted")


@router.get("/", response_model=User)
async def get_current_active_user(current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    return current_user


@router.post("/create", response_model=UserServiceResponse)
async def create_user(new_user: UserIn, response: Response):
    if user_db.exists_user(new_user.username):
        response.status_code = UserCreationResponse.CONFLICT.value.status_code
        return UserCreationResponse.CONFLICT.value

    db_user = UserInDB(username=new_user.username,
                       email=new_user.email,
                       full_name=new_user.full_name,
                       hashed_password=auth.get_password_hash(
                           new_user.password),
                       disabled=False)

    user_db.write_user(db_user)
    response.status_code = UserCreationResponse.CREATED.value.status_code
    return UserCreationResponse.CREATED.value


@router.delete("/delete", status_code=UserDeletionResponse.DELETED.value.status_code, response_model=UserServiceResponse)
async def delete_user(current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    user_db.delete_user(username=current_user.username)
    return UserDeletionResponse.DELETED.value
