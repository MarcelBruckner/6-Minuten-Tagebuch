from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List
from common.constants import WEEK_FORMAT

from common.quotes import get_random_quote


class Weekly(BaseModel):
    woche: datetime.date = Field(examples=[datetime.date.today()])

    class Wochenreflexion(BaseModel):
        meine_highlights_und_erfolge_der_woche: str = ""
        skala_wie_glücklich: int = 1
        text_wie_glücklich: str = ""

    class Wochenplanung(BaseModel):
        class SoSorgeIchFuerEineGuteWoche(BaseModel):
            berufsleben: str = ""
            privatleben: str = ""

        so_sorge_ich_fuer_eine_gute_woche: SoSorgeIchFuerEineGuteWoche = SoSorgeIchFuerEineGuteWoche(
            berufsleben="", privatleben="")
        darauf_freue_ich_mich: str = ""

    wochenreflexion: Wochenreflexion = Wochenreflexion(
        meine_highlights_und_erfolge_der_woche="", skala_wie_glücklich=0, text_wie_glücklich="")
    wochenplanung: Wochenplanung = Wochenplanung(so_sorge_ich_fuer_eine_gute_woche=Wochenplanung.SoSorgeIchFuerEineGuteWoche(
        berufsleben="", privatleben=""), darauf_freue_ich_mich="")

    notizen: str = ""
