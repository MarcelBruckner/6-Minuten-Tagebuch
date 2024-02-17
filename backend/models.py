from dataclasses import dataclass, field

import datetime
from typing import List, Tuple

from constants import DATE_FORMAT


@dataclass(eq=False)
class EintragModel:
    datum: datetime.date

    dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: List[str]
    dasNehmeIchMirHeuteVor: str
    heuteWirdGutWeil: str

    spruch: str

    einePositiveAffirmation: str
    dieSchoenstenMomentaAmHeutigenTag: List[str]
    morgenFreueIchMichAuf: str

    def __init__(self, datum, dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin: List[str] = None, dasNehmeIchMirHeuteVor: str = "", heuteWirdGutWeil: str = "", spruch: str = 'Wenn du "ja" sagst, dann sei dir sicher, dass du nicht "nein" zu dir selbst sagst; Paulo Cuelho', einePositiveAffirmation: str = "", dieSchoenstenMomentaAmHeutigenTag: List[str] = None, morgenFreueIchMichAuf: str = ""):
        self.datum = datum

        self.dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin = dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin if isinstance(
            dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin, list) else ["", "", ""]
        self.dasNehmeIchMirHeuteVor = dasNehmeIchMirHeuteVor
        self.heuteWirdGutWeil = heuteWirdGutWeil

        self.spruch = spruch

        self.einePositiveAffirmation = einePositiveAffirmation
        self.dieSchoenstenMomentaAmHeutigenTag = dieSchoenstenMomentaAmHeutigenTag if isinstance(
            dieSchoenstenMomentaAmHeutigenTag, list) else ["", "", ""]
        self.morgenFreueIchMichAuf = morgenFreueIchMichAuf

    @staticmethod
    def from_json(data: dict):
        datum = datetime.datetime.strptime(data['datum'], DATE_FORMAT).date()
        del data['datum']
        return EintragModel(datum=datum, **data)

    def __eq__(self, other):
        return self.__dict__ == other.__dict__
