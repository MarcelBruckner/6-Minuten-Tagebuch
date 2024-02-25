
import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from common.quotes import get_random_quote

from models.eintrag import Eintrag
import database.eintrag as eintrag_db
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
    eintrag = eintrag_db.read_eintrag(current_user, datum)
    if not eintrag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=EINTRAG_NOT_FOUND)
    return eintrag


@router.get("/range/", response_model=List[Eintrag])
async def get_eintraege_in_date_range(current_user: Annotated[User, Depends(auth.get_current_active_user)], start_date: datetime.date | None = None, end_date: datetime.date | None = None):
    eintraege = eintrag_db.read_eintraege(
        current_user, start_date=start_date, end_date=end_date)
    return eintraege


@router.get("/last/", response_model=List[Eintrag])
async def get_last_eintraege(current_user: Annotated[User, Depends(auth.get_current_active_user)], number: int = 5, end_date: datetime.date = datetime.date.today()):
    eintraege = eintrag_db.read_last_eintraege(
        current_user, number=number, end_date=end_date)
    return eintraege


@router.post("/", status_code=status.HTTP_201_CREATED)
async def post_eintrag(eintrag_or_date: Eintrag | datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    eintrag = eintrag_or_date
    if type(eintrag_or_date) == datetime.date:
        eintrag = Eintrag(datum=eintrag_or_date)
    if not eintrag.spruch:
        eintrag.spruch = get_random_quote(eintrag.datum)
    print(eintrag.datum, eintrag.spruch)
    eintrag_db.write_eintrag(current_user, eintrag)
    return eintrag


@router.delete("/{date}", status_code=status.HTTP_202_ACCEPTED)
async def delete_eintrag(date: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    eintrag_db.delete_eintrag(user=current_user, datum=date)
    return date
