from pydantic import BaseModel, EmailStr
from typing import Dict


class User(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None
    disabled: bool | None = None


class UserIn(User):
    password: str


class UserOut(User):
    pass


class UserInDB(User):
    hashed_password: str


class Users(BaseModel):
    items: Dict[str, UserInDB] = {}
