from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List


class Eintrag(BaseModel):
    datum: datetime.date = Field(examples=[datetime.date.today()])

    dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: List[str] = [
        "", "", ""]
    dasNehmeIchMirHeuteVor: str = ""
    heuteWirdGutWeil: str = ""

    spruch: str = ''

    einePositiveAffirmation: str = ""
    dieSchoenstenMomenteAmHeutigenTag: List[str] = ["", "", ""]
    morgenFreueIchMichAuf: str = ""
