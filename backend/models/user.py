from pydantic import BaseModel, EmailStr
from typing import Dict


class User(BaseModel):
    username: str
    email: EmailStr
    full_name: str = ""
    disabled: bool = False


class UserIn(User):
    password: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "username": "test",
                    "email": "test@example.com",
                    "full_name": "Test User",
                    "password": "test",
                    "disabled": False
                }
            ]
        }
    }


class UserOut(User):
    pass


class UserInDB(User):
    hashed_password: str

    @staticmethod
    def get_fields():
        return ("username", "email", "full_name", "disabled", "hashed_password")

    def get_values(self):
        return (self.username, self.email, self.full_name, self.disabled, self.hashed_password)
