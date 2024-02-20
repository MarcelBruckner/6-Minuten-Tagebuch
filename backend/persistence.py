import dataclasses
import datetime
import json
import pathlib
import shutil
from constants import DATE_FORMAT
from models import EintragModel, User, UserIn, UserInDB


def _get_path(user: User, datum: datetime.date | None = None) -> pathlib.Path:
    if datum == None:
        return pathlib.Path("data", user.username)
    return pathlib.Path("data", user.username, f'{datum.strftime(DATE_FORMAT)}.json')


def exists_eintrag(user: User, datum: datetime.date) -> bool:
    return _get_path(user, datum).exists()


def write_eintrag(user: User, eintrag: EintragModel) -> bool:
    path = _get_path(user, eintrag.datum)
    path.parent.mkdir(exist_ok=True)
    json_data = eintrag.model_dump_json(indent=2)
    path.write_text(json_data, encoding='utf-8')
    return exists_eintrag(user, eintrag.datum)


def read_eintrag(user: User, datum: datetime.date) -> EintragModel:
    if not exists_eintrag(user, datum):
        return EintragModel(datum=datum)

    path = _get_path(user, datum)
    eintrag = EintragModel(**json.loads(path.read_text(encoding='utf-8')))
    return eintrag


def delete_eintrag(user: User, datum: datetime.date) -> bool:
    path = _get_path(user, datum)
    path.unlink()
    return not path.exists()


def delete_user_data(user: User) -> bool:
    path = _get_path(user)
    shutil.rmtree(path, ignore_errors=True)
    return not path.exists()
