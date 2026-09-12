import uuid
import datetime
import os
import sqlite3
from typing import Dict, Any, List, Optional
from app.config import settings

class DatabaseSession:
    """
    A context-scoped database session that enforces Row-Level Security (RLS).
    The session holds the verified student_id and user_id.
    Queries executed through this session strictly enforce the student boundary.
    """
    def __init__(self, student_id: Optional[str] = None, user_id: Optional[str] = None):
        self.student_id = student_id
        self.user_id = user_id

# ---------------- In-Memory Data Store (Fulfills all PS requirements out-of-the-box) ----------------

# 1. Users & Students (from 02_people_identity and 99_smoke_test)
STUDENTS_DB = {
    "cccccccc-0000-0000-0000-000000000001": {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "user_id": "eeeeeeee-0000-0000-0000-000000000001",
        "roll_no": "24CSE001",
        "username": "24cse001",
        "password_hash": "student123", # Plain/mock accepted
        "full_name": "Asha Reddy",
        "gender": "F",
        "email": "asha@acme.edu",
        "programme_code": "BTCSE",
        "programme_name": "B.Tech Computer Science and Engineering",
        "department_code": "CSE",
        "batch_label": "2024-28 CSE",
        "section_code": "A",
        "current_year_of_study": 2,
        "cgpa": 8.45,
        "backlog_count": 0,
        "overall_attendance_pct": 78.4,
        "fee_outstanding": 12500.00,
        "mentor_name": "Dr. Meera Iyer (Associate Professor, CSE)",
        "status": "ACTIVE"
    },
    "cccccccc-0000-0000-0000-000000000002": {
        "student_id": "cccccccc-0000-0000-0000-000000000002",
        "user_id": "eeeeeeee-0000-0000-0000-000000000002",
        "roll_no": "24CSE002",
        "username": "24cse002",
        "password_hash": "student123",
        "full_name": "Rahul Verma",
        "gender": "M",
        "email": "rahul@acme.edu",
        "programme_code": "BTCSE",
        "programme_name": "B.Tech Computer Science and Engineering",
        "department_code": "CSE",
        "batch_label": "2024-28 CSE",
        "section_code": "A",
        "current_year_of_study": 2,
        "cgpa": 6.80,
        "backlog_count": 2,
        "overall_attendance_pct": 68.0,
        "fee_outstanding": 45000.00,
        "mentor_name": "Dr. Meera Iyer (Associate Professor, CSE)",
        "status": "ACTIVE"
    }
}

# 2. Attendance Summary (Agent 11 - 04_academics_attendance.sql)
ATTENDANCE_DB = [
    # Asha Reddy's Records
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "course_code": "CS301",
        "course_title": "Data Structures",
        "faculty_name": "Dr. Meera Iyer",
        "classes_held": 40,
        "classes_attended": 36,
        "current_pct": 90.0,
        "required_pct": 75.0,
        "classes_needed": 0,
        "risk_level": "NONE",
        "deadline": "2026-11-20",
        "recovery_possible": True
    },
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "course_code": "CS302",
        "course_title": "Digital Electronics",
        "faculty_name": "Prof. K. Raman",
        "classes_held": 50,
        "classes_attended": 34,
        "current_pct": 68.0,
        "required_pct": 75.0,
        "classes_needed": 14, # (34+x)/(50+x) = 0.75 -> x = 14
        "risk_level": "AT_RISK",
        "deadline": "2026-11-15",
        "recovery_possible": True
    },
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "course_code": "CS303",
        "course_title": "Discrete Mathematics",
        "faculty_name": "Dr. S. Mukherjee",
        "classes_held": 44,
        "classes_attended": 35,
        "current_pct": 79.5,
        "required_pct": 75.0,
        "classes_needed": 0,
        "risk_level": "NONE",
        "deadline": "2026-11-18",
        "recovery_possible": True
    },
    # Rahul Verma's Records
    {
        "student_id": "cccccccc-0000-0000-0000-000000000002",
        "course_code": "CS301",
        "course_title": "Data Structures",
        "faculty_name": "Dr. Meera Iyer",
        "classes_held": 40,
        "classes_attended": 28,
        "current_pct": 70.0,
        "required_pct": 75.0,
        "classes_needed": 8,
        "risk_level": "AT_RISK",
        "deadline": "2026-11-20",
        "recovery_possible": True
    }
]

