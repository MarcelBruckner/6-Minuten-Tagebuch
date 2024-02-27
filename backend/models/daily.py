from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List

from common.quotes import get_random_quote


class Daily(BaseModel):
    datum: datetime.date = Field(examples=[datetime.date.today()])

    ich_bin_dankbar_fuer: List[str] = [
        "", "", ""]
    so_sorge_ich_fuer_einen_guten_tag: str = ""
    positive_selbstbekraeftigung: str = ""

    spruch: str = ""

    was_habe_ich_heute_gutes_getan: str = ""
    was_habe_ich_heute_gelernt: str = ""
    tolle_dinge_die_ich_heute_erlebt_habe: List[str] = ["", "", ""]

    notizen: str = ""
