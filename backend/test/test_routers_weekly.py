import datetime
import pathlib
import shutil
from faker import Faker
from fastapi.testclient import TestClient
from fastapi import status
import pytest
from main import app
from models.weekly import Weekly
from utils import TEST_DATUM, TEST_WEEKLIES, TEST_USER, get_auth_headers, set_data_path

client = TestClient(app)

Faker.seed(4321)
fake = Faker()


DATA_PATH = set_data_path(__file__)


def get_headers():
    return get_auth_headers(TEST_USER.username)


@pytest.fixture(autouse=True)
def run_around_tests():
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    response = client.post(f"/user/", json=TEST_USER.model_dump())
    assert response.status_code == status.HTTP_201_CREATED or status.HTTP_409_CONFLICT

    for weekly in TEST_WEEKLIES:
        response = client.post(
            f"/weekly/", data=weekly.model_dump_json(), headers=get_headers(),
        )
        assert response.status_code == status.HTTP_201_CREATED

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_get_weekly():
    for weekly in TEST_WEEKLIES:
        response = client.get(
            f"/weekly/{weekly.woche}", headers=get_headers())
        assert response.status_code == 200

        actual_weekly_json = response.json()
        actual_weekly = Weekly(**actual_weekly_json)
        assert actual_weekly == weekly

    response = client.get(f"/weekly/{weekly.woche}", headers=get_headers())
    assert response.status_code == 200


def get_weekly_range(start_date: datetime.date | None = None, end_date: datetime.date | None = None):
    params = {}
    if start_date:
        params['start_date'] = start_date
    if end_date:
        params['end_date'] = end_date

    response = client.get(
        "/weekly/range/", params=params,  headers=get_headers())
    assert response.status_code == 200

    return [Weekly(**weekly) for weekly in response.json()]


def test_get_weeklies():
    assert get_weekly_range() == TEST_WEEKLIES

    assert get_weekly_range(start_date=TEST_DATUM +
                            datetime.timedelta(weeks=5)) == TEST_WEEKLIES[5:]

    assert get_weekly_range(end_date=TEST_DATUM +
                            datetime.timedelta(weeks=5)) == TEST_WEEKLIES[:6]

    assert get_weekly_range(start_date=TEST_DATUM + datetime.timedelta(weeks=2),
                            end_date=TEST_DATUM + datetime.timedelta(weeks=7)) == TEST_WEEKLIES[2:8]


def test_get_weeklies_empty():
    assert len(get_weekly_range(start_date=TEST_DATUM +
               datetime.timedelta(weeks=100))) == 0

    assert len(get_weekly_range(start_date=TEST_DATUM + datetime.timedelta(weeks=10),
               end_date=TEST_DATUM + datetime.timedelta(weeks=1))) == 0


def get_weekly_last(number: int, end_date: datetime.date | None = None):
    params = {}
    params['number'] = number
    if end_date:
        params['end_date'] = end_date

    response = client.get(
        "/weekly/last/", params=params,  headers=get_headers())
    assert response.status_code == 200

    return [Weekly(**weekly) for weekly in response.json()]


def test_get_last_weeklies():
    assert get_weekly_last(number=1000) == TEST_WEEKLIES

    assert get_weekly_last(number=5) == TEST_WEEKLIES[-5:]

    assert get_weekly_last(number=5, end_date=TEST_DATUM +
                           datetime.timedelta(weeks=4)) == TEST_WEEKLIES[:5]


def test_get_weeklies_empty():
    assert len(get_weekly_last(number=0)) == 0
    assert len(get_weekly_last(number=-3)) == 0

    assert len(get_weekly_last(number=5, end_date=TEST_DATUM -
               datetime.timedelta(weeks=1))) == 0


def test_delete_weekly():
    response = client.delete(f"/weekly/{TEST_DATUM}", headers=get_headers())
    assert response.status_code == 202
