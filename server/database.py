import sqlite3
from typing import Optional, List


class Database:
    """Defines the Database object."""

    def __init__(self, database_name: str) -> None:
        """
        Instantiates the Database object.
        """
        self.extension = ".db"
        if not database_name.endswith(self.extension):
            raise ValueError("Database name must end with {}".format(self.extension))
        self._name: str = database_name
        self.conn: sqlite3.Connection = self.connect(self._name)
        self.cur: sqlite3.Cursor = self.cursor()

    def __enter__(self) -> 'Database':
        """
        Context manager enter method.
        :return: Database
        """
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        """
        Context manager exit method.
        :param exc_type: Exception
        :param exc_val: Exception
        :param exc_tb: Exception
        :return: None
        """
        self.conn.close()

    @property
    def database_name(self) -> str:
        """
        Database name property.
        :return: str
        """
        return self._name

    @database_name.setter
    def database_name(self, value: str) -> None:
        """
        Database name setter.
        :param value: str
        :return: None
        """
        self._name = value

    @staticmethod
    def connect(database_name: str) -> sqlite3.Connection:
        """
        Connects to the database.
        :param database_name: str
        :return: sqlite3.Connection
        """
        if not database_name:
            raise ValueError("Database name cannot be empty.")
        return sqlite3.connect(database_name)

    def cursor(self) -> sqlite3.Cursor:
        """
        Creates a cursor object.
        :return: sqlite3.Cursor
        """
        if not self.conn:
            raise ValueError("Connection object cannot be empty.")
        return self.conn.cursor()

    def commit(self) -> None:
        """
        Commits the changes to the database.
        :return: None
        """
        self.conn.commit()

    def execute(self, sql: str, data: dict = None) -> Optional[List[tuple]]:
        """
        Executes the SQL statement.
        :param sql: str
        :param data: dict
        :return: Optional[List[tuple]]
        """
        if not sql:
            raise ValueError("SQL statement cannot be empty.")
        if data:
            self.cur.execute(sql, data)
            self.commit()
        else:
            self.cur.execute(sql)
            return self.cur.fetchall()
