import datetime

from faker import Faker
from database.eintrag import write_eintraege, write_eintrag

from models.eintrag import Eintrag
from models.user import User

Faker.seed(4321)
fake = Faker()

today = datetime.date.today()
eintraege = [Eintrag(datum=today - datetime.timedelta(days=i),
                     dasNehmeIchMirHeuteVor=fake.sentence(),
                     dieSchoenstenMomenteAmHeutigenTag=[
    fake.sentence(), fake.sentence(), fake.sentence()],
    dreiGrosseOderKleineDingeFuerDieIchHeuteDankbarBin=[
    fake.sentence(), fake.sentence(), fake.sentence()],
    einePositiveAffirmation=fake.sentence(),
    heuteWirdGutWeil=fake.sentence(),
    morgenFreueIchMichAuf=fake.sentence(),
    spruch=fake.sentence()) for i in range(100)]
me = User(username="Marcel", full_name="Marcel Bruckner",
          email="mbruckner94@gmail.com")

write_eintraege(me, eintraege)
