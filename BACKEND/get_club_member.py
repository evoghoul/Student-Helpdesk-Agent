import sqlite3; conn = sqlite3.connect("c:/StudentHelpdesk/database/student_helpdesk.db"); print(conn.execute("PRAGMA table_info(studentlife_club_member)").fetchall())
