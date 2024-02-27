
import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from common.constants import RESOURCE_NOT_FOUND
from common.quotes import get_random_quote

from models.daily import Daily
import database.daily as daily_db
from models.user import User
from routers import auth


router = APIRouter(
    prefix="/daily",
    tags=["daily"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{datum}", response_model=Daily)
async def get_daily(datum: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    daily = daily_db.read_daily(current_user, datum)
    if not daily:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=RESOURCE_NOT_FOUND)
    return daily


@router.get("/range/", response_model=List[Daily])
async def get_dailies_in_date_range(current_user: Annotated[User, Depends(auth.get_current_active_user)], start_date: datetime.date | None = None, end_date: datetime.date | None = None):
    dailies = daily_db.read_dailies(
        current_user, start_date=start_date, end_date=end_date)
    return dailies


@router.get("/last/", response_model=List[Daily])
async def get_last_dailies(current_user: Annotated[User, Depends(auth.get_current_active_user)], number: int = 5, end_date: datetime.date = datetime.date.today()):
    dailies = daily_db.read_last_dailies(
        current_user, number=number, end_date=end_date)
    return dailies


@router.post("/", status_code=status.HTTP_201_CREATED)
async def post_daily(daily_or_date: Daily | datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    daily = daily_or_date
    if type(daily_or_date) == datetime.date:
        daily = Daily(datum=daily_or_date)
    if not daily.spruch:
        daily.spruch = get_random_quote(daily.datum)
    daily_db.write_daily(current_user, daily)
    return daily


@router.delete("/{date}", status_code=status.HTTP_202_ACCEPTED)
async def delete_daily(date: datetime.date, current_user: Annotated[User, Depends(auth.get_current_active_user)]):
    daily_db.delete_daily(user=current_user, datum=date)
    return date
