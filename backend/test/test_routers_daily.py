import datetime
import pathlib
import shutil
from faker import Faker
from fastapi.testclient import TestClient
from fastapi import status
import pytest
from main import app
from models.daily import Daily
from utils import TEST_DATUM, TEST_DAILIES, TEST_USER, get_auth_headers, set_data_path

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

    for daily in TEST_DAILIES:
        response = client.post(
            f"/daily/", data=daily.model_dump_json(), headers=get_headers(),
        )
        assert response.status_code == status.HTTP_201_CREATED

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_get_daily():
    for daily in TEST_DAILIES:
        response = client.get(
            f"/daily/{daily.datum}", headers=get_headers())
        assert response.status_code == 200

        actual_daily_json = response.json()
        actual_daily = Daily(**actual_daily_json)
        assert actual_daily == daily

    response = client.get(f"/daily/{daily.datum}", headers=get_headers())
    assert response.status_code == 200


def get_daily_range(start_date: datetime.date | None = None, end_date: datetime.date | None = None):
    params = {}
    if start_date:
        params['start_date'] = start_date
    if end_date:
        params['end_date'] = end_date

    response = client.get(
        "/daily/range/", params=params,  headers=get_headers())
    assert response.status_code == 200

    return [Daily(**daily) for daily in response.json()]


def test_get_dailies():
    assert get_daily_range() == TEST_DAILIES

    assert get_daily_range(start_date=TEST_DATUM +
                           datetime.timedelta(days=5)) == TEST_DAILIES[5:]

    assert get_daily_range(end_date=TEST_DATUM +
                           datetime.timedelta(days=5)) == TEST_DAILIES[:6]

    assert get_daily_range(start_date=TEST_DATUM + datetime.timedelta(days=2),
                           end_date=TEST_DATUM + datetime.timedelta(days=7)) == TEST_DAILIES[2:8]


def test_get_dailies_empty():
    assert len(get_daily_range(start_date=TEST_DATUM +
               datetime.timedelta(days=100))) == 0

    assert len(get_daily_range(start_date=TEST_DATUM + datetime.timedelta(days=10),
               end_date=TEST_DATUM + datetime.timedelta(days=1))) == 0


def get_dailye_last(number: int, end_date: datetime.date | None = None):
    params = {}
    params['number'] = number
    if end_date:
        params['end_date'] = end_date

    response = client.get(
        "/daily/last/", params=params,  headers=get_headers())
    assert response.status_code == 200

    return [Daily(**daily) for daily in response.json()]


def test_get_last_dailies():
    assert get_dailye_last(number=1000) == TEST_DAILIES

    assert get_dailye_last(number=5) == TEST_DAILIES[-5:]

    assert get_dailye_last(number=5, end_date=TEST_DATUM +
                           datetime.timedelta(days=4)) == TEST_DAILIES[:5]


def test_get_dailies_empty():
    assert len(get_dailye_last(number=0)) == 0
    assert len(get_dailye_last(number=-3)) == 0

    assert len(get_dailye_last(number=5, end_date=TEST_DATUM -
               datetime.timedelta(days=1))) == 0


def test_delete_daily():
    response = client.delete(f"/daily/{TEST_DATUM}", headers=get_headers())
    assert response.status_code == 202
