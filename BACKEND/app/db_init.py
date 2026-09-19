"""db_init.py - Bootstraps optional Postgres tables and seeds demo data on startup."""
import logging
logger = logging.getLogger(__name__)


def init_postgres_schema():
    from app.database import is_postgres_configured, get_db_connection
    if not is_postgres_configured():
        return
    logger.info("PostgreSQL detected - bootstrapping optional tables...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        _create_tables(cur)
        conn.commit()
        logger.info("Schema bootstrap complete.")
        _seed_clubs(cur, conn)
        _seed_locations(cur, conn)
        cur.close()
        conn.close()
    except Exception as e:
        logger.error(f"db_init failed (non-fatal): {e}")


def _create_tables(cur):
    cur.execute("CREATE TABLE IF NOT EXISTS fresher_faqs (faq_id TEXT PRIMARY KEY, topic TEXT NOT NULL, question TEXT NOT NULL, answer TEXT NOT NULL, keywords TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS campus_locations (location_id TEXT PRIMARY KEY, room_number TEXT NOT NULL, block TEXT NOT NULL, floor TEXT NOT NULL, description TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS circulars (circular_id TEXT PRIMARY KEY, title TEXT NOT NULL, summary TEXT, issued_by TEXT, issued_date TEXT, category TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS policies (policy_id TEXT PRIMARY KEY, title TEXT NOT NULL, summary TEXT, category TEXT, effective_date TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS studentlife_club (club_id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, description TEXT, faculty_advisor TEXT, meeting_schedule TEXT, contact_email TEXT, member_count INTEGER DEFAULT 0)")
    cur.execute("CREATE TABLE IF NOT EXISTS studentlife_club_application (id SERIAL PRIMARY KEY, club_id TEXT, student_name TEXT, student_id TEXT, status TEXT DEFAULT 'Pending', applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")


def _get_count(cur, table):
    cur.execute(f"SELECT COUNT(*) as cnt FROM {table}")
    row = cur.fetchone()
    return row.get("cnt", 0) if hasattr(row, "get") else (row[0] if row else 0)


def _seed_clubs(cur, conn):
    if _get_count(cur, "studentlife_club") > 0:
        return
    PLCH = "PLACEHOLDER"
    ph = ",".join([PLCH.replace("PLACEHOLDER", "%s")] * 8)
    sql = f"INSERT INTO studentlife_club (club_id,name,category,description,faculty_advisor,meeting_schedule,contact_email,member_count) VALUES ({ph}) ON CONFLICT (club_id) DO NOTHING"
    clubs = [
        ("club-001", "VIGNAN Robotics Club", "Technical", "Build and program robots; participate in national robo-wars.", "Dr. K. Suresh Kumar", "Every Saturday 10:00 AM - 12:00 PM, R-Block Lab 3", "robotics@vignan.ac.in", 48),
        ("club-002", "CodeVignan - Programming Club", "Technical", "Competitive programming, hackathons and open-source contributions.", "Prof. M. Lakshmi Prasad", "Tuesdays and Thursdays 4:00 PM - 6:00 PM, CSE Seminar Hall", "codevignan@vignan.ac.in", 120),
        ("club-003", "AI and ML Student Circle", "Technical", "Explore ML and deep learning; host guest lectures and kaggle competitions.", "Dr. P. Ramana Reddy", "Wednesdays 3:30 PM - 5:30 PM, IT Block Room 204", "aiml.circle@vignan.ac.in", 75),
        ("club-004", "NSS - National Service Scheme", "Social", "Community service, blood donation drives and environment conservation campaigns.", "Dr. S. Padmaja", "Sundays 9:00 AM - 1:00 PM, NSS Office (Admin Block)", "nss@vignan.ac.in", 200),
        ("club-005", "VIGNAN Cultural Association (VCA)", "Cultural", "Annual cultural fest ZEST, music, drama and dance performances.", "Prof. A. Kavitha", "Fridays 5:00 PM - 7:00 PM, Open Auditorium", "vca@vignan.ac.in", 160),
        ("club-006", "Entrepreneurship Development Cell (EDC)", "Entrepreneurship", "Startup mentoring, business plan competitions and incubation support.", "Dr. B. Nageswara Rao", "1st and 3rd Saturday 11:00 AM - 1:00 PM, EDC Room (MBA Block)", "edc@vignan.ac.in", 55),
        ("club-007", "Photography and Media Club", "Creative Arts", "Photography workshops, campus journalism and short film making.", "Mr. C. Kiran Kumar", "Saturdays 2:00 PM - 4:00 PM, Media Lab (C-Block)", "media.club@vignan.ac.in", 40),
        ("club-008", "Sports and Athletic Association", "Sports", "Cricket, football, basketball, volleyball and inter-college tournaments.", "Mr. D. Venkat Rao", "Daily 6:00 AM - 8:00 AM and 5:00 PM - 7:00 PM, Sports Complex", "sports@vignan.ac.in", 180),
        ("club-009", "IEEE Student Branch", "Technical", "IEEE-affiliated community; paper presentations and industry visits.", "Dr. T. Harikrishna", "Alternate Mondays 3:00 PM - 5:00 PM, ECE Seminar Hall", "ieee.vignan@vignan.ac.in", 90),
        ("club-010", "Literary and Debate Club", "Academic", "Debates, elocution, quiz competitions, creative writing and MUN preparation.", "Prof. L. Sarada Devi", "Wednesdays 4:00 PM - 6:00 PM, Library Conference Room", "literary.club@vignan.ac.in", 60),
    ]
    for c in clubs:
        cur.execute(sql, c)
    conn.commit()
    logger.info(f"Seeded {len(clubs)} demo clubs.")


def _seed_locations(cur, conn):
    if _get_count(cur, "campus_locations") > 0:
        return
    PLCH = "PLACEHOLDER"
    ph = ",".join([PLCH.replace("PLACEHOLDER", "%s")] * 5)
    sql = f"INSERT INTO campus_locations (location_id,room_number,block,floor,description) VALUES ({ph}) ON CONFLICT (location_id) DO NOTHING"
    locs = [
        ("loc-001", "A-101", "A Block", "Ground Floor", "Lecture Hall - CSE Department"),
        ("loc-002", "B-201", "B Block", "First Floor", "ECE Lab - Electronics Lab 1"),
        ("loc-003", "C-301", "C Block", "Third Floor", "Media Lab and Photography Studio"),
        ("loc-004", "D-101", "D Block", "Ground Floor", "Civil Engineering Drawing Hall"),
        ("loc-005", "N-101", "N Block", "Ground Floor", "N Block Lecture Hall - CSE/IT"),
        ("loc-006", "N-201", "N Block", "Second Floor", "N Block Faculty Cabins"),
        ("loc-007", "U-101", "U Block", "Ground Floor", "U Block Lecture Hall - ECE/EEE"),
        ("loc-008", "R-101", "R Block", "Ground Floor", "Robotics Lab"),
        ("loc-009", "IT-204", "IT Block", "Second Floor", "AI and ML Lab"),
        ("loc-010", "LIB-001", "Library Block", "Ground Floor", "Main Library - Reading Hall"),
        ("loc-011", "ADM-001", "Admin Block", "Ground Floor", "Principal Office"),
        ("loc-012", "ADM-002", "Admin Block", "Ground Floor", "Registrar Office"),
        ("loc-013", "ADM-003", "Admin Block", "First Floor", "Examination Cell"),
        ("loc-014", "MHP-001", "MHP Block", "Ground Floor", "Mental Health and Psychology Centre"),
        ("loc-015", "G-001", "G Block", "Ground Floor", "Girls Hostel Reception"),
        ("loc-016", "H-001", "H Block", "Ground Floor", "Boys Hostel Reception"),
        ("loc-017", "F-101", "F Block", "Ground Floor", "MBA Lecture Hall"),
        ("loc-018", "E-205", "E Block", "Second Floor", "Mechanical Workshop"),
        ("loc-019", "CANTEEN", "Campus Centre", "Ground Floor", "Main Cafeteria and Food Court"),
        ("loc-020", "SPORTS", "Sports Complex", "Ground Floor", "Sports Ground and Indoor Stadium"),
    ]
    for l in locs:
        cur.execute(sql, l)
    conn.commit()
    logger.info(f"Seeded {len(locs)} campus locations.")
