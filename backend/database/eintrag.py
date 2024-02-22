import datetime
import json
import pathlib
import shutil
from typing import List
from common.constants import DATE_FORMAT
from common.environment import get_data_path
from models.eintrag import Eintrag
from models.user import User


def _get_path(user: User, datum: datetime.date | None = None) -> pathlib.Path:
    base = pathlib.Path(get_data_path(), user.username)
    if datum == None:
        return base
    if datum:
        return pathlib.Path(base, f'{datum.strftime(DATE_FORMAT)}.json')
    return pathlib.Path(base)


def exists_eintrag(user: User, datum: datetime.date) -> bool:
    return _get_path(user, datum).exists()


def write_eintrag(user: User, eintrag: Eintrag):
    path = _get_path(user, eintrag.datum)
    path.parent.mkdir(exist_ok=True, parents=True)
    json_data = eintrag.model_dump_json(indent=2)
    path.write_text(json_data, encoding='utf-8')

    if not exists_eintrag(user, eintrag.datum):
        raise FileNotFoundError(f"Couln't write entry "
                                f"{eintrag.datum} for {user.username}")


def write_eintraege(user: User, eintraege: List[Eintrag]):
    for eintrag in eintraege:
        write_eintrag(user, eintrag)


def read_eintrag(user: User, datum: datetime.date) -> Eintrag | None:
    if not exists_eintrag(user, datum):
        return None

    path = _get_path(user, datum)
    eintrag = Eintrag(**json.loads(path.read_text(encoding='utf-8')))
    return eintrag


def read_eintraege(user: User, start_date: datetime.date = datetime.date(1970, 1, 1), end_date: datetime.date = datetime.date.today()) -> Eintrag:
    eintraege = []
    path = _get_path(user)
    eintraege_paths = list(path.glob('*.json'))

    relevante_paths = list(filter(lambda path: start_date <= datetime.datetime.strptime(
        path.stem, DATE_FORMAT).date() <= end_date, eintraege_paths))

    eintraege = list(map(lambda path: Eintrag(
                         ** json.loads(path.read_text(encoding='utf-8'))), relevante_paths))
    return eintraege


def read_last_eintraege(user: User, number: int = 10, end_date: datetime.date = datetime.date.today()) -> Eintrag:
    if number <= 0:
        return []
    eintraege = []
    path = _get_path(user)
    eintraege_paths = list(path.glob('*.json'))

    relevante_paths = list(filter(lambda path: datetime.datetime.strptime(
        path.stem, DATE_FORMAT).date() <= end_date, eintraege_paths))
    relevante_paths = relevante_paths[-number:]

    eintraege = list(map(lambda path: Eintrag(
                         ** json.loads(path.read_text(encoding='utf-8'))), relevante_paths))
    return eintraege


def delete_eintrag(user: User, datum: datetime.date) -> bool:
    path = _get_path(user, datum)
    path.unlink()
    return not path.exists()


def delete_user_data(user: User) -> bool:
    path = _get_path(user, None)
    shutil.rmtree(path, ignore_errors=True)
    return not path.exists()
