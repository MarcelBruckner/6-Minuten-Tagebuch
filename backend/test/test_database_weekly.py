import datetime
import shutil

import pytest
from database.weekly import delete_weekly, read_last_weeklies, read_weeklies, read_weekly, write_weekly
from utils import TEST_DATUM, TEST_USER, TEST_WEEKLIES, set_data_path


DATA_PATH = set_data_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests():
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    for daily in TEST_WEEKLIES:
        write_weekly(TEST_USER, daily)

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_read_weekly_not_present():
    actual_weekly = read_weekly(TEST_USER, datetime.date(2000, 1, 1))
    assert not actual_weekly


def test_read_weeklies():
    weeklies = read_weeklies(user=TEST_USER)
    assert weeklies == TEST_WEEKLIES

    weeklies = read_weeklies(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(weeks=5))
    assert weeklies == TEST_WEEKLIES[5:]

    weeklies = read_weeklies(
        user=TEST_USER, end_date=TEST_DATUM + datetime.timedelta(weeks=5))
    assert weeklies == TEST_WEEKLIES[:6]

    weeklies = read_weeklies(
        user=TEST_USER,
        start_date=TEST_DATUM + datetime.timedelta(weeks=2),
        end_date=TEST_DATUM + datetime.timedelta(weeks=7))
    assert weeklies == TEST_WEEKLIES[2:8]


def test_read_weeklies_empty():
    weeklies = read_weeklies(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(weeks=100))
    assert len(weeklies) == 0

    weeklies = read_weeklies(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(weeks=10), end_date=TEST_DATUM + datetime.timedelta(weeks=1))
    assert len(weeklies) == 0


def test_read_last_weeklies():
    weeklies = read_last_weeklies(user=TEST_USER, number=1000)
    assert weeklies == TEST_WEEKLIES

    weeklies = read_last_weeklies(user=TEST_USER, number=5)
    assert weeklies == TEST_WEEKLIES[-5:]

    weeklies = read_last_weeklies(
        user=TEST_USER, number=5, end_date=TEST_DATUM + datetime.timedelta(weeks=4))
    assert weeklies == TEST_WEEKLIES[:5]


def test_read_last_weeklies_empty():
    weeklies = read_last_weeklies(user=TEST_USER, number=-3)
    assert len(weeklies) == 0

    weeklies = read_last_weeklies(user=TEST_USER, number=0)
    assert len(weeklies) == 0

    weeklies = read_last_weeklies(
        user=TEST_USER, number=5, end_date=TEST_DATUM - datetime.timedelta(weeks=1))
    assert len(weeklies) == 0


def test_delete_weekly():
    delete_weekly(user=TEST_USER, week=TEST_DATUM)
    assert not read_weekly(user=TEST_USER, week=TEST_DATUM)