# 3. Timetable (Agent 4 - 04_academics_attendance.sql)
TIMETABLE_DB = [
    # Section-7 (N-312) Official Academic Routine
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Monday", "time_slot": "09:05 AM - 10:45 AM", "course_code": "OOPS-25CS204", "course_title": "Object Oriented Programming Through Java [P]", "room_no": "N-312 / Java Lab", "faculty_name": "Mr. T. Latesh Babu, Manikanta Reddy, Vamsi Krishna, Shaik Shamsheer Bhash"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Monday", "time_slot": "12:30 PM - 01:20 PM", "course_code": "DLD-25CS205", "course_title": "Digital Logic design [L]", "room_no": "N-312", "faculty_name": "Mrs Archana (8985716984)"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Monday", "time_slot": "01:20 PM - 02:10 PM", "course_code": "COUN", "course_title": "Counseling / Mentorship", "room_no": "N-312", "faculty_name": "Mr. T. Latesh Babu (Class Teacher)"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Monday", "time_slot": "02:20 PM - 03:10 PM", "course_code": "DS-25CS201", "course_title": "Data Structures [L]", "room_no": "N-312", "faculty_name": "Dr. R. Prathap Kumar (7569888963)"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Monday", "time_slot": "03:10 PM - 04:00 PM", "course_code": "DBMS-25CS203", "course_title": "Database Management System [L]", "room_no": "N-312", "faculty_name": "Ms. Y. Sai Eswari (8074131669)"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Friday", "time_slot": "09:05 AM - 10:45 AM", "course_code": "DS-25CS201", "course_title": "Data Structures [P]", "room_no": "N-312 / DS Lab", "faculty_name": "Dr. R. Prathap Kumar (7569888963)"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Friday", "time_slot": "12:30 PM - 01:20 PM", "course_code": "DMS-25MT202", "course_title": "Discrete Mathematical Structures [L]", "room_no": "N-312", "faculty_name": "DR. N. SANTHOSHO"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Friday", "time_slot": "01:20 PM - 02:10 PM", "course_code": "AI-24CS302", "course_title": "Artificial Intelligence [L]", "room_no": "N-312", "faculty_name": "Dr. M. Sunil Babu (8333001991)"},
    {"student_id": "cccccccc-0000-0000-0000-000000000001", "day_of_week": "Friday", "time_slot": "02:20 PM - 03:10 PM", "course_code": "DBMS-25CS203", "course_title": "Database Management System [T]", "room_no": "N-312", "faculty_name": "Nemalikanti Deena, Mathangi Haveela, Kommuri Ramya"}
]

# 4. Marks & Assessments (Agents 33 & 34 - 05_assessment_exams_outcomes.sql)
MARKS_DB = [
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "course_code": "CS301",
        "course_title": "Data Structures",
        "assessment_name": "Formative Assessment 1 (CIE-1)",
        "max_marks": 25,
        "obtained_marks": 22,
        "percentage": 88.0,
        "status": "PASS"
    },
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "course_code": "CS302",
        "course_title": "Digital Electronics",
        "assessment_name": "Formative Assessment 1 (CIE-1)",
        "max_marks": 25,
        "obtained_marks": 17,
        "percentage": 68.0,
        "status": "PASS"
    },
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "course_code": "CS302",
        "course_title": "Digital Electronics",
        "assessment_name": "Formative Assessment 2 (CIE-2)",
        "max_marks": 25,
        "obtained_marks": None,
        "percentage": None,
        "status": "SCHEDULED_ON_OCT_14"
    }
]

# 5. Exam Schedule (Agent 30 - 05_assessment_exams_outcomes.sql)
EXAMS_DB = [
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "exam_type": "Second Formative Assessment (CIE-2)",
        "course_code": "CS302",
        "course_title": "Digital Electronics",
        "exam_date": "2026-10-14",
        "time": "10:00 AM - 11:30 AM",
        "venue": "Hall B-3, Examination Block",
        "hall_ticket_status": "APPROVED"
    },
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "exam_type": "Second Formative Assessment (CIE-2)",
        "course_code": "CS301",
        "course_title": "Data Structures",
        "exam_date": "2026-10-16",
        "time": "10:00 AM - 11:30 AM",
        "venue": "Hall B-3, Examination Block",
        "hall_ticket_status": "APPROVED"
    },
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "exam_type": "End-Semester Regular Examination",
        "course_code": "ALL_SEMESTER_3",
        "course_title": "Semester 3 Theory Exams",
        "exam_date": "2026-12-01 to 2026-12-15",
        "time": "02:00 PM - 05:00 PM",
        "venue": "Main Auditorium / Exam Centers",
        "hall_ticket_status": "ELIGIBILITY_SUBJECT_TO_ATTENDANCE"
    }
]

