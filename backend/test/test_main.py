import datetime
from fastapi.testclient import TestClient
from main import app
from models import EintragModel

client = TestClient(app)


def test_get_eintrag():
    datum = datetime.date(2024, 2, 16)
    expected_eintrag = EintragModel(datum=datum)

    response = client.get(f"/eintrag/{datum}")
    assert response.status_code == 200

    actual_eintrag_json = response.json()
    actual_eintrag = EintragModel.from_json(actual_eintrag_json)
    assert actual_eintrag == expected_eintrag
