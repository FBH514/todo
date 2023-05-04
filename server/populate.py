import os

from server.database import Database
from dotenv import load_dotenv

load_dotenv()

with Database(os.getenv("DB_NAME")) as db:
    db.execute(
        """
        INSERT INTO sightings (sighting) VALUES (:sighting)
        """,
        {"sighting": "I saw a bear!"}
    )
