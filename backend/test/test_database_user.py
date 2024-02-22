import pathlib
import shutil
import pytest
from database.eintrag import read_eintraege
from database.user import delete_user, exists_user, read_user, write_users, get_database_path

from utils import TEST_USER, TEST_USERS_IN_DB, set_data_path


DATA_PATH = set_data_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests(request):
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    write_users(TEST_USERS_IN_DB)
    for test_user in TEST_USERS_IN_DB:
        assert exists_user(test_user.username)

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def test_read_user():
    for test_user in TEST_USERS_IN_DB:
        db_user = read_user(test_user.username)
        assert test_user == db_user


def test_read_unknown_user():
    user = read_user('This user does not exist')
    assert not user


def test_delete_user():
    delete_user(TEST_USER.username)

    assert not exists_user(TEST_USER.username)
