import json
import pathlib

from models.user import User, UserInDB, Users


def _get_path(*path_to_db_file: str) -> pathlib.Path:
    return pathlib.Path(*path_to_db_file)


def exists_database_file(*path_to_db_file: str) -> bool:
    return _get_path(*path_to_db_file).exists()


def create_user(user: UserInDB, *path_to_db_file: str) -> bool:
    users = read_users(*path_to_db_file)
    if user.username in users.items:
        return False
    users.items[user.username] = user
    return write_users(users, *path_to_db_file)


def read_user(username: str, *path_to_db_file: str) -> UserInDB | None:
    users = read_users(*path_to_db_file)
    return users.items.get(username, None)


def read_users(*path_to_db_file: str) -> Users:
    if not exists_database_file(*path_to_db_file):
        return Users()
    db_file = _get_path(*path_to_db_file)
    raw_db_text = db_file.read_text(encoding='utf-8')
    json_db = json.loads(raw_db_text)
    users = Users(**json_db)
    return users


def write_users(users: Users, *path_to_db_file: str) -> bool:
    db_file = _get_path(*path_to_db_file)
    db_file.parent.mkdir(exist_ok=True, parents=True)
    users_json = users.model_dump_json(indent=2)
    raw_db_text = db_file.write_text(users_json, encoding='utf-8')
    return bool(raw_db_text)
