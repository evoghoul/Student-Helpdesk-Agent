from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.models.schemas import (
    ConversationCreate,
    ConversationResponse,
    ConversationDetailResponse,
    MessageCreate,
    MessageResponse
)
from app.database import DataRepository, DatabaseSession
from app.security import get_current_student
from app.agent.orchestrator import Agent65Orchestrator

router = APIRouter(prefix="/conversations", tags=["Conversations & Helpdesk Chat"])

@router.post("", response_model=ConversationResponse)
async def create_conversation(
    req: ConversationCreate,
    current_student: dict = Depends(get_current_student)
):
    session = DatabaseSession(student_id=current_student["student_id"], user_id=current_student["user_id"])
    new_conv = DataRepository.create_conversation(session, req.title)
    return ConversationResponse(**new_conv)

@router.get("", response_model=List[ConversationResponse])
async def list_my_conversations(current_student: dict = Depends(get_current_student)):
    session = DatabaseSession(student_id=current_student["student_id"], user_id=current_student["user_id"])
    convs = DataRepository.list_conversations(session)
    return [ConversationResponse(**c) for c in convs]

@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: str,
    current_student: dict = Depends(get_current_student)
):
    session = DatabaseSession(student_id=current_student["student_id"], user_id=current_student["user_id"])
    conv = DataRepository.get_conversation(session, conversation_id)
    if not conv:
        # Row-level check: Return 404/403 if it does not belong to the student
        raise HTTPException(status_code=404, detail="Conversation not found or access denied.")
    
    messages = DataRepository.get_conversation_messages(session, conversation_id)
    return ConversationDetailResponse(
        **conv,
        messages=[MessageResponse(**m) for m in messages]
    )

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    msg: MessageCreate,
    current_student: dict = Depends(get_current_student)
):
    session = DatabaseSession(student_id=current_student["student_id"], user_id=current_student["user_id"])
    conv = DataRepository.get_conversation(session, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found or access denied.")

    # Process through Agent 65 Orchestrator
    agent_response = Agent65Orchestrator.process_message(
        session=session,
        conversation_id=conversation_id,
        user_message=msg.content,
        language=msg.language or "en"
    )
    return MessageResponse(**agent_response)
