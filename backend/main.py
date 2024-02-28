
import argparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from routers import user, daily, auth, weekly


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title="6-Minuten Tagebuch",
    generate_unique_id_function=custom_generate_unique_id,
    separate_input_output_schemas=False)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(daily.router)
app.include_router(weekly.router)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
