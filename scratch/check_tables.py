import sqlite3
conn = sqlite3.connect('database/student_helpdesk.db')
tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print([x[0] for x in tables])
