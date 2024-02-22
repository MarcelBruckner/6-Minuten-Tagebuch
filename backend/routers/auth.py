from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import APIRouter
from common.environment import get_access_token_expires_minutes, get_app_secret_key
from database.user import read_user
from models.token import Token, TokenData
from models.user import User
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


ALGORITHM = "HS256"

CREADENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


def decode(token):
    return jwt.decode(token, get_app_secret_key(), algorithms=[ALGORITHM])


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, get_app_secret_key(), algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_token_data(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode(token)
        username: str = payload.get("sub")
        expiration: datetime = payload.get("exp")
        if username is None:
            raise CREADENTIALS_EXCEPTION
        return TokenData(username=username, expiration=expiration)
    except JWTError:
        raise CREADENTIALS_EXCEPTION


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    token_data = get_token_data(token)
    user = read_user(token_data.username)
    if not user:
        raise CREADENTIALS_EXCEPTION
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def authenticate_user(username: str, password: str):
    user = read_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(
        minutes=get_access_token_expires_minutes())
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