# 6. Fees (Agent 40 - 07_admissions_finance.sql)
FEES_DB = [
    {
        "student_id": "cccccccc-0000-0000-0000-000000000001",
        "academic_year": "2025-26",
        "total_demand": 85000.00,
        "paid_amount": 72500.00,
        "outstanding_balance": 12500.00,
        "due_date": "2026-10-31",
        "status": "PARTIAL",
        "next_installment_amount": 12500.00,
        "next_installment_date": "2026-10-31",
        "penalty_warning": "Late fee of INR 500 applies after Oct 31st."
    }
]

# 7. Curriculum & Credits (Agent 1 - 03_curriculum.sql)
CURRICULUM_DB = {
    "cccccccc-0000-0000-0000-000000000001": {
        "regulation": "R23 (Regulation 2023)",
        "programme": "B.Tech Computer Science and Engineering",
        "total_credits_required": 160,
        "credits_earned": 68,
        "credits_remaining": 92,
        "current_semester_credits": 22,
        "graduation_eligibility": "On track. Minimum CGPA required: 5.0, No active backlogs.",
        "next_semester_courses": [
            {"code": "CS401", "title": "Database Management Systems", "credits": 4, "type": "Core"},
            {"code": "CS402", "title": "Operating Systems", "credits": 4, "type": "Core"},
            {"code": "CS403", "title": "Design & Analysis of Algorithms", "credits": 4, "type": "Core"},
            {"code": "CS404", "title": "Computer Networks", "credits": 3, "type": "Core"},
            {"code": "OE401", "title": "Open Elective - I", "credits": 3, "type": "Elective"},
            {"code": "CS405", "title": "DBMS & OS Laboratory", "credits": 2, "type": "Laboratory"}
        ]
    }
}

# 8. Approved Policies (Agent 53 - 09_governance_quality_knowledge.sql)
POLICIES_DB = [
    {
        "policy_id": "pol-01",
        "title": "Academic Regulation R23 - Attendance & Promotion Norms",
        "clause_no": "Clause 4.2",
        "effective_date": "2023-07-15",
        "summary": "Every student must maintain minimum 75% attendance in each registered subject. Condonation up to 10% (between 65% and 75%) is permitted strictly on medical grounds verified by the college medical officer with valid hospitalization certificates.",
        "authority": "Academic Senate Resolution 23/12"
    },
    {
        "policy_id": "pol-02",
        "title": "Examination Code of Conduct and Evaluation Scheme",
        "clause_no": "Clause 7.1",
        "effective_date": "2023-07-15",
        "summary": "Continuous Internal Evaluation (CIE) carries 40% weightage, and Semester End Examination (SEE) carries 60% weightage. To qualify for a pass grade, students must score at least 35% in SEE and 40% aggregate.",
        "authority": "Controller of Examinations By-Laws"
    },
    {
        "policy_id": "pol-03",
        "title": "Institutional Grievance Redressal and Anti-Harassment Regulations",
        "clause_no": "Clause 2.1 - Statutory Triage",
        "effective_date": "2022-09-01",
        "summary": "Grievances relating to ragging, harassment, or discrimination bypass regular departmental triage and go directly to the Statutory Internal Complaints Committee with a mandatory 48-hour response window.",
        "authority": "Statutory Governance Committee"
    }
]

