# 
FROM python:3.10

# 
WORKDIR /app

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./routers /app/routers
COPY ./database /app/database
COPY ./models /app/models
COPY ./common /app/common
COPY ./*.py /app

# 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "81"]