import datetime

from models import EintragModel
from persistence import delete_eintrag, read_eintrag, write_eintrag


def test_read_eintrag():
    datum = datetime.date(1970, 1, 1)
    actual_eintrag = read_eintrag(datum)
    assert isinstance(actual_eintrag, EintragModel)


def test_eintrag():
    datum = datetime.date(1970, 1, 1)
    expected_eintrag = EintragModel(datum=datum,
                                    dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin=[
                                        "a", "b", "c"],
                                    dasNehmeIchMirHeuteVor="dasNehmeIchMirHeuteVor",
                                    heuteWirdGutWeil="heuteWirdGutWeil",
                                    morgenFreueIchMichAuf="morgenFreueIchMichAuf",
                                    dieSchoenstenMomentaAmHeutigenTag=[
                                        "x", "y", "z"],
                                    einePositiveAffirmation="einePositiveAffirmation",
                                    spruch="spruch")

    write_eintrag(expected_eintrag)
    actual_eintrag = read_eintrag(datum)

    assert expected_eintrag == actual_eintrag

    assert delete_eintrag(datum)
