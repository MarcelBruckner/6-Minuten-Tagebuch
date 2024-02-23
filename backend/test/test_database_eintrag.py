import datetime
import shutil

import pytest
from database.eintrag import delete_eintrag, delete_user_data, read_eintraege, read_eintrag, read_last_eintraege, write_eintrag
from models.eintrag import Eintrag
from utils import TEST_DATUM, TEST_EINTRAEGE, TEST_USER, set_data_path


DATA_PATH = set_data_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests():
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    for eintrag in TEST_EINTRAEGE:
        write_eintrag(TEST_USER, eintrag)

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_read_eintrag():
    actual_eintrag = read_eintrag(TEST_USER, TEST_DATUM)
    assert isinstance(actual_eintrag, Eintrag)


def test_read_eintrag_not_present():
    actual_eintrag = read_eintrag(TEST_USER, datetime.date(2000, 1, 1))
    assert not actual_eintrag


def test_read_write_eintrag():
    datum = datetime.date(1970, 1, 1)
    expected_eintrag = Eintrag(datum=datum,
                               ich_bin_dankbar_fuer=[
                                   "a", "b", "c"],
                               so_sorge_ich_fuer_einen_guten_tag="dasNehmeIchMirHeuteVor",
                               positive_selbstbekraeftigung="heuteWirdGutWeil",
                               was_habe_ich_heute_gelernt="morgenFreueIchMichAuf",
                               tolle_dinge_die_ich_heute_erlebt_habe=[
                                   "x", "y", "z"],
                               was_habe_ich_heute_gutes_getan="einePositiveAffirmation",
                               spruch="spruch")

    write_eintrag(TEST_USER, expected_eintrag)
    actual_eintrag = read_eintrag(TEST_USER, datum)

    assert expected_eintrag == actual_eintrag

    assert delete_user_data(TEST_USER)


def test_read_eintraege():
    eintraege = read_eintraege(user=TEST_USER)
    assert eintraege == TEST_EINTRAEGE

    eintraege = read_eintraege(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(days=5))
    assert eintraege == TEST_EINTRAEGE[5:]

    eintraege = read_eintraege(
        user=TEST_USER, end_date=TEST_DATUM + datetime.timedelta(days=5))
    assert eintraege == TEST_EINTRAEGE[:6]

    eintraege = read_eintraege(
        user=TEST_USER,
        start_date=TEST_DATUM + datetime.timedelta(days=2),
        end_date=TEST_DATUM + datetime.timedelta(days=7))
    assert eintraege == TEST_EINTRAEGE[2:8]


def test_read_eintraege_empty():
    eintraege = read_eintraege(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(days=100))
    assert len(eintraege) == 0

    eintraege = read_eintraege(
        user=TEST_USER, start_date=TEST_DATUM + datetime.timedelta(days=10), end_date=TEST_DATUM + datetime.timedelta(days=1))
    assert len(eintraege) == 0


def test_read_last_eintraege():
    eintraege = read_last_eintraege(user=TEST_USER, number=1000)
    assert eintraege == TEST_EINTRAEGE

    eintraege = read_last_eintraege(user=TEST_USER, number=5)
    assert eintraege == TEST_EINTRAEGE[-5:]

    eintraege = read_last_eintraege(
        user=TEST_USER, number=5, end_date=TEST_DATUM + datetime.timedelta(days=4))
    assert eintraege == TEST_EINTRAEGE[:5]


def test_read_last_eintraege_empty():
    eintraege = read_last_eintraege(user=TEST_USER, number=-3)
    assert len(eintraege) == 0

    eintraege = read_last_eintraege(user=TEST_USER, number=0)
    assert len(eintraege) == 0

    eintraege = read_last_eintraege(
        user=TEST_USER, number=5, end_date=TEST_DATUM - datetime.timedelta(days=1))
    assert len(eintraege) == 0


def test_delete_eintrag():
    delete_eintrag(user=TEST_USER, datum=TEST_DATUM)
    assert not read_eintrag(user=TEST_USER, datum=TEST_DATUM)
