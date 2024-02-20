import datetime
from routers.auth import create_access_token, GENERAL_TEST_USER

ACCESS_TOKEN_EXPIRES = datetime.timedelta(30)


def get_auth_headers():
    access_token = create_access_token(
        data={"sub": GENERAL_TEST_USER.username}, expires_delta=ACCESS_TOKEN_EXPIRES
    )
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    return headers
