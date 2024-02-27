import datetime
import shutil

import pytest
from database.daily import delete_daily, delete_user_data, read_dailies, read_daily, read_last_dailies, write_daily
from models.daily import Daily
from utils import TEST_DATUM, TEST_DAILIES, TEST_USER, set_data_path


DATA_PATH = set_data_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests():
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    for daily in TEST_DAILIES:
        write_daily(TEST_USER, daily)

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_read_daily():
    actual_daily = read_daily(TEST_USER, TEST_DATUM)
    assert isinstance(actual_daily, Daily)


def test_read_daily_not_present():
    actual_daily = read_daily(TEST_USER, datetime.date(2000, 1, 1))
    assert not actual_daily


def test_read_write_daily():
    datum = datetime.date(1970, 1, 1)
    expected_daily = Daily(datum=datum,
                           ich_bin_dankbar_fuer=[
                               "a", "b", "c"],
                           so_sorge_ich_fuer_einen_guten_tag="dasNehmeIchMirHeuteVor",
                           positive_selbstbekraeftigung="heuteWirdGutWeil",
                           was_habe_ich_heute_gelernt="morgenFreueIchMichAuf",
                           tolle_dinge_die_ich_heute_erlebt_habe=[
                               "x", "y", "z"],
                           was_habe_ich_heute_gutes_getan="einePositiveAffirmation",
                           spruch="spruch")

    write_daily(TEST_USER, expected_daily)
    actual_daily = read_daily(TEST_USER, datum)

    assert expected_daily == actual_daily

    assert delete_user_data(TEST_USER)


def test_read_dailies():
    dailies = read_dailies(user=TEST_USER)
    assert dailies == TEST_DAILIES

    dailies = read_dailies(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(days=5))
    assert dailies == TEST_DAILIES[5:]

    dailies = read_dailies(
        user=TEST_USER, end_date=TEST_DATUM + datetime.timedelta(days=5))
    assert dailies == TEST_DAILIES[:6]

    dailies = read_dailies(
        user=TEST_USER,
        start_date=TEST_DATUM + datetime.timedelta(days=2),
        end_date=TEST_DATUM + datetime.timedelta(days=7))
    assert dailies == TEST_DAILIES[2:8]


def test_read_dailies_empty():
    dailies = read_dailies(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(days=100))
    assert len(dailies) == 0

    dailies = read_dailies(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(days=10), end_date=TEST_DATUM + datetime.timedelta(days=1))
    assert len(dailies) == 0


def test_read_last_dailies():
    dailies = read_last_dailies(user=TEST_USER, number=1000)
    assert dailies == TEST_DAILIES

    dailies = read_last_dailies(user=TEST_USER, number=5)
    assert dailies == TEST_DAILIES[-5:]

    dailies = read_last_dailies(
        user=TEST_USER, number=5, end_date=TEST_DATUM + datetime.timedelta(days=4))
    assert dailies == TEST_DAILIES[:5]


def test_read_last_dailies_empty():
    dailies = read_last_dailies(user=TEST_USER, number=-3)
    assert len(dailies) == 0

    dailies = read_last_dailies(user=TEST_USER, number=0)
    assert len(dailies) == 0

    dailies = read_last_dailies(
        user=TEST_USER, number=5, end_date=TEST_DATUM - datetime.timedelta(days=1))
    assert len(dailies) == 0


def test_delete_daily():
    delete_daily(user=TEST_USER, datum=TEST_DATUM)
    assert not read_daily(user=TEST_USER, datum=TEST_DATUM)
