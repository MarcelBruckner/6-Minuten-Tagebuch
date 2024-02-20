import pathlib
import shutil
from faker import Faker
import pytest
from database.users import create_user, read_user, read_users, write_users

from models.user import User, UserInDB, Users

Faker.seed(4321)
fake = Faker()

TEST_USERS = Users(**{'items': {username: UserInDB(username=username, email=fake.email(), full_name=fake.name(),
                   hashed_password=fake.password()) for username in [fake.name() for _ in range(10)]}})
PATH = ["tmp", "tests", "database", "users.json"]


@pytest.fixture(autouse=True)
def run_around_tests():
    write_users(TEST_USERS, *PATH)

    yield

    pathlib.Path(*PATH).unlink(missing_ok=True)


def test_read_users():
    users = read_users(*PATH)
    assert len(users.items) == 10
    assert users.items['Jason Brown'].email == "emyers@example.com"


def test_read_user():
    user = read_user('Jason Brown', *PATH)
    assert user.email == "emyers@example.com"


def test_read_unknown_user():
    user = read_user('This user does not exist', *PATH)
    assert not user


def test_read_users_database_not_present():
    pathlib.Path(*PATH).unlink()

    users = read_users(*PATH)
    assert not users.items


def test_read_user_database_not_present():
    pathlib.Path(*PATH).unlink()

    user = read_user('This user does not exist', *PATH)
    assert not user


def test_create_user():
    test_user = UserInDB(
        username="Marcel", email="i-wont-tell@example.com", full_name="Marcel Bruckner", hashed_password="my-super-secure-password")
    create_user(test_user, *PATH)
    users = read_users(*PATH)
    assert len(users.items) == 11
    assert read_user(
        "Marcel", *PATH).hashed_password == "my-super-secure-password"
