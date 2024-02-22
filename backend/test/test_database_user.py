import pathlib
from faker import Faker
import pytest
from database.user import delete_user, exists_user, read_user, write_users

from models.user import UserInDB
from utils import set_database_path

Faker.seed(4321)
fake = Faker()

TEST_USERS = [UserInDB(username=fake.name(), email=fake.email(), full_name=fake.name(),
                       hashed_password=fake.password()) for _ in range(10)]

PATH = set_database_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests(request):
    pathlib.Path(PATH).unlink(missing_ok=True)
    write_users(TEST_USERS)
    for test_user in TEST_USERS:
        assert exists_user(test_user.username)

    yield

    pathlib.Path(PATH).unlink(missing_ok=True)


def test_read_user():
    for test_user in TEST_USERS:
        db_user = read_user(test_user.username)
        assert test_user == db_user


def test_read_unknown_user():
    user = read_user('This user does not exist')
    assert not user


def test_delete_user():
    delete_user(TEST_USERS[0].username)

    assert not exists_user(TEST_USERS[0].username)
