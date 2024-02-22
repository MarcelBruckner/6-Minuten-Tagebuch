import pathlib
import shutil
from fastapi.testclient import TestClient
import pytest
from fastapi import status
from main import app
from models.user import User
from routers.user import USER_EXISTS_ALREADY
from utils import TEST_USER, get_auth_headers, set_data_path

client = TestClient(app)


DATA_PATH = set_data_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests():
    shutil.rmtree(DATA_PATH, ignore_errors=True)
    response = client.post(f"/user/create", json=TEST_USER.model_dump())
    assert response.status_code == status.HTTP_201_CREATED
    assert not response.json()

    yield

    shutil.rmtree(DATA_PATH, ignore_errors=True)


def assert_test_user(response):
    user = User(**response.json())
    assert user.username == TEST_USER.username
    assert user.full_name == TEST_USER.full_name
    assert user.email == TEST_USER.email


def test_get_user():
    headers = get_auth_headers(TEST_USER.username)
    response = client.get("/user/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert_test_user(response)


def test_create_existing_user():
    response = client.post(f"/user/create", json=TEST_USER.model_dump())
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()['detail'] == USER_EXISTS_ALREADY


def test_delete_user():
    headers = get_auth_headers(TEST_USER.username)
    response = client.delete("/user/delete", headers=headers)
    assert response.status_code == status.HTTP_202_ACCEPTED
    assert_test_user(response)

    response = client.get("/user/", headers=headers)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
