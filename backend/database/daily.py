import datetime
import json
import pathlib
import shutil
from typing import List
from common.constants import DATE_FORMAT
from common.environment import get_data_path
from models.daily import Daily
from models.user import User


def _get_path(user: User, datum: datetime.date | None = None) -> pathlib.Path:
    base = pathlib.Path(get_data_path(), user.username, 'daily')
    if datum == None:
        return base
    if datum:
        return pathlib.Path(base, f'{datum.strftime(DATE_FORMAT)}.json')
    return pathlib.Path(base)


def exists_daily(user: User, datum: datetime.date) -> bool:
    return _get_path(user, datum).exists()


def write_daily(user: User, daily: Daily):
    path = _get_path(user, daily.datum)
    path.parent.mkdir(exist_ok=True, parents=True)
    json_data = daily.model_dump_json(indent=2)
    path.write_text(json_data, encoding='utf-8')

    if not exists_daily(user, daily.datum):
        raise FileNotFoundError(f"Couln't write entry "
                                f"{daily.datum} for {user.username}")


def write_dailies(user: User, dailies: List[Daily]):
    for daily in dailies:
        write_daily(user, daily)


def read_daily(user: User, datum: datetime.date) -> Daily | None:
    if not exists_daily(user, datum):
        return None

    path = _get_path(user, datum)
    daily = Daily(**json.loads(path.read_text(encoding='utf-8')))
    return daily


def read_dailies(user: User, start_date: datetime.date = None, end_date: datetime.date = None) -> Daily:
    dailies = []
    path = _get_path(user)
    dailies_paths = list(path.glob('*.json'))

    if not start_date and end_date:
        def filter_lambda(path): return datetime.datetime.strptime(
            path.stem, DATE_FORMAT).date() <= end_date
    elif start_date and not end_date:
        def filter_lambda(path): return start_date <= datetime.datetime.strptime(
            path.stem, DATE_FORMAT).date()
    elif start_date and end_date:
        def filter_lambda(path): return start_date <= datetime.datetime.strptime(
            path.stem, DATE_FORMAT).date() <= end_date
    else:
        def filter_lambda(path): return True

    relevante_paths = list(filter(filter_lambda, dailies_paths))

    dailies = list(map(lambda path: Daily(
        ** json.loads(path.read_text(encoding='utf-8'))), relevante_paths))
    return dailies


def read_last_dailies(user: User, number: int = 10, end_date: datetime.date = None) -> Daily:
    if number <= 0:
        return []
    dailies = []
    path = _get_path(user)
    dailies_paths = list(path.glob('*.json'))

    if end_date == None:
        end_date = datetime.date.today()

    relevante_paths = list(filter(lambda path: datetime.datetime.strptime(
        path.stem, DATE_FORMAT).date() <= end_date, dailies_paths))
    relevante_paths = relevante_paths[-number:]

    dailies = list(map(lambda path: Daily(
        ** json.loads(path.read_text(encoding='utf-8'))), relevante_paths))
    return dailies


def delete_daily(user: User, datum: datetime.date) -> bool:
    path = _get_path(user, datum)
    path.unlink()
    if exists_daily(user, datum):
        raise FileNotFoundError(f"Couln't delete entry "
                                f"{datum} for {user.username}")


def delete_user_data(user: User) -> bool:
    path = _get_path(user, None)
    shutil.rmtree(path, ignore_errors=True)
    return not path.exists()
