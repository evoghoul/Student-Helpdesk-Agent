import uuid
import datetime
import os
import sqlite3
import json
from typing import Dict, Any, List, Optional
from app.config import settings

def get_db_connection():
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "database", "student_helpdesk.db"))
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS crisis_escalations (
            crisis_escalation_id TEXT PRIMARY KEY,
            student_id TEXT,
            student_name TEXT,
            roll_no TEXT,
            detected_at TEXT,
            detected_by TEXT,
            trigger_snippet TEXT,
            escalated_to TEXT,
            channel_used TEXT,
            status TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS analytics_daily (
            stat_date TEXT,
            intent_category TEXT,
            topic TEXT,
            language_code TEXT DEFAULT 'en',
            query_count INTEGER DEFAULT 1,
            successful_answers INTEGER DEFAULT 1,
            escalated_count INTEGER DEFAULT 0,
            distress_count INTEGER DEFAULT 0
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS message_feedback (
            feedback_id TEXT PRIMARY KEY,
            message_id TEXT,
            conversation_id TEXT,
            student_id TEXT,
            rating TEXT,
            comment TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    return conn

class DatabaseSession:
    """
    A context-scoped database session that enforces Row-Level Security (RLS).
    The session holds the verified student_id and user_id.
    Queries executed through this session strictly enforce the student boundary.
    """
    def __init__(self, student_id: Optional[str] = None, user_id: Optional[str] = None):
        self.student_id = student_id
        self.user_id = user_id

class DataRepository:
    """
    Data repository providing strictly row-level secured access to all student records
    using SQLite database directly.
    """
    
    @staticmethod
    def _execute_query(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        with get_db_connection() as conn:
            cur = conn.execute(query, params)
            return [dict(row) for row in cur.fetchall()]

    @staticmethod
    def _execute_insert(query: str, params: tuple = ()):
        with get_db_connection() as conn:
            conn.execute(query, params)
            conn.commit()

    @staticmethod
    def get_student_by_username(username: str) -> Optional[Dict[str, Any]]:
        clean_user = username.lower().replace("-", "").replace(" ", "")
        # Can't do easy replace in SQL across all formats, so fetch all and filter or do OR
        query = "SELECT * FROM students WHERE LOWER(REPLACE(REPLACE(username, '-', ''), ' ', '')) = ? OR LOWER(REPLACE(REPLACE(roll_no, '-', ''), ' ', '')) = ? OR LOWER(REPLACE(REPLACE(student_id, '-', ''), ' ', '')) = ?"
        res = DataRepository._execute_query(query, (clean_user, clean_user, clean_user))
        return res[0] if res else None

    @staticmethod
    def get_student_profile(session: DatabaseSession) -> Optional[Dict[str, Any]]:
        if not session.student_id:
            return None
        res = DataRepository._execute_query("SELECT * FROM students WHERE student_id = ?", (session.student_id,))
        return res[0] if res else None

    @staticmethod
    def get_attendance(session: DatabaseSession, subject_query: Optional[str] = None) -> List[Dict[str, Any]]:
        query = "SELECT * FROM attendance WHERE student_id = ?"
        params = [session.student_id]
        if subject_query:
            query += " AND (LOWER(course_code) LIKE ? OR LOWER(course_title) LIKE ?)"
            like_val = f"%{subject_query.lower()}%"
            params.extend([like_val, like_val])
        return DataRepository._execute_query(query, tuple(params))

    @staticmethod
    def get_timetable(session: DatabaseSession, day: Optional[str] = None) -> List[Dict[str, Any]]:
        query = "SELECT * FROM timetable WHERE student_id = ?"
        params = [session.student_id]
        if day:
            query += " AND LOWER(day_of_week) = ?"
            params.append(day.lower())
        return DataRepository._execute_query(query, tuple(params))

    @staticmethod
    def get_marks(session: DatabaseSession, subject_query: Optional[str] = None) -> List[Dict[str, Any]]:
        query = "SELECT * FROM marks WHERE student_id = ?"
        params = [session.student_id]
        if subject_query:
            query += " AND (LOWER(course_code) LIKE ? OR LOWER(course_title) LIKE ?)"
            like_val = f"%{subject_query.lower()}%"
            params.extend([like_val, like_val])
        return DataRepository._execute_query(query, tuple(params))

    @staticmethod
    def get_exams(session: DatabaseSession) -> List[Dict[str, Any]]:
        return DataRepository._execute_query("SELECT * FROM exams WHERE student_id = ?", (session.student_id,))

    @staticmethod
    def get_fees(session: DatabaseSession) -> Optional[Dict[str, Any]]:
        res = DataRepository._execute_query("SELECT * FROM fees WHERE student_id = ?", (session.student_id,))
        return res[0] if res else None

    @staticmethod
    def get_curriculum(session: DatabaseSession) -> Optional[Dict[str, Any]]:
        res = DataRepository._execute_query("SELECT * FROM curriculum LIMIT 1")
        if res:
            data = res[0]
            if isinstance(data.get("next_semester_courses"), str):
                try:
                    data["next_semester_courses"] = json.loads(data["next_semester_courses"])
                except:
                    pass
            return data
        return None

    @staticmethod
    def search_policies(query_text: str) -> List[Dict[str, Any]]:
        query = "SELECT * FROM policies WHERE LOWER(title) LIKE ? OR LOWER(summary) LIKE ?"
        like_val = f"%{query_text.lower()}%"
        matches = DataRepository._execute_query(query, (like_val, like_val))
        if not matches:
            return DataRepository._execute_query("SELECT * FROM policies LIMIT 2")
        return matches

    @staticmethod
    def search_circulars(query_text: str) -> List[Dict[str, Any]]:
        query = "SELECT * FROM circulars WHERE LOWER(title) LIKE ? OR LOWER(summary) LIKE ?"
        like_val = f"%{query_text.lower()}%"
        matches = DataRepository._execute_query(query, (like_val, like_val))
        if not matches:
            return DataRepository._execute_query("SELECT * FROM circulars LIMIT 2")
        return matches

    @staticmethod
    def list_conversations(session: DatabaseSession) -> List[Dict[str, Any]]:
        return DataRepository._execute_query("SELECT * FROM conversations WHERE student_id = ? ORDER BY updated_at DESC", (session.student_id,))

    @staticmethod
    def get_conversation(session: DatabaseSession, conversation_id: str) -> Optional[Dict[str, Any]]:
        res = DataRepository._execute_query("SELECT * FROM conversations WHERE conversation_id = ? AND student_id = ?", (conversation_id, session.student_id))
        if res:
            data = res[0]
            if isinstance(data.get("context_data"), str):
                try: data["context_data"] = json.loads(data["context_data"])
                except: pass
            return data
        return None

    @staticmethod
    def create_conversation(session: DatabaseSession, title: str) -> Dict[str, Any]:
        conv_id = f"conv-{uuid.uuid4().hex[:8]}"
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        query = "INSERT INTO conversations (conversation_id, student_id, title, status, context_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        DataRepository._execute_insert(query, (conv_id, session.student_id, title or "New Conversation", "ACTIVE", "{}", now, now))
        return DataRepository.get_conversation(session, conv_id)

    @staticmethod
    def get_conversation_messages(session: DatabaseSession, conversation_id: str) -> List[Dict[str, Any]]:
        conv = DataRepository.get_conversation(session, conversation_id)
        if not conv:
            return []
        msgs = DataRepository._execute_query("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conversation_id,))
        for m in msgs:
            if isinstance(m.get("citations"), str):
                try: m["citations"] = json.loads(m["citations"])
                except: pass
            if isinstance(m.get("structured_card"), str):
                try: m["structured_card"] = json.loads(m["structured_card"])
                except: pass
        return msgs

    @staticmethod
    def add_message(session: DatabaseSession, conversation_id: str, message_data: Dict[str, Any]) -> Dict[str, Any]:
        conv = DataRepository.get_conversation(session, conversation_id)
        if not conv:
            raise PermissionError("Access denied: conversation does not belong to the authenticated student.")
        
        msg_id = f"msg-{uuid.uuid4().hex[:8]}"
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        citations = json.dumps(message_data.get("citations", []))
        structured_card = json.dumps(message_data.get("structured_card")) if message_data.get("structured_card") else None
        
        query = "INSERT INTO messages (message_id, conversation_id, sender_role, content, category, source_agent, citations, structured_card, is_distress, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        DataRepository._execute_insert(query, (msg_id, conversation_id, message_data.get("sender_role", "STUDENT"), message_data.get("content"), message_data.get("category"), message_data.get("source_agent", "Agent 65"), citations, structured_card, 1 if message_data.get("is_distress") else 0, now))
        
        DataRepository._execute_insert("UPDATE conversations SET updated_at = ? WHERE conversation_id = ?", (now, conversation_id))
        
        res = DataRepository._execute_query("SELECT * FROM messages WHERE message_id = ?", (msg_id,))
        m = res[0]
        if isinstance(m.get("citations"), str):
            try: m["citations"] = json.loads(m["citations"])
            except: pass
        if isinstance(m.get("structured_card"), str):
            try: m["structured_card"] = json.loads(m["structured_card"])
            except: pass
        return m

    @staticmethod
    def create_service_request(session: DatabaseSession, data: Dict[str, Any]) -> Dict[str, Any]:
        req_id = f"sr-{uuid.uuid4().hex[:8]}"
        count_res = DataRepository._execute_query("SELECT COUNT(*) as c FROM service_requests")
        req_no = f"SR-2026-{(count_res[0]['c'] + 1):04d}"
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        sla = (datetime.date.today() + datetime.timedelta(days=3)).isoformat()
        
        query = "INSERT INTO service_requests (service_request_id, request_no, student_id, category, title, description, priority, status, assigned_office, sla_due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        DataRepository._execute_insert(query, (req_id, req_no, session.student_id, data["category"], data["title"], data["description"], data.get("priority", "NORMAL"), "SUBMITTED", "Registrar Student Affairs (Agent 46)", sla, now, now))
        
        res = DataRepository._execute_query("SELECT * FROM service_requests WHERE service_request_id = ?", (req_id,))
        return res[0] if res else None

    @staticmethod
    def list_service_requests(session: DatabaseSession) -> List[Dict[str, Any]]:
        return DataRepository._execute_query("SELECT * FROM service_requests WHERE student_id = ?", (session.student_id,))

    @staticmethod
    def log_crisis_escalation(session: DatabaseSession, trigger_phrase: str, student_info: Dict[str, Any]) -> Dict[str, Any]:
        esc_id = f"esc-{uuid.uuid4().hex[:8]}"
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        query = "INSERT INTO crisis_escalations (crisis_escalation_id, student_id, student_name, roll_no, detected_at, detected_by, trigger_snippet, escalated_to, channel_used, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        DataRepository._execute_insert(query, (esc_id, session.student_id, student_info.get("full_name"), student_info.get("roll_no"), now, "Agent 65 Distress Guardrail", trigger_phrase, "Agent 66 (24/7 Student Wellbeing Helpline & On-duty Counselor)", "PRIORITY_INTERNAL_DISPATCH", "PAGE_SENT"))
        
        res = DataRepository._execute_query("SELECT * FROM crisis_escalations WHERE crisis_escalation_id = ?", (esc_id,))
        return res[0] if res else None

    @staticmethod
    def record_query_metric(intent_category: str, topic: str, language: str = "en", is_distress: bool = False, is_escalated: bool = False):
        today_str = datetime.date.today().isoformat()
        try:
            existing = DataRepository._execute_query("SELECT * FROM analytics_daily WHERE stat_date = ? AND intent_category = ? AND topic = ? AND language_code = ?", (today_str, intent_category, topic, language))
            if existing:
                query = "UPDATE analytics_daily SET query_count = query_count + 1, successful_answers = successful_answers + 1, distress_count = distress_count + ?, escalated_count = escalated_count + ? WHERE stat_date = ? AND intent_category = ? AND topic = ? AND language_code = ?"
                DataRepository._execute_insert(query, (1 if is_distress else 0, 1 if is_escalated else 0, today_str, intent_category, topic, language))
            else:
                query = "INSERT INTO analytics_daily (stat_date, intent_category, topic, language_code, query_count, successful_answers, escalated_count, distress_count) VALUES (?, ?, ?, ?, 1, 1, ?, ?)"
                DataRepository._execute_insert(query, (today_str, intent_category, topic, language, 1 if is_escalated else 0, 1 if is_distress else 0))
        except Exception:
            pass

    @staticmethod
    def get_analytics_summary() -> List[Dict[str, Any]]:
        return DataRepository._execute_query("SELECT * FROM analytics_daily")

    @staticmethod
    def record_message_feedback(
        session: DatabaseSession,
        conversation_id: str,
        message_id: str,
        rating: str,
        comment: Optional[str] = None
    ) -> Dict[str, Any]:
        conv = DataRepository.get_conversation(session, conversation_id)
        if not conv:
            raise PermissionError("Access denied: conversation does not belong to the authenticated student.")
        
        fb_id = f"fb-{uuid.uuid4().hex[:8]}"
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        query = "INSERT INTO message_feedback (feedback_id, message_id, conversation_id, student_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        DataRepository._execute_insert(query, (fb_id, message_id, conversation_id, session.student_id, rating, comment or "", now))
        return {
            "feedback_id": fb_id,
            "message_id": message_id,
            "conversation_id": conversation_id,
            "rating": rating,
            "comment": comment,
            "created_at": now
        }

    @staticmethod
    def get_message_by_id(session: DatabaseSession, message_id: str) -> Optional[Dict[str, Any]]:
        msgs = DataRepository._execute_query("SELECT * FROM messages WHERE message_id = ?", (message_id,))
        if not msgs:
            return None
        m = msgs[0]
        conv = DataRepository.get_conversation(session, m["conversation_id"])
        if not conv:
            return None
        if isinstance(m.get("citations"), str):
            try: m["citations"] = json.loads(m["citations"])
            except: pass
        if isinstance(m.get("structured_card"), str):
            try: m["structured_card"] = json.loads(m["structured_card"])
            except: pass
        return m


class _CrisisEscalationsProxy:
    """Compatibility proxy so tests can inspect CRISIS_ESCALATIONS_DB directly."""
    def __len__(self):
        return len(DataRepository._execute_query("SELECT * FROM crisis_escalations"))
    def __getitem__(self, idx):
        return DataRepository._execute_query("SELECT * FROM crisis_escalations")[idx]
    def __iter__(self):
        return iter(DataRepository._execute_query("SELECT * FROM crisis_escalations"))

class _AnalyticsDailyProxy:
    """Compatibility proxy so tests can inspect ANALYTICS_DAILY_DB directly."""
    def __len__(self):
        return len(DataRepository._execute_query("SELECT * FROM analytics_daily"))
    def __getitem__(self, idx):
        return DataRepository._execute_query("SELECT * FROM analytics_daily")[idx]
    def __iter__(self):
        return iter(DataRepository._execute_query("SELECT * FROM analytics_daily"))

CRISIS_ESCALATIONS_DB = _CrisisEscalationsProxy()
ANALYTICS_DAILY_DB = _AnalyticsDailyProxy()

class _StudentsDbProxy(dict):
    def values(self):
        return DataRepository._execute_query("SELECT * FROM students")
    def __getitem__(self, key):
        s = DataRepository.get_student_by_username(str(key))
        if s:
            return s
        raise KeyError(key)

STUDENTS_DB = _StudentsDbProxy()
