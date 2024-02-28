import datetime
import os
import pathlib

from faker import Faker
from models.daily import Daily
from models.user import UserIn, UserInDB
from models.weekly import Weekly
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
TEST_DAILIES = [Daily(datum=TEST_DATUM + datetime.timedelta(days=i),
                      so_sorge_ich_fuer_einen_guten_tag=fake.sentence(),
                      tolle_dinge_die_ich_heute_erlebt_habe=[
    fake.sentence(), fake.sentence(), fake.sentence()],
    ich_bin_dankbar_fuer=[
    fake.sentence(), fake.sentence(), fake.sentence()],
    was_habe_ich_heute_gutes_getan=fake.sentence(),
    positive_selbstbekraeftigung=fake.sentence(),
    was_habe_ich_heute_gelernt=fake.sentence(),
    spruch=fake.sentence(),
    notizen=fake.sentence()) for i in range(10)]


TEST_WEEKLIES = [Weekly(
    woche=TEST_DATUM + datetime.timedelta(weeks=i),
    wochenplanung=Weekly.Wochenplanung(
        darauf_freue_ich_mich=fake.sentence(),
        so_sorge_ich_fuer_eine_gute_woche=Weekly.Wochenplanung.SoSorgeIchFuerEineGuteWoche(
            berufsleben=fake.sentence(), privatleben=fake.sentence())
    ),
    wochenreflexion=Weekly.Wochenreflexion(
        meine_highlights_und_erfolge_der_woche=fake.sentence(),
        skala_wie_glücklich=i,
        text_wie_glücklich=fake.sentence()
    ),
    notizen=fake.sentence()) for i in range(10)]


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
