from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List


class Eintrag(BaseModel):
    datum: datetime.date = Field(examples=[datetime.date.today()])

    dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: List[str] = [
        "", "", ""]
    dasNehmeIchMirHeuteVor: str = ""
    heuteWirdGutWeil: str = ""

    spruch: str = 'Wenn du "ja" sagst, dann sei dir sicher, dass du nicht "nein" zu dir selbst sagst; Paulo Cuelho'

    einePositiveAffirmation: str = ""
    dieSchoenstenMomenteAmHeutigenTag: List[str] = ["", "", ""]
    morgenFreueIchMichAuf: str = ""
