
import datetime
from typing import Annotated
from fastapi import APIRouter, Depends

from models import EintragModel, User
from persistence import read_eintrag, write_eintrag
from routers import auth


router = APIRouter(
    prefix="/eintrag",
    tags=["eintrag"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{datum}", response_model=EintragModel, tags=["eintrag"])
async def getEintrag(datum: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    eintrag = read_eintrag(current_user, datum)
    return eintrag


@router.post("/", response_model=bool, tags=["eintrag"])
async def postEintrag(eintrag: EintragModel, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    return write_eintrag(current_user, eintrag)
