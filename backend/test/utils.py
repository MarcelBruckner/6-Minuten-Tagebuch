import datetime
import os
import pathlib
from database.user import GENERAL_TEST_USER
from routers.auth import create_access_token

ACCESS_TOKEN_EXPIRES = datetime.timedelta(30)


def get_auth_headers(username: str):
    access_token = create_access_token(
        data={"sub": username}, expires_delta=ACCESS_TOKEN_EXPIRES
    )
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    return headers


def set_database_path(filename: str) -> str:
    database_path = str(pathlib.Path(
        "tmp", "tests", os.path.basename(filename), "db.sqlite"))
    os.environ['DATABASE_PATH'] = database_path
    return database_path
