from fastapi import APIRouter
from models.user import User
from typing import Annotated

from fastapi import Depends
from routers import auth

# to get a string like this run:
# openssl rand -hex 32


router = APIRouter(
    prefix="/users",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)


@router.get("/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(auth.get_current_active_user)]
):
    return current_user
