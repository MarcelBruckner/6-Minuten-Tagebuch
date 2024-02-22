import os


def get_database_path():
    database_path = os.environ.get("DATABASE_PATH", "data/db.sqlite")
    print("Database path: ", database_path)
    return database_path


def get_access_token_expires_minutes():
    return int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 60*24))


def get_app_secret_key():
    return os.environ.get('APP_SECRET_KEY', '4352c9036368100cb0e7292aae9c0d10eee244b147a1a53148c2cfd19ecbd324')
