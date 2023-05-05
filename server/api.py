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
@app.get("/todos/")
async def get_todos(response: Response) -> list:
    with Database(os.getenv("DB_NAME")) as db:
        data = []
        for row in db.execute(os.getenv("SELECT_ALL")):
            data.append({
                "id": row[0],
                "todo": row[1],
            })
        return data


@app.post("/todos/add")
async def add_todos(response: Response, request: Request) -> dict:
    """
    Adds a todo to the database.
    :param response: Response
    :param request: Request
    :return: dict
    """
    with Database(os.getenv("DB_NAME")) as db:
        data = await request.json()
        todo = data.get("todo")
        if not todo:
            response.status_code = 400
            return {"error": "todo cannot be empty."}
        db.execute(os.getenv("INSERT_TODO"), {"todo": todo})
        return {"success": "todo added successfully."}


@app.delete("/todos/delete/")
async def remove_todos(response: Response, request: Request) -> dict:
    """
    Removes a todo from the database.
    :param response: Response
    :param request: Request
    :return: dict
    """
    data = await request.json()
    todo_id = data.get("id")
    with Database(os.getenv("DB_NAME")) as db:
        db.execute(os.getenv("DELETE_TODO"), {"id": todo_id})
        return {"success": "todo removed successfully."}
