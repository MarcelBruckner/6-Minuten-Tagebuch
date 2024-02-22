
import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status

from models.eintrag import Eintrag
from database.eintrag import read_eintraege, read_eintrag, read_last_eintraege, write_eintrag
from models.user import User
from routers import auth


router = APIRouter(
    prefix="/eintrag",
    tags=["eintrag"],
    responses={404: {"description": "Not found"}},
)

EINTRAG_NOT_FOUND = "Eintrag not found!"


@router.get("/{datum}", response_model=Eintrag)
async def get_eintrag(datum: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    eintrag = read_eintrag(current_user, datum)
    if not eintrag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=EINTRAG_NOT_FOUND)
    return eintrag


@router.get("/range/", response_model=List[Eintrag])
async def get_eintraege_in_date_range(current_user: Annotated[User, Depends(auth.get_current_active_user)], start_date: datetime.date = datetime.date(1970, 1, 1), end_date: datetime.date = datetime.date.today()):
    eintraege = read_eintraege(
        current_user, start_date=start_date, end_date=end_date)
    return eintraege


@router.get("/last/", response_model=List[Eintrag])
async def get_last_eintraege(current_user: Annotated[User, Depends(auth.get_current_active_user)], number: int = 5, end_date: datetime.date = datetime.date.today()):
    eintraege = read_last_eintraege(
        current_user, number=number, end_date=end_date)
    return eintraege


@router.put("/", status_code=status.HTTP_201_CREATED)
async def put_eintrag(eintrag: Eintrag, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    write_eintrag(current_user, eintrag)
    return eintrag
