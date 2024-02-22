from pydantic import BaseModel
import datetime
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
    expiration: datetime | None = None
