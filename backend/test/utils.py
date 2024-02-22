import datetime
import os
import pathlib

from faker import Faker
from models.eintrag import Eintrag
from models.user import UserIn, UserInDB
from routers.auth import create_access_token

ACCESS_TOKEN_EXPIRES = datetime.timedelta(30)

Faker.seed(4321)
fake = Faker()

TEST_USERS_IN_DB = [UserInDB(username=fake.name(), email=fake.email(), full_name=fake.name(),
                             hashed_password=fake.password()) for _ in range(10)]
TEST_USER = UserIn(email=TEST_USERS_IN_DB[0].email,
                   password=fake.password(),
                   username=TEST_USERS_IN_DB[0].username,
                   full_name=TEST_USERS_IN_DB[0].full_name)

TEST_DATUM = datetime.date(1980, 1, 1)
TEST_EINTRAEGE = [Eintrag(datum=TEST_DATUM + datetime.timedelta(days=i),
                          dasNehmeIchMirHeuteVor=fake.sentence(),
                          dieSchoenstenMomenteAmHeutigenTag=[
    fake.sentence(), fake.sentence(), fake.sentence()],
    dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin=[
    fake.sentence(), fake.sentence(), fake.sentence()],
    einePositiveAffirmation=fake.sentence(),
    heuteWirdGutWeil=fake.sentence(),
    morgenFreueIchMichAuf=fake.sentence(),
    spruch=fake.sentence()) for i in range(10)]


def get_auth_headers(username: str):
    access_token = create_access_token(
        data={"sub": username}, expires_delta=ACCESS_TOKEN_EXPIRES
    )
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    return headers


def set_data_path(filename: str) -> str:
    data_path = str(pathlib.Path(
        "tmp", "tests", os.path.basename(filename)))
    os.environ['DATA_PATH'] = data_path
    return data_path
