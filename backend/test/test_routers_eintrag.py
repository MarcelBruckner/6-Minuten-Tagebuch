import datetime
from fastapi.testclient import TestClient
from main import app
from models.eintrag import EintragModel
from utils import get_auth_headers

client = TestClient(app)


def test_get_eintrag():
    datum = datetime.date(1970, 1, 1)
    expected_eintrag = EintragModel(datum=datum)

    headers = get_auth_headers()
    response = client.get(f"/eintrag/{datum}", headers=headers)
    assert response.status_code == 200

    actual_eintrag_json = response.json()
    actual_eintrag = EintragModel(**actual_eintrag_json)
    assert actual_eintrag == expected_eintrag
