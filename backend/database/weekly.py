import datetime
import json
import pathlib
import shutil
from typing import List
from common.constants import WEEK_FORMAT, WEEK_FORMAT
from common.environment import get_data_path
from models.weekly import Weekly
from models.user import User


def _get_path(user: User, week: datetime.date | None = None) -> pathlib.Path:
    base = pathlib.Path(get_data_path(), user.username, 'weekly')
    if week:
        return pathlib.Path(base, f'{week.strftime(WEEK_FORMAT)}.json')
    return pathlib.Path(base)


def exists_weekly(user: User, week: datetime.date) -> bool:
    return _get_path(user, week).exists()


def write_weekly(user: User, weekly: Weekly):
    path = _get_path(user, weekly.woche)
    path.parent.mkdir(exist_ok=True, parents=True)
    json_data = weekly.model_dump_json(indent=2)
    path.write_text(json_data, encoding='utf-8')

    if not exists_weekly(user, weekly.woche):
        raise FileNotFoundError(f"Couln't write entry "
                                f"{weekly.woche} for {user.username}")


def write_weeklies(user: User, weeklies: List[Weekly]):
    for weekly in weeklies:
        write_weekly(user, weekly)


def read_weekly(user: User, week: datetime.date) -> Weekly | None:
    if not exists_weekly(user, week):
        return None

    path = _get_path(user, week)
    weekly = Weekly(**json.loads(path.read_text(encoding='utf-8')))
    return weekly


def read_weeklies(user: User, start_date: datetime.date = None, end_date: datetime.date = None) -> Weekly:
    weeklies = []
    path = _get_path(user)
    weeklies_paths = list(path.glob('*.json'))

    if not start_date and end_date:
        def filter_lambda(path):
            new_var = datetime.datetime.strptime(path.stem, WEEK_FORMAT).date()
            return new_var <= end_date
    elif start_date and not end_date:
        def filter_lambda(path):
            new_var = datetime.datetime.strptime(path.stem, WEEK_FORMAT).date()
            return start_date <= new_var
    elif start_date and end_date:
        def filter_lambda(path):
            new_var = datetime.datetime.strptime(path.stem, WEEK_FORMAT).date()
            return start_date <= new_var <= end_date
    else:
        def filter_lambda(_): return True

    relevante_paths = list(filter(filter_lambda, weeklies_paths))

    weeklies = list(map(lambda path: Weekly(
        ** json.loads(path.read_text(encoding='utf-8'))), relevante_paths))
    return weeklies


def read_last_weeklies(user: User, number: int = 10, end_date: datetime.date = None) -> Weekly:
    if number <= 0:
        return []
    weeklies = []
    path = _get_path(user)
    weeklies_paths = list(path.glob('*.json'))

    if end_date == None:
        end_date = datetime.date.today()

    relevante_paths = list(filter(lambda path: datetime.datetime.strptime(
        path.stem, WEEK_FORMAT).date() <= end_date, weeklies_paths))
    relevante_paths = relevante_paths[-number:]

    weeklies = list(map(lambda path: Weekly(
        ** json.loads(path.read_text(encoding='utf-8'))), relevante_paths))
    return weeklies


def delete_weekly(user: User, week: datetime.date) -> bool:
    path = _get_path(user, week)
    path.unlink()
    if exists_weekly(user, week):
        raise FileNotFoundError(f"Couln't delete entry "
                                f"{week} for {user.username}")


def delete_user_data(user: User) -> bool:
    path = _get_path(user, None)
    shutil.rmtree(path, ignore_errors=True)
    return not path.exists()
