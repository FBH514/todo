import os

from server.database import Database
from dotenv import load_dotenv

load_dotenv()


with Database(os.getenv("DB_NAME")) as db:
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, todo TEXT)
        """
    )
