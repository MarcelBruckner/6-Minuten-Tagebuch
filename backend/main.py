import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from persistence import read_eintrag, write_eintrag

from models import EintragModel


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title="6-Minuten Tagebuch",
    generate_unique_id_function=custom_generate_unique_id)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/eintrag/{datum}", response_model=EintragModel, tags=["eintrag"])
async def getEintrag(datum: datetime.date):
    eintrag = read_eintrag(datum)
    assert isinstance(eintrag, EintragModel)
    return eintrag


@app.post("/eintrag/", response_model=bool, tags=["eintrag"])
async def postEintrag(eintrag: EintragModel):
    return write_eintrag(eintrag)
