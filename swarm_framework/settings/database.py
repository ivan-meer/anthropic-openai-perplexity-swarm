import sqlite3
from typing import Any, Dict, Optional

class SettingsDatabase:
    def __init__(self, db_path: str = "settings.db"):
        self.connection = sqlite3.connect(db_path)
        self._create_tables()

    def _create_tables(self):
        with self.connection:
            self.connection.execute('''
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            ''')
            self.connection.execute('''
                CREATE TABLE IF NOT EXISTS metadata (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT NOT NULL,
                    value TEXT NOT NULL
                )
            ''')

    def get_setting(self, key: str) -> Optional[str]:
        cursor = self.connection.execute('SELECT value FROM settings WHERE key = ?', (key,))
        row = cursor.fetchone()
        return row[0] if row else None

    def set_setting(self, key: str, value: str) -> None:
        with self.connection:
            self.connection.execute('''
                INSERT INTO settings (key, value) VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            ''', (key, value))

    def get_metadata(self, key: str) -> Dict[int, str]:
        cursor = self.connection.execute('SELECT id, value FROM metadata WHERE key = ?', (key,))
        return {row[0]: row[1] for row in cursor.fetchall()}

    def add_metadata(self, key: str, value: str) -> None:
        with self.connection:
            self.connection.execute('''
                INSERT INTO metadata (key, value) VALUES (?, ?)
            ''', (key, value))
