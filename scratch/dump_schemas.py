import sqlite3
import json

tables = [
    'hostel_requests',
    'marketplace_listings',
    'resumes',
    'gamification',
    'library_resources',
    'transportation_routes',
    'alumni_mentors',
    'wellness_resources',
    'campus_polls',
    'broadcast_alerts',
    'calendar_events',
    'lost_and_found',
    'facilities',
    'bookings',
    'event_registrations',
    'studentlife_grievance',
    'studentlife_club',
    'studentlife_club_application',
    'studentlife_club_member',
]

conn = sqlite3.connect('database/student_helpdesk.db')
conn.row_factory = sqlite3.Row

schemas = {}
for t in tables:
    try:
        columns = conn.execute(f"PRAGMA table_info({t})").fetchall()
        schemas[t] = [dict(c) for c in columns]
    except Exception as e:
        schemas[t] = str(e)

with open('scratch/schemas.json', 'w') as f:
    json.dump(schemas, f, indent=2)

print("Done")
