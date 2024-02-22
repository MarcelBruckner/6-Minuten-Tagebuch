import datetime
import pathlib
import shutil
from faker import Faker
from fastapi.testclient import TestClient
from fastapi import status
import pytest
from main import app
from models.eintrag import Eintrag
from utils import TEST_DATUM, TEST_EINTRAEGE, TEST_USER, get_auth_headers, set_data_path

client = TestClient(app)

Faker.seed(4321)
fake = Faker()


DATA_PATH = set_data_path(__file__)


def get_headers():
    return get_auth_headers(TEST_USER.username)


@pytest.fixture(autouse=True)
def run_around_tests():
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    response = client.post(f"/user/create", json=TEST_USER.model_dump())
    assert response.status_code == status.HTTP_201_CREATED or status.HTTP_409_CONFLICT

    for eintrag in TEST_EINTRAEGE:
        response = client.put(
            f"/eintrag/", data=eintrag.model_dump_json(), headers=get_headers(),
        )
        assert response.status_code == status.HTTP_201_CREATED

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_get_eintrag():
    for eintrag in TEST_EINTRAEGE:
        response = client.get(
            f"/eintrag/{eintrag.datum}", headers=get_headers())
        assert response.status_code == 200

        actual_eintrag_json = response.json()
        actual_eintrag = Eintrag(**actual_eintrag_json)
        assert actual_eintrag == eintrag

    response = client.get(f"/eintrag/{eintrag.datum}", headers=get_headers())
    assert response.status_code == 200


def get_eintrage_range(start_date: datetime.date | None = None, end_date: datetime.date | None = None):
    params = {}
    if start_date:
        params['start_date'] = start_date
    if end_date:
        params['end_date'] = end_date

    response = client.get(
        "/eintrag/range/", params=params,  headers=get_headers())
    assert response.status_code == 200

    return [Eintrag(**eintrag) for eintrag in response.json()]


def test_get_eintraege():
    assert get_eintrage_range() == TEST_EINTRAEGE

    assert get_eintrage_range(start_date=TEST_DATUM +
                              datetime.timedelta(days=5)) == TEST_EINTRAEGE[5:]

    assert get_eintrage_range(end_date=TEST_DATUM +
                              datetime.timedelta(days=5)) == TEST_EINTRAEGE[:6]

    assert get_eintrage_range(start_date=TEST_DATUM + datetime.timedelta(days=2),
                              end_date=TEST_DATUM + datetime.timedelta(days=7)) == TEST_EINTRAEGE[2:8]


def test_get_eintraege_empty():
    assert len(get_eintrage_range(start_date=TEST_DATUM +
               datetime.timedelta(days=100))) == 0

    assert len(get_eintrage_range(start_date=TEST_DATUM + datetime.timedelta(days=10),
               end_date=TEST_DATUM + datetime.timedelta(days=1))) == 0


def get_eintrage_last(number: int, end_date: datetime.date | None = None):
    params = {}
    params['number'] = number
    if end_date:
        params['end_date'] = end_date

    response = client.get(
        "/eintrag/last/", params=params,  headers=get_headers())
    assert response.status_code == 200

    return [Eintrag(**eintrag) for eintrag in response.json()]


def test_get_last_eintraege():
    assert get_eintrage_last(number=1000) == TEST_EINTRAEGE

    assert get_eintrage_last(number=5) == TEST_EINTRAEGE[-5:]

    assert get_eintrage_last(number=5, end_date=TEST_DATUM +
                             datetime.timedelta(days=4)) == TEST_EINTRAEGE[:5]


def test_get_eintraege_empty():
    assert len(get_eintrage_last(number=0)) == 0
    assert len(get_eintrage_last(number=-3)) == 0

    assert len(get_eintrage_last(number=5, end_date=TEST_DATUM -
               datetime.timedelta(days=1))) == 0
