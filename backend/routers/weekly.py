
import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from common.constants import RESOURCE_NOT_FOUND
from common.quotes import get_random_quote

from models.weekly import Weekly
import database.weekly as weekly_db
from models.user import User
from routers import auth


router = APIRouter(
    prefix="/weekly",
    tags=["weekly"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{datum}", response_model=Weekly)
async def get_daily(datum: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    weekly = weekly_db.read_weekly(current_user, datum)
    if not weekly:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=RESOURCE_NOT_FOUND)
    return weekly


@router.get("/range/", response_model=List[Weekly])
async def get_weeklies_in_date_range(current_user: Annotated[User, Depends(auth.get_current_active_user)], start_date: datetime.date | None = None, end_date: datetime.date | None = None):
    weeklies = weekly_db.read_weeklies(
        current_user, start_date=start_date, end_date=end_date)
    return weeklies


@router.get("/last/", response_model=List[Weekly])
async def get_last_weeklies(current_user: Annotated[User, Depends(auth.get_current_active_user)], number: int = 5, end_date: datetime.date = datetime.date.today()):
    weeklies = weekly_db.read_last_weeklies(
        current_user, number=number, end_date=end_date)
    return weeklies


@router.post("/", status_code=status.HTTP_201_CREATED)
async def post_weekly(weekly_or_date: Weekly | datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    weekly = weekly_or_date
    if type(weekly_or_date) == datetime.date:
        weekly = Weekly(datum=weekly_or_date)
    weekly_db.write_weekly(current_user, weekly)
    return weekly


@router.delete("/{date}", status_code=status.HTTP_202_ACCEPTED)
async def delete_weekly(date: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    weekly_db.delete_weekly(user=current_user, week=date)
    return date
