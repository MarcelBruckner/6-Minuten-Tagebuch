import pathlib
from faker import Faker
from fastapi.testclient import TestClient
import pytest
from fastapi import status
from main import app
from models.user import UserIn
from routers.user import UserCreationResponse, UserDeletionResponse
from utils import get_auth_headers, set_database_path

client = TestClient(app)

Faker.seed(4321)
fake = Faker()

TEST_USER = UserIn(username=fake.name(),
                   email=fake.email(),
                   full_name=fake.name(),
                   password=fake.password())

DATABASE_PATH = set_database_path(__file__)


@pytest.fixture(autouse=True)
def run_around_tests():
    pathlib.Path(DATABASE_PATH).unlink(missing_ok=True)

    yield

    pathlib.Path(DATABASE_PATH).unlink(missing_ok=True)


def test_create_user():
    response = client.post(f"/user/create", json=TEST_USER.model_dump())
    assert response.status_code == UserCreationResponse.CREATED.value.status_code

    repsonse_json = response.json()
    assert repsonse_json['status_code'] == UserCreationResponse.CREATED.value.status_code
    assert repsonse_json['message'] == UserCreationResponse.CREATED.value.message


def test_create_existing_user():
    response = client.post(f"/user/create", json=TEST_USER.model_dump())
    response = client.post(f"/user/create", json=TEST_USER.model_dump())
    assert response.status_code == UserCreationResponse.CONFLICT.value.status_code

    repsonse_json = response.json()
    assert repsonse_json['status_code'] == UserCreationResponse.CONFLICT.value.status_code
    assert repsonse_json['message'] == UserCreationResponse.CONFLICT.value.message


def test_delete_user():
    response = client.post("/user/create", json=TEST_USER.model_dump())
    assert response.status_code == UserCreationResponse.CREATED.value.status_code

    headers = get_auth_headers(TEST_USER.username)
    response = client.get("/user/", headers=headers)
    assert response.status_code == status.HTTP_200_OK

    response = client.delete("/user/delete", headers=headers)
    assert response.status_code == UserDeletionResponse.DELETED.value.status_code

    response = client.get("/user/", headers=headers)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
