import os


def get_data_path():
    data_path = os.environ.get("DATA_PATH", "data")
    return data_path


def get_access_token_expires_minutes():
    return int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 1440))


def get_app_secret_key():
    return os.environ.get('APP_SECRET_KEY', 'YF3FUdiO7NZkcpzcxi69kFP7XHdyLPclf+BnMJAO9Kg=')
