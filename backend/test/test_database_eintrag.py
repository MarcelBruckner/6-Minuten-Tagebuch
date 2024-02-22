import datetime
from database.eintrag import delete_user_data, read_eintrag, write_eintrag
from database.user import GENERAL_TEST_USER
from models.eintrag import EintragModel


TEST_USER = GENERAL_TEST_USER
PATH = ["tmp", "tests", "database"]


def test_read_eintrag():
    datum = datetime.date(1970, 1, 1)
    actual_eintrag = read_eintrag(TEST_USER, datum, *PATH)
    assert isinstance(actual_eintrag, EintragModel)


def test_read_write_eintrag():
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

    write_eintrag(TEST_USER, expected_eintrag, *PATH)
    actual_eintrag = read_eintrag(TEST_USER, datum, *PATH)

    assert expected_eintrag == actual_eintrag

    assert delete_user_data(TEST_USER, *PATH)
