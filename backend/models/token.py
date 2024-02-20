from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
