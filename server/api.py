import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from starlette.requests import Request
from database import Database
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class Cache:
    """Defines the Cache decorator object."""

    def __init__(self, minutes: int) -> None:
        """
        Instantiates the Cache decorator.
        :param minutes: int
        """
        self.minutes = minutes

    def __call__(self, function: callable) -> callable:
        """
        Decorator function.
        :param function: callable
        :return: callable
        """
        def wrapper(*args, **kwargs) -> callable:
            response: Response = args[0]
            response.headers['Cache-Control'] = "public, max-age={}".format(self.minutes)
            return function(*args, **kwargs)
        return wrapper


@Cache(15)
@app.get("/sightings/")
async def get_sightings(response: Response) -> list:
    with Database(os.getenv("DB_NAME")) as db:
        data = []
        for row in db.execute(os.getenv("SELECT_ALL")):
            data.append({
                "id": row[0],
                "sighting": row[1],
            })
        return data


@app.post("/sightings/add")
async def add_sightings(response: Response, request: Request) -> dict:
    """
    Adds a sighting to the database.
    :param response: Response
    :param request: Request
    :return: dict
    """
    with Database(os.getenv("DB_NAME")) as db:
        data = await request.json()
        sighting = data.get("sighting")
        print(data)
        if not sighting:
            response.status_code = 400
            return {"error": "Sighting cannot be empty."}
        db.execute(os.getenv("INSERT_SIGHTING"), {"sighting": sighting})
        return {"success": "Sighting added successfully."}
