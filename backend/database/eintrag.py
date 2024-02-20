import datetime
import json
import pathlib
import shutil
from common.constants import DATE_FORMAT
from models.eintrag import EintragModel
from models.user import User


def _get_path(user: User, datum: datetime.date | None = None, *data_path: str) -> pathlib.Path:
    base = pathlib.Path(*data_path, user.username)
    if datum == None:
        return base
    return pathlib.Path(base, f'{datum.strftime(DATE_FORMAT)}.json')


def exists_eintrag(user: User, datum: datetime.date, *data_path: str) -> bool:
    return _get_path(user, datum, *data_path).exists()


def write_eintrag(user: User, eintrag: EintragModel, *data_path: str) -> bool:
    path = _get_path(user, eintrag.datum, *data_path)
    path.parent.mkdir(exist_ok=True, parents=True)
    json_data = eintrag.model_dump_json(indent=2)
    path.write_text(json_data, encoding='utf-8')
    return exists_eintrag(user, eintrag.datum, *data_path)


def read_eintrag(user: User, datum: datetime.date, *data_path: str) -> EintragModel:
    if not exists_eintrag(user, datum, *data_path):
        return EintragModel(datum=datum)

    path = _get_path(user, datum, *data_path)
    eintrag = EintragModel(**json.loads(path.read_text(encoding='utf-8')))
    return eintrag


def delete_eintrag(user: User, datum: datetime.date, *data_path: str) -> bool:
    path = _get_path(user, datum, data_path)
    path.unlink()
    return not path.exists()


def delete_user_data(user: User, *data_path: str) -> bool:
    path = _get_path(user, None, *data_path)
    shutil.rmtree(path, ignore_errors=True)
    return not path.exists()
