import dataclasses
import datetime
import json
import pathlib
from constants import DATE_FORMAT
from models import EintragModel


def _get_path(datum: datetime.date) -> pathlib.Path:
    return pathlib.Path("data", f'{datum.strftime(DATE_FORMAT)}.json')


def exists_eintrag(datum: datetime.date) -> bool:
    return _get_path(datum).exists()


def write_eintrag(eintrag: EintragModel) -> bool:
    path = _get_path(eintrag.datum)
    path.parent.mkdir(exist_ok=True)
    json_data = json.dumps(dataclasses.asdict(eintrag),
                           indent=4, sort_keys=True, default=str, ensure_ascii=False)
    path.write_text(json_data, encoding='utf-8')
    return exists_eintrag(eintrag.datum)


def read_eintrag(datum: datetime.date) -> EintragModel:
    if not exists_eintrag(datum):
        return EintragModel(datum)

    path = _get_path(datum)
    eintrag = EintragModel.from_json(
        json.loads(path.read_text(encoding='utf-8')))
    return eintrag


def delete_eintrag(datum: datetime.date) -> bool:
    path = _get_path(datum)
    path.unlink()
    return not path.exists()