# 9. Approved Circulars (Agent 55 - 09_governance_quality_knowledge.sql)
CIRCULARS_DB = [
    {
        "circular_no": "VFSTR/AAA/2026/AC-01",
        "title": "B.Tech Academic Calendar 2026-27 (Semester-I)",
        "issued_date": "2026-06-01",
        "effective_date": "2026-07-10",
        "summary": "Official B.Tech Academic Calendar (Semester-I, 2026-27) for 2nd (R25), 3rd (R22C24) & 4th (R22) Year. Module-1 commenced on 10-Jul-2026. Module-2 commenced on 08-Sep-2026. M-2 FA-1 is scheduled for 06-Oct to 08-Oct-2026. Dasara vacation runs from 18-Oct to 21-Oct-2026. M-2 FA-2 is from 11-Nov to 13-Nov-2026. Preparation & Practical Summative Assessment is from 14-Nov to 20-Nov-2026. Summative Assessment (Theory End Semester) runs from 21-Nov to 04-Dec-2026. Semester-II commences on 14-Dec-2026.",
        "issued_by": "Dean-AAA & FA, VFSTR Vadlamudi"
    },
    {
        "circular_no": "ACME/REG/2026/089",
        "title": "Schedule for Second Continuous Internal Evaluation (CIE-2)",
        "issued_date": "2026-09-05",
        "effective_date": "2026-10-14",
        "summary": "CIE-2 for all UG Semesters 3 and 5 will be conducted from October 14, 2026 to October 21, 2026. Hall tickets will be issued through student portal from Oct 10.",
        "issued_by": "Registrar Academic Affairs"
    },
    {
        "circular_no": "ACME/FIN/2026/041",
        "title": "Second Installment Tuition Fee Payment Notification",
        "issued_date": "2026-09-01",
        "effective_date": "2026-10-31",
        "summary": "Last date to pay second installment of academic fees without fine is October 31, 2026. Online gateway available at bursar portal.",
        "issued_by": "Finance Bursar"
    }
]

# 10. Helpdesk Tables (Conversations, Messages, Service Requests, Handovers, Analytics)
CONVERSATIONS_DB: Dict[str, Dict[str, Any]] = {}
MESSAGES_DB: Dict[str, List[Dict[str, Any]]] = {}
SERVICE_REQUESTS_DB: Dict[str, Dict[str, Any]] = {}
HANDOVERS_DB: Dict[str, Dict[str, Any]] = {}
CRISIS_ESCALATIONS_DB: List[Dict[str, Any]] = []
ANALYTICS_DAILY_DB: Dict[str, Dict[str, Any]] = {}

# Pre-seed a default conversation for Asha
_demo_conv_id = "conv-asha-001"
CONVERSATIONS_DB[_demo_conv_id] = {
    "conversation_id": _demo_conv_id,
    "student_id": "cccccccc-0000-0000-0000-000000000001",
    "title": "Academic Assistance & Course Query",
    "status": "ACTIVE",
    "context_data": {"active_subject": "Digital Electronics"},
    "created_at": datetime.datetime.now(datetime.timezone.utc),
    "updated_at": datetime.datetime.now(datetime.timezone.utc)
}
MESSAGES_DB[_demo_conv_id] = [
    {
        "message_id": str(uuid.uuid4()),
        "conversation_id": _demo_conv_id,
        "sender_role": "AGENT_65",
        "content": "Hello Asha, I am your Student Helpdesk Agent (Agent 65). How can I assist you today with your attendance, timetable, marks, exam schedules, fee payments, or university service requests?",
        "category": "GENERAL",
        "source_agent": "Agent 65",
        "citations": [],
        "structured_card": None,
        "is_distress": False,
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }
]

# Pre-seed an initial service request for Asha
_demo_sr_id = "sr-asha-001"
SERVICE_REQUESTS_DB[_demo_sr_id] = {
    "service_request_id": _demo_sr_id,
    "request_no": "SR-2026-0001",
    "student_id": "cccccccc-0000-0000-0000-000000000001",
    "category": "BONAFIDE_CERTIFICATE",
    "title": "Bonafide Certificate for State Bus Pass Concession",
    "description": "Requesting college bonafide certificate for RTC bus pass application.",
    "priority": "NORMAL",
    "status": "READY_FOR_COLLECTION",
    "assigned_office": "Registrar Student Affairs (Agent 46)",
    "sla_due_date": datetime.date.today(),
    "created_at": datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2),
    "updated_at": datetime.datetime.now(datetime.timezone.utc)
}

