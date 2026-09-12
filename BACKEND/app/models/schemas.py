from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

# ---------------- Auth Schemas ----------------
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    student_id: str
    roll_no: str
    full_name: str
    programme_code: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    student_id: Optional[str] = None
    roll_no: Optional[str] = None

# ---------------- Profile Schema ----------------
class StudentProfile(BaseModel):
    student_id: str
    roll_no: str
    full_name: str
    programme_code: str
    department_code: str
    batch_label: str
    section_code: str
    current_year_of_study: int
    cgpa: Optional[float] = None
    backlog_count: int = 0
    overall_attendance_pct: float
    fee_outstanding: float
    status: str

# ---------------- Structured Card Schemas ----------------
class StructuredCard(BaseModel):
    type: str # 'attendance', 'exam', 'fee', 'curriculum', 'timetable', 'service', 'distress', 'policy'
    title: str
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    badgeVariant: Optional[str] = "blue"
    data: Dict[str, Any] = Field(default_factory=dict)
    actionLabel: Optional[str] = None
    actionIntent: Optional[str] = None

# ---------------- Chat & Message Schemas ----------------
class MessageCreate(BaseModel):
    content: str
    language: Optional[str] = "en"
    model_mode: Optional[str] = "fast"

class Citation(BaseModel):
    title: str
    clause: str
    effective_date: str
    summary: Optional[str] = None

class MessageResponse(BaseModel):
    message_id: str
    conversation_id: str
    sender_role: str
    content: str
    category: Optional[str] = None
    source_agent: Optional[str] = "Agent 65"
    citations: List[Citation] = Field(default_factory=list)
    structured_card: Optional[StructuredCard] = None
    is_distress: bool = False
    suggested_follow_ups: List[str] = Field(default_factory=list)
    created_at: datetime

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class ConversationResponse(BaseModel):
    conversation_id: str
    student_id: str
    title: str
    status: str
    created_at: datetime
    updated_at: datetime
    last_message: Optional[str] = None

class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = Field(default_factory=list)

# ---------------- Service Request Schemas ----------------
class ServiceRequestCreate(BaseModel):
    category: str # 'BONAFIDE_CERTIFICATE', 'GRADE_CARD_TRANSCRIPT', 'FEE_CONCESSION', 'HOSTEL_MAINTENANCE', 'ID_CARD_REPLACEMENT', 'BUS_PASS_ENDORSEMENT', 'MENTOR_MEETING', 'GRIEVANCE', 'OTHER'
    title: str
    description: str
    priority: Optional[str] = "NORMAL"

class ServiceRequestResponse(BaseModel):
    service_request_id: str
    request_no: str
    student_id: str
    category: str
    title: str
    description: str
    priority: str
    status: str
    assigned_office: str
    sla_due_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime

# ---------------- Human Handover Schema ----------------
class HandoverCreate(BaseModel):
    conversation_id: Optional[str] = None
    target_office: str
    reason: str
    conversation_summary: str
    urgency: Optional[str] = "NORMAL"

class HandoverResponse(BaseModel):
    handover_id: str
    handover_no: str
    student_id: str
    target_office: str
    reason: str
    urgency: str
    status: str
    created_at: datetime

# ---------------- Analytics Schema ----------------
class DailyAnalyticsItem(BaseModel):
    stat_date: str
    intent_category: str
    topic: str
    language_code: str
    query_count: int
    successful_answers: int
    escalated_count: int
    distress_count: int
