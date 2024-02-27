import pathlib
import sqlite3
from typing import List

from common.environment import get_data_path
from database.daily import delete_user_data
from models.user import UserInDB


TABLE_NAME = "user"


def get_database_path() -> pathlib.Path:
    return pathlib.Path(get_data_path(), "users.sqlite")


def _exists_table():
    connection = _open_database_file()
    cursor = connection.cursor()
    res = cursor.execute("SELECT name FROM sqlite_master")
    tables = res.fetchone()
    connection.close()
    return tables != None and TABLE_NAME in tables


def _create_table():
    connection = _open_database_file()
    cursor = connection.cursor()
    query = f"CREATE TABLE {TABLE_NAME}({', '.join(UserInDB.get_fields())})"
    cursor.execute(query)
    connection.close()
    return _exists_table()


def _open_database_file():
    path = get_database_path()
    path.parent.mkdir(exist_ok=True, parents=True)
    connection = sqlite3.connect(path)
    return connection


def get_database():
    connection = _open_database_file()
    if not _exists_table():
        if not _create_table():
            raise sqlite3.DatabaseError(
                f"Couldn't create table in database file: {get_database_path()}")
    return connection


def exists_database_file() -> bool:
    return get_database_path().exists()


def read_user(username: str) -> UserInDB | None:
    connection = get_database()
    query = f"SELECT * FROM {TABLE_NAME} WHERE username='{username}'"
    cursor = connection.cursor()
    res = cursor.execute(query)
    values = res.fetchone()
    connection.close()
    try:
        return UserInDB(**dict(zip(UserInDB.get_fields(), values)))
    except:
        return None


def exists_user(username: str) -> bool:
    return read_user(username) != None


def write_user(user: UserInDB):
    connection = get_database()

    values = user.get_values()
    cursor = connection.cursor()
    query = f"INSERT INTO {TABLE_NAME} VALUES (?, ?, ?, ?, ?)"
    cursor.execute(query, values)
    connection.commit()
    connection.close()

    if not exists_user(user.username):
        raise sqlite3.Error(f"Couln't write user {user.username} to database")


def write_users(users: List[UserInDB]):
    for user in users:
        write_user(user)


def delete_user(username: str):
    user = read_user(username)

    connection = get_database()
    cursor = connection.cursor()

    query = f"DELETE FROM {TABLE_NAME} WHERE username='{username}'"
    cursor.execute(query)
    connection.commit()
    connection.close()

    if exists_user(username):
        raise sqlite3.Error(f"Couln't delete user {username} from database")
    delete_user_data(user)