def _load_from_sqlite():
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "database", "student_helpdesk.db"))
    if not os.path.exists(db_path):
        return
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        # Load all 70 students from VFSTR Section 7
        cur.execute("SELECT student_id, roll_no, password, full_name, gender, email, department_code, programme_code, batch_label, section_code, year_of_study, semester, cgpa, backlog_count, total_attendance_pct, fee_outstanding, mentor_name, status FROM student")
        for row in cur.fetchall():
            sid, roll, pwd, name, gender, email, dept, prog, batch, sec, yr, sem, cgpa, backlogs, att, fee, mentor, status = row
            clean_user = roll.lower().replace("-", "").replace(" ", "")
            STUDENTS_DB[sid] = {
                "student_id": sid,
                "user_id": f"usr-{sid}",
                "roll_no": roll,
                "username": clean_user,
                "password_hash": pwd if pwd else roll,
                "full_name": name,
                "gender": gender,
                "email": email,
                "programme_code": prog,
                "programme_name": "B.Tech Computer Science and Engineering",
                "department_code": dept,
                "batch_label": batch,
                "section_code": sec,
                "current_year_of_study": yr,
                "semester": sem,
                "cgpa": cgpa,
                "backlog_count": backlogs,
                "overall_attendance_pct": att,
                "fee_outstanding": fee,
                "mentor_name": mentor,
                "status": status
            }

        # Load Attendance Summary
        cur.execute("SELECT student_id, course_code, course_title, faculty_name, attendance_pct, classes_held, classes_attended, risk_level, classes_needed FROM attendance_summary")
        for row in cur.fetchall():
            sid, code, title, fac, pct, held, att_cnt, risk, needed = row
            ATTENDANCE_DB.append({
                "student_id": sid,
                "course_code": code,
                "course_title": title,
                "faculty_name": fac,
                "classes_held": held,
                "classes_attended": att_cnt,
                "current_pct": pct,
                "required_pct": 75.0,
                "classes_needed": needed,
                "risk_level": risk,
                "deadline": "2026-11-20",
                "recovery_possible": (pct >= 50.0)
            })

        # Load Internal Marks
        cur.execute("SELECT student_id, course_code, assessment_name, max_marks, marks_obtained, status FROM internal_mark")
        for row in cur.fetchall():
            sid, code, aname, max_m, obt_m, status = row
            MARKS_DB.append({
                "student_id": sid,
                "course_code": code,
                "course_title": code,
                "assessment_name": aname,
                "max_marks": max_m,
                "obtained_marks": obt_m,
                "percentage": round((obt_m / max_m) * 100, 1),
                "status": "PASS" if (obt_m / max_m) >= 0.4 else "FAIL"
            })

        # Load Fee Demands
        cur.execute("SELECT student_id, fee_head, amount_demanded, amount_paid, due_date, status FROM fee_demand")
        for row in cur.fetchall():
            sid, fhead, dem, paid, due, status = row
            FEES_DB.append({
                "student_id": sid,
                "academic_year": "2025-26",
                "total_demand": dem,
                "paid_amount": paid,
                "outstanding_balance": dem - paid,
                "due_date": due,
                "status": status,
                "next_installment_amount": dem - paid,
                "next_installment_date": due,
                "penalty_warning": "Late fine applies after due date." if (dem - paid) > 0 else "All dues cleared."
            })

        # Section 7 Timetable mapping (From SQLite timetable table)
        cur.execute("SELECT day_of_week, time_slot, course_code, course_title, room_no, faculty_name, slot_type FROM timetable")
        tt_rows = cur.fetchall()
        for sid in list(STUDENTS_DB.keys()):
            for tr in tt_rows:
                t_day, t_slot, t_code, t_title, t_room, t_fac, t_type = tr
                TIMETABLE_DB.append({
                    "student_id": sid,
                    "day_of_week": t_day,
                    "time_slot": t_slot,
                    "course_code": t_code,
                    "course_title": t_title,
                    "room_no": t_room,
                    "faculty_name": t_fac,
                    "slot_type": t_type
                })

        # Section 7 Exam Schedule (Aligned with VFSTR 2026-27 Academic Calendar)
        sec7_exams = [
            {"exam_type": "Formative Assessment (M-2 FA-1)", "course_code": "M2-FA1", "course_title": "Module-2 Formative Assessment 1", "exam_date": "2026-10-06", "time": "10:00 AM - 12:00 PM", "venue": "Department of CSE, VFSTR", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Formative Assessment (M-2 FA-2)", "course_code": "M2-FA2", "course_title": "Module-2 Formative Assessment 2", "exam_date": "2026-11-11", "time": "10:00 AM - 12:00 PM", "venue": "Department of CSE, VFSTR", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Practical Summative Assessment", "course_code": "DW-25CS202", "course_title": "Data Wrangling & Visualization Practical", "exam_date": "2026-11-17", "time": "02:00 PM - 05:00 PM", "venue": "Computing Lab N-314A", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Summative End-Semester Theory", "course_code": "DLD-25CS205", "course_title": "Digital Logic design", "exam_date": "2026-11-21", "time": "10:00 AM - 01:00 PM", "venue": "Examination Hall A2", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Summative End-Semester Theory", "course_code": "DS-25CS201", "course_title": "Data Structures", "exam_date": "2026-11-24", "time": "10:00 AM - 01:00 PM", "venue": "Examination Hall B1", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Summative End-Semester Theory", "course_code": "DMS-25MT202", "course_title": "Discrete Mathematical Structures", "exam_date": "2026-11-26", "time": "10:00 AM - 01:00 PM", "venue": "Examination Hall A2", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Summative End-Semester Theory", "course_code": "OOPS-25CS204", "course_title": "Object Oriented Programming Through Java", "exam_date": "2026-11-28", "time": "10:00 AM - 01:00 PM", "venue": "Examination Hall A1", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Summative End-Semester Theory", "course_code": "DBMS-25CS203", "course_title": "Database Management System", "exam_date": "2026-12-01", "time": "10:00 AM - 01:00 PM", "venue": "Examination Hall B3", "hall_ticket_status": "APPROVED"},
            {"exam_type": "Summative End-Semester Theory", "course_code": "AI-24CS302", "course_title": "Artificial Intelligence", "exam_date": "2026-12-03", "time": "10:00 AM - 01:00 PM", "venue": "Examination Hall A1", "hall_ticket_status": "APPROVED"}
        ]
        for sid in list(STUDENTS_DB.keys()):
            for ex in sec7_exams:
                EXAMS_DB.append({
                    "student_id": sid,
                    **ex
                })

        # Pre-seed initial conversation for Akshat Raj
        akshat_sid = "stu-251fa04e03"
        akshat_conv = "conv-akshat-001"
        if akshat_sid in STUDENTS_DB:
            CONVERSATIONS_DB[akshat_conv] = {
                "conversation_id": akshat_conv,
                "student_id": akshat_sid,
                "title": "Welcome & Academic Assistance",
                "status": "ACTIVE",
                "context_data": {"department": "CSE", "section": "7"},
                "created_at": datetime.datetime.now(datetime.timezone.utc),
                "updated_at": datetime.datetime.now(datetime.timezone.utc)
            }
            MESSAGES_DB[akshat_conv] = [
                {
                    "message_id": str(uuid.uuid4()),
                    "conversation_id": akshat_conv,
                    "sender_role": "AGENT_65",
                    "content": "Hello Akshat, I am your Student Helpdesk Agent (Agent 65) for VFSTR CSE Section 7. I can assist you with your course attendance, midterm marks, exam schedule, fee demands, or administrative requests.",
                    "category": "GENERAL",
                    "source_agent": "Agent 65",
                    "citations": [],
                    "structured_card": None,
                    "is_distress": False,
                    "created_at": datetime.datetime.now(datetime.timezone.utc)
                }
            ]

        conn.close()
    except Exception as e:
        print(f"Notice: SQLite loader skipped ({e})")

# Load real VFSTR student data
_load_from_sqlite()

# ---------------- Safe Data Access Layer with RLS ----------------

class DataRepository:
    """
    Data repository providing strictly row-level secured access to all student records.
    Every method takes the authenticated `session` and NEVER exposes records of other students.
    """
    
    @staticmethod
    def get_student_by_username(username: str) -> Optional[Dict[str, Any]]:
        clean_user = username.lower().replace("-", "").replace(" ", "")
        for student in STUDENTS_DB.values():
            s_roll_clean = student["roll_no"].lower().replace("-", "").replace(" ", "")
            s_id_clean = student["student_id"].lower().replace("-", "").replace(" ", "")
            s_user_clean = student["username"].lower().replace("-", "").replace(" ", "")
            if s_user_clean == clean_user or s_roll_clean == clean_user or s_id_clean == clean_user:
                return student
        return None

    @staticmethod
    def get_student_profile(session: DatabaseSession) -> Optional[Dict[str, Any]]:
        # Row-level check: Return only if student_id matches session
        if not session.student_id or session.student_id not in STUDENTS_DB:
            return None
        return STUDENTS_DB[session.student_id]

    @staticmethod
    def get_attendance(session: DatabaseSession, subject_query: Optional[str] = None) -> List[Dict[str, Any]]:
        # Strict RLS filter: row.student_id == session.student_id
        results = [
            att for att in ATTENDANCE_DB 
            if att["student_id"] == session.student_id
        ]
        if subject_query:
            query = subject_query.lower()
            results = [
                att for att in results 
                if query in att["course_code"].lower() or query in att["course_title"].lower()
            ]
        return results

    @staticmethod
    def get_timetable(session: DatabaseSession, day: Optional[str] = None) -> List[Dict[str, Any]]:
        results = [
            tt for tt in TIMETABLE_DB 
            if tt["student_id"] == session.student_id
        ]
        if day:
            results = [tt for tt in results if tt["day_of_week"].lower() == day.lower()]
        return results

    @staticmethod
    def get_marks(session: DatabaseSession, subject_query: Optional[str] = None) -> List[Dict[str, Any]]:
        results = [
            m for m in MARKS_DB 
            if m["student_id"] == session.student_id
        ]
        if subject_query:
            query = subject_query.lower()
            results = [
                m for m in results 
                if query in m["course_code"].lower() or query in m["course_title"].lower()
            ]
        return results

    @staticmethod
    def get_exams(session: DatabaseSession) -> List[Dict[str, Any]]:
        return [
            e for e in EXAMS_DB 
            if e["student_id"] == session.student_id
        ]

    @staticmethod
    def get_fees(session: DatabaseSession) -> Optional[Dict[str, Any]]:
        for f in FEES_DB:
            if f["student_id"] == session.student_id:
                return f
        return None

    @staticmethod
    def get_curriculum(session: DatabaseSession) -> Optional[Dict[str, Any]]:
        return CURRICULUM_DB.get(session.student_id)

    @staticmethod
    def search_policies(query_text: str) -> List[Dict[str, Any]]:
        # Policies are institutional knowledge - open to all authenticated students
        q = query_text.lower()
        matches = []
        for p in POLICIES_DB:
            if any(term in p["title"].lower() or term in p["summary"].lower() for term in q.split()):
                matches.append(p)
        return matches or POLICIES_DB[:2]

    @staticmethod
    def search_circulars(query_text: str) -> List[Dict[str, Any]]:
        q = query_text.lower()
        matches = []
        for c in CIRCULARS_DB:
            if any(term in c["title"].lower() or term in c["summary"].lower() for term in q.split()):
                matches.append(c)
        return matches or CIRCULARS_DB[:2]

    # --- Helpdesk Conversations (RLS Enforced) ---

    @staticmethod
    def list_conversations(session: DatabaseSession) -> List[Dict[str, Any]]:
        convs = [
            c for c in CONVERSATIONS_DB.values() 
            if c["student_id"] == session.student_id
        ]
        return sorted(convs, key=lambda x: x["updated_at"], reverse=True)

    @staticmethod
    def get_conversation(session: DatabaseSession, conversation_id: str) -> Optional[Dict[str, Any]]:
        conv = CONVERSATIONS_DB.get(conversation_id)
        if not conv or conv["student_id"] != session.student_id:
            return None # RLS: blocked if belonging to another student
        return conv

    @staticmethod
    def create_conversation(session: DatabaseSession, title: str) -> Dict[str, Any]:
        conv_id = f"conv-{uuid.uuid4().hex[:8]}"
        now = datetime.datetime.now(datetime.timezone.utc)
        new_conv = {
            "conversation_id": conv_id,
            "student_id": session.student_id,
            "title": title or "New Conversation",
            "status": "ACTIVE",
            "context_data": {},
            "created_at": now,
            "updated_at": now
        }
        CONVERSATIONS_DB[conv_id] = new_conv
        MESSAGES_DB[conv_id] = []
        return new_conv

    @staticmethod
    def get_conversation_messages(session: DatabaseSession, conversation_id: str) -> List[Dict[str, Any]]:
        # Check parent conversation ownership
        conv = DataRepository.get_conversation(session, conversation_id)
        if not conv:
            return []
        return MESSAGES_DB.get(conversation_id, [])

    @staticmethod
    def add_message(session: DatabaseSession, conversation_id: str, message_data: Dict[str, Any]) -> Dict[str, Any]:
        conv = DataRepository.get_conversation(session, conversation_id)
        if not conv:
            raise PermissionError("Access denied: conversation does not belong to the authenticated student.")
        
        msg_id = f"msg-{uuid.uuid4().hex[:8]}"
        now = datetime.datetime.now(datetime.timezone.utc)
        record = {
            "message_id": msg_id,
            "conversation_id": conversation_id,
            "sender_role": message_data.get("sender_role", "STUDENT"),
            "content": message_data["content"],
            "category": message_data.get("category"),
            "source_agent": message_data.get("source_agent", "Agent 65"),
            "citations": message_data.get("citations", []),
            "structured_card": message_data.get("structured_card"),
            "is_distress": message_data.get("is_distress", False),
            "created_at": now
        }
        if conversation_id not in MESSAGES_DB:
            MESSAGES_DB[conversation_id] = []
        MESSAGES_DB[conversation_id].append(record)
        CONVERSATIONS_DB[conversation_id]["updated_at"] = now
        return record

    # --- Service Requests (Agent 46, RLS Enforced) ---

    @staticmethod
    def create_service_request(session: DatabaseSession, data: Dict[str, Any]) -> Dict[str, Any]:
        req_id = f"sr-{uuid.uuid4().hex[:8]}"
        req_no = f"SR-2026-{len(SERVICE_REQUESTS_DB) + 1:04d}"
        now = datetime.datetime.now(datetime.timezone.utc)
        record = {
            "service_request_id": req_id,
            "request_no": req_no,
            "student_id": session.student_id,
            "category": data["category"],
            "title": data["title"],
            "description": data["description"],
            "priority": data.get("priority", "NORMAL"),
            "status": "SUBMITTED",
            "assigned_office": "Registrar Student Affairs (Agent 46)",
            "sla_due_date": datetime.date.today() + datetime.timedelta(days=3),
            "created_at": now,
            "updated_at": now
        }
        SERVICE_REQUESTS_DB[req_id] = record
        return record

    @staticmethod
    def list_service_requests(session: DatabaseSession) -> List[Dict[str, Any]]:
        return [
            sr for sr in SERVICE_REQUESTS_DB.values() 
            if sr["student_id"] == session.student_id
        ]

    # --- Crisis Escalation (Agent 66) ---

    @staticmethod
    def log_crisis_escalation(session: DatabaseSession, trigger_phrase: str, student_info: Dict[str, Any]) -> Dict[str, Any]:
        esc_id = f"esc-{uuid.uuid4().hex[:8]}"
        record = {
            "crisis_escalation_id": esc_id,
            "student_id": session.student_id,
            "student_name": student_info.get("full_name"),
            "roll_no": student_info.get("roll_no"),
            "detected_at": datetime.datetime.now(datetime.timezone.utc),
            "detected_by": "Agent 65 Distress Guardrail",
            "trigger_snippet": trigger_phrase,
            "escalated_to": "Agent 66 (24/7 Student Wellbeing Helpline & On-duty Counselor)",
            "channel_used": "PRIORITY_INTERNAL_DISPATCH",
            "status": "PAGE_SENT"
        }
        CRISIS_ESCALATIONS_DB.append(record)
        return record

    # --- Query Analytics (Privacy Safe, No PII) ---

    @staticmethod
    def record_query_metric(intent_category: str, topic: str, language: str = "en", is_distress: bool = False, is_escalated: bool = False):
        today_str = datetime.date.today().isoformat()
        key = f"{today_str}:{intent_category}:{topic}:{language}"
        if key not in ANALYTICS_DAILY_DB:
            ANALYTICS_DAILY_DB[key] = {
                "stat_date": today_str,
                "intent_category": intent_category,
                "topic": topic,
                "language_code": language,
                "query_count": 0,
                "successful_answers": 0,
                "escalated_count": 0,
                "distress_count": 0
            }
        ANALYTICS_DAILY_DB[key]["query_count"] += 1
        ANALYTICS_DAILY_DB[key]["successful_answers"] += 1
        if is_distress:
            ANALYTICS_DAILY_DB[key]["distress_count"] += 1
        if is_escalated:
            ANALYTICS_DAILY_DB[key]["escalated_count"] += 1

    @staticmethod
    def get_analytics_summary() -> List[Dict[str, Any]]:
        return list(ANALYTICS_DAILY_DB.values())
